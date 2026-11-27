import logging
import re
from typing import Any

_CONTROL_CHARS_RE = re.compile(r"[\r\n\t\x00-\x1f\x7f]")

security_logger = logging.getLogger("wikidev.security")
if not security_logger.handlers:
    _handler = logging.StreamHandler()
    _formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    _handler.setFormatter(_formatter)
    security_logger.addHandler(_handler)
    security_logger.setLevel(logging.INFO)


def sanitize_log_value(value: Any, max_length: int = 120) -> str:
    """Elimina saltos de línea y caracteres de control para prevenir Log Injection (CWE-117)."""
    text = str(value)
    cleaned = _CONTROL_CHARS_RE.sub(" ", text).strip()
    if len(cleaned) > max_length:
        return cleaned[:max_length] + "..."
    return cleaned


def log_security_event(event: str, level: int = logging.INFO, **fields: Any) -> None:
    """Registra un evento de seguridad estructurado sin exponer secretos."""
    serialized = " ".join(
        f"{k}={sanitize_log_value(v)}" for k, v in fields.items() if v is not None
    )
    message = f"event={sanitize_log_value(event)}"
    if serialized:
        message = f"{message} {serialized}"
    security_logger.log(level, message)
