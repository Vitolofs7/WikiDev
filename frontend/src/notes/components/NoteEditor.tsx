"use client";

import { useState, useRef, useEffect } from "react";
import { Note, type NoteImage, notesApi } from "@/notes/services/notes.service";
import { Trash2, ImagePlus, X } from "lucide-react";
import { DeleteNoteModal } from "@/notes/components/DeleteNoteModal";
import { ModalShell } from "@/shared/components/ModalShell";
import Image from "next/image";

interface Props {
  note: Note;
  onUpdate: (
    id: number,
    data: { title?: string; content?: string },
  ) => Promise<Note>;
  onDelete: (id: number) => Promise<void>;
  onUploadImage: (noteId: number, file: File) => Promise<Note>;
  onDeleteImage: (noteId: number, imageId: number) => Promise<void>;
}

export function NoteEditor({
  note,
  onUpdate,
  onDelete,
  onUploadImage,
  onDeleteImage,
}: Props) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<NoteImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<{ title: string; content: string } | null>(
    null,
  );
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const noteId = note.id;
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      if (pendingSaveRef.current) {
        const pending = pendingSaveRef.current;
        pendingSaveRef.current = null;
        void onUpdateRef
          .current(noteId, {
            title: pending.title.trim() || "Sin título",
            content: pending.content,
          })
          .catch(() => {});
      }
    };
  }, [note.id]);

  const triggerSave = (newTitle: string, newContent: string) => {
    pendingSaveRef.current = { title: newTitle, content: newContent };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      pendingSaveRef.current = null;
      setSaving(true);
      setEditorError(null);
      try {
        await onUpdate(note.id, {
          title: newTitle.trim() || "Sin título",
          content: newContent,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setEditorError(
          err instanceof Error ? err.message : "Error al guardar la nota",
        );
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    triggerSave(e.target.value, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    triggerSave(title, e.target.value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditorError(null);
    try {
      await onUploadImage(note.id, file);
    } catch (err) {
      setEditorError(
        err instanceof Error ? err.message : "Error al subir la imagen",
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmDelete = async () => {
    pendingSaveRef.current = null;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setShowDeleteModal(false);
    await onDelete(note.id);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border) px-6 py-4">
        <span className="text-xs tabular-nums text-(--text-muted)">
          Actualizada el {formatDate(note.updated_at)}
        </span>
        <div className="flex items-center gap-2">
          <span aria-live="polite" className="mr-1 text-xs">
            {saving && <span className="text-(--text-muted)">Guardando…</span>}
            {saved && <span className="text-(--success)">Guardado</span>}
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Adjuntar imagen
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--error)/40 hover:text-(--error) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </div>

      {editorError && (
        <div
          role="alert"
          className="mx-6 mt-4 rounded-xl border border-(--error)/30 bg-(--error)/10 px-4 py-2.5 text-xs text-(--error)"
        >
          {editorError}
        </div>
      )}

      <input
        value={title}
        onChange={handleTitleChange}
        maxLength={200}
        aria-label="Título de la nota"
        placeholder="Título de la nota…"
        className="w-full bg-transparent px-6 pb-2 pt-6 font-display text-3xl font-semibold tracking-[-0.025em] text-(--text) outline-none placeholder:text-(--text-muted)/60 sm:text-4xl"
      />

      <textarea
        value={content}
        onChange={handleContentChange}
        aria-label="Contenido de la nota"
        placeholder="Escribe tus apuntes aquí…"
        className="flex-1 w-full resize-none bg-transparent px-6 py-4 text-base leading-7 text-(--text-secondary) outline-none placeholder:text-(--text-muted)/60 sm:text-[17px]"
      />

      {note.images.length > 0 && (
        <div className="border-t border-(--border) px-6 py-4">
          <p className="mb-3 text-xs font-medium text-(--text-muted)">
            Imágenes adjuntas ({note.images.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {note.images.map((img) => (
              <div key={img.id} className="group relative">
                <button
                  type="button"
                  onClick={() => setPreviewImage(img)}
                  aria-label={`Ampliar imagen ${img.original_name}`}
                  className="block overflow-hidden rounded-xl border border-(--border) transition-colors hover:border-(--accent)/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
                >
                  <Image
                    src={notesApi.getImageUrl(img.filename)}
                    alt={img.original_name}
                    width={96}
                    height={96}
                    className="h-24 w-24 object-cover"
                    unoptimized
                  />
                </button>
                <button
                  type="button"
                  onClick={() => void onDeleteImage(note.id, img.id)}
                  aria-label={`Eliminar imagen ${img.original_name}`}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-(--error) text-[#1a0b0b] opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        aria-label="Seleccionar imagen para adjuntar"
        className="hidden"
        onChange={handleImageUpload}
      />

      {showDeleteModal && (
        <DeleteNoteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <ModalShell
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        labelledBy="image-lightbox-title"
        maxWidthClass="max-w-3xl"
      >
        {previewImage && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-(--border) px-5 py-4">
              <h2
                id="image-lightbox-title"
                className="truncate text-sm font-medium text-(--text)"
              >
                {previewImage.original_name}
              </h2>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                aria-label="Cerrar vista ampliada"
                className="rounded-lg p-1 text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex max-h-[75vh] items-center justify-center overflow-auto bg-(--bg-code) p-4">
              <Image
                src={notesApi.getImageUrl(previewImage.filename)}
                alt={previewImage.original_name}
                width={1200}
                height={900}
                className="max-h-[68vh] w-auto rounded-lg object-contain"
                unoptimized
              />
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
}
