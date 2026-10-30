/**

ruta: frontend/src/notes/components/NoteEditor.tsx

* Gestiona la edición de una nota, incluyendo su título, contenido e imágenes
* asociadas. Mantiene el estado local de los campos editables y programa el
* guardado automático tras un breve periodo de inactividad, mostrando indicadores
* del estado de persistencia. Permite subir y eliminar imágenes, así como eliminar
* la nota mediante un modal de confirmación. Recibe las operaciones de actualización
* y gestión de recursos a través de sus propiedades, delegando en el componente
* padre la persistencia de los cambios. Requiere que el padre utilice `note.id`
* como `key` para reinicializar correctamente el estado al cambiar de nota.

**/

"use client";
import { useState, useRef } from "react";
import { Note, notesApi } from "@/notes/services/notesApi.service";
import { Trash2, ImagePlus, X } from "lucide-react";
import { DeleteNoteModal } from "@/notes/components/DeleteNoteModal";
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

// IMPORTANTE: el padre debe renderizar <NoteEditor key={note.id} ... />.
// Al cambiar `note.id`, React desmonta y vuelve a montar este componente con
// `key` distinta, así que `title`/`content` arrancan frescos desde `note` sin
// necesidad de un efecto que los sincronice manualmente.
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerSave = (newTitle: string, newContent: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      await onUpdate(note.id, { title: newTitle, content: newContent });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
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
    await onUploadImage(note.id, file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    await onDelete(note.id);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <span
          className="text-base text-zinc-600"
        >
          {formatDate(note.updated_at)}
        </span>
        <div className="flex items-center gap-3">
          {saving && (
            <span
              className="text-base text-zinc-600"
            >
              Guardando...
            </span>
          )}
          {saved && (
            <span
              className="text-base text-emerald-500"
            >
              Guardado ✓
            </span>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-base text-zinc-400 hover:text-violet-400 hover:bg-white/5 transition-all"
          >
            <ImagePlus className="w-5 h-5" />
            Imagen
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-base text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={handleTitleChange}
        placeholder="Título de la nota..."
        className="w-full bg-transparent px-6 pt-6 pb-2 text-4xl font-bold text-white outline-none placeholder:text-zinc-700"
      />

      {/* Content */}
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Escribe tus apuntes aquí..."
        className="flex-1 w-full bg-transparent px-6 py-4 text-lg text-zinc-300 outline-none resize-none placeholder:text-zinc-700 leading-relaxed"
      />

      {/* Images */}
      {note.images.length > 0 && (
        <div className="px-6 py-4 border-t border-white/5">
          <p
            className="text-sm text-zinc-600 mb-3 uppercase tracking-widest font-bold"
          >
            Imágenes
          </p>
          <div className="flex flex-wrap gap-3">
            {note.images.map((img) => (
              <div key={img.id} className="relative group">
                <Image
                  src={notesApi.getImageUrl(img.filename)}
                  alt={img.original_name}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-xl border border-white/10"
                  unoptimized
                />
                <button
                  onClick={() => onDeleteImage(note.id, img.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {showDeleteModal && (
        <DeleteNoteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
