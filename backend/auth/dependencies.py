import hmac
import logging
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session, joinedload
from auth.models import User, UserSession
from auth.security import ensure_utc, hash_session_token, utc_now
from notes.database import get_db
from shared import config
from shared.logging_utils import log_security_event
from shared.rate_limit import get_client_ip


def verify_origin(request: Request) -> None:
    """
    Valida cabeceras Origin y Sec-Fetch-Site frente a peticiones cross-site no autorizadas.
    """
    sec_fetch_site = request.headers.get("sec-fetch-site", "").strip().lower()
    origin = request.headers.get("origin", "").strip().rstrip("/")

    if origin and origin not in config.CORS_ORIGINS:
        log_security_event(
            "origin_rejected",
            level=logging.WARNING,
            origin=origin,
            ip=get_client_ip(request),
            path=request.url.path,
        )
        raise HTTPException(status_code=403, detail="Origen no autorizado")

    if sec_fetch_site == "cross-site" and (not origin or origin not in config.CORS_ORIGINS):
        log_security_event(
            "cross_site_rejected",
            level=logging.WARNING,
            sec_fetch_site=sec_fetch_site,
            ip=get_client_ip(request),
            path=request.url.path,
        )
        raise HTTPException(status_code=403, detail="Petición cross-site rechazada")


def get_current_session(
    request: Request,
    db: Session = Depends(get_db),
) -> UserSession:
    raw_token = request.cookies.get(config.SESSION_COOKIE_NAME)
    if not raw_token:
        raise HTTPException(status_code=401, detail="Autenticación requerida")

    token_hash = hash_session_token(raw_token)
    session = (
        db.query(UserSession)
        .options(joinedload(UserSession.user))
        .filter(UserSession.token_hash == token_hash)
        .first()
    )

    now = utc_now()
    if (
        not session
        or session.revoked
        or ensure_utc(session.expires_at) <= now
        or not session.user
        or not session.user.is_active
    ):
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")

    return session


def get_current_user(
    session: UserSession = Depends(get_current_session),
) -> User:
    return session.user


def verify_csrf(
    request: Request,
    session: UserSession = Depends(get_current_session),
) -> None:
    """
    Protección CSRF para operaciones que modifican estado o ejecutan acciones sensibles.

    Valida Origin/Sec-Fetch-Site y exige coincidencia en tiempo constante del token CSRF
    vinculado a la sesión en servidor.
    """
    verify_origin(request)
    header_token = request.headers.get("x-csrf-token", "")
    if not header_token or not hmac.compare_digest(header_token, session.csrf_token):
        log_security_event(
            "csrf_validation_failed",
            level=logging.WARNING,
            user_id=session.user_id,
            ip=get_client_ip(request),
            path=request.url.path,
        )
        raise HTTPException(status_code=403, detail="Token CSRF inválido o ausente")
