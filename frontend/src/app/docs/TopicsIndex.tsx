"use client";

/**
 * TopicsIndex
 *
 * Cuadrícula de temas de /docs. Sigue el mismo patrón que SubItemsIndex:
 * la página (servidor) calcula los datos y este componente (cliente) se
 * encarga del filtro y de la interacción.
 *
 * - Escala sola: la cuadrícula se adapta al número de temas.
 * - El filtro solo aparece cuando hay más de FILTER_THRESHOLD temas.
 * - Un tema sin capítulos se muestra como "Próximamente" y no es enlace.
 */

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Search } from "lucide-react";

import type { TopicSummary } from "@/documentation/utils/topics";
import {
  TopicIcon,
  getTopicAccent,
} from "@/documentation/components/TopicIcon";

const FILTER_THRESHOLD = 6;
const PREVIEW_LIMIT = 3;

/** Minúsculas y sin tildes, para que "algoritmos" encuentre "Algoritmos". */
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

/* ── Tarjeta ────────────────────────────────────────────── */

function TopicCardBody({ topic }: { topic: TopicSummary }) {
  const accent = getTopicAccent(topic.slug);
  const isEmpty = topic.chapterCount === 0;

  const preview = topic.chapters.slice(0, PREVIEW_LIMIT);
  const remaining = topic.chapters.length - preview.length;

  return (
    <>
      {/* Brillo de color del tema: aparece al pasar el cursor */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-(--topic)/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}99, transparent)`,
        }}
      />

      <div className="relative mb-6 flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
          }}
        >
          <TopicIcon slug={topic.slug} emoji={topic.emoji} />
        </div>

        {isEmpty ? (
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#6e6e8a",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Próximamente
          </span>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-(--topic)/15 group-hover:text-(--topic)">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>

      <h2 className="relative text-2xl font-bold tracking-tight text-white">
        {topic.title}
      </h2>

      {/* Siempre 2 líneas de alto: así los separadores quedan alineados entre tarjetas */}
      <p className="relative mt-2 line-clamp-2 min-h-[3.25rem] text-base leading-relaxed text-(--text-muted)">
        {topic.description}
      </p>

      {preview.length > 0 && (
        <ul className="relative mt-5 space-y-2 border-t border-white/5 pt-5">
          {preview.map((title) => (
            <li
              key={title}
              className="flex items-center gap-2.5 text-sm text-zinc-400"
            >
              <span
                aria-hidden="true"
                className="h-1 w-1 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              <span className="truncate">{title}</span>
            </li>
          ))}

          {remaining > 0 && (
            <li className="pl-3.5 text-xs text-zinc-600">
              y {remaining} más
            </li>
          )}
        </ul>
      )}

      {/* Contadores: siempre abajo, aunque las tarjetas tengan distinto alto */}
      {!isEmpty && (
        <div
          className="relative mt-auto flex items-center gap-2 pt-6 text-xs text-zinc-500 font-mono"
        >
          <span>{plural(topic.chapterCount, "capítulo", "capítulos")}</span>

          {topic.hasSections && (
            <>
              <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-zinc-700" />
              <span>{plural(topic.documentCount, "apartado", "apartados")}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}

const cardClasses =
  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 p-6 transition-all duration-300";

const cardBackground =
  "linear-gradient(135deg, rgba(124,109,250,0.08), rgba(14,14,26,0.97) 55%, rgba(6,214,160,0.04))";

/* ── Índice ─────────────────────────────────────────────── */

export function TopicsIndex({ topics }: { topics: TopicSummary[] }) {
  const [filter, setFilter] = useState("");
  const shouldReduceMotion = useReducedMotion();

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
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            value={filter}
            autoComplete="off"
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filtrar temas..."
            aria-label="Filtrar temas"
            className="w-full rounded-xl border border-white/5 bg-white/5 py-3 pl-11 pr-4 text-base text-zinc-300 outline-none transition-colors placeholder:text-zinc-600 focus:border-violet-500/30"
          />
          {filter && (
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600"
              aria-live="polite"
            >
              {plural(filtered.length, "resultado", "resultados")}
            </span>
          )}
        </div>
      )}

      {filtered.length > 0 ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,17.5rem),1fr))] gap-5">
          {filtered.map((topic, index) => {
            const style = {
              "--topic": getTopicAccent(topic.slug),
              background: cardBackground,
            } as CSSProperties;

            return (
              <motion.li
                key={topic.slug}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: shouldReduceMotion ? 0 : index * 0.06,
                  ease: "easeOut",
                }}
              >
                {topic.chapterCount === 0 ? (
                  <div className={`${cardClasses} opacity-70`} style={style}>
                    <TopicCardBody topic={topic} />
                  </div>
                ) : (
                  <Link
                    href={topic.href}
                    className={`${cardClasses} hover:-translate-y-0.5 hover:border-(--topic)/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)`}
                    style={style}
                  >
                    <TopicCardBody topic={topic} />
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <div className="py-10 text-center">
          <p className="text-base text-zinc-600">
            No se encontraron temas para{" "}
            <span className="text-zinc-400">{`"${filter}"`}</span>
          </p>
        </div>
      )}
    </div>
  );
}
