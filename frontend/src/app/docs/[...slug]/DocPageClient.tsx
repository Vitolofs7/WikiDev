"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CodeRunner } from "@/code-execution/components/CodeRunner";
import {
  CompactTocBar,
  TableOfContents,
} from "@/documentation/components/TableOfContents";
import {
  Download,
  ArrowLeft,
  ArrowRight,
  ListTree,
  StickyNote,
} from "lucide-react";
import { Callout } from "@/documentation/components/Callout";
import { downloadPdf } from "@/documentation/utils/pdf-export";
import { ReadingProgress } from "@/documentation/components/ReadingProgress";
import { DocBreadcrumbs } from "@/documentation/components/DocBreadcrumbs";
import { DocOutlineDrawer } from "@/documentation/components/DocOutlineDrawer";
import { DocNotesDrawer } from "@/documentation/components/DocNotesDrawer";
import { DocProvider } from "@/documentation/context/DocContext";
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
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesRevision, setNotesRevision] = useState(0);
  const [lessonNotesCount, setLessonNotesCount] = useState(0);

  const notifyNotesChanged = useCallback(() => {
    setNotesRevision((r) => r + 1);
  }, []);

  const openNotesDrawer = useCallback(() => {
    setNotesOpen(true);
  }, []);

  // Atajo Alt+N para abrir/cerrar el panel de apuntes sin chocar con atajos del navegador
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setNotesOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const Content = docs[docKey];
  const { prev: prevDoc, next: nextDoc, position, total } =
    getAdjacentDocs(docKey);
  const crumbs = getBreadcrumbLinks(docKey);
  const parentCrumb = crumbs.length >= 2 ? crumbs[crumbs.length - 2] : null;
  const lessonTitle =
    crumbs[crumbs.length - 1]?.label ?? docKey.split("/").pop() ?? "Lección";

  const docContextValue = useMemo(
    () => ({
      docKey,
      lessonTitle,
      notesRevision,
      notifyNotesChanged,
      openNotesDrawer,
    }),
    [docKey, lessonTitle, notesRevision, notifyNotesChanged, openNotesDrawer],
  );

  if (!Content) return null;

  const secondaryBtn =
    "inline-flex h-9 items-center gap-2 rounded-lg border border-(--border) bg-(--bg-2) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)";

  return (
    <DocProvider value={docContextValue}>
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
              onClick={() => setNotesOpen((prev) => !prev)}
              aria-pressed={notesOpen}
              className={
                notesOpen
                  ? "inline-flex h-9 items-center gap-2 rounded-lg border border-(--accent)/50 bg-(--accent-soft) px-3 text-xs font-medium text-(--text) transition-colors hover:border-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
                  : secondaryBtn
              }
              title="Abrir o cerrar apuntes de esta lección (Alt+N)"
            >
              <StickyNote
                className="h-3.5 w-3.5 text-(--accent-light)"
                aria-hidden="true"
              />
              Apuntes
              {lessonNotesCount > 0 && (
                <span className="rounded-md bg-(--accent-soft) px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-(--accent-light)">
                  {lessonNotesCount}
                </span>
              )}
              <kbd
                translate="no"
                className="hidden rounded border border-(--border) bg-(--bg) px-1.5 py-0.5 font-mono text-[10px] text-(--text-muted) xl:inline"
              >
                Alt&nbsp;N
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setOutlineOpen(true)}
              className={secondaryBtn}
              title="Abrir temario completo del área actual"
            >
              <ListTree
                className="h-3.5 w-3.5 text-(--accent-light)"
                aria-hidden="true"
              />
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
            {notesOpen && <CompactTocBar docKey={docKey} />}
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
                      <span className="text-xs text-(--text-muted)">
                        Anterior
                      </span>
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
                      <span className="text-xs text-(--text-muted)">
                        Siguiente
                      </span>
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

          <TableOfContents docKey={docKey} hidden={notesOpen} />
        </div>

        <DocNotesDrawer
          open={notesOpen}
          onClose={() => setNotesOpen(false)}
          docKey={docKey}
          lessonTitle={lessonTitle}
          notesRevision={notesRevision}
          onNotesCountChange={setLessonNotesCount}
        />

        <DocOutlineDrawer
          open={outlineOpen}
          onClose={() => setOutlineOpen(false)}
          docKey={docKey}
        />
      </div>
    </DocProvider>
  );
}
