"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Download,
  Hash,
  Plus,
  Search,
  StickyNote,
  X,
  Zap,
} from "lucide-react";
import {
  useSearch,
  type CommandItem,
  type CommandItemKind,
  type SearchScope,
} from "../hooks/useSearch";
import { cn } from "@/shared/utils/cn";
import { ModalShell } from "@/shared/components/ModalShell";
import { useAuth } from "@/auth/context/AuthProvider";
import { notesApi, type Note } from "@/notes/services/notes.service";
import { useHistory } from "@/history/hooks/useHistory";
import { downloadPdf } from "@/documentation/utils/pdf-export";
import { docPath } from "@/shared/utils/routes";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const GROUP_LABELS: Record<CommandItemKind, string> = {
  action: "Acciones rápidas",
  doc: "Lecciones",
  heading: "Secciones",
  note: "Mis notas",
};

const SCOPE_TABS: { id: SearchScope; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "doc", label: "Lecciones" },
  { id: "heading", label: "Secciones" },
  { id: "note", label: "Notas" },
  { id: "action", label: "Acciones" },
];

function ItemIcon({ item }: { item: CommandItem }) {
  if (item.kind === "heading") {
    return (
      <Hash className="h-4 w-4 shrink-0 text-(--text-muted)" aria-hidden="true" />
    );
  }
  if (item.kind === "note") {
    return (
      <StickyNote
        className="h-4 w-4 shrink-0 text-(--accent-light)"
        aria-hidden="true"
      />
    );
  }
  if (item.kind === "doc") {
    return (
      <BookOpen
        className="h-4 w-4 shrink-0 text-(--text-secondary)"
        aria-hidden="true"
      />
    );
  }
  switch (item.actionId) {
    case "new-note":
      return (
        <Plus
          className="h-4 w-4 shrink-0 text-(--accent-light)"
          aria-hidden="true"
        />
      );
    case "export-pdf":
      return (
        <Download
          className="h-4 w-4 shrink-0 text-(--accent-light)"
          aria-hidden="true"
        />
      );
    case "last-lesson":
      return (
        <Clock
          className="h-4 w-4 shrink-0 text-(--accent-light)"
          aria-hidden="true"
        />
      );
    default:
      return (
        <Zap
          className="h-4 w-4 shrink-0 text-(--accent-light)"
          aria-hidden="true"
        />
      );
  }
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();
  const { history } = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [scope, setScope] = useState<SearchScope>("all");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);

  const currentDocKey = useMemo(() => {
    if (!pathname.startsWith("/docs/")) return null;
    return pathname.replace(/^\/docs\//, "").replace(/\/+$/, "") || null;
  }, [pathname]);

  const actions = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [];

    if (history.length > 0) {
      list.push({
        id: "action:last-lesson",
        kind: "action",
        actionId: "last-lesson",
        title: "Ir a última lección",
        subtitle: history[0].title,
        href: history[0].href,
        keywords: "reciente continuar historial ultimo",
      });
    }

    list.push({
      id: "action:new-note",
      kind: "action",
      actionId: "new-note",
      title: "Nueva nota",
      subtitle: currentDocKey
        ? "Crear apunte vinculado a esta lección"
        : "Crear una nota en tu cuaderno privado",
      keywords: "crear apunte escribir cuaderno",
    });

    if (
      currentDocKey &&
      typeof document !== "undefined" &&
      document.querySelector("[data-doc-article]")
    ) {
      list.push({
        id: "action:export-pdf",
        kind: "action",
        actionId: "export-pdf",
        title: "Exportar lección a PDF",
        subtitle: "Descargar el artículo actual con salidas de código",
        keywords: "descargar imprimir documento pdf",
      });
    }

    list.push(
      {
        id: "action:go-docs",
        kind: "action",
        actionId: "go-docs",
        title: "Explorar documentación",
        subtitle: "Ver todas las áreas de estudio",
        href: docPath(),
        keywords: "temario catalogo indice guias",
      },
      {
        id: "action:go-notes",
        kind: "action",
        actionId: "go-notes",
        title: "Abrir cuaderno de notas",
        subtitle: "Gestionar tus apuntes privados e imágenes",
        href: "/notes",
        keywords: "cuaderno apuntes privados",
      },
    );

    return list;
  }, [history, currentDocKey]);

  const { query, results, search, clear } = useSearch({
    notes: user ? notes : [],
    actions,
    scope,
  });

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setSelected(0);
      setScope("all");
    }
  }

  // Carga notas privadas al abrir la paleta cuando hay sesión iniciada
  useEffect(() => {
    if (!open || !user) return;
    let active = true;
    notesApi
      .getAll()
      .then((data) => {
        if (active) setNotes(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [open, user]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(id);
    }
    clear();
  }, [open, clear]);

  const displayItems = useMemo<CommandItem[]>(() => {
    if (query.trim() || scope !== "all") return results;
    const recentItems: CommandItem[] = history.slice(0, 3).map((item) => ({
      id: `recent:${item.href}`,
      kind: "doc",
      title: item.title,
      subtitle: `Reciente / ${item.category}`,
      href: item.href,
    }));
    return [...actions, ...recentItems];
  }, [query, scope, results, actions, history]);

  const executeItem = useCallback(
    async (item: CommandItem) => {
      if (item.actionId === "export-pdf" && currentDocKey) {
        onClose();
        void downloadPdf(currentDocKey);
        return;
      }

      if (item.actionId === "new-note") {
        onClose();
        if (!user) {
          openAuthModal("login");
          return;
        }
        try {
          const created = await notesApi.create(
            "Nueva nota",
            "",
            currentDocKey,
          );
          router.push(`/notes?note=${created.id}`);
        } catch {
          router.push("/notes");
        }
        return;
      }

      if (item.href) {
        router.push(item.href);
        onClose();
      }
    },
    [currentDocKey, onClose, user, openAuthModal, router],
  );

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) =>
          Math.min(s + 1, Math.max(displayItems.length - 1, 0)),
        );
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && displayItems[selected]) {
        e.preventDefault();
        void executeItem(displayItems[selected]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, displayItems, selected, executeItem]);

  useEffect(() => {
    const activeEl = listRef.current?.querySelector<HTMLElement>(
      `[data-command-index="${selected}"]`,
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  // Agrupa los ítems preservando su índice plano para la navegación por teclado
  const grouped = useMemo(() => {
    const map = new Map<
      string,
      { label: string; items: { item: CommandItem; index: number }[] }
    >();
    const isDefaultView = !query.trim() && scope === "all";

    displayItems.forEach((item, index) => {
      const key =
        isDefaultView && item.id.startsWith("recent:") ? "recent" : item.kind;
      const label =
        key === "recent" ? "Lecciones recientes" : GROUP_LABELS[item.kind];
      const existing = map.get(key);
      if (existing) {
        existing.items.push({ item, index });
      } else {
        map.set(key, { label, items: [{ item, index }] });
      }
    });

    return Array.from(map.values());
  }, [displayItems, query, scope]);

  const visibleTabs = user
    ? SCOPE_TABS
    : SCOPE_TABS.filter((tab) => tab.id !== "note");

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      ariaLabel="Paleta de comandos y búsqueda"
      align="top"
      maxWidthClass="max-w-2xl"
    >
      {/* Input */}
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
          aria-label="Buscar lecciones, secciones, notas o acciones"
          placeholder="Buscar lecciones, secciones, notas o escribe > para acciones…"
          className="flex-1 bg-transparent text-base text-(--text) outline-none placeholder:text-(--text-muted)"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              clear();
              setSelected(0);
            }}
            aria-label="Limpiar búsqueda"
            className="rounded-lg p-1 text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Scope filter tabs */}
      <div
        role="tablist"
        aria-label="Filtrar categoría de búsqueda"
        className="flex items-center gap-1.5 overflow-x-auto border-b border-(--border) px-5 py-2.5"
      >
        {visibleTabs.map((tab) => {
          const active = scope === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setScope(tab.id);
                setSelected(0);
              }}
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)",
                active
                  ? "bg-(--accent-soft) text-(--accent-light)"
                  : "text-(--text-muted) hover:bg-(--bg-3) hover:text-(--text)",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grouped results */}
      <div
        ref={listRef}
        className="max-h-[24rem] overflow-y-auto overscroll-contain py-2"
        role="listbox"
        aria-label="Resultados de la paleta de comandos"
      >
        {grouped.length > 0 ? (
          grouped.map((group) => (
            <div key={group.label} className="mb-2 last:mb-0">
              <p className="px-5 py-1.5 text-xs font-medium text-(--text-muted)">
                {group.label}
              </p>
              <ul>
                {group.items.map(({ item, index }) => {
                  const isSelected = selected === index;
                  return (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      data-command-index={index}
                    >
                      <button
                        type="button"
                        onClick={() => void executeItem(item)}
                        onMouseEnter={() => setSelected(index)}
                        className={cn(
                          "flex w-full items-center gap-3.5 px-5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--accent-light)",
                          isSelected ? "bg-(--accent-soft)" : "hover:bg-(--bg-3)",
                        )}
                      >
                        <ItemIcon item={item} />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-(--text)">
                            {item.title}
                          </p>
                          <p className="truncate text-xs text-(--text-muted)">
                            {item.subtitle}
                          </p>
                        </div>

                        {isSelected && (
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-(--accent-light)"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <div className="px-5 py-10 text-center" aria-live="polite">
            <p className="text-sm text-(--text-muted)">
              {query.trim() ? (
                <>
                  No se encontraron resultados para{" "}
                  <span className="text-(--text)">{`“${query.trim()}”`}</span>
                </>
              ) : (
                "No hay elementos en esta categoría."
              )}
            </p>
          </div>
        )}
      </div>

      {/* Footer keyboard hints */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border) px-5 py-3">
        <div className="flex items-center gap-4">
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
            ejecutar
          </span>
          <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <kbd className="rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[11px] text-(--text-secondary)">
              &gt;
            </kbd>
            acciones
          </span>
          <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <kbd className="rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[11px] text-(--text-secondary)">
              Esc
            </kbd>
            cerrar
          </span>
        </div>

        <span className="text-xs tabular-nums text-(--text-muted)">
          {displayItems.length}{" "}
          {displayItems.length === 1 ? "resultado" : "resultados"}
        </span>
      </div>
    </ModalShell>
  );
}
