/**
* Gestiona la representación de una página de documentación, integrando la carga dinámica
* del contenido MDX, las migas de pan, las acciones de navegación, la exportación a PDF,
* el seguimiento del progreso de lectura y el índice de contenidos. También organiza la
* navegación secuencial entre lecciones de una misma unidad mediante los metadatos generados,
* y proporciona los componentes personalizados necesarios para renderizar el contenido
* interactivo de la documentación.

*/

"use client";

import { useRef } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { CodeRunner } from "@/code-execution/components/CodeRunner";

import { TableOfContents } from "@/documentation/components/TableOfContents";

import { Download, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

import { Callout } from "@/documentation/components/Callout";

import { downloadPdf } from "@/documentation/utils/pdf-export";

import { ReadingProgress } from "@/documentation/components/ReadingProgress";

import docs from "@/generated/docs.generated";

import { docPath } from "@/shared/utils/routes";

import {
  getAdjacentDocs,
  getBreadcrumbs,
} from "@/documentation/utils/doc-navigation";

import "@/documentation/styles/prose-docs.css";

const components = { CodeRunner, Callout };

interface Props {
  docKey: string;
}

export function DocPageClient({ docKey }: Props) {
  const router = useRouter();
  const articleRef = useRef<HTMLElement>(null);

  const Content = docs[docKey];

  if (!Content) return null;

  const { prev: prevDoc, next: nextDoc } = getAdjacentDocs(docKey);
  const crumbs = getBreadcrumbs(docKey);

  const secondaryBtn =
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 transition-all";

  const secondaryBtnStyle = {
    background: "#14141f",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <>
      <ReadingProgress articleRef={articleRef} docKey={docKey} />

      <div className="flex gap-12 items-start">
        <div className="flex-1 min-w-0">
          {/* Barra superior: breadcrumbs + acciones */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
            <nav
              aria-label="Ruta de navegación"
              className="flex items-center flex-wrap gap-1.5 text-sm"
            >
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;

                return (
                  <span key={i} className="flex items-center gap-1.5">
                    <span
                      className={
                        isLast ? "text-zinc-300 font-medium" : "text-zinc-600"
                      }
                    >
                      {crumb}
                    </span>

                    {!isLast && (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />
                    )}
                  </span>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className={secondaryBtn}
                style={secondaryBtnStyle}
                title="Volver a la página anterior"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>

              <button
                onClick={() => downloadPdf(docKey)}
                className={secondaryBtn}
                style={secondaryBtnStyle}
                title="Ejecuta el código antes de descargar para incluir las salidas"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          </div>

          <article ref={articleRef} className="prose-docs" data-doc-article>
            <Content components={components} />
          </article>

          {/* Navegación entre lecciones de la unidad (fuera del article: no entra en el PDF) */}
          {(prevDoc || nextDoc) && (
            <nav
              aria-label="Navegación entre lecciones"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {prevDoc ? (
                <Link
                  href={docPath(...prevDoc.slug.split("/"))}
                  className="group flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{
                    background: "#0e0e1a",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-600 group-hover:text-violet-300 transition-colors" />

                  <span className="flex flex-col min-w-0">
                    <span className="text-xs uppercase tracking-widest text-zinc-600">
                      Anterior
                    </span>

                    <span className="text-sm text-zinc-300 truncate">
                      {prevDoc.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {nextDoc ? (
                <Link
                  href={docPath(...nextDoc.slug.split("/"))}
                  className="group flex items-center justify-end gap-3 p-4 rounded-2xl text-right transition-all hover:-translate-y-0.5 sm:col-start-2"
                  style={{
                    background: "#0e0e1a",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="flex flex-col min-w-0">
                    <span className="text-xs uppercase tracking-widest text-zinc-600">
                      Siguiente
                    </span>

                    <span className="text-sm text-zinc-300 truncate">
                      {nextDoc.title}
                    </span>
                  </span>

                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-300 transition-colors" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        <TableOfContents docKey={docKey} />
      </div>
    </>
  );
}
