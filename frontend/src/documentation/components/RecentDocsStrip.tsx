"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { useHistory } from "@/history/hooks/useHistory";

function subscribe() {
  return () => {};
}

export function RecentDocsStrip() {
  const { history, clearHistory } = useHistory();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted || history.length === 0) return null;

  return (
    <section aria-label="Lecciones recientes" className="mb-10">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-(--text-secondary)">
          <Clock className="h-4 w-4 text-(--accent-light)" aria-hidden="true" />
          Continuar leyendo
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="rounded px-2 py-0.5 text-xs text-(--text-muted) transition-colors hover:text-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
        >
          Limpiar historial
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {history.slice(0, 3).map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--bg-2) px-4 py-3.5 transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-(--text)">
                  {item.title}
                </p>
                <p className="truncate text-xs text-(--text-muted)">
                  {item.category}
                </p>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent-light)"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
