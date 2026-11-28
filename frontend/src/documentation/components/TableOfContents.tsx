"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function useDocumentHeadings(docKey: string) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article.prose-docs");

    if (!article) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeadings([]);
      setActiveId("");
      return;
    }

    const elements = Array.from(article.querySelectorAll("h2, h3"));
    const items: Heading[] = [];

    elements.forEach((el, index) => {
      const text = el.textContent ?? "";

      if (!el.id) {
        el.id =
          text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim() +
          "-" +
          index;
      }

      items.push({
        id: el.id,
        text,
        level: parseInt(el.tagName[1], 10),
      });
    });

    setHeadings(items);
    setActiveId(elements[0]?.id ?? "");

    let ticking = false;
    let animationFrameId: number | null = null;

    const updateActiveHeading = () => {
      const scrollY = window.scrollY + 120;
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;

      let current = "";

      if (isAtBottom) {
        current = elements[elements.length - 1]?.id ?? "";
      } else if (elements.length > 0) {
        let low = 0;
        let high = elements.length - 1;
        current = elements[0].id;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const el = elements[mid];
          const absoluteTop =
            (el as HTMLElement).getBoundingClientRect().top + window.scrollY;

          if (absoluteTop <= scrollY) {
            current = el.id;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
      }

      setActiveId((previousId) =>
        previousId === current ? previousId : current,
      );
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      animationFrameId = requestAnimationFrame(() => {
        updateActiveHeading();
        ticking = false;
        animationFrameId = null;
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [docKey]);

  const activeIndex = Math.max(
    0,
    headings.findIndex((h) => h.id === activeId),
  );

  return { headings, activeId, activeIndex };
}

interface TableOfContentsProps {
  docKey: string;
  hidden?: boolean;
}

export function TableOfContents({
  docKey,
  hidden = false,
}: TableOfContentsProps) {
  const { headings, activeId, activeIndex } = useDocumentHeadings(docKey);

  if (headings.length === 0) return null;

  return (
    <aside
      aria-label="Índice de la página"
      aria-hidden={hidden}
      inert={hidden}
      className={`sticky top-20 hidden h-fit max-h-[calc(100vh-6rem)] w-72 shrink-0 overflow-y-auto rounded-2xl border border-(--border) bg-(--bg-2)/80 p-5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block xl:w-80 ${
        hidden
          ? "pointer-events-none translate-x-2 opacity-0"
          : "translate-x-0 opacity-100"
      }`}
    >
      <div className="mb-3.5 flex items-center justify-between gap-2 border-b border-(--border) pb-3">
        <p className="font-display text-[15px] font-semibold text-(--text)">
          En esta página
        </p>
        <span className="text-xs font-medium tabular-nums text-(--text-muted)">
          {activeIndex + 1} / {headings.length}
        </span>
      </div>

      <ul className="space-y-1 border-l border-(--border)">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(heading.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`-ml-px block rounded-r-lg border-l-2 pr-3 leading-snug transition-[color,background-color,border-color,padding] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) ${
                  heading.level === 3
                    ? "py-1.5 pl-6 text-sm hover:pl-7"
                    : "py-2 pl-3.5 text-[15px] hover:pl-4.5"
                } ${
                  isActive
                    ? "border-(--accent-light) bg-(--accent-soft) font-medium text-(--accent-light)"
                    : "border-transparent text-(--text-muted) hover:border-(--accent)/60 hover:bg-(--bg-3)/70 hover:text-(--text)"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/**
 * Índice compacto estático en la cabecera del artículo cuando el panel de apuntes
 * está abierto: nunca persigue ni tapa el texto al hacer scroll.
 */
export function CompactTocBar({ docKey }: { docKey: string }) {
  const { headings, activeId, activeIndex } = useDocumentHeadings(docKey);
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [expanded]);

  if (headings.length === 0) return null;

  const activeHeading = headings[activeIndex] ?? headings[0];

  return (
    <div ref={wrapperRef} className="relative z-20 mb-6">
      <div className="overflow-hidden rounded-xl border border-(--border-hover) bg-(--bg-2)">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label="Desplegar índice de secciones de esta lección"
          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-(--bg-3)/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--accent-light)"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <List
              className="h-4 w-4 shrink-0 text-(--accent-light)"
              aria-hidden="true"
            />
            <span className="shrink-0 text-xs font-medium text-(--text-muted)">
              En esta página:
            </span>
            <span className="truncate text-sm font-medium text-(--text)">
              {activeHeading.text}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className="text-xs font-medium tabular-nums text-(--text-muted)">
              {activeIndex + 1} / {headings.length}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-(--text-muted) transition-transform duration-200 ${
                expanded ? "rotate-180 text-(--accent-light)" : ""
              }`}
              aria-hidden="true"
            />
          </div>
        </button>
      </div>

      {expanded && (
        <nav
          aria-label="Secciones de esta página"
          className="mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-(--border-hover) bg-(--bg-2) p-2.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
        >
          <ul className="space-y-0.5 border-l border-(--border)">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setExpanded(false);
                      document
                        .getElementById(heading.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`-ml-px block rounded-r-lg border-l-2 pr-3 leading-snug transition-[color,background-color,border-color,padding] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) ${
                      heading.level === 3
                        ? "py-1.5 pl-6 text-xs hover:pl-7"
                        : "py-2 pl-3.5 text-sm hover:pl-4.5"
                    } ${
                      isActive
                        ? "border-(--accent-light) bg-(--accent-soft) font-medium text-(--accent-light)"
                        : "border-transparent text-(--text-muted) hover:border-(--accent)/60 hover:bg-(--bg-3)/70 hover:text-(--text)"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
