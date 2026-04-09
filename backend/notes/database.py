from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from notes.models import Base

# URL de conexión a la base de datos.
# En este caso se utiliza SQLite almacenando el archivo localmente.
DATABASE_URL = "sqlite:///./wikidev.db"

# Crea el motor de conexión de SQLAlchemy.
# check_same_thread=False permite compartir la conexión entre distintos hilos,
# algo necesario cuando se trabaja con FastAPI y SQLite.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Fábrica de sesiones para interactuar con la base de datos.
# autocommit=False obliga a confirmar cambios manualmente.
# autoflush=False evita enviar cambios automáticamente antes de consultas.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """
    Crea todas las tablas definidas en los modelos si aún no existen.
    """
    Base.metadata.create_all(bind=engine)


def get_db():
    """
    Generador de dependencias para obtener una sesión de base de datos.

    Yields:
        Session: Sesión activa de SQLAlchemy.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        # Garantiza el cierre de la sesión al finalizar la petición.
        db.close()
