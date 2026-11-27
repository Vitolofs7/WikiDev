import Link from "next/link";
import { Logo } from "@/shared/components/Logo";
import { docPath } from "@/shared/utils/routes";
import { ArrowUpRight, Github } from "lucide-react";

export default function HomeFooter() {
  return (
    <footer className="border-t border-(--border) bg-(--bg) px-5 sm:px-8">
      <div className="mx-auto max-w-6xl py-12">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-3">
            <Logo compact />
            <p className="max-w-sm text-sm text-(--text-muted)">
              Documentación técnica en español con ejemplos ejecutables y
              apuntes privados.
            </p>
          </div>

          <nav
            aria-label="Enlaces de navegación del pie de página"
            className="flex flex-wrap items-center gap-6 text-sm text-(--text-muted)"
          >
            <Link
              href={docPath()}
              className="rounded transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              Documentación
            </Link>
            <Link
              href="/notes"
              className="rounded transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              Notas
            </Link>
            <a
              href="https://github.com/Vitolofs7/WikiDev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </nav>
        </div>

        <div className="mt-10 border-t border-(--border) pt-6 text-xs text-(--text-muted)">
          <p>© {new Date().getFullYear()} WikiDev.</p>
        </div>
      </div>
    </footer>
  );
}
