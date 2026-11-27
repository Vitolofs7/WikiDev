import logging
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from auth.dependencies import get_current_session, verify_csrf, verify_origin
from auth.models import User, UserSession
from auth.schemas import (
    AuthResponse,
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    UserOut,
)
from auth.security import (
    cleanup_expired_sessions,
    clear_auth_cookies,
    create_user_session,
    ensure_utc,
    hash_password,
    set_auth_cookies,
    utc_now,
    verify_dummy_password,
    verify_password,
)
from notes.database import get_db
from shared import config
from shared.logging_utils import log_security_event
from shared.rate_limit import auth_login_limiter, auth_register_limiter, get_client_ip

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(auth_register_limiter), Depends(verify_origin)],
)
def register(
    payload: RegisterRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    """Registra un nuevo usuario, hashea su contraseña con Argon2id e inicia sesión."""
    existing = (
        db.query(User)
        .filter(
            or_(
                User.email == payload.email,
                User.username == payload.username,
            )
        )
        .first()
    )
    if existing:
        log_security_event(
            "register_conflict",
            level=logging.WARNING,
            ip=get_client_ip(request),
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No fue posible completar el registro con los datos proporcionados",
        )

    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="user",
        is_active=True,
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No fue posible completar el registro con los datos proporcionados",
        )

    raw_token, session = create_user_session(
        db=db,
        user=user,
        ip_address=get_client_ip(request),
        user_agent=request.headers.get("user-agent"),
    )
    set_auth_cookies(response, raw_token, session.csrf_token)

    log_security_event(
        "user_registered",
        user_id=user.id,
        ip=get_client_ip(request),
    )

    return AuthResponse(user=UserOut.model_validate(user), csrf_token=session.csrf_token)


@router.post(
    "/login",
    response_model=AuthResponse,
    dependencies=[Depends(auth_login_limiter), Depends(verify_origin)],
)
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    """Autentica al usuario con protección frente a fuerza bruta y enumeración."""
    ip = get_client_ip(request)
    identifier_lower = payload.identifier.lower()

    user = (
        db.query(User)
        .filter(
            or_(
                User.email == identifier_lower,
                User.username == payload.identifier,
            )
        )
        .first()
    )

    now = utc_now()

    if not user:
        verify_dummy_password(payload.password)
        log_security_event("login_failed", level=logging.WARNING, reason="unknown", ip=ip)
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    locked_until = ensure_utc(user.locked_until)
    if locked_until and locked_until > now:
        verify_dummy_password(payload.password)
        log_security_event(
            "login_blocked_locked",
            level=logging.WARNING,
            user_id=user.id,
            ip=ip,
        )
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    is_valid, needs_rehash = verify_password(payload.password, user.password_hash)

    if not is_valid or not user.is_active:
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= config.MAX_FAILED_LOGINS:
            user.locked_until = now + timedelta(minutes=config.ACCOUNT_LOCKOUT_MINUTES)
            user.failed_login_attempts = 0
        db.commit()
        log_security_event(
            "login_failed",
            level=logging.WARNING,
            user_id=user.id,
            active=user.is_active,
            ip=ip,
        )
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # Inicio de sesión exitoso: reinicia contadores y actualiza hash si hace falta.
    user.failed_login_attempts = 0
    user.locked_until = None
    if needs_rehash:
        user.password_hash = hash_password(payload.password)
    db.commit()

    # Revoca cualquier sesión previa enviada en la cookie actual para prevenir Session Fixation.
    old_cookie = request.cookies.get(config.SESSION_COOKIE_NAME)
    if old_cookie:
        from auth.security import hash_session_token

        db.query(UserSession).filter(
            UserSession.token_hash == hash_session_token(old_cookie)
        ).update({"revoked": True})
        db.commit()

    raw_token, session = create_user_session(
        db=db,
        user=user,
        ip_address=ip,
        user_agent=request.headers.get("user-agent"),
    )
    cleanup_expired_sessions(db)
    set_auth_cookies(response, raw_token, session.csrf_token)

    log_security_event("login_success", user_id=user.id, ip=ip)
    return AuthResponse(user=UserOut.model_validate(user), csrf_token=session.csrf_token)


@router.post("/logout", dependencies=[Depends(verify_csrf)])
def logout(
    request: Request,
    response: Response,
    session: UserSession = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    """Revoca la sesión activa en servidor y limpia las cookies de autenticación."""
    session.revoked = True
    db.commit()
    clear_auth_cookies(response)
    log_security_event(
        "logout_success",
        user_id=session.user_id,
        ip=get_client_ip(request),
    )
    return {"ok": True}


@router.post("/logout-all", dependencies=[Depends(verify_csrf)])
def logout_all(
    request: Request,
    response: Response,
    session: UserSession = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    """Revoca todas las sesiones activas del usuario autenticado."""
    db.query(UserSession).filter(
        UserSession.user_id == session.user_id,
        UserSession.revoked.is_(False),
    ).update({"revoked": True}, synchronize_session=False)
    db.commit()
    clear_auth_cookies(response)
    log_security_event(
        "logout_all_success",
        user_id=session.user_id,
        ip=get_client_ip(request),
    )
    return {"ok": True}


@router.post(
    "/change-password",
    response_model=AuthResponse,
    dependencies=[Depends(auth_login_limiter), Depends(verify_csrf)],
)
def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    response: Response,
    session: UserSession = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    """Cambia la contraseña del usuario autenticado y rota todas sus sesiones activas."""
    ip = get_client_ip(request)
    user = session.user

    is_valid, _ = verify_password(payload.current_password, user.password_hash)
    if not is_valid:
        log_security_event(
            "password_change_failed",
            level=logging.WARNING,
            user_id=user.id,
            ip=ip,
        )
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")

    if payload.new_password == payload.current_password:
        raise HTTPException(
            status_code=400,
            detail="La nueva contraseña debe ser diferente de la actual",
        )

    user.password_hash = hash_password(payload.new_password)
    db.query(UserSession).filter(
        UserSession.user_id == user.id,
        UserSession.revoked.is_(False),
    ).update({"revoked": True}, synchronize_session=False)
    db.commit()

    raw_token, new_session = create_user_session(
        db=db,
        user=user,
        ip_address=ip,
        user_agent=request.headers.get("user-agent"),
    )
    set_auth_cookies(response, raw_token, new_session.csrf_token)
    log_security_event("password_changed", user_id=user.id, ip=ip)
    return AuthResponse(
        user=UserOut.model_validate(user),
        csrf_token=new_session.csrf_token,
    )


@router.get("/me", response_model=AuthResponse)
def get_me(session: UserSession = Depends(get_current_session)):
    """Devuelve el usuario autenticado actual y su token CSRF de sesión."""
    return AuthResponse(
        user=UserOut.model_validate(session.user),
        csrf_token=session.csrf_token,
    )
