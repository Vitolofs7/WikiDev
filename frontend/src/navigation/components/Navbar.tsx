"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { docPath } from "@/shared/utils/routes";
import Link from "next/link";
import { Logo } from "@/shared/components/Logo";
import {
  Search,
  StickyNote,
  BookOpen,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useSearchModal } from "@/search/components/SearchProvider";
import { useAuth } from "@/auth/context/AuthProvider";

type NavbarProps = {
  compact?: boolean;
};

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)";

export function Navbar({ compact = false }: NavbarProps) {
  const pathname = usePathname();
  const { open } = useSearchModal();
  const { user, loading, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDocsActive = pathname.startsWith("/docs");
  const isNotesActive = pathname.startsWith("/notes");

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--bg)/92 backdrop-blur-md">
      <div
        className={`mx-auto flex max-w-6xl items-center gap-3 px-5 sm:px-8 ${
          compact ? "h-(--navbar-h)" : "h-16"
        }`}
      >
        <Logo compact />

        <div className="hidden h-5 w-px bg-(--border) md:block" />

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          <Link
            href={docPath()}
            aria-current={isDocsActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[15px] font-medium transition-colors ${FOCUS} ${
              isDocsActive
                ? "bg-(--accent-soft) text-(--text)"
                : "text-(--text-muted) hover:bg-(--bg-2) hover:text-(--text)"
            }`}
          >
            <BookOpen
              aria-hidden="true"
              className={`h-4 w-4 ${isDocsActive ? "text-(--accent-light)" : ""}`}
            />
            Documentación
          </Link>

          <Link
            href="/notes"
            aria-current={isNotesActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[15px] font-medium transition-colors ${FOCUS} ${
              isNotesActive
                ? "bg-(--accent-soft) text-(--text)"
                : "text-(--text-muted) hover:bg-(--bg-2) hover:text-(--text)"
            }`}
          >
            <StickyNote
              aria-hidden="true"
              className={`h-4 w-4 ${isNotesActive ? "text-(--accent-light)" : ""}`}
            />
            Notas
          </Link>
        </nav>

        <div className="ml-auto sm:w-64 md:w-72">
          <button
            type="button"
            onClick={open}
            className={`group flex h-9 w-full items-center gap-2.5 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-left transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) ${FOCUS}`}
            aria-label="Buscar documentación"
          >
            <Search
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-(--text-muted) group-hover:text-(--text)"
            />
            <span className="hidden min-w-0 flex-1 truncate text-sm text-(--text-muted) sm:inline">
              Buscar…
            </span>
            <kbd
              translate="no"
              className="hidden shrink-0 rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[10px] text-(--text-muted) sm:inline"
            >
              Ctrl&nbsp;K
            </kbd>
          </button>
        </div>

        {!loading && (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-(--border) bg-(--bg-2) px-2.5 py-1.5 text-xs font-medium text-(--text-secondary)">
                  <User
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-(--accent-light)"
                  />
                  <span className="max-w-28 truncate">{user.username}</span>
                </span>
                <button
                  type="button"
                  onClick={() => void logout()}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--error)/40 hover:text-(--error) ${FOCUS}`}
                >
                  <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Salir</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className={`inline-flex h-9 items-center rounded-lg bg-(--accent) px-4 text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) ${FOCUS}`}
              >
                Acceder
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-main-nav"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--bg-2) text-(--text-secondary) md:hidden ${FOCUS}`}
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-main-nav"
          aria-label="Navegación móvil"
          className="border-t border-(--border) bg-(--bg-2) px-5 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            <Link
              href={docPath()}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-(--text-secondary) hover:bg-(--bg-3) hover:text-(--text) ${FOCUS}`}
            >
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              Documentación
            </Link>
            <Link
              href="/notes"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-(--text-secondary) hover:bg-(--bg-3) hover:text-(--text) ${FOCUS}`}
            >
              <StickyNote aria-hidden="true" className="h-4 w-4" />
              Notas
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
