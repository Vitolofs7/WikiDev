"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { docPath } from "@/shared/utils/routes";
import type { NavSubItem } from "@/navigation/config/nav.config";
import { IndexCard } from "@/documentation/components/IndexCard";
import { DocBreadcrumbs } from "@/documentation/components/DocBreadcrumbs";

interface AdjacentChapter {
  slug: string;
  title: string;
}

interface Props {
  title: string;
  category: string;
  categoryTitle: string;
  page: string;
  subItems: NavSubItem[];
  chapterNumber: number;
  totalChapters: number;
  prevChapter?: AdjacentChapter | null;
  nextChapter?: AdjacentChapter | null;
}

export function SubItemsIndex({
  title,
  category,
  categoryTitle,
  page,
  subItems,
  chapterNumber,
  totalChapters,
  prevChapter,
  nextChapter,
}: Props) {
  const [filter, setFilter] = useState("");

  const filtered = subItems.filter((sub) =>
    sub.title.toLowerCase().includes(filter.toLowerCase()),
  );

  const firstLessonHref = subItems[0]
    ? docPath(category, page, subItems[0].slug)
    : null;
  const estimatedMinutes = Math.max(5, subItems.length * 4);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={docPath(category)}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Volver a {categoryTitle}
        </Link>

        <DocBreadcrumbs
          items={[
            { label: "Documentación", href: docPath() },
            { label: categoryTitle, href: docPath(category) },
            { label: title },
          ]}
        />
      </div>

      <header className="mb-8 flex flex-col justify-between gap-6 border-b border-(--border) pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-(--text) sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          <p className="mt-3 text-base leading-7 text-(--text-secondary)">
            Unidad {chapterNumber} de {totalChapters} en {categoryTitle}. Recorre
            las lecciones en orden o filtra el concepto que quieras repasar.
          </p>
          <p className="mt-3 text-sm tabular-nums text-(--text-muted)">
            {subItems.length} {subItems.length === 1 ? "lección" : "lecciones"}
            , lectura estimada de {estimatedMinutes} min.
          </p>
        </div>

        {firstLessonHref && (
          <Link
            href={firstLessonHref}
            className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-(--accent) px-4 text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) sm:w-auto"
          >
            Empezar unidad
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </header>

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="font-display text-lg font-semibold text-(--text)">
          Lecciones de la unidad
        </h2>

        {subItems.length > 4 && (
          <div className="relative w-full sm:max-w-xs">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-(--text-muted)"
            />
            <input
              value={filter}
              autoComplete="off"
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filtrar lecciones de esta unidad"
              placeholder="Filtrar lecciones…"
              className="w-full rounded-lg border border-(--border) bg-(--bg-2) py-2 pl-9 pr-16 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--accent)/60"
            />
            {filter && (
              <span
                aria-live="polite"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums text-(--text-muted)"
              >
                {filtered.length}/{subItems.length}
              </span>
            )}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {filtered.map((sub) => {
            const originalIndex = subItems.findIndex(
              (item) => item.slug === sub.slug,
            );

            return (
              <IndexCard
                key={sub.slug}
                href={docPath(category, page, sub.slug)}
                index={originalIndex}
                title={sub.title}
                meta={`Lección ${originalIndex + 1} de ${subItems.length}`}
              />
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-xl border border-(--border) bg-(--bg-2) py-12 text-center"
          aria-live="polite"
        >
          <p className="text-sm text-(--text-muted)">
            No se encontraron lecciones para{" "}
            <span className="text-(--text)">{`“${filter}”`}</span>
          </p>
        </div>
      )}

      {(prevChapter || nextChapter) && (
        <nav
          aria-label="Navegación entre unidades"
          className="mt-12 grid grid-cols-1 gap-3.5 border-t border-(--border) pt-8 sm:grid-cols-2"
        >
          {prevChapter ? (
            <Link
              href={docPath(category, prevChapter.slug)}
              className="group flex items-center gap-3 rounded-xl border border-(--border) bg-(--bg-2) p-4 transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-(--text-muted) group-hover:text-(--accent-light)"
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-xs text-(--text-muted)">
                  Unidad anterior
                </span>
                <span className="truncate text-sm font-medium text-(--text-secondary) group-hover:text-(--text)">
                  {prevChapter.title}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {nextChapter ? (
            <Link
              href={docPath(category, nextChapter.slug)}
              className="group flex items-center justify-end gap-3 rounded-xl border border-(--border) bg-(--bg-2) p-4 text-right transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) sm:col-start-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              <span className="flex min-w-0 flex-col">
                <span className="text-xs text-(--text-muted)">
                  Siguiente unidad
                </span>
                <span className="truncate text-sm font-medium text-(--text-secondary) group-hover:text-(--text)">
                  {nextChapter.title}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-(--text-muted) group-hover:text-(--accent-light)"
              />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
