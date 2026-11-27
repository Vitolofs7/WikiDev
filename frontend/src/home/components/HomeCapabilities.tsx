import Link from "next/link";
import { ArrowRight, BookOpen, StickyNote, Terminal } from "lucide-react";
import { docPath } from "@/shared/utils/routes";

export default function HomeCapabilities() {
  return (
    <section
      aria-labelledby="home-capabilities-heading"
      className="mt-24 border-t border-(--border) pt-16"
    >
      <div className="mb-10 max-w-2xl">
        <h2
          id="home-capabilities-heading"
          className="font-display text-2xl font-semibold tracking-[-0.025em] text-(--text) sm:text-3xl"
        >
          Pensado para estudiar sin cambiar de ventana.
        </h2>
        <p className="mt-2 text-[15px] leading-6 text-(--text-muted)">
          Lectura técnica, ejecución de pruebas y notas personales dentro del
          mismo espacio de trabajo.
        </p>
      </div>

      {/* Asymmetric two-row layout: lead wide feature + two focused companions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-(--border) bg-(--bg-2) p-7 md:col-span-2 md:flex-row md:items-center md:p-8">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent-soft) text-(--accent-light)">
              <Terminal aria-hidden="true" className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-(--text)">
              Ejecución directa en cada lección
            </h3>
            <p className="mt-2 text-[15px] leading-6 text-(--text-secondary)">
              Edita los bloques de Python y JavaScript desde el propio artículo,
              pasa datos por entrada estándar y comprueba el resultado al
              instante con límite de tiempo seguro.
            </p>
          </div>

          <Link
            href={docPath("python", "funciones-basicas", "que-es-una-funcion")}
            className="group inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-(--border-hover) bg-(--bg) px-4 text-sm font-medium text-(--text) transition-colors hover:border-(--accent)/50 hover:text-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light) md:self-center"
          >
            Probar un ejemplo
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="flex flex-col rounded-2xl border border-(--border) bg-(--bg-2) p-7">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent-soft) text-(--accent-light)">
            <StickyNote aria-hidden="true" className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg font-semibold text-(--text)">
            Apuntes privados por cuenta
          </h3>
          <p className="mt-2 text-[15px] leading-6 text-(--text-secondary)">
            Guarda resúmenes propios con autoguardado, filtro instantáneo y
            capturas adjuntas en un espacio aislado para tu usuario.
          </p>
          <Link
            href="/notes"
            className="group mt-auto inline-flex w-fit items-center gap-1.5 rounded pt-6 text-sm font-medium text-(--accent-light) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            Ir a mis notas
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="flex flex-col rounded-2xl border border-(--border) bg-(--bg-2) p-7">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent-soft) text-(--accent-light)">
            <BookOpen aria-hidden="true" className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg font-semibold text-(--text)">
            Guías en MDX listas para PDF
          </h3>
          <p className="mt-2 text-[15px] leading-6 text-(--text-secondary)">
            Índice sincronizado al desplazarte, historial de lectura reciente y
            descarga en PDF incluyendo las salidas del código que hayas probado.
          </p>
          <Link
            href={docPath()}
            className="group mt-auto inline-flex w-fit items-center gap-1.5 rounded pt-6 text-sm font-medium text-(--accent-light) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            Ver documentación
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
