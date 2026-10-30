/**
 * /docs — Punto de entrada a la documentación.
 *
 * Muestra todos los temas disponibles (Python, JavaScript, Algoritmos…)
 * para que el usuario elija un área antes de entrar en ella. Cada tarjeta
 * enlaza a la portada del tema (/docs/<slug>), que ya existe en
 * [...slug]/page.tsx: esta página no carga documentos ni duplica rutas.
 *
 * Los temas salen de `navConfig` a través de `getTopicSummaries()`.
 */

import type { Metadata } from "next";

import { getTopicSummaries } from "@/documentation/utils/topics";
import { TopicsIndex } from "./TopicsIndex";

export const metadata: Metadata = {
  title: "Documentación — WikiDev",
  description:
    "Explora todos los temas de WikiDev y elige el área que quieres consultar.",
};

const chip =
  "rounded-full px-3 py-1.5 text-sm font-medium";

export default function DocsIndexPage() {
  const topics = getTopicSummaries();

  const chapters = topics.reduce((total, topic) => total + topic.chapterCount, 0);
  const documents = topics.reduce((total, topic) => total + topic.documentCount, 0);

  return (
    <div className="w-full">
      <header className="mb-12 border-b border-white/5 pb-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-(--accent)/50" />
          <span
            className="text-base uppercase tracking-[0.2em] text-(--accent-light)"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Documentación
          </span>
        </div>

        <h1 className="mb-4 text-6xl font-extrabold tracking-tight text-white">
          Elige un{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            área de estudio
          </span>
        </h1>

        <p className="max-w-2xl text-xl leading-relaxed text-zinc-500">
          Cada tema reúne capítulos y apartados con ejemplos de código que
          puedes ejecutar. Selecciona uno para entrar en su documentación.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className={chip}
            style={{
              background: "rgba(124,109,250,0.1)",
              color: "#a89cf7",
              border: "1px solid rgba(124,109,250,0.2)",
            }}
          >
            {topics.length} {topics.length === 1 ? "tema" : "temas"}
          </span>

          <span
            className={chip}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#d4d0e2",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {chapters} {chapters === 1 ? "capítulo" : "capítulos"}
          </span>

          <span
            className={chip}
            style={{
              background: "rgba(6,214,160,0.08)",
              color: "#6ee7b7",
              border: "1px solid rgba(6,214,160,0.2)",
            }}
          >
            {documents} {documents === 1 ? "documento" : "documentos"}
          </span>
        </div>
      </header>

      <TopicsIndex topics={topics} />
    </div>
  );
}
