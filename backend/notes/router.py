import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from notes.database import get_db
from notes.models import Note, NoteImage
from notes.schemas import NoteCreate, NoteUpdate, NoteOut

router = APIRouter(prefix="/notes", tags=["notes"])

IMAGES_DIR = "note_images"
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

os.makedirs(IMAGES_DIR, exist_ok=True)


@router.get("/", response_model=list[NoteOut])
def get_notes(search: str = "", db: Session = Depends(get_db)):
    query = db.query(Note)
    if search:
        query = query.filter(
            Note.title.ilike(f"%{search}%") | Note.content.ilike(f"%{search}%")
        )
    notes = query.order_by(Note.updated_at.desc()).all()
    for note in notes:
        note.images = db.query(NoteImage).filter(NoteImage.note_id == note.id).all()
    return notes


@router.post("/", response_model=NoteOut)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    db_note.images = []
    return db_note


@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    if note.title is not None:
        db_note.title = note.title
    if note.content is not None:
        db_note.content = note.content
    from datetime import datetime, timezone
    db_note.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_note)
    db_note.images = db.query(NoteImage).filter(NoteImage.note_id == note_id).all()
    return db_note


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    db.query(NoteImage).filter(NoteImage.note_id == note_id).delete()
    db.delete(db_note)
    db.commit()
    return {"ok": True}


@router.post("/{note_id}/images", response_model=NoteOut)
async def upload_image(note_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Formato de imagen no permitido")

    content = await file.read()

    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="La imagen no puede superar 5 MB")

    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(IMAGES_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(content)

    db_image = NoteImage(note_id=note_id, filename=filename, original_name=file.filename)
    db.add(db_image)
    db.commit()

    db_note.images = db.query(NoteImage).filter(NoteImage.note_id == note_id).all()
    return db_note


@router.delete("/{note_id}/images/{image_id}")
def delete_image(note_id: int, image_id: int, db: Session = Depends(get_db)):
    db_image = db.query(NoteImage).filter(
        NoteImage.id == image_id, NoteImage.note_id == note_id
    ).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    filepath = os.path.join(IMAGES_DIR, db_image.filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    db.delete(db_image)
    db.commit()
    return {"ok": True}


@router.get("/images/{filename}")
def get_image(filename: str):
    # Evitar path traversal
    filename = os.path.basename(filename)
    filepath = os.path.join(IMAGES_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    return FileResponse(filepath)