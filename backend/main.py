from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from code_execution.router import router as execution_router
from notes.router import router as notes_router
from notes.database import init_db
from collections import defaultdict
import time

# Crea la instancia principal de FastAPI con metadatos de la API.
app = FastAPI(
    title="WikiDev API",
    description="Backend para ejecución de código y notas",
    version="0.2.0",
)

# Configura CORS para permitir peticiones desde el frontend local.
# Esto permite que una aplicación en otro dominio o puerto
# pueda comunicarse con esta API.
app.add_middleware(
    CORSMiddleware,
    # Lista de orígenes permitidos.
    allow_origins=["http://localhost:3000"],
    # Permite enviar cookies, cabeceras de autenticación, etc.
    allow_credentials=True,
    # Permite todos los métodos HTTP.
    allow_methods=["*"],
    # Permite todas las cabeceras HTTP.
    allow_headers=["*"],
)

# -----------------------------
# Configuración de rate limiting
# -----------------------------
#
# Se limita únicamente el endpoint /api/execute
# para evitar abuso de la ejecución de código.
#
# Máximo:
# - 20 peticiones
# - cada 60 segundos
# - por dirección IP
RATE_LIMIT = 20
RATE_WINDOW = 60

# Diccionario que almacena timestamps de peticiones por IP.
#
# Ejemplo:
# {
#     "192.168.1.10": [1712660000.0, 1712660025.0],
#     "192.168.1.11": [1712660010.0]
# }
_rate_store: dict[str, list[float]] = defaultdict(list)


@app.middleware("http")
async def rate_limit_execute(request: Request, call_next):
    """
    Middleware para limitar el número de peticiones al endpoint de ejecución.

    Args:
        request: Petición HTTP entrante.
        call_next: Función que continúa el flujo hacia el siguiente middleware o endpoint.

    Returns:
        Response: Respuesta HTTP generada.
    """

    # Solo aplica rate limiting al endpoint de ejecución de código.
    if request.url.path == "/api/execute":

        # Obtiene la IP del cliente que realiza la petición.
        ip = request.client.host

        # Timestamp actual en segundos.
        now = time.time()

        # Obtiene las marcas de tiempo previas de esa IP.
        timestamps = _rate_store[ip]

        # Elimina peticiones antiguas fuera de la ventana configurada.
        _rate_store[ip] = [t for t in timestamps if now - t < RATE_WINDOW]

        # Verifica si ya alcanzó el límite permitido.
        if len(_rate_store[ip]) >= RATE_LIMIT:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": (
                        f"Demasiadas peticiones. "
                        f"Límite: {RATE_LIMIT} ejecuciones por minuto."
                    )
                },
            )

        # Registra la petición actual.
        _rate_store[ip].append(now)

    # Continúa con la ejecución normal de la petición.
    return await call_next(request)


# Registra el router de ejecución de código bajo el prefijo /api.
app.include_router(execution_router, prefix="/api")

# Registra el router de notas bajo el prefijo /api.
app.include_router(notes_router, prefix="/api")


@app.on_event("startup")
def startup():
    """
    Evento ejecutado al iniciar la aplicación.

    Inicializa la base de datos y crea las tablas necesarias.
    """

    init_db()


@app.get("/health")
def health():
    """
    Endpoint simple de verificación de estado.

    Returns:
        dict: Estado básico de disponibilidad de la API.
    """

    return {"status": "ok"}
