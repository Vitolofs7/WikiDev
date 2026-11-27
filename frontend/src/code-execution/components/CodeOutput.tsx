import { CheckCircle2, XCircle, Terminal } from "lucide-react";
import type { ExecutionResult } from "../services/execution.service";

interface CodeOutputProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  error: string | null;
}

export function CodeOutput({ result, isRunning, error }: CodeOutputProps) {
  if (isRunning) {
    return (
      <div className="flex items-center gap-3 p-5">
        <div className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-(--accent-light)"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <span className="font-mono text-sm text-(--text-muted)">
          Ejecutando…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2.5 p-5">
        <XCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-(--error)"
          aria-hidden="true"
        />
        <span className="font-mono text-sm text-(--error)">{error}</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center gap-2.5 p-5 text-(--text-muted)">
        <Terminal className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono text-sm">La salida aparecerá aquí…</span>
      </div>
    );
  }

  return (
    <div className="p-5">
      {result.stdout && (
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-(--success)"
            aria-hidden="true"
          />
          <pre
            className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-(--success)"
            data-code-output="stdout"
          >
            {result.stdout}
          </pre>
        </div>
      )}
      {result.stderr && (
        <div className="mt-2 flex items-start gap-3">
          <XCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-(--error)"
            aria-hidden="true"
          />
          <pre
            className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-(--error)"
            data-code-output="stderr"
          >
            {result.stderr}
          </pre>
        </div>
      )}
      {!result.stdout && !result.stderr && (
        <span className="font-mono text-sm text-(--text-muted)">
          (sin salida)
        </span>
      )}
    </div>
  );
}
