"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, RotateCcw } from "lucide-react";
import { docPath } from "@/shared/utils/routes";

interface HomeHeroProps {
  docCount: number;
  topicCount: number;
}

type DemoLang = "python" | "javascript";

interface Token {
  text: string;
  tone?: "kw" | "fn" | "str" | "num" | "muted" | "plain";
}

const TONE_CLASS: Record<NonNullable<Token["tone"]>, string> = {
  kw: "text-[#69d2de]",
  fn: "text-[#f0eee9] font-medium",
  str: "text-[#e5b25d]",
  num: "text-[#56c99b]",
  muted: "text-[#7d8da3]",
  plain: "text-[#d6dde7]",
};

const DEMOS: Record<
  DemoLang,
  {
    file: string;
    command: string;
    presets: { label: string; arg: string; output: string }[];
    renderLines: (arg: string) => Token[][];
    href: string;
    lessonLabel: string;
  }
> = {
  python: {
    file: "funciones.py",
    command: "python funciones.py",
    presets: [
      { label: "120 €", arg: "120", output: "Total con IVA: 145.20 €" },
      { label: "85 €", arg: "85", output: "Total con IVA: 102.85 €" },
    ],
    renderLines: (arg) => [
      [
        { text: "def ", tone: "kw" },
        { text: "precio_con_iva", tone: "fn" },
        { text: "(base, iva=", tone: "plain" },
        { text: "0.21", tone: "num" },
        { text: "):", tone: "muted" },
      ],
      [
        { text: "    return ", tone: "kw" },
        { text: "round", tone: "fn" },
        { text: "(base * (", tone: "plain" },
        { text: "1", tone: "num" },
        { text: " + iva), ", tone: "plain" },
        { text: "2", tone: "num" },
        { text: ")", tone: "plain" },
      ],
      [],
      [
        { text: "total", tone: "plain" },
        { text: " = ", tone: "muted" },
        { text: "precio_con_iva", tone: "fn" },
        { text: "(", tone: "plain" },
        { text: arg, tone: "num" },
        { text: ")", tone: "plain" },
      ],
      [
        { text: "print", tone: "fn" },
        { text: "(", tone: "plain" },
        { text: 'f"Total con IVA: {total:.2f} €"', tone: "str" },
        { text: ")", tone: "plain" },
      ],
    ],
    href: docPath("python", "funciones-basicas", "que-es-una-funcion"),
    lessonLabel: "Abrir lección de Python",
  },
  javascript: {
    file: "arrays.js",
    command: "node arrays.js",
    presets: [
      { label: ">= 20", arg: "20", output: "Suma filtrada: 107" },
      { label: ">= 50", arg: "50", output: "Suma filtrada: 65" },
    ],
    renderLines: (arg) => [
      [
        { text: "const ", tone: "kw" },
        { text: "precios", tone: "plain" },
        { text: " = [", tone: "muted" },
        { text: "18", tone: "num" },
        { text: ", ", tone: "muted" },
        { text: "42", tone: "num" },
        { text: ", ", tone: "muted" },
        { text: "65", tone: "num" },
        { text: ", ", tone: "muted" },
        { text: "12", tone: "num" },
        { text: "];", tone: "muted" },
      ],
      [
        { text: "const ", tone: "kw" },
        { text: "filtrados", tone: "plain" },
        { text: " = precios.", tone: "plain" },
        { text: "filter", tone: "fn" },
        { text: "((n) => n >= ", tone: "plain" },
        { text: arg, tone: "num" },
        { text: ");", tone: "plain" },
      ],
      [
        { text: "const ", tone: "kw" },
        { text: "total", tone: "plain" },
        { text: " = filtrados.", tone: "plain" },
        { text: "reduce", tone: "fn" },
        { text: "((a, b) => a + b, ", tone: "plain" },
        { text: "0", tone: "num" },
        { text: ");", tone: "plain" },
      ],
      [],
      [
        { text: "console", tone: "plain" },
        { text: ".", tone: "muted" },
        { text: "log", tone: "fn" },
        { text: "(", tone: "plain" },
        { text: '"Suma filtrada:"', tone: "str" },
        { text: ", total);", tone: "plain" },
      ],
    ],
    href: docPath("javascript", "arrays"),
    lessonLabel: "Abrir lección de JavaScript",
  },
};

