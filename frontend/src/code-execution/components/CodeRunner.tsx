"use client";

import { useMemo, useRef, useState } from "react";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  BookmarkPlus,
} from "lucide-react";
import { useCodeExecution } from "../hooks/useCodeExecution";
import { CodeOutput } from "./CodeOutput";
import { TOKEN_CLASSES, tokenizeCode } from "../utils/syntax-highlight";
import { cn } from "@/shared/utils/cn";
import { useAuth } from "@/auth/context/AuthProvider";
import { notesApi } from "@/notes/services/notes.service";
import { useDocContext } from "@/documentation/context/DocContext";

interface CodeRunnerProps {
  initialCode: string;
  language: "javascript" | "python";
  title?: string;
  stdin?: boolean;
}

const LANGUAGE_CONFIG = {
  javascript: { label: "JavaScript" },
  python: { label: "Python" },
};

const EDITOR_METRICS =
  "font-mono text-sm leading-6 sm:text-[15px] sm:leading-[1.625rem] py-4 pr-5 pl-3.5 whitespace-pre";

export function CodeRunner({
  initialCode,
  language,
  title,
  stdin: hasStdin,
}: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode.trim());
  const [stdinValue, setStdinValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [saveNoteError, setSaveNoteError] = useState<string | null>(null);
  const { result, isRunning, error, execute, reset } = useCodeExecution();
  const { user, openAuthModal } = useAuth();
  const docCtx = useDocContext();
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lang = LANGUAGE_CONFIG[language];
  const tokens = useMemo(() => tokenizeCode(code, language), [code, language]);
  const lineCount = useMemo(() => Math.max(code.split("\n").length, 1), [code]);
  const visibleRows = Math.min(Math.max(lineCount + 1, 6), 22);

  const handleRun = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    execute({ language, code, stdin: hasStdin ? stdinValue : undefined });
  };

  const handleReset = () => {
    setCode(initialCode.trim());
    setStdinValue("");
    setSaveNoteError(null);
    reset();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotes = async () => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    if (!code.trim() || savingNote) return;

    setSavingNote(true);
    setSaveNoteError(null);
    try {
      const noteTitle = (
        title
          ? `${title} (${lang.label})`
          : docCtx?.lessonTitle
            ? `${docCtx.lessonTitle} — ${lang.label}`
            : `Código ${lang.label}`
      ).slice(0, 200);

      const sections = [`\`\`\`${language}\n${code.trim()}\n\`\`\``];
      if (result?.stdout?.trim()) {
        sections.push(`Salida:\n\`\`\`\n${result.stdout.trim()}\n\`\`\``);
      }
      if (result?.stderr?.trim()) {
        sections.push(`Error:\n\`\`\`\n${result.stderr.trim()}\n\`\`\``);
      }

      await notesApi.create(
        noteTitle,
        sections.join("\n\n"),
        docCtx?.docKey ?? null,
      );
      docCtx?.notifyNotesChanged();
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 3500);
    } catch (e) {
      setSaveNoteError(
        e instanceof Error ? e.message : "No se pudo guardar en notas",
      );
    } finally {
      setSavingNote(false);
    }
  };

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div
      className="my-7 overflow-hidden rounded-xl border border-(--border-hover) bg-(--bg-2)"
      data-code-runner
    >
      <div className="flex items-center justify-between gap-3 border-b border-(--border) px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            translate="no"
            className="shrink-0 rounded-md bg-(--accent-soft) px-2 py-0.5 font-mono text-xs font-medium text-(--accent-light)"
          >
            {lang.label}
          </span>
          {title && (
            <span className="truncate text-xs font-medium text-(--text-secondary)">
              {title}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Código copiado" : "Copiar código"}
          title="Copiar código"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-(--text-muted) transition-colors hover:bg-(--bg-3) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-(--success)" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Syntax-highlighted editor with synchronized line-number gutter */}
      <div className="flex bg-(--bg-code)">
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none overflow-hidden border-r border-(--border) py-4 pl-3 pr-3 text-right font-mono text-xs leading-6 tabular-nums text-[#4c5e75] sm:text-[13px] sm:leading-[1.625rem]"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <pre
            ref={preRef}
            data-code-highlight
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 m-0 overflow-hidden ${EDITOR_METRICS}`}
          >
            <code>
              {tokens.map((token, idx) => (
                <span key={idx} className={TOKEN_CLASSES[token.type]}>
                  {token.value}
                </span>
              ))}
              {code.endsWith("\n") ? " " : null}
            </code>
          </pre>

          <textarea
            data-code-editor
            aria-label={`Editor de código ${lang.label}${title ? `: ${title}` : ""}`}
            value={code}
            rows={visibleRows}
            wrap="off"
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleEditorScroll}
            className={`relative block w-full resize-y overflow-auto bg-transparent text-transparent caret-(--accent-light) outline-none selection:bg-(--accent)/30 selection:text-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--accent)/50 ${EDITOR_METRICS}`}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
                return;
              }
              if (e.key === "Tab") {
                e.preventDefault();
                const target = e.currentTarget;
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const newCode =
                  code.substring(0, start) + "  " + code.substring(end);
                setCode(newCode);
                setTimeout(() => {
                  target.selectionStart = start + 2;
                  target.selectionEnd = start + 2;
                });
              }
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleRun();
            }}
          />
        </div>
      </div>

      {hasStdin && (
        <div className="border-t border-(--border) bg-(--bg-code)">
          <div className="flex items-center gap-2 px-5 pb-1 pt-3">
            <Terminal className="h-3.5 w-3.5 text-(--text-muted)" aria-hidden="true" />
            <span className="text-xs font-medium text-(--text-muted)">
              Entrada estándar (stdin)
            </span>
          </div>
          <textarea
            aria-label="Entrada estándar (stdin)"
            value={stdinValue}
            onChange={(e) => setStdinValue(e.target.value)}
            placeholder="Escribe aquí la entrada del programa antes de ejecutar…"
            className="w-full resize-none bg-transparent px-5 pb-3 font-mono text-sm leading-relaxed text-(--text-secondary) outline-none placeholder:text-(--text-muted)"
            spellCheck={false}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border) bg-(--bg-2) px-4 py-2.5">
        <span className="text-xs text-(--text-muted)">
          <kbd translate="no" className="font-mono text-[11px] text-(--text-secondary)">Tab</kbd> indenta,{" "}
          <kbd translate="no" className="font-mono text-[11px] text-(--text-secondary)">Esc</kbd> sale,{" "}
          <kbd translate="no" className="font-mono text-[11px] text-(--text-secondary)">Ctrl+Enter</kbd> ejecuta
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {savedNote && docCtx && (
            <button
              type="button"
              onClick={docCtx.openNotesDrawer}
              className="rounded px-2 py-1 text-xs font-medium text-(--accent-light) transition-colors hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
            >
              Ver en apuntes
            </button>
          )}

          <button
            type="button"
            onClick={() => void handleSaveToNotes()}
            disabled={savingNote || !code.trim()}
            title="Guardar este código y su salida en tus apuntes privados"
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)",
              savedNote
                ? "border-(--success)/40 bg-(--success)/10 text-(--success)"
                : "border-(--border) bg-(--bg) text-(--text-secondary) hover:border-(--border-hover) hover:text-(--text) disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {savedNote ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {savingNote
              ? "Guardando…"
              : savedNote
                ? "Guardado"
                : "Guardar en notas"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-(--border) bg-(--bg) px-3 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--border-hover) hover:text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restablecer
          </button>

          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-light)",
              isRunning || !code.trim()
                ? "cursor-not-allowed border border-(--border) bg-(--bg-3) text-(--text-muted)"
                : "bg-(--accent) text-(--accent-fg) hover:bg-(--accent-light)",
            )}
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            {isRunning ? "Ejecutando…" : "Ejecutar"}
          </button>
        </div>
      </div>

      {saveNoteError && (
        <div
          role="alert"
          className="border-t border-(--error)/30 bg-(--error)/10 px-4 py-2 text-xs text-(--error)"
        >
          {saveNoteError}
        </div>
      )}

      <div
        aria-live="polite"
        className="min-h-13 border-t border-(--border) bg-(--bg-code)"
      >
        <CodeOutput result={result} isRunning={isRunning} error={error} />
      </div>
    </div>
  );
}
