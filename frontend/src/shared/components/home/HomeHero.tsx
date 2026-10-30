/**

ruta: frontend/src/shared/components/home/HomeHero.tsx

* Renderiza la sección principal de presentación (hero) de la página de inicio
* de WikiDev. Presenta la propuesta de valor de la aplicación mediante un título
* destacado, una descripción de sus recursos de aprendizaje y dos enlaces de
* navegación: uno hacia la documentación de JavaScript y otro hacia un ejemplo
* práctico de arrays. Utiliza una composición adaptable que combina el contenido
* textual con una representación visual del conocimiento, cargada mediante el
* componente `KnowledgeSceneLazy` para optimizar la carga inicial. Incorpora
* jerarquía tipográfica, degradados de marca y efectos de interacción para
* destacar las acciones principales, manteniendo una distribución centrada
* en dispositivos pequeños y alineada a la izquierda en pantallas grandes.

**/


import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

import KnowledgeSceneLazy from "@/shared/components/knowledge/KnowledgeSceneLazy";

export default function HomeHero() {
  return (
    <section className="relative grid min-h-115 grid-cols-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] xl:gap-8">
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-sm font-medium text-(--accent)">
          <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />
          Documentación de programación en español
        </p>

        <h1 className="font-display mx-auto mb-6 max-w-170 text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-balance text-(--text) sm:text-6xl lg:mx-0 xl:text-7xl">
          Aprende, consulta y{" "}
          <span className="bg-(image:--gradient-brand) bg-clip-text pb-1 text-transparent">
            experimenta.
          </span>
        </h1>

        <p className="font-display mx-auto mb-8 max-w-xl text-base leading-7 text-(--text-secondary) sm:text-lg lg:mx-0">
          Conceptos claros y ejemplos prácticos de JavaScript y más,
          pensados para que los leas y los pruebes al momento.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
          <Link
            href="/docs/javascript"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-(image:--gradient-brand) px-6 py-3 text-sm font-semibold text-white shadow-(--shadow-brand) transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) sm:w-auto"
          >
            Explorar documentación
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/docs/javascript/arrays"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-(--border-hover) bg-(--surface) px-6 py-3 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) sm:w-auto"
          >
            <Terminal className="h-4 w-4 text-(--accent)" />
            Ver un ejemplo
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative flex min-w-0 items-center justify-center"
      >
        <KnowledgeSceneLazy />
      </div>
    </section>
  );
}