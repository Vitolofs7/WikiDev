
import { docPath } from "@/shared/utils/routes";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

import KnowledgeSceneLazy from "@/home/components/knowledge/KnowledgeSceneLazy";

export default function HomeHero() {
  return (
    <section className="relative grid min-h-115 grid-cols-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] xl:gap-8">
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-3) px-3 py-1 text-sm font-medium text-(--accent)">
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
            href={docPath("javascript")}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-(image:--gradient-brand) px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-(color:--accent)/20 transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) sm:w-auto"
          >
            Explorar documentación
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={docPath("javascript", "arrays")}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-(--border-hover) bg-(--bg-3) px-6 py-3 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) sm:w-auto"
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
