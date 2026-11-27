import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { TopicSummary } from "@/documentation/utils/topics";
import { TopicIcon } from "@/documentation/components/TopicIcon";
import { docPath } from "@/shared/utils/routes";

interface HomeTopicsProps {
  topics: TopicSummary[];
}

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

export default function HomeTopics({ topics }: HomeTopicsProps) {
  return (
    <section aria-labelledby="home-topics-heading" className="mt-24">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2
            id="home-topics-heading"
            className="font-display text-2xl font-semibold tracking-[-0.025em] text-(--text) sm:text-3xl"
          >
            Áreas de documentación
          </h2>
          <p className="mt-1.5 text-[15px] text-(--text-muted)">
            Elige un lenguaje o disciplina para entrar directo a sus guías.
          </p>
        </div>

        <Link
          href={docPath()}
          className="group inline-flex w-fit items-center gap-1.5 rounded text-sm font-medium text-(--accent-light) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
        >
          Ver catálogo completo
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {topics.map((topic) => {
          const preview = topic.chapters.slice(0, 3);
          const remaining = topic.chapters.length - preview.length;

          return (
            <li key={topic.slug}>
              <Link
                href={topic.href}
                className="group flex h-full flex-col rounded-2xl border border-(--border) bg-(--bg-2) p-6 transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
              >
                <div className="mb-5 flex items-center justify-between">
                  <TopicIcon slug={topic.slug} emoji={topic.emoji} size="md" />

                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent-light)"
                  />
                </div>

                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-(--text)">
                  {topic.title}
                </h3>

                <p className="mt-2 text-[15px] leading-6 text-(--text-secondary)">
                  {topic.description}
                </p>

                {preview.length > 0 && (
                  <ul className="mt-5 space-y-1.5 border-t border-(--border) pt-4">
                    {preview.map((itemTitle) => (
                      <li
                        key={itemTitle}
                        className="truncate text-sm text-(--text-muted)"
                      >
                        {itemTitle}
                      </li>
                    ))}
                    {remaining > 0 && (
                      <li className="text-xs font-medium text-(--accent-light)">
                        +{remaining}{" "}
                        {remaining === 1 ? "unidad más" : "unidades más"}
                      </li>
                    )}
                  </ul>
                )}

                <p className="mt-auto pt-6 text-xs font-medium tabular-nums text-(--text-muted)">
                  {topic.hasSections
                    ? `${plural(topic.chapterCount, "unidad", "unidades")}, ${plural(topic.documentCount, "lección", "lecciones")}`
                    : plural(topic.documentCount, "artículo", "artículos")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
