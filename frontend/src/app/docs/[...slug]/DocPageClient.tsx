"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CodeRunner } from "@/code-execution/components/CodeRunner";
import { TableOfContents } from "@/documentation/components/TableOfContents";
import { Download, ArrowLeft, ArrowRight, ListTree } from "lucide-react";
import { Callout } from "@/documentation/components/Callout";
import { downloadPdf } from "@/documentation/utils/pdf-export";
import { ReadingProgress } from "@/documentation/components/ReadingProgress";
import { DocBreadcrumbs } from "@/documentation/components/DocBreadcrumbs";
import { DocOutlineDrawer } from "@/documentation/components/DocOutlineDrawer";
import docs from "@/generated/docs.generated";
import { docPath } from "@/shared/utils/routes";
import {
  getAdjacentDocs,
  getBreadcrumbLinks,
} from "@/documentation/utils/doc-navigation";

import "@/documentation/styles/prose-docs.css";

const components = { CodeRunner, Callout };

interface Props {
  docKey: string;
}

export function DocPageClient({ docKey }: Props) {
  const articleRef = useRef<HTMLElement>(null);
  const [outlineOpen, setOutlineOpen] = useState(false);

  const Content = docs[docKey];
  if (!Content) return null;

  const { prev: prevDoc, next: nextDoc, position, total } = getAdjacentDocs(docKey);
  const crumbs = getBreadcrumbLinks(docKey);
  const parentCrumb = crumbs.length >= 2 ? crumbs[crumbs.length - 2] : null;

  const secondaryBtn =
    "inline-flex h-9 items-center gap-2 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)";

  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <ReadingProgress articleRef={articleRef} docKey={docKey} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-(--border) pb-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {parentCrumb?.href && (
            <Link href={parentCrumb.href} className={secondaryBtn}>
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="max-w-44 truncate">{parentCrumb.label}</span>
            </Link>
          )}
          <div className="hidden sm:block">
            <DocBreadcrumbs items={crumbs} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {position && total > 1 && (
            <span className="hidden rounded-lg border border-(--border) bg-(--bg-2) px-2.5 py-1.5 text-xs font-medium tabular-nums text-(--text-muted) md:inline-block">
              {position} de {total}
            </span>
          )}

          <button
            type="button"
            onClick={() => setOutlineOpen(true)}
            className={secondaryBtn}
            title="Abrir temario completo del área actual"
          >
            <ListTree className="h-3.5 w-3.5 text-(--accent-light)" aria-hidden="true" />
            Temario
          </button>

          <button
            type="button"
            onClick={() => downloadPdf(docKey)}
            className={secondaryBtn}
            title="Ejecuta el código antes de descargar para incluir las salidas"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            PDF
          </button>
        </div>
      </div>

      <div className="flex items-start gap-10 xl:gap-12">
        <div className="min-w-0 flex-1">
          <article ref={articleRef} className="prose-docs" data-doc-article>
            <Content components={components} />
          </article>

          {(prevDoc || nextDoc) && (
            <nav
              aria-label="Navegación entre lecciones"
              className="mt-14 grid grid-cols-1 gap-4 border-t border-(--border) pt-8 sm:grid-cols-2"
            >
              {prevDoc ? (
                <Link
                  href={docPath(...prevDoc.slug.split("/"))}
                  className="group flex items-center gap-3 rounded-xl border border-(--border) bg-(--bg-2) p-4 transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
                >
                  <ArrowLeft
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-(--text-muted) group-hover:text-(--accent-light)"
                  />

                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs text-(--text-muted)">Anterior</span>
                    <span className="truncate text-sm font-medium text-(--text-secondary) group-hover:text-(--text)">
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
                  className="group flex items-center justify-end gap-3 rounded-xl border border-(--border) bg-(--bg-2) p-4 text-right transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) sm:col-start-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs text-(--text-muted)">Siguiente</span>
                    <span className="truncate text-sm font-medium text-(--text-secondary) group-hover:text-(--text)">
                      {nextDoc.title}
                    </span>
                  </span>

                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-(--text-muted) group-hover:text-(--accent-light)"
                  />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        <TableOfContents docKey={docKey} />
      </div>

      <DocOutlineDrawer
        open={outlineOpen}
        onClose={() => setOutlineOpen(false)}
        docKey={docKey}
      />
    </div>
  );
}