export default function HomeHero({ docCount, topicCount }: HomeHeroProps) {
  const [lang, setLang] = useState<DemoLang>("python");
  const [presetIndex, setPresetIndex] = useState(0);
  const [hasRun, setHasRun] = useState(true);

  const demo = DEMOS[lang];
  const preset = demo.presets[presetIndex] ?? demo.presets[0];
  const lines = demo.renderLines(preset.arg);

  return (
    <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-14">
      <div className="min-w-0">
        <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-(--text) sm:text-5xl lg:text-[3.4rem]">
          Aprende programación leyendo y ejecutando cada ejemplo.
        </h1>

        <p className="mt-5 max-w-[54ch] text-lg leading-7 text-(--text-secondary)">
          Manuales en español de Python, JavaScript y algoritmos. Modifica el
          código en el navegador sin instalar nada y guarda tus apuntes privados
          con imágenes.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={docPath()}
            className="group inline-flex h-11 items-center gap-2 rounded-lg bg-(--accent) px-5 text-[15px] font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            Explorar documentación
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href="/notes"
            className="inline-flex h-11 items-center rounded-lg border border-(--border) bg-(--bg-2) px-5 text-[15px] font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            Abrir notas
          </Link>
        </div>

        <p className="mt-7 text-sm text-(--text-muted)">
          <span className="tabular-nums font-medium text-(--text-secondary)">
            {docCount} lecciones
          </span>{" "}
          organizadas en{" "}
          <span className="tabular-nums font-medium text-(--text-secondary)">
            {topicCount} áreas
          </span>
          , con búsqueda rápida (<kbd translate="no" className="font-mono text-xs text-(--text-secondary)">Ctrl&nbsp;K</kbd>) y exportación a PDF.
        </p>
      </div>

      {/* Signature element: live syntax-colored code workbench */}
      <div className="min-w-0 overflow-hidden rounded-2xl border border-(--border-hover) bg-(--bg-2) shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--border) px-4 py-3">
          <div
            role="tablist"
            aria-label="Seleccionar lenguaje de ejemplo"
            className="flex items-center gap-1"
          >
            {(["python", "javascript"] as const).map((key) => {
              const active = lang === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setLang(key);
                    setPresetIndex(0);
                    setHasRun(true);
                  }}
                  className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) ${
                    active
                      ? "bg-(--accent-soft) font-medium text-(--accent-light)"
                      : "text-(--text-muted) hover:bg-(--bg-3) hover:text-(--text)"
                  }`}
                >
                  {DEMOS[key].file}
                </button>
              );
            })}
          </div>

          <Link
            href={demo.href}
            className="inline-flex items-center gap-1 rounded text-xs font-medium text-(--text-muted) transition-colors hover:text-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            {demo.lessonLabel}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="overflow-x-auto bg-(--bg-code) px-5 py-5">
          <pre className="font-mono text-[13px] leading-6.5 sm:text-sm">
            <code>
              {lines.map((tokens, i) => (
                <div key={i} className="whitespace-pre">
                  <span className="mr-5 inline-block w-4 select-none text-right tabular-nums text-[#4c5b70]">
                    {i + 1}
                  </span>
                  {tokens.length === 0 ? (
                    <span> </span>
                  ) : (
                    tokens.map((tok, j) => (
                      <span
                        key={j}
                        className={TONE_CLASS[tok.tone ?? "plain"]}
                      >
                        {tok.text}
                      </span>
                    ))
                  )}
                </div>
              ))}
            </code>
          </pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border) bg-(--bg-2) px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-(--text-muted)">Entrada:</span>
            {demo.presets.map((p, idx) => {
              const active = idx === presetIndex;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setPresetIndex(idx);
                    setHasRun(true);
                  }}
                  className={`rounded-md px-2 py-1 font-mono text-xs tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) ${
                    active
                      ? "bg-(--bg-3) text-(--text)"
                      : "text-(--text-muted) hover:text-(--text)"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {hasRun && (
              <button
                type="button"
                onClick={() => setHasRun(false)}
                aria-label="Limpiar salida"
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-(--border) px-2.5 text-xs font-medium text-(--text-muted) transition-colors hover:border-(--border-hover) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Limpiar
              </button>
            )}
            <button
              type="button"
              onClick={() => setHasRun(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-(--accent) px-3 text-xs font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              <Play className="h-3 w-3" aria-hidden="true" />
              Ejecutar
            </button>
          </div>
        </div>

        <div
          aria-live="polite"
          className="border-t border-(--border) bg-(--bg-code) px-5 py-3.5 font-mono text-xs"
        >
          {hasRun ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-(--success)">{preset.output}</span>
              <span className="shrink-0 text-[11px] text-(--text-muted)">
                {demo.command}
              </span>
            </div>
          ) : (
            <span className="text-(--text-muted)">
              Pulsa Ejecutar para comprobar la salida.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
