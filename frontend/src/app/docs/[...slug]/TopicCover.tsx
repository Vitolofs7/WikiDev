import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TopicIcon } from "@/documentation/components/TopicIcon";
import type { NavCategory } from "@/navigation/config/nav.config";
import { docPath } from "@/shared/utils/routes";
import { IndexCard } from "@/documentation/components/IndexCard";
import { DocBreadcrumbs } from "@/documentation/components/DocBreadcrumbs";

interface TopicCoverProps {
  category: NavCategory;
}

export function TopicCover({ category }: TopicCoverProps) {
  const hasChapters = category.items.some(
    (item) => (item.subItems?.length ?? 0) > 0,
  );
  const totalLessons = category.items.reduce(
    (acc, item) => acc + (item.subItems?.length || 1),
    0,
  );
  const firstItem = category.items[0];
  const startHref = firstItem
    ? firstItem.subItems?.length
      ? docPath(category.slug, firstItem.slug, firstItem.subItems[0].slug)
      : docPath(category.slug, firstItem.slug)
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={docPath()}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Áreas de estudio
        </Link>

        <DocBreadcrumbs
          items={[
            { label: "Documentación", href: docPath() },
            { label: category.title },
          ]}
        />
      </div>

      <header className="mb-10 flex flex-col justify-between gap-6 border-b border-(--border) pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <TopicIcon slug={category.slug} emoji={category.emoji} size="lg" />
            <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-(--text) sm:text-4xl lg:text-[2.75rem]">
              {category.title}
            </h1>
          </div>

          <p className="mt-4 text-base leading-7 text-(--text-secondary)">
            {category.description}
          </p>

          <p className="mt-3 text-sm tabular-nums text-(--text-muted)">
            {hasChapters
              ? `${category.items.length} ${category.items.length === 1 ? "unidad" : "unidades"} con ${totalLessons} ${totalLessons === 1 ? "lección" : "lecciones"} en total`
              : `${totalLessons} ${totalLessons === 1 ? "artículo interactivo" : "artículos interactivos"}`}
          </p>
        </div>

        {startHref && (
          <Link
            href={startHref}
            className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-(--accent) px-4 text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) sm:w-auto"
          >
            Empezar por la primera lección
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </header>

      <h2 className="mb-5 font-display text-lg font-semibold text-(--text)">
        {hasChapters ? "Unidades del temario" : "Artículos disponibles"}
      </h2>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {category.items.map((item, index) => (
          <IndexCard
            key={item.slug}
            href={docPath(category.slug, item.slug)}
            index={index}
            title={item.title}
            meta={
              item.subItems?.length
                ? `${item.subItems.length} ${
                    item.subItems.length === 1 ? "lección" : "lecciones"
                  }`
                : "Artículo interactivo"
            }
          />
        ))}
      </div>
    </div>
  );
}
