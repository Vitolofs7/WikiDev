"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/context/AuthProvider";
import { docPath } from "@/shared/utils/routes";

export default function HomeCta() {
  const { user, openAuthModal } = useAuth();

  return (
    <section aria-labelledby="home-cta-heading" className="mt-20">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-(--border-hover) bg-(--bg-2) p-7 sm:p-9 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2
            id="home-cta-heading"
            className="font-display text-xl font-semibold tracking-[-0.02em] text-(--text) sm:text-2xl"
          >
            Accede para ejecutar código y guardar tus apuntes.
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-(--text-secondary)">
            Todas las lecciones son de lectura abierta. Crea una cuenta local
            para activar el ejecutor integrado y tus notas privadas.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
          <Link
            href={docPath()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--border) bg-(--bg) px-4 text-sm font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            Ver documentación
          </Link>

          {user ? (
            <Link
              href="/notes"
              className="group inline-flex h-10 items-center gap-2 rounded-lg bg-(--accent) px-4 text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              Ir a mis notas
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className="group inline-flex h-10 items-center gap-2 rounded-lg bg-(--accent) px-4 text-sm font-semibold text-(--accent-fg) transition-colors hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              Crear cuenta
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
