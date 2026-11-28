"use client";

import { Note } from "@/notes/services/notes.service";
import { cn } from "@/shared/utils/cn";
import { BookOpen, FileText, ImageIcon } from "lucide-react";

function formatSlugLabel(slug: string) {
  const parts = slug.split("/");
  const last = parts[parts.length - 1] ?? slug;
  return last.replace(/-/g, " ");
}

interface Props {
  notes: Note[];
  selectedId: number | null;
  onSelect: (note: Note) => void;
}

export function NotesList({ notes, selectedId, onSelect }: Props) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (notes.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-(--text-muted)">
        <FileText className="mb-2 h-8 w-8 opacity-60" aria-hidden="true" />
        <p className="text-sm">No hay notas</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1 px-2.5">
      {notes.map((note) => {
        const isSelected = selectedId === note.id;
        return (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => onSelect(note)}
              className={cn(
                "w-full rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)",
                isSelected
                  ? "border-(--accent)/35 bg-(--accent-soft)"
                  : "border-transparent hover:bg-(--bg-3)",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    isSelected ? "text-(--text)" : "text-(--text-secondary)",
                  )}
                >
                  {note.title || "Sin título"}
                </p>
                {note.images.length > 0 && (
                  <div className="flex shrink-0 items-center gap-1 text-(--text-muted)">
                    <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="text-xs tabular-nums">
                      {note.images.length}
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                {note.content
                  ? note.content.slice(0, 60) +
                    (note.content.length > 60 ? "…" : "")
                  : "Sin contenido"}
              </p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="text-[11px] tabular-nums text-(--text-muted)">
                  {formatDate(note.updated_at)}
                </p>
                {note.doc_slug && (
                  <span className="inline-flex max-w-[10.5rem] items-center gap-1 truncate rounded-md bg-(--accent-soft) px-1.5 py-0.5 text-[11px] text-(--accent-light)">
                    <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="truncate capitalize">
                      {formatSlugLabel(note.doc_slug)}
                    </span>
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
