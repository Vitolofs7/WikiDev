import subprocess
import sys
import tempfile
import os
from .schemas import RunCodeRequest, RunCodeResponse

MAX_CODE_LENGTH = 10_000  # 10 KB
TIMEOUT = 5  # segundos


async def execute_code(req: RunCodeRequest) -> RunCodeResponse:
    if len(req.code) > MAX_CODE_LENGTH:
        return RunCodeResponse(stdout='', stderr='El código excede el límite permitido (10 KB)', exit_code=1)

    try:
        if req.language == 'python':
            result = _run_python(req.code)
        elif req.language == 'javascript':
            result = _run_javascript(req.code)
        else:
            return RunCodeResponse(stdout='', stderr='Lenguaje no soportado', exit_code=1)
        return result
    except Exception as e:
        return RunCodeResponse(stdout='', stderr=str(e), exit_code=1)


def _run(cmd: list[str], code: str, suffix: str) -> RunCodeResponse:
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False, mode='w', encoding='utf-8') as f:
        f.write(code)
        tmp_path = f.name

    try:
        result = subprocess.run(
            cmd + [tmp_path],
            capture_output=True,
            text=True,
            timeout=TIMEOUT,
        )
        return RunCodeResponse(
            stdout=result.stdout[:50_000],  # limitar output a 50 KB
            stderr=result.stderr[:10_000],
            exit_code=result.returncode,
        )
    except subprocess.TimeoutExpired:
        return RunCodeResponse(
            stdout='',
            stderr=f'Tiempo de ejecución excedido ({TIMEOUT}s)',
            exit_code=1,
        )
    finally:
        os.unlink(tmp_path)


def _run_python(code: str) -> RunCodeResponse:
    return _run([sys.executable], code, '.py')


def _run_javascript(code: str) -> RunCodeResponse:
    return _run(['node'], code, '.js')