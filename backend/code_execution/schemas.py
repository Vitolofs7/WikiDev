from pydantic import BaseModel
from typing import Literal, Optional


# Modelo de entrada para solicitudes de ejecución de código.
class RunCodeRequest(BaseModel):
    # Solo se permiten los lenguajes definidos explícitamente.
    language: Literal["python", "javascript"]
    # Código fuente que será ejecutado.
    code: str


# Modelo de salida con el resultado de la ejecución.
class RunCodeResponse(BaseModel):
    # Salida estándar producida por el programa.
    stdout: str
    # Salida de error producida por el programa.
    stderr: str
    # Código de salida del proceso.
    # 0 normalmente indica éxito.
    exit_code: Optional[int] = None
