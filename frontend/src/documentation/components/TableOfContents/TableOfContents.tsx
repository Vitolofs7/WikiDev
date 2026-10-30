/**

ruta: frontend/src/documentation/components/TableOfContents/TableOfContents.tsx

* Genera un índice de contenidos interactivo a partir de los encabezados H1, H2 y H3
* del documento MDX renderizado. Recopila sus títulos, niveles e identificadores,
* asignando identificadores automáticamente cuando no existen. Detecta el apartado
* activo durante el desplazamiento de la página y actualiza su resaltado visual,
* optimizando los cálculos mediante `requestAnimationFrame` y búsqueda binaria.
* Permite navegar hasta cada sección mediante desplazamiento suave y adapta la
* presentación del índice según la jerarquía de los encabezados. También gestiona
* la sincronización con el documento actual y limpia los eventos y las animaciones
* pendientes al desmontarse el componente.

**/


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
      // Este efecto sincroniza el índice con el DOM renderizado por el MDX,
      // algo que solo se puede leer después del pintado — no hay alternativa
      // sin efecto (ni "key", ni estado inicial perezoso) para este caso.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeadings([]);
      setActiveId("");
      return;
    }

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
    setActiveId(elements[0]?.id ?? "");

    let ticking = false;
    let animationFrameId: number | null = null;

    const updateActiveHeading = () => {
      const scrollY = window.scrollY + 60;

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
    <aside className="w-90 shrink-0 sticky top-10 h-fit hidden xl:block">
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