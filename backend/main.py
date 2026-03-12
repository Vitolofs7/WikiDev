from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from code_execution.router import router as execution_router
from notes.router import router as notes_router
from notes.database import init_db
from collections import defaultdict
import time

app = FastAPI(
    title="WikiDev API",
    description="Backend para ejecución de código y notas",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting — solo para /api/execute
# Máximo 20 peticiones por IP cada 60 segundos
RATE_LIMIT = 20
RATE_WINDOW = 60
_rate_store: dict[str, list[float]] = defaultdict(list)


@app.middleware("http")
async def rate_limit_execute(request: Request, call_next):
    if request.url.path == "/api/execute":
        ip = request.client.host
        now = time.time()
        timestamps = _rate_store[ip]

        # Limpiar peticiones fuera de la ventana
        _rate_store[ip] = [t for t in timestamps if now - t < RATE_WINDOW]

        if len(_rate_store[ip]) >= RATE_LIMIT:
            return JSONResponse(
                status_code=429,
                content={"detail": f"Demasiadas peticiones. Límite: {RATE_LIMIT} ejecuciones por minuto."},
            )

        _rate_store[ip].append(now)

    return await call_next(request)


app.include_router(execution_router, prefix="/api")
app.include_router(notes_router, prefix="/api")


@app.on_event("startup")
def startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}