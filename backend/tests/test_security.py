from io import BytesIO
import os
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

# Configura entorno de pruebas aislado antes de importar módulos de la app
os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("CODE_EXECUTION_MODE", "local_unsafe")

from auth.models import User  # noqa: E402
from main import app  # noqa: E402
from notes.database import get_db  # noqa: E402
from shared import config  # noqa: E402
from shared.db_base import Base  # noqa: E402
from shared.rate_limit import reset_all_rate_limiters  # noqa: E402


def _make_png_bytes(width: int = 16, height: int = 16) -> bytes:
    buf = BytesIO()
    img = Image.new("RGB", (width, height), color=(124, 109, 250))
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture()
def test_env(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    db_file = tmp_path / "test_wikidev.db"
    images_dir = tmp_path / "note_images"
    images_dir.mkdir(parents=True, exist_ok=True)

    engine = create_engine(
        f"sqlite:///{db_file.as_posix()}",
        connect_args={"check_same_thread": False},
    )

    @event.listens_for(engine, "connect")
    def _fk_on(dbapi_conn, _rec):
        cur = dbapi_conn.cursor()
        cur.execute("PRAGMA foreign_keys=ON")
        cur.close()

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def _override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    monkeypatch.setattr(config, "IMAGES_DIR", images_dir)
    monkeypatch.setattr(config, "CODE_EXECUTION_MODE", "local_unsafe")
    app.dependency_overrides[get_db] = _override_get_db
    reset_all_rate_limiters()

    yield {
        "session_factory": TestingSessionLocal,
        "images_dir": images_dir,
    }

    app.dependency_overrides.clear()
    reset_all_rate_limiters()
    engine.dispose()


def _new_client() -> TestClient:
    return TestClient(app, base_url="http://localhost")


def _register_user(
    client: TestClient,
    username: str,
    email: str,
    password: str = "StrongPass!2026",
):
    res = client.post(
        "/api/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert res.status_code == 201, res.text
    return res.json()


# ---------------------------------------------------------------------------
# 1. Control de acceso y autenticación (SEC-002)
# ---------------------------------------------------------------------------


def test_unauthenticated_requests_are_rejected(test_env):
    client = _new_client()
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/notes/").status_code == 401
    assert client.post("/api/notes/", json={"title": "x", "content": ""}).status_code == 401
    assert client.put("/api/notes/1", json={"title": "x"}).status_code == 401
    assert client.delete("/api/notes/1").status_code == 401
    assert (
        client.get("/api/notes/images/00000000-0000-0000-0000-000000000000.png").status_code
        == 401
    )
    assert (
        client.post("/api/execute", json={"language": "python", "code": "print(1)"}).status_code
        == 401
    )


def test_password_policy_argon2id_and_cookie_flags(test_env):
    client = _new_client()
    weak = client.post(
        "/api/auth/register",
        json={"username": "weakuser", "email": "weak@example.com", "password": "password"},
    )
    assert weak.status_code == 422

    res = client.post(
        "/api/auth/register",
        json={
            "username": "alice",
            "email": "alice@example.com",
            "password": "StrongPass!2026",
        },
    )
    assert res.status_code == 201

    # Verifica atributo HttpOnly en la cookie de sesión y Cache-Control: no-store
    set_cookies = res.headers.get_list("set-cookie")
    session_cookie_header = next(c for c in set_cookies if c.startswith("wikidev_session="))
    assert "httponly" in session_cookie_header.lower()
    assert "samesite=lax" in session_cookie_header.lower()
    assert res.headers.get("cache-control") == "no-store"

    # Verifica almacenamiento con Argon2id (nunca texto plano)
    db = test_env["session_factory"]()
    try:
        user = db.query(User).filter(User.username == "alice").first()
        assert user is not None
        assert user.password_hash.startswith("$argon2id$")
        assert "StrongPass!2026" not in user.password_hash
    finally:
        db.close()


def test_anti_enumeration_lockout_and_session_revocation(test_env):
    client = _new_client()
    auth = _register_user(client, "bob", "bob@example.com")
    csrf = auth["csrf_token"]
    old_session = client.cookies.get("wikidev_session")

    # Logout revoca sesión en servidor
    logout_res = client.post("/api/auth/logout", headers={"X-CSRF-Token": csrf})
    assert logout_res.status_code == 200

    # Reutilizar la cookie revocada falla con 401
    client.cookies.set("wikidev_session", old_session)
    assert client.get("/api/auth/me").status_code == 401
    client.cookies.clear()

    # Mensajes genéricos idénticos ante usuario inexistente vs contraseña incorrecta
    r_unknown = client.post(
        "/api/auth/login",
        json={"identifier": "nobody@example.com", "password": "WrongPassword!1"},
    )
    r_wrong = client.post(
        "/api/auth/login",
        json={"identifier": "bob@example.com", "password": "WrongPassword!1"},
    )
    assert r_unknown.status_code == 401
    assert r_wrong.status_code == 401
    assert r_unknown.json()["detail"] == r_wrong.json()["detail"]

    # Agota los 5 intentos fallidos para activar bloqueo de cuenta
    for _ in range(4):
        res = client.post(
            "/api/auth/login",
            json={"identifier": "bob@example.com", "password": "WrongPassword!1"},
        )
        assert res.status_code == 401

    # Incluso con la contraseña correcta la cuenta bloqueada responde 401
    locked = client.post(
        "/api/auth/login",
        json={"identifier": "bob@example.com", "password": "StrongPass!2026"},
    )
    assert locked.status_code == 401


def test_session_rotation_on_login_and_inactive_user_blocked(test_env):
    client = _new_client()
    _register_user(client, "carol", "carol@example.com")
    first_cookie = client.cookies.get("wikidev_session")

    login_res = client.post(
        "/api/auth/login",
        json={"identifier": "carol", "password": "StrongPass!2026"},
    )
    assert login_res.status_code == 200
    second_cookie = client.cookies.get("wikidev_session")
    assert second_cookie != first_cookie

    # Desactivar la cuenta invalida inmediatamente su sesión
    db = test_env["session_factory"]()
    try:
        user = db.query(User).filter(User.username == "carol").first()
        user.is_active = False
        db.commit()
    finally:
        db.close()

    assert client.get("/api/auth/me").status_code == 401


# ---------------------------------------------------------------------------
# 2. Aislamiento multiusuario y prevención IDOR/BOLA (SEC-002)
# ---------------------------------------------------------------------------


def test_idor_isolation_between_users_for_notes_and_images(test_env):
    client_a = _new_client()
    auth_a = _register_user(client_a, "user_a", "a@example.com")
    csrf_a = auth_a["csrf_token"]

    note_res = client_a.post(
        "/api/notes/",
        json={"title": "Secreto de A", "content": "Contenido privado"},
        headers={"X-CSRF-Token": csrf_a},
    )
    assert note_res.status_code == 200
    note_id = note_res.json()["id"]

    img_res = client_a.post(
        f"/api/notes/{note_id}/images",
        files={"file": ("foto.png", _make_png_bytes(), "image/png")},
        headers={"X-CSRF-Token": csrf_a},
    )
    assert img_res.status_code == 200
    img = img_res.json()["images"][0]

    # Usuario B no puede leer, editar, borrar ni descargar recursos de A
    client_b = _new_client()
    auth_b = _register_user(client_b, "user_b", "b@example.com")
    csrf_b = auth_b["csrf_token"]

    assert client_b.get("/api/notes/").json() == []
    assert (
        client_b.put(
            f"/api/notes/{note_id}",
            json={"title": "Hackeada"},
            headers={"X-CSRF-Token": csrf_b},
        ).status_code
        == 404
    )
    assert (
        client_b.delete(
            f"/api/notes/{note_id}",
            headers={"X-CSRF-Token": csrf_b},
        ).status_code
        == 404
    )
    assert (
        client_b.post(
            f"/api/notes/{note_id}/images",
            files={"file": ("otra.png", _make_png_bytes(), "image/png")},
            headers={"X-CSRF-Token": csrf_b},
        ).status_code
        == 404
    )
    assert (
        client_b.delete(
            f"/api/notes/{note_id}/images/{img['id']}",
            headers={"X-CSRF-Token": csrf_b},
        ).status_code
        == 404
    )
    assert client_b.get(f"/api/notes/images/{img['filename']}").status_code == 404

    # Usuario A sí puede descargar su propia imagen con cabeceras seguras
    dl = client_a.get(f"/api/notes/images/{img['filename']}")
    assert dl.status_code == 200
    assert dl.headers["content-type"] == "image/png"
    assert dl.headers["x-content-type-options"] == "nosniff"
    assert "sandbox" in dl.headers["content-security-policy"]


# ---------------------------------------------------------------------------
# 3. Protección CSRF y Origin (SEC-007)
# ---------------------------------------------------------------------------


def test_csrf_and_origin_protection(test_env):
    client = _new_client()
    auth = _register_user(client, "csrfuser", "csrf@example.com")
    csrf = auth["csrf_token"]

    # Sin token CSRF
    assert client.post("/api/notes/", json={"title": "t", "content": ""}).status_code == 403
    # Token CSRF incorrecto
    assert (
        client.post(
            "/api/notes/",
            json={"title": "t", "content": ""},
            headers={"X-CSRF-Token": "invalid-token"},
        ).status_code
        == 403
    )
    # Origin no autorizado
    assert (
        client.post(
            "/api/notes/",
            json={"title": "t", "content": ""},
            headers={"X-CSRF-Token": csrf, "Origin": "https://attacker.example"},
        ).status_code
        == 403
    )
    # Ejecución de código sin CSRF
    assert (
        client.post(
            "/api/execute",
            json={"language": "python", "code": "print(1)"},
        ).status_code
        == 403
    )


# ---------------------------------------------------------------------------
# 4. Archivos: validación real, límites y borrado físico (SEC-005)
# ---------------------------------------------------------------------------


def test_file_upload_validation_and_disk_cleanup(test_env):
    client = _new_client()
    auth = _register_user(client, "uploader", "up@example.com")
    csrf = auth["csrf_token"]

    note = client.post(
        "/api/notes/",
        json={"title": "Con imagen", "content": ""},
        headers={"X-CSRF-Token": csrf},
    ).json()
    note_id = note["id"]

    # Contenido HTML disfrazado con extensión .png -> rechazado (400)
    fake_png = client.post(
        f"/api/notes/{note_id}/images",
        files={"file": ("evil.png", b"<script>alert(1)</script>", "image/png")},
        headers={"X-CSRF-Token": csrf},
    )
    assert fake_png.status_code == 400

    # Extensión peligrosa -> rechazada (400)
    bad_ext = client.post(
        f"/api/notes/{note_id}/images",
        files={"file": ("evil.svg", b"<svg></svg>", "image/svg+xml")},
        headers={"X-CSRF-Token": csrf},
    )
    assert bad_ext.status_code == 400

    # Tamaño superior a 5 MB -> rechazado (413)
    oversized = client.post(
        f"/api/notes/{note_id}/images",
        files={"file": ("big.png", b"\x89PNG" + b"A" * (5 * 1024 * 1024 + 10), "image/png")},
        headers={"X-CSRF-Token": csrf},
    )
    assert oversized.status_code == 413

    # Path traversal en descarga -> rechazado (400)
    traversal = client.get("/api/notes/images/..%2Fmain.py")
    assert traversal.status_code in (400, 404)

    # Subida válida y limpieza física al borrar la nota
    ok_upload = client.post(
        f"/api/notes/{note_id}/images",
        files={"file": ("valid.png", _make_png_bytes(), "image/png")},
        headers={"X-CSRF-Token": csrf},
    )
    assert ok_upload.status_code == 200
    saved_filename = ok_upload.json()["images"][0]["filename"]
    saved_path = test_env["images_dir"] / saved_filename
    assert saved_path.is_file()

    del_note = client.delete(f"/api/notes/{note_id}", headers={"X-CSRF-Token": csrf})
    assert del_note.status_code == 200
    assert not saved_path.exists()


# ---------------------------------------------------------------------------
# 5. Ejecución de código: aislamiento de env, modo disabled y límites (SEC-001)
# ---------------------------------------------------------------------------


def test_code_execution_env_scrubbing_limits_and_disabled_mode(
    test_env, monkeypatch: pytest.MonkeyPatch
):
    client = _new_client()
    auth = _register_user(client, "coder", "coder@example.com")
    csrf = auth["csrf_token"]

    # Establece un secreto simulado en el entorno del proceso backend
    monkeypatch.setenv("WIKIDEV_SECRET_TEST", "super-secret-value")

    # Ejecución Python legítima + comprobación de que el secreto NO se hereda
    py_res = client.post(
        "/api/execute",
        json={
            "language": "python",
            "code": "import os\nprint('OK', os.environ.get('WIKIDEV_SECRET_TEST'))",
        },
        headers={"X-CSRF-Token": csrf},
    )
    assert py_res.status_code == 200
    assert py_res.json()["stdout"].strip() == "OK None"
    assert py_res.json()["exit_code"] == 0

    # Ejecución JavaScript legítima
    js_res = client.post(
        "/api/execute",
        json={"language": "javascript", "code": "console.log(2 + 2)"},
        headers={"X-CSRF-Token": csrf},
    )
    assert js_res.status_code == 200
    assert js_res.json()["stdout"].strip() == "4"

    # Límites de tamaño de code y stdin
    assert (
        client.post(
            "/api/execute",
            json={"language": "python", "code": "x" * 10_001},
            headers={"X-CSRF-Token": csrf},
        ).status_code
        == 422
    )
    assert (
        client.post(
            "/api/execute",
            json={"language": "python", "code": "print(1)", "stdin": "s" * 10_001},
            headers={"X-CSRF-Token": csrf},
        ).status_code
        == 422
    )

    # Modo disabled (por defecto en producción) bloquea con 503
    monkeypatch.setattr(config, "CODE_EXECUTION_MODE", "disabled")
    disabled_res = client.post(
        "/api/execute",
        json={"language": "python", "code": "print(1)"},
        headers={"X-CSRF-Token": csrf},
    )
    assert disabled_res.status_code == 503


# ---------------------------------------------------------------------------
# 6. Validación, escape LIKE, Rate Limit, Cabeceras y Host (SEC-004/006/008/010)
# ---------------------------------------------------------------------------


def test_validation_like_escape_headers_host_and_rate_limit(test_env):
    client = _new_client()
    auth = _register_user(client, "searcher", "s@example.com")
    csrf = auth["csrf_token"]

    # Cabeceras HTTP de seguridad
    health = client.get("/health")
    assert health.status_code == 200
    assert health.headers["x-content-type-options"] == "nosniff"
    assert health.headers["x-frame-options"] == "DENY"
    assert health.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "permissions-policy" in health.headers

    # Host header malicioso bloqueado por TrustedHostMiddleware
    bad_host = client.get("/health", headers={"Host": "evil.example/bypass"})
    assert bad_host.status_code == 400

    # Límites de longitud en notas
    assert (
        client.post(
            "/api/notes/",
            json={"title": "A" * 201, "content": ""},
            headers={"X-CSRF-Token": csrf},
        ).status_code
        == 422
    )

    # Escape de comodines LIKE ('%' no debe devolver notas que no contienen '%')
    client.post(
        "/api/notes/",
        json={"title": "Nota normal", "content": "Sin simbolos"},
        headers={"X-CSRF-Token": csrf},
    )
    client.post(
        "/api/notes/",
        json={"title": "Descuento 50%", "content": "Con porcentaje"},
        headers={"X-CSRF-Token": csrf},
    )
    res_pct = client.get("/api/notes/?search=%25")
    assert res_pct.status_code == 200
    titles = [n["title"] for n in res_pct.json()]
    assert titles == ["Descuento 50%"]

    # Rate limit en /api/execute (límite 20/minuto -> la 21 devuelve 429)
    for _ in range(20):
        r = client.post(
            "/api/execute",
            json={"language": "python", "code": "print(1)"},
            headers={"X-CSRF-Token": csrf},
        )
        assert r.status_code == 200
    blocked = client.post(
        "/api/execute",
        json={"language": "python", "code": "print(1)"},
        headers={"X-CSRF-Token": csrf},
    )
    assert blocked.status_code == 429
    assert "retry-after" in blocked.headers


def test_change_password_and_logout_all_revoke_sessions(test_env):
    client_1 = _new_client()
    auth_1 = _register_user(client_1, "multi", "multi@example.com")
    csrf_1 = auth_1["csrf_token"]

    # Segunda sesión simultánea del mismo usuario
    client_2 = _new_client()
    login_2 = client_2.post(
        "/api/auth/login",
        json={"identifier": "multi", "password": "StrongPass!2026"},
    )
    assert login_2.status_code == 200

    # Cambiar contraseña con contraseña actual incorrecta falla (401)
    bad_pw = client_1.post(
        "/api/auth/change-password",
        json={
            "current_password": "WrongPassword!1",
            "new_password": "NewStrongPass!2027",
        },
        headers={"X-CSRF-Token": csrf_1},
    )
    assert bad_pw.status_code == 401

    # Cambiar contraseña rota sesión actual y revoca client_2
    ok_pw = client_1.post(
        "/api/auth/change-password",
        json={
            "current_password": "StrongPass!2026",
            "new_password": "NewStrongPass!2027",
        },
        headers={"X-CSRF-Token": csrf_1},
    )
    assert ok_pw.status_code == 200
    new_csrf_1 = ok_pw.json()["csrf_token"]
    assert client_1.get("/api/auth/me").status_code == 200
    assert client_2.get("/api/auth/me").status_code == 401

    # Nueva sesión con la contraseña actualizada + logout-all revoca todas
    client_3 = _new_client()
    assert (
        client_3.post(
            "/api/auth/login",
            json={"identifier": "multi", "password": "NewStrongPass!2027"},
        ).status_code
        == 200
    )
    assert (
        client_1.post(
            "/api/auth/logout-all",
            headers={"X-CSRF-Token": new_csrf_1},
        ).status_code
        == 200
    )
    assert client_1.get("/api/auth/me").status_code == 401
    assert client_3.get("/api/auth/me").status_code == 401
