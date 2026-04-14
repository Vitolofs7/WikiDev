from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Esquema de salida para imágenes asociadas a notas.
class NoteImageOut(BaseModel):
    id: int
    note_id: int
    filename: str
    original_name: str
    created_at: datetime

    class Config:
        # Permite crear el esquema directamente desde objetos ORM.
        from_attributes = True


# Esquema para crear una nota.
class NoteCreate(BaseModel):
    title: str
    content: str = ""


# Esquema para actualizar una nota.
# Todos los campos son opcionales para permitir modificaciones parciales.
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


# Esquema de salida completo de una nota.
class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    # Lista de imágenes asociadas a la nota.
    images: list[NoteImageOut] = []

    class Config:
        # Permite convertir automáticamente modelos ORM a respuestas Pydantic.
        from_attributes = True
