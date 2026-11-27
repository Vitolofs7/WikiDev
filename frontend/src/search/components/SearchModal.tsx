"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { cn } from "@/shared/utils/cn";
import { ModalShell } from "@/shared/components/ModalShell";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { query, results, search, clear } = useSearch();
  const [selected, setSelected] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSelected(0);
    }
  }

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
    clear();
  }, [open, clear]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, Math.max(results.length - 1, 0)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && results[selected]) {
        router.push(results[selected].href);
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, selected, onClose, router]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      ariaLabel="Buscar en la documentación"
      align="top"
      maxWidthClass="max-w-xl"
    >
      <div className="flex items-center gap-3.5 border-b border-(--border) px-5 py-4">
        <Search
          className="h-5 w-5 shrink-0 text-(--accent-light)"
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          value={query}
          autoComplete="off"
          onChange={(e) => {
            search(e.target.value);
            setSelected(0);
          }}
          aria-label="Buscar documentación"
          placeholder="Buscar documentación…"
          className="flex-1 bg-transparent text-base text-(--text) outline-none placeholder:text-(--text-muted)"
        />

        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Limpiar búsqueda"
            className="rounded-lg p-1 text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul
          className="max-h-80 overflow-y-auto overscroll-contain py-2"
          role="listbox"
          aria-label="Resultados de búsqueda"
        >
          {results.map((result, i) => (
            <li key={result.href} role="option" aria-selected={selected === i}>
              <button
                type="button"
                onClick={() => {
                  router.push(result.href);
                  onClose();
                }}
                onMouseEnter={() => setSelected(i)}
                className={cn(
                  "flex w-full items-center gap-4 px-5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--accent-light)",
                  selected === i ? "bg-(--accent-soft)" : "hover:bg-(--bg-3)",
                )}
              >
                <span className="shrink-0 text-lg" aria-hidden="true">
                  {result.categoryEmoji}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-(--text)">
                    {result.title}
                  </p>
                  <p className="truncate text-xs text-(--text-muted)">
                    {result.category}
                  </p>
                </div>

                {selected === i && (
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-(--accent-light)"
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query && results.length === 0 && (
        <div className="px-5 py-10 text-center" aria-live="polite">
          <p className="text-sm text-(--text-muted)">
            No se encontraron resultados para{" "}
            <span className="text-(--text)">{`“${query}”`}</span>
          </p>
        </div>
      )}

      {!query && (
        <div className="flex items-center gap-5 border-t border-(--border) px-5 py-3">
          <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <kbd className="rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[11px] text-(--text-secondary)">
              ↑↓
            </kbd>
            navegar
          </span>
          <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <kbd className="rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[11px] text-(--text-secondary)">
              ↵
            </kbd>
            abrir
          </span>
          <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <kbd className="rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[11px] text-(--text-secondary)">
              Esc
            </kbd>
            cerrar
          </span>
        </div>
      )}
    </ModalShell>
  );
}
