from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class NoteImageOut(BaseModel):
    id: int
    note_id: int
    filename: str
    original_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    title: str
    content: str = ""


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    images: list[NoteImageOut] = []

    class Config:
        from_attributes = True