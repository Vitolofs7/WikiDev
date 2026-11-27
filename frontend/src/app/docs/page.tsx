import type { Metadata } from "next";
import { getTopicSummaries } from "@/documentation/utils/topics";
import { RecentDocsStrip } from "@/documentation/components/RecentDocsStrip";
import { TopicsIndex } from "./TopicsIndex";

export const metadata: Metadata = {
  title: "Documentación — WikiDev",
  description:
    "Explora todos los temas de WikiDev y elige el área que quieres consultar.",
};

export default function DocsIndexPage() {
  const topics = getTopicSummaries();
  const sections = topics.reduce((total, topic) => total + topic.chapterCount, 0);
  const documents = topics.reduce((total, topic) => total + topic.documentCount, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <header className="mb-10 border-b border-(--border) pb-8">
        <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-(--text) sm:text-4xl lg:text-[2.75rem]">
          Áreas de estudio
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-(--text-secondary)">
          Selecciona una ruta para consultar sus unidades y lecciones con
          ejemplos ejecutables.
        </p>

        <p className="mt-4 text-sm tabular-nums text-(--text-muted)">
          {topics.length} {topics.length === 1 ? "área" : "áreas"},{" "}
          {sections} {sections === 1 ? "sección" : "secciones"} y{" "}
          {documents} {documents === 1 ? "lección" : "lecciones"} disponibles.
        </p>
      </header>

      <RecentDocsStrip />
      <TopicsIndex topics={topics} />
    </div>
  );
}
