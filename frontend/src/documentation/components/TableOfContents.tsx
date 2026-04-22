"use client";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article.prose-docs");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h1, h2, h3"));
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
        level: parseInt(el.tagName[1]),
      });
    });

    setHeadings(items);

    const handleScroll = () => {
      const scrollY = window.scrollY + 60;

      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;
      if (isAtBottom) {
        setActiveId(elements[elements.length - 1]?.id ?? "");
        return;
      }

      let current = elements[0]?.id ?? "";
      for (const el of elements) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        if (absoluteTop <= scrollY) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (headings.length === 0) return null;

  function getPadding(level: number): string {
    if (level === 2) return "1rem";
    if (level === 3) return "1.75rem";
    return "0.5rem";
  }

  function getFontSize(level: number): string {
    if (level === 1) return "1.15rem";
    if (level === 2) return "1.1rem";
    return "1.05rem";
  }

  return (
    <aside className="w-90 flex-shrink-0 sticky top-10 h-fit hidden xl:block">
      <ul className="space-y-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const linkStyle: React.CSSProperties = {
            fontFamily: "Outfit, sans-serif",
            fontSize: getFontSize(heading.level),
            paddingTop: "0.35rem",
            paddingBottom: "0.35rem",
            paddingLeft: getPadding(heading.level),
            paddingRight: "0.5rem",
            color: isActive ? "#a89cf7" : "#71718b",
            fontWeight: 400,
            display: "block",
            lineHeight: "1.4",
            transition: "color 0.2s",
            borderRadius: "0.375rem",
            background: isActive ? "rgba(124,109,250,0.08)" : "transparent",
          };
          return (
            <li key={heading.id}>
              <a
                href={"#" + heading.id}
                style={linkStyle}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(heading.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
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