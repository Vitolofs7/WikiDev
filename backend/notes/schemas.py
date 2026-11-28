from datetime import datetime
import re
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

_DOC_SLUG_RE = re.compile(r"^[a-z0-9]+(?:[-_/][a-z0-9]+)*$")


def _validate_doc_slug(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    cleaned = value.strip()
    if not cleaned:
        return None
    if len(cleaned) > 255 or not _DOC_SLUG_RE.match(cleaned):
        raise ValueError("Identificador de lección inválido")
    return cleaned


class NoteImageOut(BaseModel):
    id: int
    note_id: int
    filename: str
    original_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NoteCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(default="", max_length=100_000)
    doc_slug: Optional[str] = Field(default=None, max_length=255)

    @field_validator("doc_slug")
    @classmethod
    def check_doc_slug(cls, value: Optional[str]) -> Optional[str]:
        return _validate_doc_slug(value)


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    content: Optional[str] = Field(default=None, max_length=100_000)
    doc_slug: Optional[str] = Field(default=None, max_length=255)

    @field_validator("doc_slug")
    @classmethod
    def check_doc_slug(cls, value: Optional[str]) -> Optional[str]:
        return _validate_doc_slug(value)


class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    doc_slug: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    images: list[NoteImageOut] = []

    model_config = ConfigDict(from_attributes=True)
