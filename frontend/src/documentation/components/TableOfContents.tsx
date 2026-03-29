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

    elements.forEach((el) => {
      const text = el.textContent ?? "";
      if (!el.id) {
        el.id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim();
      }
      items.push({
        id: el.id,
        text,
        level: parseInt(el.tagName[1]),
      });
    });

    setHeadings(items);

    const handleScroll = () => {
      const scrollY = window.scrollY + 950;

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
    if (level === 2) return "0.75rem";
    if (level === 3) return "1.5rem";
    return "0";
  }

  function getFontSize(level: number): string {
    if (level === 1) return "0.985rem";
    if (level === 2) return "0.950rem";
    return "0.95rem";
  }

  return (
    <aside className="w-80 flex-shrink-0 sticky top-10 h-fit hidden xl:block">
      <div className="pl-6">
        <ul className="space-y-1">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const linkStyle: React.CSSProperties = {
              fontFamily: "Outfit, sans-serif",
              fontSize: getFontSize(heading.level),
              paddingLeft: getPadding(heading.level),
              paddingTop: "0.2rem",
              paddingBottom: "0.2rem",
              color: isActive ? "#a89cf7" : "#71718b",
              fontWeight: isActive ? 600 : 400,
              borderLeft: isActive
                ? "2px solid #7c6dfa"
                : "2px solid transparent",
              marginLeft: "-1px",
              display: "block",
              lineHeight: "1.4",
              transition: "color 0.2s",
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
      </div>
    </aside>
  );
}