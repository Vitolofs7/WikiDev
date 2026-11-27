"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { TopicSummary } from "@/documentation/utils/topics";
import { TopicIcon } from "@/documentation/components/TopicIcon";

const FILTER_THRESHOLD = 6;
const PREVIEW_LIMIT = 4;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

function TopicCardBody({ topic }: { topic: TopicSummary }) {
  const isEmpty = topic.chapterCount === 0;
  const preview = topic.chapters.slice(0, PREVIEW_LIMIT);
  const remaining = topic.chapters.length - preview.length;

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <TopicIcon slug={topic.slug} emoji={topic.emoji} size="md" />

        {isEmpty ? (
          <span className="rounded-md border border-(--border) px-2 py-0.5 text-xs text-(--text-muted)">
            Próximamente
          </span>
        ) : (
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent-light)"
          />
        )}
      </div>

      <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-(--text)">
        {topic.title}
      </h2>

      <p className="mt-2 text-[15px] leading-6 text-(--text-secondary)">
        {topic.description}
      </p>

      {preview.length > 0 && (
        <ul className="mt-5 space-y-1.5 border-t border-(--border) pt-4">
          {preview.map((title) => (
            <li key={title} className="truncate text-sm text-(--text-muted)">
              {title}
            </li>
          ))}
          {remaining > 0 && (
            <li className="text-xs font-medium text-(--accent-light)">
              +{remaining} {remaining === 1 ? "unidad más" : "unidades más"}
            </li>
          )}
        </ul>
      )}

      {!isEmpty && (
        <p className="mt-auto pt-6 text-xs font-medium tabular-nums text-(--text-muted)">
          {topic.hasSections
            ? `${plural(topic.chapterCount, "unidad", "unidades")}, ${plural(topic.documentCount, "lección", "lecciones")}`
            : plural(topic.documentCount, "artículo", "artículos")}
        </p>
      )}
    </>
  );
}

export function TopicsIndex({ topics }: { topics: TopicSummary[] }) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const query = normalize(filter.trim());
    if (!query) return topics;

    return topics.filter((topic) =>
      normalize(
        [topic.title, topic.description, ...topic.chapters].join(" "),
      ).includes(query),
    );
  }, [filter, topics]);

  return (
    <div>
      {topics.length > FILTER_THRESHOLD && (
        <div className="relative mb-6">
          <Search
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)"
          />
          <input
            value={filter}
            autoComplete="off"
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filtrar áreas…"
            aria-label="Filtrar áreas"
            className="w-full rounded-xl border border-(--border) bg-(--bg-2) py-2.5 pl-10 pr-24 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--accent)/60"
          />
          {filter && (
            <span
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs tabular-nums text-(--text-muted)"
              aria-live="polite"
            >
              {plural(filtered.length, "resultado", "resultados")}
            </span>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filtered.map((topic) => (
            <li key={topic.slug}>
              {topic.chapterCount === 0 ? (
                <div className="flex h-full flex-col rounded-2xl border border-(--border) bg-(--bg-2) p-6 opacity-60">
                  <TopicCardBody topic={topic} />
                </div>
              ) : (
                <Link
                  href={topic.href}
                  className="group flex h-full flex-col rounded-2xl border border-(--border) bg-(--bg-2) p-6 transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
                >
                  <TopicCardBody topic={topic} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-10 text-center">
          <p className="text-sm text-(--text-muted)">
            No se encontraron áreas para{" "}
            <span className="text-(--text)">{`“${filter}”`}</span>
          </p>
        </div>
      )}
    </div>
  );
}
