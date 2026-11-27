"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  docKey: string;
}

export function TableOfContents({ docKey }: TableOfContentsProps) {
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
      const scrollY = window.scrollY + 96;
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

  if (headings.length === 0) return null;

  const activeIndex = Math.max(
    0,
    headings.findIndex((h) => h.id === activeId),
  );
  const progressRatio =
    headings.length > 1 ? (activeIndex + 1) / headings.length : 1;

  return (
    <aside
      aria-label="Índice de la página"
      className="sticky top-20 hidden h-fit max-h-[calc(100vh-6rem)] w-72 shrink-0 overflow-y-auto rounded-2xl border border-(--border) bg-(--bg-2)/80 p-5 lg:block xl:w-80"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-display text-[15px] font-semibold text-(--text)">
          En esta página
        </p>
        <span className="text-xs font-medium tabular-nums text-(--text-muted)">
          {activeIndex + 1} / {headings.length}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="mb-4 h-1 w-full overflow-hidden rounded-full bg-(--bg-3)"
      >
        <div
          className="h-full w-full origin-left rounded-full bg-(--accent) transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${progressRatio})` }}
        />
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
                className={`-ml-px block rounded-r-lg border-l-2 pr-3 leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) ${
                  heading.level === 3
                    ? "py-1.5 pl-6 text-sm"
                    : "py-2 pl-3.5 text-[15px]"
                } ${
                  isActive
                    ? "border-(--accent-light) bg-(--accent-soft) font-medium text-(--accent-light)"
                    : "border-transparent text-(--text-muted) hover:border-(--border-hover) hover:bg-(--bg-3)/60 hover:text-(--text)"
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
