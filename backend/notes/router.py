import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from notes.database import get_db
from notes.models import Note, NoteImage
from notes.schemas import NoteCreate, NoteUpdate, NoteOut

# Router principal para todos los endpoints relacionados con notas.
router = APIRouter(prefix="/notes", tags=["notes"])

# Carpeta donde se almacenarán las imágenes.
IMAGES_DIR = "note_images"

# Tamaño máximo permitido por imagen: 5 MB.
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB

# Extensiones de imagen permitidas.
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

# Crea la carpeta de imágenes si todavía no existe.
os.makedirs(IMAGES_DIR, exist_ok=True)


@router.get("/", response_model=list[NoteOut])
def get_notes(search: str = "", db: Session = Depends(get_db)):
    """
    Obtiene todas las notas.

    Permite filtrar por texto en título o contenido.
    """
    query = db.query(Note)
    if search:
        query = query.filter(
            Note.title.ilike(f"%{search}%") | Note.content.ilike(f"%{search}%")
        )
    # Ordena las notas por fecha de última actualización descendente.
    notes = query.order_by(Note.updated_at.desc()).all()
    # Carga manualmente las imágenes asociadas a cada nota.
    for note in notes:
        note.images = db.query(NoteImage).filter(NoteImage.note_id == note.id).all()
    return notes


@router.post("/", response_model=NoteOut)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva nota.
    """
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    # Se inicializa el listado de imágenes vacío para la respuesta.
    db_note.images = []
    return db_note


@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    """
    Actualiza una nota existente.
    """
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    # Solo actualiza campos que hayan sido enviados.
    if note.title is not None:
        db_note.title = note.title
    if note.content is not None:
        db_note.content = note.content
    from datetime import datetime, timezone

    # Actualiza manualmente la fecha de modificación.
    db_note.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_note)
    # Carga las imágenes asociadas antes de responder.
    db_note.images = db.query(NoteImage).filter(NoteImage.note_id == note_id).all()
    return db_note


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """
    Elimina una nota y todas sus imágenes asociadas.
    """
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    # Elimina primero los registros de imágenes asociados.
    db.query(NoteImage).filter(NoteImage.note_id == note_id).delete()
    # Elimina la nota principal.
    db.delete(db_note)
    db.commit()
    return {"ok": True}


@router.post("/{note_id}/images", response_model=NoteOut)
async def upload_image(
    note_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    """
    Sube una imagen y la asocia a una nota.
    """
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    # Obtiene la extensión del archivo subido
    ext = os.path.splitext(file.filename)[1].lower()
    # Verifica que la extensión esté permitida.
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Formato de imagen no permitido")

    # Lee el contenido completo del archivo.
    content = await file.read()

    # Verifica que el tamaño no supere el límite permitido.
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="La imagen no puede superar 5 MB")

    # Genera un nombre único para evitar colisiones.
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(IMAGES_DIR, filename)

    # Guarda el archivo físicamente en disco.
    with open(filepath, "wb") as f:
        f.write(content)

    # Guarda el registro de la imagen en base de datos.
    db_image = NoteImage(
        note_id=note_id, filename=filename, original_name=file.filename
    )
    db.add(db_image)
    db.commit()

    # Devuelve la nota actualizada con todas sus imágenes.
    db_note.images = db.query(NoteImage).filter(NoteImage.note_id == note_id).all()
    return db_note


@router.delete("/{note_id}/images/{image_id}")
def delete_image(note_id: int, image_id: int, db: Session = Depends(get_db)):
    """
    Elimina una imagen específica de una nota.
    """
    db_image = (
        db.query(NoteImage)
        .filter(NoteImage.id == image_id, NoteImage.note_id == note_id)
        .first()
    )
    if not db_image:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    filepath = os.path.join(IMAGES_DIR, db_image.filename)
    # Elimina el archivo físico si existe.
    if os.path.exists(filepath):
        os.remove(filepath)
    # Elimina el registro de la base de datos.
    db.delete(db_image)
    db.commit()
    return {"ok": True}


@router.get("/images/{filename}")
def get_image(filename: str):
    """
    Devuelve una imagen almacenada en disco.
    """
    # Evita ataques de path traversal usando únicamente el nombre base.
    filename = os.path.basename(filename)
    filepath = os.path.join(IMAGES_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    return FileResponse(filepath)
