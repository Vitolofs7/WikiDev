import logging
import threading
import time
from fastapi import HTTPException, Request
from shared import config
from shared.logging_utils import log_security_event


def get_client_ip(request: Request) -> str:
    """
    Obtiene la IP del cliente de forma segura.

    Solo confía en X-Forwarded-For cuando la conexión directa proviene de un proxy
    explícitamente configurado en TRUSTED_PROXY_IPS.
    """
    direct_ip = request.client.host if request.client and request.client.host else "unknown"
    if direct_ip in config.TRUSTED_PROXY_IPS:
        forwarded = request.headers.get("x-forwarded-for", "")
        if forwarded:
            candidate = forwarded.split(",")[0].strip()
            if candidate:
                return candidate
    return direct_ip


class InMemoryRateLimiter:
    """
    Limitador de tasa por ventana deslizante con límite de claves y limpieza automática.

    Diseñado como dependencia por ruta/operación (inmune a discrepancias de path en middleware
    y sin contabilizar preflights OPTIONS). En despliegues multi-worker se recomienda sustituir
    el almacenamiento interno por Redis manteniendo la misma interfaz.
    """

    def __init__(
        self,
        scope: str,
        limit: int,
        window_seconds: int = 60,
        max_keys: int = 10_000,
    ) -> None:
        self.scope = scope
        self.limit = limit
        self.window_seconds = window_seconds
        self.max_keys = max_keys
        self._store: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def _prune(self, now: float) -> None:
        expired_keys = [
            key
            for key, timestamps in self._store.items()
            if not timestamps or now - timestamps[-1] >= self.window_seconds
        ]
        for key in expired_keys:
            del self._store[key]

        if len(self._store) >= self.max_keys:
            # Expulsa las claves más antiguas para acotar el uso de memoria.
            oldest = sorted(
                self._store.items(),
                key=lambda item: item[1][-1] if item[1] else 0.0,
            )[: max(1, len(self._store) - self.max_keys + 1)]
            for key, _ in oldest:
                del self._store[key]

    def check(self, key: str) -> tuple[bool, int]:
        now = time.monotonic()
        with self._lock:
            if len(self._store) >= self.max_keys:
                self._prune(now)

            timestamps = [
                t for t in self._store.get(key, []) if now - t < self.window_seconds
            ]

            if len(timestamps) >= self.limit:
                self._store[key] = timestamps
                retry_after = max(1, int(self.window_seconds - (now - timestamps[0])) + 1)
                return False, retry_after

            timestamps.append(now)
            self._store[key] = timestamps
            return True, 0

    def reset(self) -> None:
        with self._lock:
            self._store.clear()

    def __call__(self, request: Request) -> None:
        client_ip = get_client_ip(request)
        key = f"{self.scope}:{client_ip}"
        allowed, retry_after = self.check(key)
        if not allowed:
            log_security_event(
                "rate_limit_exceeded",
                level=logging.WARNING,
                scope=self.scope,
                ip=client_ip,
                path=request.url.path,
            )
            raise HTTPException(
                status_code=429,
                detail=f"Demasiadas peticiones. Inténtalo de nuevo en {retry_after}s.",
                headers={"Retry-After": str(retry_after)},
            )


auth_login_limiter = InMemoryRateLimiter(scope="auth_login", limit=10, window_seconds=60)
auth_register_limiter = InMemoryRateLimiter(scope="auth_register", limit=5, window_seconds=60)
code_execute_limiter = InMemoryRateLimiter(scope="code_execute", limit=20, window_seconds=60)
notes_write_limiter = InMemoryRateLimiter(scope="notes_write", limit=60, window_seconds=60)
notes_upload_limiter = InMemoryRateLimiter(scope="notes_upload", limit=20, window_seconds=60)
notes_read_limiter = InMemoryRateLimiter(scope="notes_read", limit=120, window_seconds=60)

ALL_RATE_LIMITERS = (
    auth_login_limiter,
    auth_register_limiter,
    code_execute_limiter,
    notes_write_limiter,
    notes_upload_limiter,
    notes_read_limiter,
)


def reset_all_rate_limiters() -> None:
    for limiter in ALL_RATE_LIMITERS:
        limiter.reset()
