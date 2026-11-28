from datetime import datetime, timezone
from io import BytesIO
import logging
from pathlib import Path
import re
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from PIL import Image, UnidentifiedImageError
from sqlalchemy.orm import Session, selectinload
from auth.dependencies import get_current_user, verify_csrf
from auth.models import User
from notes.database import get_db
from notes.models import Note, NoteImage
from notes.schemas import NoteCreate, NoteOut, NoteUpdate
from shared import config
from shared.logging_utils import log_security_event
from shared.rate_limit import notes_read_limiter, notes_upload_limiter, notes_write_limiter

router = APIRouter(prefix="/notes", tags=["notes"])

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
UPLOAD_CHUNK_SIZE = 64 * 1024  # 64 KB
Image.MAX_IMAGE_PIXELS = 25_000_000  # Protección frente a decompression bombs

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
FORMAT_TO_EXT_AND_MIME = {
    "JPEG": (".jpg", "image/jpeg"),
    "PNG": (".png", "image/png"),
    "GIF": (".gif", "image/gif"),
    "WEBP": (".webp", "image/webp"),
}
EXT_TO_MIME = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
}

_FILENAME_SAFE_RE = re.compile(r"^[0-9a-fA-F-]{36}\.(jpg|jpeg|png|gif|webp)$")
_CONTROL_RE = re.compile(r"[\x00-\x1f\x7f]")


def _get_images_dir() -> Path:
    images_dir = config.IMAGES_DIR.resolve()
    images_dir.mkdir(parents=True, exist_ok=True)
    return images_dir


def _resolve_image_path(filename: str) -> Path:
    safe_name = Path(filename).name
    if safe_name != filename or not _FILENAME_SAFE_RE.match(safe_name):
        raise HTTPException(status_code=400, detail="Nombre de archivo inválido")
    images_dir = _get_images_dir()
    candidate = (images_dir / safe_name).resolve()
    if not candidate.is_relative_to(images_dir):
        raise HTTPException(status_code=400, detail="Ruta de archivo inválida")
    return candidate


def _remove_file_safely(filename: str) -> None:
    try:
        filepath = _resolve_image_path(filename)
        if filepath.is_file():
            filepath.unlink()
    except HTTPException:
        pass
    except OSError:
        log_security_event(
            "image_delete_disk_failed",
            level=logging.WARNING,
            filename=filename,
        )


def _sanitize_original_name(raw_name: str | None) -> str:
    base = Path(raw_name or "image").name
    cleaned = _CONTROL_RE.sub("", base).strip()
    return (cleaned or "image")[:200]


def _escape_like(term: str) -> str:
    return term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


