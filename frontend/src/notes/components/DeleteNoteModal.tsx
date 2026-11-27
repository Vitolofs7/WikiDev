"use client";

import { Trash2 } from "lucide-react";
import { ModalShell } from "@/shared/components/ModalShell";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteNoteModal({ onConfirm, onCancel }: Props) {
  return (
    <ModalShell
      open
      onClose={onCancel}
      labelledBy="delete-note-modal-title"
      maxWidthClass="max-w-md"
    >
      <div className="flex items-center gap-3.5 border-b border-(--border) px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--error)/25 bg-(--error)/10 text-(--error)">
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2
            id="delete-note-modal-title"
            className="font-display text-lg font-semibold text-(--text)"
          >
            Eliminar nota
          </h2>
          <p className="mt-0.5 text-xs text-(--text-muted)">
            Esta acción no se puede deshacer
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="text-sm leading-6 text-(--text-secondary)">
          ¿Estás seguro de que quieres eliminar esta nota? Se perderá todo su
          contenido y las imágenes adjuntas.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-(--border) px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center rounded-lg border border-(--border) bg-(--bg) px-4 text-sm font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex h-9 items-center rounded-lg border border-(--error)/40 bg-(--error)/15 px-4 text-sm font-semibold text-(--error) transition-colors hover:bg-(--error)/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--error)"
        >
          Eliminar nota
        </button>
      </div>
    </ModalShell>
  );
}
