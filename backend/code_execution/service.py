import asyncio
import logging
import os
import shutil
# Ejecución controlada de intérpretes/Docker sin shell=True.
import subprocess  # nosec B404
import sys
import tempfile
from pathlib import Path
from typing import Optional
from fastapi import HTTPException
from code_execution.schemas import (
    MAX_CODE_LENGTH,
    MAX_STDIN_LENGTH,
    RunCodeRequest,
    RunCodeResponse,
)
from shared import config
from shared.logging_utils import log_security_event

TIMEOUT = 5  # segundos
MAX_STDOUT_CHARS = 50_000
MAX_STDERR_CHARS = 10_000

_execution_semaphore: Optional[asyncio.Semaphore] = None


def _get_semaphore() -> asyncio.Semaphore:
    global _execution_semaphore
    if _execution_semaphore is None:
        _execution_semaphore = asyncio.Semaphore(config.MAX_CONCURRENT_EXECUTIONS)
    return _execution_semaphore


def _build_safe_env(work_dir: str) -> dict[str, str]:
    """
    Construye un entorno mínimo sin heredar secretos ni variables de configuración
    del proceso backend (p. ej. DATABASE_URL, claves API o tokens).
    """
    env: dict[str, str] = {
        "PATH": os.environ.get("PATH", ""),
        "TMP": work_dir,
        "TEMP": work_dir,
        "TMPDIR": work_dir,
        "HOME": work_dir,
        "PYTHONIOENCODING": "utf-8",
        "PYTHONDONTWRITEBYTECODE": "1",
    }
    if os.name == "nt":
        for key in ("SYSTEMROOT", "WINDIR"):
            if key in os.environ:
                env[key] = os.environ[key]
    return env


def _terminate_process_tree(proc: subprocess.Popen) -> None:
    try:
        proc.kill()
    except OSError:
        pass
    try:
        proc.wait(timeout=2)
    except Exception:
        pass


def _run_subprocess(
    cmd: list[str],
    work_dir: str,
    stdin: str,
    use_safe_env: bool = True,
) -> RunCodeResponse:
    env = _build_safe_env(work_dir) if use_safe_env else None
    # Argumentos en lista fija con shell=False.
    proc = subprocess.Popen(  # nosec B603
        cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
        cwd=work_dir,
        env=env,
        shell=False,
    )
    try:
        stdout, stderr = proc.communicate(input=stdin, timeout=TIMEOUT)
        return RunCodeResponse(
            stdout=(stdout or "")[:MAX_STDOUT_CHARS],
            stderr=(stderr or "")[:MAX_STDERR_CHARS],
            exit_code=proc.returncode,
        )
    except subprocess.TimeoutExpired:
        _terminate_process_tree(proc)
        return RunCodeResponse(
            stdout="",
            stderr=f"Tiempo de ejecución excedido ({TIMEOUT}s)",
            exit_code=124,
        )


def _run_local_unsafe(language: str, code: str, stdin: str) -> RunCodeResponse:
    work_dir = tempfile.mkdtemp(prefix="wikidev_exec_")
    try:
        if language == "python":
            script_path = Path(work_dir) / "main.py"
            script_path.write_text(code, encoding="utf-8")
            cmd = [sys.executable, "-I", str(script_path)]
        elif language == "javascript":
            node_bin = shutil.which("node")
            if not node_bin:
                return RunCodeResponse(
                    stdout="",
                    stderr="Intérprete de JavaScript no disponible en el servidor",
                    exit_code=1,
                )
            script_path = Path(work_dir) / "main.js"
            script_path.write_text(code, encoding="utf-8")
            cmd = [node_bin, str(script_path)]
        else:
            return RunCodeResponse(stdout="", stderr="Lenguaje no soportado", exit_code=1)

        return _run_subprocess(cmd, work_dir=work_dir, stdin=stdin, use_safe_env=True)
    finally:
        shutil.rmtree(work_dir, ignore_errors=True)


def _run_docker(language: str, code: str, stdin: str) -> RunCodeResponse:
    """
    Ejecuta código dentro de un contenedor efímero sin privilegios, sin red,
    sistema de archivos de solo lectura y límites estrictos de CPU/RAM/PIDs.
    """
    docker_bin = shutil.which("docker")
    if not docker_bin:
        raise HTTPException(
            status_code=503,
            detail="El motor de aislamiento Docker no está disponible en este servidor",
        )

    work_dir = tempfile.mkdtemp(prefix="wikidev_docker_")
    try:
        if language == "python":
            image = config.CODE_EXECUTION_DOCKER_PYTHON_IMAGE
            script_name = "main.py"
            runtime_cmd = ["python3", "-I", f"/sandbox/{script_name}"]
        elif language == "javascript":
            image = config.CODE_EXECUTION_DOCKER_NODE_IMAGE
            script_name = "main.js"
            runtime_cmd = ["node", f"/sandbox/{script_name}"]
        else:
            return RunCodeResponse(stdout="", stderr="Lenguaje no soportado", exit_code=1)

        script_path = Path(work_dir) / script_name
        script_path.write_text(code, encoding="utf-8")

        cmd = [
            docker_bin,
            "run",
            "--rm",
            "-i",
            "--network=none",
            "--read-only",
            "--cap-drop=ALL",
            "--security-opt=no-new-privileges:true",
            "--pids-limit=32",
            "--memory=128m",
            "--memory-swap=128m",
            "--cpus=0.5",
            # Mount tmpfs efímero dentro del contenedor aislado, no en el host.
            "--tmpfs",
            "/tmp:rw,noexec,nosuid,size=16m",  # nosec B108
            "--user",
            "65534:65534",
            "-v",
            f"{work_dir}:/sandbox:ro",
            image,
            *runtime_cmd,
        ]
        return _run_subprocess(cmd, work_dir=work_dir, stdin=stdin, use_safe_env=False)
    finally:
        shutil.rmtree(work_dir, ignore_errors=True)


async def execute_code(req: RunCodeRequest, user_id: Optional[int] = None) -> RunCodeResponse:
    mode = config.CODE_EXECUTION_MODE
    if mode == "disabled":
        log_security_event(
            "code_execution_blocked_disabled",
            level=logging.WARNING,
            user_id=user_id,
            language=req.language,
        )
        raise HTTPException(
            status_code=503,
            detail="La ejecución de código está deshabilitada en este entorno por seguridad",
        )

    if len(req.code) > MAX_CODE_LENGTH:
        return RunCodeResponse(
            stdout="",
            stderr="El código excede el límite permitido (10 KB)",
            exit_code=1,
        )

    stdin_data = req.stdin or ""
    if len(stdin_data) > MAX_STDIN_LENGTH:
        return RunCodeResponse(
            stdout="",
            stderr="La entrada estándar excede el límite permitido (10 KB)",
            exit_code=1,
        )

    log_security_event(
        "code_execution_started",
        user_id=user_id,
        language=req.language,
        mode=mode,
        code_len=len(req.code),
    )

    semaphore = _get_semaphore()
    async with semaphore:
        if mode == "docker":
            return await asyncio.to_thread(_run_docker, req.language, req.code, stdin_data)
        return await asyncio.to_thread(_run_local_unsafe, req.language, req.code, stdin_data)