@router.get(
    "/",
    response_model=list[NoteOut],
    dependencies=[Depends(notes_read_limiter)],
)
def get_notes(
    search: str = Query(default="", max_length=200),
    doc_slug: str | None = Query(default=None, max_length=255),
    limit: int = Query(default=100, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obtiene únicamente las notas pertenecientes al usuario autenticado."""
    query = (
        db.query(Note)
        .options(selectinload(Note.images))
        .filter(Note.user_id == current_user.id)
    )
    if doc_slug:
        query = query.filter(Note.doc_slug == doc_slug.strip())
    if search:
        escaped = _escape_like(search)
        pattern = f"%{escaped}%"
        query = query.filter(
            Note.title.ilike(pattern, escape="\\")
            | Note.content.ilike(pattern, escape="\\")
        )
    return (
        query.order_by(Note.updated_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.post(
    "/",
    response_model=NoteOut,
    dependencies=[Depends(notes_write_limiter), Depends(verify_csrf)],
)
def create_note(
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Crea una nueva nota asociada al usuario autenticado."""
    db_note = Note(
        user_id=current_user.id,
        title=note.title,
        content=note.content,
        doc_slug=note.doc_slug,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.put(
    "/{note_id}",
    response_model=NoteOut,
    dependencies=[Depends(notes_write_limiter), Depends(verify_csrf)],
)
def update_note(
    note_id: int,
    note: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Actualiza una nota existente perteneciente al usuario autenticado."""
    db_note = (
        db.query(Note)
        .options(selectinload(Note.images))
        .filter(Note.id == note_id, Note.user_id == current_user.id)
        .first()
    )
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    if note.title is not None:
        db_note.title = note.title
    if note.content is not None:
        db_note.content = note.content
    if "doc_slug" in note.model_fields_set:
        db_note.doc_slug = note.doc_slug
    db_note.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete(
    "/{note_id}",
    dependencies=[Depends(notes_write_limiter), Depends(verify_csrf)],
)
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Elimina una nota del usuario autenticado y borra también sus imágenes físicas."""
    db_note = (
        db.query(Note)
        .options(selectinload(Note.images))
        .filter(Note.id == note_id, Note.user_id == current_user.id)
        .first()
    )
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    filenames = [img.filename for img in db_note.images]
    db.delete(db_note)
    db.commit()

    for filename in filenames:
        _remove_file_safely(filename)

    log_security_event("note_deleted", user_id=current_user.id, note_id=note_id)
    return {"ok": True}


@router.post(
    "/{note_id}/images",
    response_model=NoteOut,
    dependencies=[Depends(notes_upload_limiter), Depends(verify_csrf)],
)
async def upload_image(
    note_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Sube y valida una imagen real asociada a una nota del usuario autenticado."""
    db_note = (
        db.query(Note)
        .options(selectinload(Note.images))
        .filter(Note.id == note_id, Note.user_id == current_user.id)
        .first()
    )
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    if not file.filename:
        raise HTTPException(status_code=400, detail="Nombre de archivo requerido")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Formato de imagen no permitido")

    # Lectura por bloques para rechazar archivos excesivos sin agotar la memoria RAM.
    chunks: list[bytes] = []
    total_size = 0
    while True:
        chunk = await file.read(UPLOAD_CHUNK_SIZE)
        if not chunk:
            break
        total_size += len(chunk)
        if total_size > MAX_IMAGE_SIZE:
            log_security_event(
                "image_upload_rejected_size",
                level=logging.WARNING,
                user_id=current_user.id,
                note_id=note_id,
            )
            raise HTTPException(
                status_code=413,
                detail="La imagen no puede superar 5 MB",
            )
        chunks.append(chunk)

    if total_size == 0:
        raise HTTPException(status_code=400, detail="El archivo está vacío")

    content = b"".join(chunks)

    # Verifica firma binaria y estructura real de imagen mediante Pillow.
    try:
        with Image.open(BytesIO(content)) as img:
            detected_format = (img.format or "").upper()
            img.verify()
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError, ValueError):
        log_security_event(
            "image_upload_rejected_invalid_content",
            level=logging.WARNING,
            user_id=current_user.id,
            note_id=note_id,
        )
        raise HTTPException(
            status_code=400,
            detail="El archivo no es una imagen válida o está corrupto",
        )

    if detected_format not in FORMAT_TO_EXT_AND_MIME:
        raise HTTPException(status_code=400, detail="Formato de imagen no permitido")

    canonical_ext, _ = FORMAT_TO_EXT_AND_MIME[detected_format]
    filename = f"{uuid.uuid4()}{canonical_ext}"
    filepath = _resolve_image_path(filename)
    filepath.write_bytes(content)

    db_image = NoteImage(
        note_id=note_id,
        filename=filename,
        original_name=_sanitize_original_name(file.filename),
    )
    try:
        db.add(db_image)
        db.commit()
    except Exception:
        db.rollback()
        _remove_file_safely(filename)
        raise

    refreshed = (
        db.query(Note)
        .options(selectinload(Note.images))
        .filter(Note.id == note_id, Note.user_id == current_user.id)
        .first()
    )
    return refreshed


@router.delete(
    "/{note_id}/images/{image_id}",
    dependencies=[Depends(notes_write_limiter), Depends(verify_csrf)],
)
def delete_image(
    note_id: int,
    image_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Elimina una imagen específica perteneciente a una nota del usuario autenticado."""
    db_image = (
        db.query(NoteImage)
        .join(Note, NoteImage.note_id == Note.id)
        .filter(
            NoteImage.id == image_id,
            NoteImage.note_id == note_id,
            Note.user_id == current_user.id,
        )
        .first()
    )
    if not db_image:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    filename = db_image.filename
    db.delete(db_image)
    db.commit()
    _remove_file_safely(filename)
    return {"ok": True}


@router.get(
    "/images/{filename}",
    dependencies=[Depends(notes_read_limiter)],
)
def get_image(
    filename: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Devuelve una imagen almacenada únicamente si pertenece a una nota del usuario autenticado,
    con cabeceras anti-sniffing y sandbox CSP.
    """
    filepath = _resolve_image_path(filename)

    db_image = (
        db.query(NoteImage)
        .join(Note, NoteImage.note_id == Note.id)
        .filter(
            NoteImage.filename == filepath.name,
            Note.user_id == current_user.id,
        )
        .first()
    )
    if not db_image or not filepath.is_file():
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    media_type = EXT_TO_MIME.get(filepath.suffix.lower(), "application/octet-stream")
    return FileResponse(
        path=str(filepath),
        media_type=media_type,
        headers={
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "default-src 'none'; sandbox",
            "Cache-Control": "private, max-age=3600",
        },
    )
