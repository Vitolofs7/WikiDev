"use client";
import { useState, useEffect, useCallback } from "react";
import { notesApi, Note } from "@/notes/services/notes.service";

export function useNotes(enabled = true) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!enabled) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await notesApi.getAll(search);
      setNotes(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudieron cargar las notas",
      );
    } finally {
      setLoading(false);
    }
  }, [search, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes, enabled]);

  const createNote = async (title: string) => {
    setError(null);
    const note = await notesApi.create(title);
    setNotes((prev) => [note, ...prev]);
    return note;
  };

  const updateNote = async (
    id: number,
    data: { title?: string; content?: string },
  ) => {
    setError(null);
    const updated = await notesApi.update(id, data);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  };

  const deleteNote = async (id: number) => {
    setError(null);
    await notesApi.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const uploadImage = async (noteId: number, file: File) => {
    setError(null);
    const updated = await notesApi.uploadImage(noteId, file);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
    return updated;
  };

  const deleteImage = async (noteId: number, imageId: number) => {
    setError(null);
    await notesApi.deleteImage(noteId, imageId);
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, images: n.images.filter((img) => img.id !== imageId) }
          : n,
      ),
    );
  };

  return {
    notes: enabled ? notes : [],
    loading: enabled ? loading : false,
    error: enabled ? error : null,
    search,
    setSearch,
    createNote,
    updateNote,
    deleteNote,
    uploadImage,
    deleteImage,
    fetchNotes,
  };
}
