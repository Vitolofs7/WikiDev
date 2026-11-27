"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { navConfig, type NavCategory } from "@/navigation/config/nav.config";
import { langColors, langIcons } from "@/shared/components/LangIcons";
import { docPath } from "@/shared/utils/routes";
import { cn } from "@/shared/utils/cn";

interface DocOutlineDrawerProps {
  open: boolean;
  onClose: () => void;
  docKey: string;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)";

export function DocOutlineDrawer({
  open,
  onClose,
  docKey,
}: DocOutlineDrawerProps) {
  const pathname = usePathname();
  const [topicSlug, chapterSlug] = docKey.split("/");

  const activeTopic: NavCategory | undefined =
    navConfig.categories.find((c) => c.slug === topicSlug) ??
    navConfig.categories[0];

  const [toggledChapters, setToggledChapters] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !activeTopic) return null;

  const topicColor = langColors[activeTopic.slug] || "var(--accent-light)";
  const TopicIcon = langIcons[activeTopic.slug];

  const isExpanded = (key: string, slug: string) =>
    key in toggledChapters ? toggledChapters[key] : slug === chapterSlug;

  const toggle = (key: string, current: boolean) =>
    setToggledChapters((prev) => ({ ...prev, [key]: !current }));

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-black/65 backdrop-blur-xs"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Temario de ${activeTopic.title}`}
        className="flex h-full w-88 max-w-[90vw] flex-col overscroll-contain border-l border-(--border-hover) bg-(--bg-2) shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-(--border) px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: `${topicColor}18`,
                border: `1px solid ${topicColor}35`,
                color: topicColor,
              }}
            >
              {TopicIcon ? (
                <TopicIcon className="h-4 w-4" />
              ) : (
                <span className="text-sm">{activeTopic.emoji}</span>
              )}
            </span>
            <div className="min-w-0">
              <Link
                href={docPath(activeTopic.slug)}
                onClick={onClose}
                className={cn(
                  "block truncate font-display text-base font-semibold text-(--text) hover:text-(--accent-light) rounded",
                  FOCUS,
                )}
              >
                {activeTopic.title}
              </Link>
              <p className="text-xs text-(--text-muted)">Temario completo</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar temario"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--text)",
              FOCUS,
            )}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label={`Capítulos y lecciones de ${activeTopic.title}`}
          className="flex-1 space-y-1.5 overflow-y-auto overscroll-contain p-4"
        >
          {activeTopic.items.map((item) => {
            const itemHref = docPath(activeTopic.slug, item.slug);
            const hasSubItems = Boolean(
              item.subItems && item.subItems.length > 0,
            );

            if (!hasSubItems) {
              const isActive = pathname === itemHref;
              return (
                <Link
                  key={item.slug}
                  href={itemHref}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-(--accent-soft) font-medium text-(--text)"
                      : "text-(--text-muted) hover:bg-(--bg-3) hover:text-(--text)",
                    FOCUS,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      isActive ? "bg-(--accent-light)" : "bg-(--border-hover)",
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            }

            const key = `${activeTopic.slug}/${item.slug}`;
            const expanded = isExpanded(key, item.slug);
            const isChapterActive = pathname.startsWith(itemHref);

            return (
              <div key={item.slug} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggle(key, expanded)}
                  aria-expanded={expanded}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors",
                    isChapterActive
                      ? "text-(--accent-light)"
                      : "text-(--text-secondary) hover:bg-(--bg-3) hover:text-(--text)",
                    FOCUS,
                  )}
                >
                  {expanded ? (
                    <ChevronDown
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                </button>

                {expanded && (
                  <ul className="ml-3 space-y-0.5 border-l border-(--border) pl-2.5">
                    {item.subItems!.map((sub) => {
                      const subHref = docPath(
                        activeTopic.slug,
                        item.slug,
                        sub.slug,
                      );
                      const isSubActive = pathname === subHref;

                      return (
                        <li key={sub.slug}>
                          <Link
                            href={subHref}
                            onClick={onClose}
                            aria-current={isSubActive ? "page" : undefined}
                            className={cn(
                              "block truncate rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                              isSubActive
                                ? "bg-(--accent-soft) font-medium text-(--text)"
                                : "text-(--text-muted) hover:bg-(--bg-3) hover:text-(--text)",
                              FOCUS,
                            )}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-(--border) p-4">
          <Link
            href={docPath()}
            onClick={onClose}
            className={cn(
              "flex w-full items-center justify-center rounded-lg border border-(--border) bg-(--bg) px-4 py-2 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:text-(--text)",
              FOCUS,
            )}
          >
            Ver todas las áreas de estudio
          </Link>
        </div>
      </aside>
    </div>
  );
}
