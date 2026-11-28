"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  GripHorizontal,
  Lock,
  Plus,
  RotateCcw,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/auth/context/AuthProvider";
import { notesApi, type Note } from "@/notes/services/notes.service";
import { cn } from "@/shared/utils/cn";

interface DocNotesDrawerProps {
  open: boolean;
  onClose: () => void;
  docKey: string;
  lessonTitle: string;
  notesRevision: number;
  onNotesCountChange?: (count: number) => void;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)";

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DocNotesDrawer({
  open,
  onClose,
  docKey,
  lessonTitle,
  notesRevision,
  onNotesCountChange,
}: DocNotesDrawerProps) {
  const { user, openAuthModal } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Dragging state (desktop lg+)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{
    id: number;
    title: string;
    content: string;
  } | null>(null);

  const flushPendingSave = useCallback(async () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const pending = pendingRef.current;
    if (!pending) return;
    pendingRef.current = null;
    try {
      const updated = await notesApi.update(pending.id, {
        title: pending.title.trim() || "Sin título",
        content: pending.content,
      });
      setNotes((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n)),
      );
    } catch {
      // Silenciado al cerrar para no bloquear la navegación
    }
  }, []);

  // Sincroniza el contador del padre fuera de cualquier updater de estado
  useEffect(() => {
    onNotesCountChange?.(user ? notes.length : 0);
  }, [notes.length, user, onNotesCountChange]);

  // Carga apuntes de la lección al montar con sesión, abrir el panel o guardar desde CodeRunner
  useEffect(() => {
    if (!user) return;
    let active = true;
    const shouldShowSpinner = open;
    if (shouldShowSpinner) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      setError(null);
    }
    notesApi
      .getAll("", docKey)
      .then((data) => {
        if (!active) return;
        setNotes(data);
      })
      .catch((e) => {
        if (!active || !shouldShowSpinner) return;
        setError(
          e instanceof Error ? e.message : "No se pudieron cargar los apuntes",
        );
      })
      .finally(() => {
        if (active && shouldShowSpinner) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, docKey, notesRevision, user]);

  // Bloquea scroll solo en móvil (<1024px); en escritorio flota sin bloquear la lectura
  useEffect(() => {
    if (!open) return;
    const isMobileOverlay = window.innerWidth < 1024;
    const prevOverflow = document.body.style.overflow;
    if (isMobileOverlay) {
      document.body.style.overflow = "hidden";
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (
          document.activeElement instanceof HTMLElement &&
          document.activeElement.hasAttribute("data-code-editor")
        ) {
          return;
        }
        void flushPendingSave();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (isMobileOverlay) {
        document.body.style.overflow = prevOverflow;
      }
    };
  }, [open, onClose, flushPendingSave]);

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024 || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const margin = 12;
    // Posición base sin desplazamiento (anclada en top-20 right-6)
    const baseLeft = rect.left - offset.x;
    const baseTop = rect.top - offset.y;

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
      minX: margin - baseLeft,
      maxX: window.innerWidth - margin - rect.width - baseLeft,
      minY: margin - baseTop,
      maxY: window.innerHeight - margin - rect.height - baseTop,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handleHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const rawX = drag.originX + (e.clientX - drag.startX);
    const rawY = drag.originY + (e.clientY - drag.startY);
    const clampedX = Math.min(Math.max(rawX, drag.minX), drag.maxX);
    const clampedY = Math.min(Math.max(rawY, drag.minY), drag.maxY);
    setOffset({ x: clampedX, y: clampedY });
  };

  const handleHeaderPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const hasCustomPosition = offset.x !== 0 || offset.y !== 0;

  const openEditor = (note: Note) => {
    setActiveNote(note);
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setSaved(false);
    setConfirmDeleteId(null);
    setError(null);
  };

  const handleClose = () => {
    void flushPendingSave();
    setConfirmDeleteId(null);
    onClose();
  };

  const handleBackToList = async () => {
    await flushPendingSave();
    setActiveNote(null);
    setConfirmDeleteId(null);
  };

  const handleCreate = async () => {
    setError(null);
    try {
      const created = await notesApi.create(
        `Apuntes: ${lessonTitle}`,
        "",
        docKey,
      );
      setNotes((prev) => [created, ...prev]);
      openEditor(created);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear la nota");
    }
  };

  const scheduleSave = (id: number, title: string, content: string) => {
    pendingRef.current = { id, title, content };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      pendingRef.current = null;
      setSaving(true);
      setError(null);
      try {
        const updated = await notesApi.update(id, {
          title: title.trim() || "Sin título",
          content,
        });
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
        setActiveNote(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar la nota");
      } finally {
        setSaving(false);
      }
    }, 700);
  };

  const handleDelete = async (id: number) => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    pendingRef.current = null;
    setError(null);
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNote?.id === id) setActiveNote(null);
      setConfirmDeleteId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar la nota");
    }
  };

  const panelTransform = open
    ? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1)`
    : `translate3d(${offset.x + 28}px, ${offset.y}px, 0) scale(0.98)`;

  return (
    <>
      {/* Mobile-only dimmed backdrop (< lg) with smooth opacity transition */}
      <div
        aria-hidden="true"
        onClick={handleClose}
        className={cn(
          "fixed inset-0 z-[55] bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Non-blocking draggable floating panel on desktop (lg+), smooth slide-over on mobile */}
      <aside
        ref={panelRef}
        aria-label={`Apuntes de ${lessonTitle}`}
        aria-hidden={!open}
        inert={!open}
        style={{ transform: panelTransform }}
        className={cn(
          "fixed right-0 top-0 z-[60] flex h-full w-[26rem] max-w-[92vw] flex-col overscroll-contain border-l border-(--border-hover) bg-(--bg-2) shadow-[0_24px_64px_-20px_rgba(0,0,0,0.75)] lg:right-[max(1.5rem,calc((100vw-80rem)/2-9rem))] lg:top-[11.5rem] lg:z-40 lg:h-[min(calc(100vh-13rem),42rem)] lg:w-[22rem] lg:max-w-none lg:overflow-hidden lg:rounded-2xl lg:border xl:w-[24rem]",
          isDragging
            ? "select-none"
            : "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {/* Draggable Header */}
        <div
          onPointerDown={handleHeaderPointerDown}
          onPointerMove={handleHeaderPointerMove}
          onPointerUp={handleHeaderPointerEnd}
          onPointerCancel={handleHeaderPointerEnd}
          className={cn(
            "flex items-center justify-between gap-3 border-b border-(--border) px-5 py-3.5 lg:touch-none",
            isDragging ? "lg:cursor-grabbing" : "lg:cursor-grab",
          )}
          title="Arrastra desde la cabecera para mover el panel"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--accent-soft) text-(--accent-light)">
              <StickyNote className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display text-base font-semibold text-(--text)">
                  Apuntes de la lección
                </p>
                <GripHorizontal
                  className="hidden h-3.5 w-3.5 shrink-0 text-(--text-muted)/70 lg:block"
                  aria-hidden="true"
                />
              </div>
              <p className="truncate text-xs text-(--text-muted)">
                {lessonTitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {hasCustomPosition && (
              <button
                type="button"
                onClick={() => setOffset({ x: 0, y: 0 })}
                aria-label="Restablecer posición del panel"
                title="Volver a la posición original"
                className={cn(
                  "hidden h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--accent-light) lg:inline-flex",
                  FOCUS,
                )}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar apuntes"
              title="Cerrar apuntes (Alt+N o Esc)"
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--text)",
                FOCUS,
              )}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!user ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-(--accent-soft) text-(--accent-light)">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg font-semibold text-(--text)">
              Tu cuaderno privado en cada lección
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-(--text-secondary)">
              Inicia sesión para escribir apuntes mientras lees o guardar código
              y resultados desde cualquier CodeRunner.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg bg-(--accent) px-4 text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light)",
                  FOCUS,
                )}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg border border-(--border) bg-(--bg) px-4 text-sm font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:text-(--text)",
                  FOCUS,
                )}
              >
                Crear cuenta
              </button>
            </div>
          </div>
        ) : activeNote ? (
          /* Inline note editor inside the floating panel */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-(--border) px-4 py-2.5">
              <button
                type="button"
                onClick={() => void handleBackToList()}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-(--text-secondary) transition-colors hover:bg-(--bg-3) hover:text-(--text)",
                  FOCUS,
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Volver ({notes.length})
              </button>

              <div className="flex items-center gap-2">
                <span aria-live="polite" className="text-xs">
                  {saving && (
                    <span className="text-(--text-muted)">Guardando…</span>
                  )}
                  {saved && <span className="text-(--success)">Guardado</span>}
                </span>

                {confirmDeleteId === activeNote.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => void handleDelete(activeNote.id)}
                      className={cn(
                        "rounded-md border border-(--error)/40 bg-(--error)/15 px-2 py-1 text-xs font-medium text-(--error) transition-colors hover:bg-(--error)/25",
                        FOCUS,
                      )}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className={cn(
                        "rounded-md px-2 py-1 text-xs text-(--text-muted) hover:text-(--text)",
                        FOCUS,
                      )}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(activeNote.id)}
                    aria-label="Eliminar nota"
                    title="Eliminar nota"
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--error)",
                      FOCUS,
                    )}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mx-4 mt-3 rounded-lg border border-(--error)/30 bg-(--error)/10 px-3 py-2 text-xs text-(--error)"
              >
                {error}
              </p>
            )}

            <input
              value={draftTitle}
              onChange={(e) => {
                setDraftTitle(e.target.value);
                scheduleSave(activeNote.id, e.target.value, draftContent);
              }}
              maxLength={200}
              aria-label="Título del apunte"
              placeholder="Título del apunte…"
              className="w-full border-b border-(--border) bg-transparent px-5 py-3.5 font-display text-lg font-semibold text-(--text) outline-none placeholder:text-(--text-muted)/60"
            />

            <textarea
              value={draftContent}
              onChange={(e) => {
                setDraftContent(e.target.value);
                scheduleSave(activeNote.id, draftTitle, e.target.value);
              }}
              aria-label="Contenido del apunte"
              placeholder="Escribe tus notas o pega ejemplos de la lección aquí…"
              className="min-h-0 flex-1 w-full resize-none bg-(--bg) px-5 py-4 text-sm leading-6 text-(--text-secondary) outline-none placeholder:text-(--text-muted)/60"
            />
          </div>
        ) : (
          /* Lesson notes list */
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-(--border) px-5 py-3">
              <span className="text-xs font-medium tabular-nums text-(--text-muted)">
                {notes.length} {notes.length === 1 ? "nota" : "notas"} en esta
                lección
              </span>
              <button
                type="button"
                onClick={() => void handleCreate()}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg bg-(--accent) px-3 text-xs font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light)",
                  FOCUS,
                )}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Nueva nota
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="mx-5 mt-3 rounded-lg border border-(--error)/30 bg-(--error)/10 px-3 py-2 text-xs text-(--error)"
              >
                {error}
              </p>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              {loading ? (
                <div className="flex h-28 items-center justify-center">
                  <div
                    className="h-5 w-5 animate-spin rounded-full border-2 border-(--accent)/30 border-t-(--accent-light)"
                    role="status"
                    aria-label="Cargando apuntes"
                  />
                </div>
              ) : notes.length === 0 ? (
                <div className="rounded-xl border border-(--border) bg-(--bg) px-5 py-8 text-center">
                  <StickyNote
                    className="mx-auto mb-3 h-7 w-7 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-(--text)">
                    Aún no tienes apuntes aquí
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-(--text-muted)">
                    Crea una nota rápida o pulsa{" "}
                    <span className="text-(--text-secondary)">
                      Guardar en notas
                    </span>{" "}
                    en cualquier bloque de código.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {notes.map((note) => (
                    <li key={note.id}>
                      <button
                        type="button"
                        onClick={() => openEditor(note)}
                        className={cn(
                          "w-full rounded-xl border border-(--border) bg-(--bg) px-4 py-3 text-left transition-colors hover:border-(--border-hover) hover:bg-(--bg-3)",
                          FOCUS,
                        )}
                      >
                        <p className="truncate text-sm font-medium text-(--text)">
                          {note.title || "Sin título"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--text-muted)">
                          {note.content.trim() || "Sin contenido"}
                        </p>
                        <p className="mt-2 text-[11px] tabular-nums text-(--text-muted)">
                          {formatShortDate(note.updated_at)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-(--border) p-4">
          <Link
            href="/notes"
            onClick={handleClose}
            className={cn(
              "flex w-full items-center justify-center gap-1.5 rounded-lg border border-(--border) bg-(--bg) px-4 py-2 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:text-(--text)",
              FOCUS,
            )}
          >
            Abrir cuaderno completo
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </>
  );
}
