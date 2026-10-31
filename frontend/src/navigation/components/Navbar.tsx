/**
 * Ruta: frontend/src/navigation/components/Navbar.tsx
 *
 * Define la barra de navegación principal de WikiDev, proporcionando acceso a la página
 * de inicio, la documentación, el módulo de notas y el área de búsqueda. Permite adaptar
 * su tamaño mediante la propiedad opcional compact, ajustando la altura de la barra, las
 * dimensiones del logotipo, la tipografía, los iconos y el espaciado entre elementos.
 * Utiliza componentes de navegación de Next.js y optimiza la carga del logotipo mediante
 * next/image. El buscador se controla desde el contexto global SearchProvider, evitando
 * instancias duplicadas del modal y manteniendo una experiencia de navegación coherente.
 */

"use client";

import { docPath } from "@/shared/utils/routes";
import Link from "next/link";
import { Logo } from "@/shared/components/Logo";
import { Search, StickyNote, BookOpen } from "lucide-react";
import { useSearchModal } from "@/search/components/SearchProvider";

type NavbarProps = {
  compact?: boolean;
};

export function Navbar({ compact = false }: NavbarProps) {
  const { open } = useSearchModal();

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-transparent">
      <div
        className={`mx-auto flex max-w-7xl items-center px-6 lg:px-8 ${
          compact ? "h-(--navbar-h)" : "h-20"
        }`}
      >
        {/* Logo */}
        <Logo compact={compact} />

        {/* Divider */}
        <div
          className={`hidden w-px bg-(--border-hover) md:block ${
            compact ? "ml-7 h-7" : "ml-10 h-9"
          }`}
        />

        {/* Navigation */}
        <nav
          className={`hidden items-center md:flex ${
            compact ? "ml-4 gap-1" : "ml-7 gap-3"
          }`}
        >
          <Link
            href={docPath()}
            className={`flex items-center rounded-xl text-(--text-secondary) transition-all hover:bg-white/4 hover:text-(--text) ${
              compact ? "gap-2 px-3.5 py-2" : "gap-3 px-5 py-3"
            }`}
          >
            <BookOpen
              className={
                compact ? "h-4 w-4 text-(--accent)" : "h-5 w-5 text-(--accent)"
              }
            />

            <span
              className={`font-medium ${compact ? "text-sm" : "text-base"}`}
            >
              Documentación
            </span>
          </Link>

          <Link
            href="/notes"
            className={`flex items-center rounded-xl text-(--text-secondary) transition-all hover:bg-white/4 hover:text-(--text) ${
              compact ? "gap-2 px-3.5 py-2" : "gap-3 px-5 py-3"
            }`}
          >
            <StickyNote
              className={
                compact ? "h-4 w-4 text-(--accent)" : "h-5 w-5 text-(--accent)"
              }
            />

            <span
              className={`font-medium ${compact ? "text-sm" : "text-base"}`}
            >
              Notas
            </span>
          </Link>
        </nav>

        {/* Search */}
        <div className={`ml-auto ${compact ? "ml-6 flex-1 max-w-130" : ""}`}>
          <button
            type="button"
            onClick={open}
            className={`group flex w-full items-center rounded-xl border border-(--border-hover) bg-(--bg-3)/80 transition-all hover:border-(--accent)/40 hover:bg-(--bg-3) focus:border-(--accent)/60 focus:outline-none ${
              compact ? "h-10 gap-3 px-4" : "h-12 w-95 gap-3.5 px-5"
            }`}
            aria-label="Buscar documentación"
          >
            <Search
              className={`shrink-0 text-(--accent) transition-transform group-hover:scale-105 ${
                compact ? "h-4.5 w-4.5" : "h-5 w-5"
              }`}
            />

            <span
              className={`min-w-0 flex-1 truncate text-left text-(--text-muted) ${
                compact ? "text-sm" : "text-base"
              }`}
            >
              Buscar documentación...
            </span>

            <kbd
              className={`shrink-0 rounded-md border border-(--accent)/20 bg-(--accent)/10 text-(--accent-light) ${
                compact
                  ? "px-2 py-0.5 text-[10px]"
                  : "px-2.5 py-1 text-[11px] font-mono"
              }`}
            >
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
