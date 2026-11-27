from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


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


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    content: Optional[str] = Field(default=None, max_length=100_000)


class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    images: list[NoteImageOut] = []

    model_config = ConfigDict(from_attributes=True)
