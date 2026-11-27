from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware
from auth.router import router as auth_router
from code_execution.router import router as execution_router
from notes.database import init_db
from notes.router import router as notes_router
from shared import config
from shared.logging_utils import log_security_event


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Inicializa la base de datos y recursos al arrancar la aplicación."""
    init_db()
    yield


app = FastAPI(
    title="WikiDev API",
    description="Backend para ejecución de código y notas",
    version="0.3.0",
    lifespan=lifespan,
    docs_url=None if config.IS_PRODUCTION else "/docs",
    redoc_url=None if config.IS_PRODUCTION else "/redoc",
    openapi_url=None if config.IS_PRODUCTION else "/openapi.json",
)

# Protección frente a ataques de cabecera Host (incluyendo defensa en profundidad frente a BadHost).
if config.TRUSTED_HOSTS:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=config.TRUSTED_HOSTS)

# CORS restrictivo basado en configuración centralizada.
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRF-Token"],
)


@app.middleware("http")
async def security_headers_and_limits(request: Request, call_next):
    """
    Aplica límites de tamaño de petición y añade cabeceras HTTP de seguridad
    a todas las respuestas de la API.
    """
    content_length = request.headers.get("content-length")
    if content_length is not None:
        try:
            length_int = int(content_length)
        except ValueError:
            return JSONResponse(
                status_code=400,
                content={"detail": "Cabecera Content-Length inválida"},
            )
        if length_int < 0:
            return JSONResponse(
                status_code=400,
                content={"detail": "Cabecera Content-Length inválida"},
            )
        if length_int > config.MAX_REQUEST_BODY_BYTES:
            return JSONResponse(
                status_code=413,
                content={"detail": "La petición supera el tamaño máximo permitido"},
            )

    response = await call_next(request)

    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()",
    )
    if request.url.path.startswith("/api/auth"):
        response.headers["Cache-Control"] = "no-store"
    if config.IS_PRODUCTION:
        response.headers.setdefault(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains",
        )
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Evita filtrar trazas o mensajes internos ante excepciones no controladas."""
    log_security_event(
        "unhandled_exception",
        level=logging.ERROR,
        path=request.url.path,
        error_type=type(exc).__name__,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"},
    )


app.include_router(auth_router, prefix="/api")
app.include_router(execution_router, prefix="/api")
app.include_router(notes_router, prefix="/api")


@app.get("/health")
def health():
    """Endpoint simple de verificación de estado."""
    return {"status": "ok"}
