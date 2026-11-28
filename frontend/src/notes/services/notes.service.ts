import {
  extractApiError,
  getApiBaseUrl,
  getCsrfToken,
} from "@/auth/services/auth.service";

const notesBase = () => `${getApiBaseUrl()}/api/notes`;

export interface NoteImage {
  id: number;
  note_id: number;
  filename: string;
  original_name: string;
  created_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  doc_slug?: string | null;
  created_at: string;
  updated_at: string;
  images: NoteImage[];
}

function csrfHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getCsrfToken();
  return {
    ...(extra ?? {}),
    ...(token ? { "X-CSRF-Token": token } : {}),
  };
}

export const notesApi = {
  getAll: async (search = "", docSlug?: string): Promise<Note[]> => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (docSlug) params.set("doc_slug", docSlug);
    const qs = params.toString();
    const base = notesBase();
    const url = qs ? `${base}/?${qs}` : `${base}/`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
      throw await extractApiError(res, "Error al cargar las notas");
    }
    return res.json();
  },

  create: async (
    title: string,
    content = "",
    docSlug?: string | null,
  ): Promise<Note> => {
    const res = await fetch(`${notesBase()}/`, {
      method: "POST",
      credentials: "include",
      headers: csrfHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        title,
        content,
        doc_slug: docSlug ?? null,
      }),
    });
    if (!res.ok) {
      throw await extractApiError(res, "Error al crear la nota");
    }
    return res.json();
  },

  update: async (
    id: number,
    data: { title?: string; content?: string; doc_slug?: string | null },
  ): Promise<Note> => {
    const res = await fetch(
      `${notesBase()}/${encodeURIComponent(String(id))}`,
      {
        method: "PUT",
        credentials: "include",
        headers: csrfHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      },
    );
    if (!res.ok) {
      throw await extractApiError(res, "Error al guardar la nota");
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(
      `${notesBase()}/${encodeURIComponent(String(id))}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: csrfHeaders(),
      },
    );
    if (!res.ok) {
      throw await extractApiError(res, "Error al eliminar la nota");
    }
  },

  uploadImage: async (noteId: number, file: File): Promise<Note> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(
      `${notesBase()}/${encodeURIComponent(String(noteId))}/images`,
      {
        method: "POST",
        credentials: "include",
        headers: csrfHeaders(),
        body: form,
      },
    );
    if (!res.ok) {
      throw await extractApiError(res, "Error al subir la imagen");
    }
    return res.json();
  },

  deleteImage: async (noteId: number, imageId: number): Promise<void> => {
    const res = await fetch(
      `${notesBase()}/${encodeURIComponent(String(noteId))}/images/${encodeURIComponent(String(imageId))}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: csrfHeaders(),
      },
    );
    if (!res.ok) {
      throw await extractApiError(res, "Error al eliminar la imagen");
    }
  },

  getImageUrl: (filename: string): string => {
    return `${notesBase()}/images/${encodeURIComponent(filename)}`;
  },
};
