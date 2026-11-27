from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.orm import sessionmaker
from shared import config
from shared.db_base import Base

DATABASE_URL = config.DATABASE_URL

_connect_args = (
    {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

engine = create_engine(DATABASE_URL, connect_args=_connect_args, pool_pre_ping=True)

if DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def _ensure_legacy_notes_user_id_column() -> None:
    """
    Actualización no destructiva para bases de datos SQLite existentes creadas antes
    del soporte multiusuario: añade la columna user_id a notes si todavía no existe.
    """
    inspector = inspect(engine)
    if "notes" not in inspector.get_table_names():
        return
    columns = {col["name"] for col in inspector.get_columns("notes")}
    if "user_id" not in columns:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE notes ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_notes_user_id ON notes (user_id)"))


def init_db() -> None:
    """Crea todas las tablas definidas en los modelos y aplica ajustes seguros de esquema."""
    # Importar modelos para garantizar que estén registrados en Base.metadata.
    import auth.models  # noqa: F401
    import notes.models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _ensure_legacy_notes_user_id_column()


def get_db():
    """Generador de dependencias para obtener una sesión de base de datos."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
