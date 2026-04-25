"use client";
import { useState } from "react";
import { Play, RotateCcw, Copy, Check, Terminal } from "lucide-react";
import { useCodeExecution } from "../hooks/useCodeExecution";
import { CodeOutput } from "./CodeOutput";
import { cn } from "@/shared/utils/cn";

interface CodeRunnerProps {
  initialCode: string;
  language: "javascript" | "python";
  title?: string;
  stdin?: boolean;
}

const LANGUAGE_CONFIG = {
  javascript: {
    label: "JavaScript",
    badge: "bg-yellow-300/10 border-yellow-300/20 text-yellow-300",
  },
  python: {
    label: "Python",
    badge: "bg-blue-300/10 border-blue-300/20 text-blue-300",
  },
};

export function CodeRunner({
  initialCode,
  language,
  title,
  stdin: hasStdin,
}: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode.trim());
  const [stdinValue, setStdinValue] = useState("");
  const [copied, setCopied] = useState(false);
  const { result, isRunning, error, execute, reset } = useCodeExecution();
  const lang = LANGUAGE_CONFIG[language];

  const handleRun = () => {
    execute({ language, code, stdin: hasStdin ? stdinValue : undefined });
  };
  const handleReset = () => {
    setCode(initialCode.trim());
    setStdinValue("");
    reset();
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden my-8 shadow-2xl"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: "#0e0e1a",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span
            className={cn(
              "text-sm font-medium px-2.5 py-0.5 rounded-md border",
              lang.badge,
            )}
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {lang.label}
          </span>
          {title && (
            <span
              className="text-zinc-600 text-sm"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all"
            title="Copiar"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ background: "#080810" }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-transparent text-zinc-300 text-base p-6 resize-none outline-none min-h-[160px] leading-relaxed"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.currentTarget.selectionStart;
              const end = e.currentTarget.selectionEnd;
              const newCode =
                code.substring(0, start) + "  " + code.substring(end);
              setCode(newCode);
              setTimeout(() => {
                e.currentTarget.selectionStart = start + 2;
                e.currentTarget.selectionEnd = start + 2;
              });
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleRun();
          }}
        />
      </div>

      {/* Stdin — solo si el CodeRunner lo requiere */}
      {hasStdin && (
        <div
          style={{
            background: "#080810",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-2 px-6 pt-3 pb-1">
            <Terminal className="w-3.5 h-3.5 text-zinc-600" />
            <span
              className="text-xs text-zinc-600 uppercase tracking-widest font-bold"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Entrada (stdin)
            </span>
          </div>
          <textarea
            value={stdinValue}
            onChange={(e) => setStdinValue(e.target.value)}
            placeholder="Escribe aquí la entrada del programa antes de ejecutar..."
            className="w-full bg-transparent text-zinc-400 text-sm px-6 pb-2 resize-none outline-none leading-relaxed"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              minHeight: "60px",
            }}
            spellCheck={false}
          />
          {!stdinValue.trim() && (
            <p
              className="px-6 pb-3 text-xs text-amber-500/70"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              ⚠ Escribe la entrada antes de ejecutar para evitar errores
            </p>
          )}
        </div>
      )}

      {/* Footer / Run bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: "#0e0e1a",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span
          className="text-zinc-700 text-sm"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          Ctrl+Enter para ejecutar
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 transition-all"
            style={{
              fontFamily: "Outfit, sans-serif",
              background: "#14141f",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all",
              isRunning || !code.trim()
                ? "text-zinc-600 cursor-not-allowed"
                : "text-white hover:scale-105",
            )}
            style={
              !isRunning && code.trim()
                ? {
                    fontFamily: "Outfit, sans-serif",
                    background: "linear-gradient(135deg, #7c6dfa, #06d6a0)",
                    boxShadow: "0 4px 20px rgba(124,109,250,0.3)",
                  }
                : {
                    fontFamily: "Outfit, sans-serif",
                    background: "#14141f",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Ejecutando..." : "Ejecutar"}
          </button>
        </div>
      </div>

      {/* Output */}
      <div
        style={{
          background: "#06060e",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          minHeight: "60px",
        }}
      >
        <CodeOutput result={result} isRunning={isRunning} error={error} />
      </div>
    </div>
  );
}