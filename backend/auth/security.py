import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from fastapi import Response
from sqlalchemy.orm import Session
from auth.models import User, UserSession
from shared import config

# Argon2id con parámetros recomendados por OWASP.
_password_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
    hash_len=32,
    salt_len=16,
)

# Hash ficticio para ejecutar una verificación de tiempo constante cuando el usuario no existe.
_DUMMY_HASH = _password_hasher.hash("WikiDev!DummyPass#2026")


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def ensure_utc(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def hash_password(password: str) -> str:
    return _password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> tuple[bool, bool]:
    """
    Verifica una contraseña contra su hash Argon2id.

    Returns:
        tuple[bool, bool]: (es_valida, requiere_rehash)
    """
    try:
        valid = _password_hasher.verify(password_hash, password)
        return valid, _password_hasher.check_needs_rehash(password_hash)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False, False


def verify_dummy_password(password: str) -> None:
    """Mitiga ataques de temporización para enumeración de usuarios."""
    try:
        _password_hasher.verify(_DUMMY_HASH, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        pass


def hash_session_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def create_user_session(
    db: Session,
    user: User,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> tuple[str, UserSession]:
    """
    Crea una sesión nueva con un token aleatorio de alta entropía (prevención de Session Fixation).
    Solo se almacena el hash SHA-256 del token en la base de datos.
    """
    raw_token = secrets.token_urlsafe(32)
    csrf_token = secrets.token_urlsafe(32)
    expires_at = utc_now() + timedelta(hours=config.SESSION_TTL_HOURS)

    session = UserSession(
        token_hash=hash_session_token(raw_token),
        csrf_token=csrf_token,
        user_id=user.id,
        expires_at=expires_at,
        revoked=False,
        ip_address=(ip_address or "")[:64] or None,
        user_agent=(user_agent or "")[:255] or None,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return raw_token, session


def set_auth_cookies(response: Response, raw_session_token: str, csrf_token: str) -> None:
    max_age = config.SESSION_TTL_HOURS * 3600
    response.set_cookie(
        key=config.SESSION_COOKIE_NAME,
        value=raw_session_token,
        httponly=True,
        secure=config.COOKIE_SECURE,
        samesite=config.COOKIE_SAMESITE,
        path="/",
        max_age=max_age,
    )
    response.set_cookie(
        key=config.CSRF_COOKIE_NAME,
        value=csrf_token,
        httponly=False,
        secure=config.COOKIE_SECURE,
        samesite=config.COOKIE_SAMESITE,
        path="/",
        max_age=max_age,
    )


def cleanup_expired_sessions(db: Session) -> int:
    """Elimina sesiones expiradas para evitar crecimiento ilimitado de la tabla."""
    deleted = (
        db.query(UserSession)
        .filter(UserSession.expires_at < utc_now())
        .delete(synchronize_session=False)
    )
    db.commit()
    return deleted


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(
        key=config.SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=config.COOKIE_SECURE,
        samesite=config.COOKIE_SAMESITE,
    )
    response.delete_cookie(
        key=config.CSRF_COOKIE_NAME,
        path="/",
        httponly=False,
        secure=config.COOKIE_SECURE,
        samesite=config.COOKIE_SAMESITE,
    )
