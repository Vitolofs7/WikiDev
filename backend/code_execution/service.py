import subprocess
import sys
import tempfile
import os
from typing import Optional
from .schemas import RunCodeRequest, RunCodeResponse

# Tamaño máximo permitido para el código recibido.
# Se limita para evitar abuso o consumo excesivo de recursos.
MAX_CODE_LENGTH = 10_000  # 10 KB
# Tiempo máximo permitido para la ejecución de un programa.
TIMEOUT = 5  # segundos


async def execute_code(req: RunCodeRequest) -> RunCodeResponse:
    print(f"stdin recibido: '{req.stdin}'")  # log temporal
    if len(req.code) > MAX_CODE_LENGTH:
        return RunCodeResponse(
            stdout="",
            stderr="El código excede el límite permitido (10 KB)",
            exit_code=1,
        )

    try:
        if req.language == "python":
            result = _run_python(req.code, req.stdin)
        elif req.language == "javascript":
            result = _run_javascript(req.code, req.stdin)
        else:
            return RunCodeResponse(
                stdout="", stderr="Lenguaje no soportado", exit_code=1
            )
        return result
    except Exception as e:
        return RunCodeResponse(stdout="", stderr=str(e), exit_code=1)


def _run(
    cmd: list[str], code: str, suffix: str, stdin: Optional[str] = None
) -> RunCodeResponse:
    with tempfile.NamedTemporaryFile(
        suffix=suffix, delete=False, mode="w", encoding="utf-8"
    ) as f:
        f.write(code)
        tmp_path = f.name

    try:
        result = subprocess.run(
            cmd + [tmp_path],
            capture_output=True,
            text=True,
            timeout=TIMEOUT,
            input=stdin or "",
        )
        return RunCodeResponse(
            stdout=result.stdout[:50_000],
            stderr=result.stderr[:10_000],
            exit_code=result.returncode,
        )
    except subprocess.TimeoutExpired:
        return RunCodeResponse(
            stdout="",
            stderr=f"Tiempo de ejecución excedido ({TIMEOUT}s)",
            exit_code=1,
        )
    finally:
        os.unlink(tmp_path)


def _run_python(code: str, stdin: Optional[str] = None) -> RunCodeResponse:
    return _run([sys.executable], code, ".py", stdin)


def _run_javascript(code: str, stdin: Optional[str] = None) -> RunCodeResponse:
    return _run(["node"], code, ".js", stdin)
