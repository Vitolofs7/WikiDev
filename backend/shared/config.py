import os
from pathlib import Path
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent

# Carga variables de entorno desde backend/.env o la raíz del proyecto sin sobrescribir
# variables ya definidas en el entorno del sistema.
load_dotenv(BACKEND_DIR / ".env", override=False)
load_dotenv(PROJECT_ROOT / ".env", override=False)


def _parse_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_csv(value: str | None, default: list[str]) -> list[str]:
    if value is None or not value.strip():
        return list(default)
    return [item.strip().rstrip("/") for item in value.split(",") if item.strip()]


ENVIRONMENT = os.getenv("ENVIRONMENT", "development").strip().lower()
IS_PRODUCTION = ENVIRONMENT == "production"
IS_TEST = ENVIRONMENT == "test"

DEFAULT_SQLITE_URL = f"sqlite:///{(BACKEND_DIR / 'wikidev.db').as_posix()}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL).strip() or DEFAULT_SQLITE_URL

IMAGES_DIR = Path(os.getenv("IMAGES_DIR", str(BACKEND_DIR / "note_images"))).resolve()

_default_cors = ["http://localhost:3000", "http://127.0.0.1:3000"]
CORS_ORIGINS = _parse_csv(os.getenv("CORS_ORIGINS"), _default_cors)

if "*" in CORS_ORIGINS:
    raise ValueError(
        "Configuración insegura: CORS_ORIGINS no puede incluir '*' cuando allow_credentials está habilitado."
    )

_default_hosts = ["localhost", "127.0.0.1", "testserver"]
TRUSTED_HOSTS = _parse_csv(os.getenv("TRUSTED_HOSTS"), _default_hosts)

TRUSTED_PROXY_IPS = set(_parse_csv(os.getenv("TRUSTED_PROXY_IPS"), []))

# Cookies y sesiones
SESSION_COOKIE_NAME = os.getenv("SESSION_COOKIE_NAME", "wikidev_session").strip()
CSRF_COOKIE_NAME = os.getenv("CSRF_COOKIE_NAME", "wikidev_csrf").strip()
COOKIE_SECURE = _parse_bool(os.getenv("COOKIE_SECURE"), default=IS_PRODUCTION)
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax").strip().lower()
if COOKIE_SAMESITE not in {"lax", "strict", "none"}:
    raise ValueError("COOKIE_SAMESITE debe ser 'lax', 'strict' o 'none'.")
if COOKIE_SAMESITE == "none" and not COOKIE_SECURE:
    raise ValueError("COOKIE_SAMESITE='none' requiere COOKIE_SECURE=true.")

SESSION_TTL_HOURS = max(1, int(os.getenv("SESSION_TTL_HOURS", "24")))
MAX_FAILED_LOGINS = max(3, int(os.getenv("MAX_FAILED_LOGINS", "5")))
ACCOUNT_LOCKOUT_MINUTES = max(1, int(os.getenv("ACCOUNT_LOCKOUT_MINUTES", "15")))

# Ejecución de código: deshabilitada por defecto en producción (Secure by Default)
_default_exec_mode = "disabled" if IS_PRODUCTION else "local_unsafe"
CODE_EXECUTION_MODE = os.getenv("CODE_EXECUTION_MODE", _default_exec_mode).strip().lower()
if CODE_EXECUTION_MODE not in {"disabled", "docker", "local_unsafe"}:
    raise ValueError("CODE_EXECUTION_MODE debe ser 'disabled', 'docker' o 'local_unsafe'.")

CODE_EXECUTION_DOCKER_PYTHON_IMAGE = os.getenv(
    "CODE_EXECUTION_DOCKER_PYTHON_IMAGE", "python:3.12-slim"
).strip()
CODE_EXECUTION_DOCKER_NODE_IMAGE = os.getenv(
    "CODE_EXECUTION_DOCKER_NODE_IMAGE", "node:22-slim"
).strip()
MAX_CONCURRENT_EXECUTIONS = max(1, int(os.getenv("MAX_CONCURRENT_EXECUTIONS", "4")))

# Límite global del tamaño de petición HTTP (6 MB para permitir imágenes de hasta 5 MB + multipart)
MAX_REQUEST_BODY_BYTES = max(1024 * 1024, int(os.getenv("MAX_REQUEST_BODY_BYTES", str(6 * 1024 * 1024))))
