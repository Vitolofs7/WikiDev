from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime, timezone


# Clase base para todos los modelos ORM.
class Base(DeclarativeBase):
    pass


# Modelo principal de notas.
class Note(Base):
    __tablename__ = "notes"

    # Identificador único de la nota.
    id = Column(Integer, primary_key=True, index=True)
    # Título de la nota.
    title = Column(String(200), nullable=False)
    # Contenido principal de la nota.
    content = Column(Text, default="")
    # Fecha de creación de la nota.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    # Fecha de última actualización.
    # Se actualiza automáticamente cuando se modifica el registro.
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


# Modelo para imágenes asociadas a una nota.
class NoteImage(Base):
    __tablename__ = "note_images"

    # Identificador único de la imagen.
    id = Column(Integer, primary_key=True, index=True)
    # Referencia al identificador de la nota.
    note_id = Column(Integer, nullable=False, index=True)
    # Nombre interno del archivo almacenado en disco.
    filename = Column(String(255), nullable=False)
    # Nombre original del archivo subido por el usuario.
    original_name = Column(String(255), nullable=False)
    # Fecha de creación del registro.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
