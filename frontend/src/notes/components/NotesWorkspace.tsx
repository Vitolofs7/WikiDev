"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/auth/context/AuthProvider";
import { useNotes } from "@/notes/hooks/useNotes";
import { NotesList } from "@/notes/components/NotesList";
import { NoteEditor } from "@/notes/components/NoteEditor";
import { ArrowLeft, Lock, Plus, Search, StickyNote } from "lucide-react";
import Link from "next/link";
import type { Note } from "@/notes/services/notes.service";

export function NotesWorkspace() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const {
    notes,
    loading,
    error,
    search,
    setSearch,
    createNote,
    updateNote,
    deleteNote,
    uploadImage,
    deleteImage,
  } = useNotes(Boolean(user));

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Permite abrir una nota concreta desde la paleta Ctrl+K (/notes?note=<id>)
  useEffect(() => {
    if (notes.length === 0 || selectedNote) return;
    const rawId = new URLSearchParams(window.location.search).get("note");
    if (!rawId) return;
    const targetId = Number(rawId);
    if (!Number.isInteger(targetId)) return;
    const match = notes.find((n) => n.id === targetId);
    if (match) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedNote(match);
    }
  }, [notes, selectedNote]);

  if (authLoading) {
    return (
      <div className="relative -mt-(--navbar-h) flex min-h-screen items-center justify-center bg-(--bg)">
        <div
          className="h-6 w-6 animate-spin rounded-full border-2 border-(--accent)/30 border-t-(--accent-light)"
          role="status"
          aria-label="Cargando sesión"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative -mt-(--navbar-h) flex min-h-screen items-center justify-center bg-(--bg) px-6">
        <div className="w-full max-w-md rounded-2xl border border-(--border-hover) bg-(--bg-2) p-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-(--accent-soft) text-(--accent-light)">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-(--text)">
            Notas privadas
          </h1>
          <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
            Inicia sesión o crea una cuenta para gestionar tus apuntes
            personales con imágenes de forma aislada.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="inline-flex h-10 items-center rounded-lg bg-(--accent) px-5 text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className="inline-flex h-10 items-center rounded-lg border border-(--border) bg-(--bg) px-5 text-sm font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreate = async () => {
    setActionError(null);
    try {
      const note = await createNote("Nueva nota");
      setSelectedNote(note);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Error al crear la nota",
      );
    }
  };

  const handleDelete = async (id: number) => {
    setActionError(null);
    try {
      await deleteNote(id);
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Error al eliminar la nota",
      );
    }
  };

  const handleUpdate = async (
    id: number,
    data: { title?: string; content?: string },
  ) => {
    setActionError(null);
    const updated = await updateNote(id, data);
    if (selectedNote?.id === id) setSelectedNote(updated);
    return updated;
  };

  const handleUploadImage = async (noteId: number, file: File) => {
    setActionError(null);
    const updated = await uploadImage(noteId, file);
    if (selectedNote?.id === noteId) setSelectedNote(updated);
    return updated;
  };

  const handleDeleteImage = async (noteId: number, imageId: number) => {
    setActionError(null);
    await deleteImage(noteId, imageId);
    if (selectedNote?.id === noteId) {
      setSelectedNote((prev) =>
        prev
          ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) }
          : null,
      );
    }
  };

  const visibleError = actionError || error;

  return (
    <div className="relative -mt-(--navbar-h) flex min-h-screen bg-(--bg) pt-(--navbar-h)">
      <aside
        aria-label="Lista de notas"
        className={`w-full shrink-0 flex-col border-r border-(--border) bg-(--bg-2) md:flex md:w-80 ${
          selectedNote ? "hidden" : "flex"
        }`}
      >
        <div className="px-5 pb-4 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              <StickyNote
                className="h-5 w-5 text-(--accent-light)"
                aria-hidden="true"
              />
              <span className="font-display text-xl font-semibold text-(--text)">
                Notas
              </span>
            </Link>
            <button
              type="button"
              onClick={handleCreate}
              aria-label="Crear nueva nota"
              title="Crear nueva nota"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--accent) text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)"
            />
            <input
              value={search}
              autoComplete="off"
              onChange={(e) => setSearch(e.target.value)}
              maxLength={200}
              aria-label="Buscar notas"
              placeholder="Buscar notas…"
              className="w-full rounded-xl border border-(--border) bg-(--bg) py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--accent)/60"
            />
          </div>

          {visibleError && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-(--error)/30 bg-(--error)/10 px-3 py-2 text-xs text-(--error)"
            >
              {visibleError}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="flex h-20 items-center justify-center">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-(--accent)/30 border-t-(--accent-light)"
                role="status"
                aria-label="Cargando notas"
              />
            </div>
          ) : (
            <NotesList
              notes={notes}
              selectedId={selectedNote?.id ?? null}
              onSelect={setSelectedNote}
            />
          )}
        </div>

        <div className="border-t border-(--border) px-5 py-3.5">
          <p className="text-xs tabular-nums text-(--text-muted)">
            {notes.length} {notes.length === 1 ? "nota" : "notas"}
          </p>
        </div>
      </aside>

      <div
        className={`flex-1 flex-col overflow-hidden md:flex ${
          selectedNote ? "flex" : "hidden"
        }`}
      >
        {selectedNote ? (
          <>
            <div className="flex items-center border-b border-(--border) px-4 py-3 md:hidden">
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-(--text-secondary) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Volver a notas
              </button>
            </div>
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onUploadImage={handleUploadImage}
              onDeleteImage={handleDeleteImage}
            />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-(--border) bg-(--bg-2) text-(--text-muted)">
              <StickyNote className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="font-display text-xl font-semibold text-(--text)">
              Selecciona una nota
            </p>
            <p className="mt-1.5 text-sm text-(--text-muted)">
              Elige un apunte de la lista o crea uno nuevo con el botón +.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
