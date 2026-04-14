import subprocess
import sys
import tempfile
import os
from .schemas import RunCodeRequest, RunCodeResponse

# Tamaño máximo permitido para el código recibido.
# Se limita para evitar abuso o consumo excesivo de recursos.
MAX_CODE_LENGTH = 10_000  # 10 KB
# Tiempo máximo permitido para la ejecución de un programa.
TIMEOUT = 5  # segundos


async def execute_code(req: RunCodeRequest) -> RunCodeResponse:
    """
    Ejecuta código según el lenguaje especificado en la petición.

    Args:
        req: Objeto con el lenguaje y el código fuente.
    Returns:
        RunCodeResponse: Resultado de la ejecución.
    """
    # Valida que el tamaño del código no supere el límite establecido.
    if len(req.code) > MAX_CODE_LENGTH:
        return RunCodeResponse(
            stdout="",
            stderr="El código excede el límite permitido (10 KB)",
            exit_code=1,
        )

    try:
        # Selecciona el motor de ejecución según el lenguaje indicado.
        if req.language == "python":
            result = _run_python(req.code)
        elif req.language == "javascript":
            result = _run_javascript(req.code)
        else:
            # Protección adicional ante lenguajes no soportados.
            return RunCodeResponse(
                stdout="", stderr="Lenguaje no soportado", exit_code=1
            )
        return result
    except Exception as e:
        # Captura cualquier error inesperado y lo devuelve como stderr.
        return RunCodeResponse(stdout="", stderr=str(e), exit_code=1)


def _run(cmd: list[str], code: str, suffix: str) -> RunCodeResponse:
    """
    Ejecuta código fuente escribiéndolo primero en un archivo temporal.

    Args:
        cmd: Comando base que se utilizará para ejecutar el archivo.
        code: Código fuente recibido.
        suffix: Extensión del archivo temporal (.py, .js, etc.).
    Returns:
        RunCodeResponse: Resultado de la ejecución.
    """

    # Crea un archivo temporal en disco para almacenar el código.
    with tempfile.NamedTemporaryFile(
        suffix=suffix, delete=False, mode="w", encoding="utf-8"
    ) as f:
        f.write(code)
        tmp_path = f.name

    try:
        # Ejecuta el archivo temporal mediante un proceso externo.
        result = subprocess.run(
            cmd + [tmp_path],
            # Captura stdout y stderr.
            capture_output=True,
            # Devuelve la salida como texto en lugar de bytes.
            text=True,
            # Cancela la ejecución si supera el tiempo permitido.
            timeout=TIMEOUT,
        )
        # Devuelve el resultado limitando el tamaño máximo de salida.
        return RunCodeResponse(
            stdout=result.stdout[:50_000],  # Máximo 50 KB
            stderr=result.stderr[:10_000],  # Máximo 10 KB
            exit_code=result.returncode,
        )
    except subprocess.TimeoutExpired:
        # Maneja específicamente el caso en que el programa tarda demasiado.
        return RunCodeResponse(
            stdout="",
            stderr=f"Tiempo de ejecución excedido ({TIMEOUT}s)",
            exit_code=1,
        )
    finally:
        # Elimina el archivo temporal independientemente del resultado.
        # Esto evita acumular archivos innecesarios en el sistema.
        os.unlink(tmp_path)


def _run_python(code: str) -> RunCodeResponse:
    """
    Ejecuta código Python usando el intérprete actual.
    """
    # sys.executable apunta al binario de Python actualmente en uso.
    return _run([sys.executable], code, ".py")


def _run_javascript(code: str) -> RunCodeResponse:
    """
    Ejecuta código JavaScript usando Node.js.
    """
    return _run(["node"], code, ".js")
