"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { cn } from "@/shared/utils/cn";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, results, search, clear } = useSearch();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    } else {
      clear();
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? onClose() : null;
      }
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown")
        setSelected((s) => Math.min(s + 1, results.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && results[selected]) {
        router.push(results[selected].href);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, selected]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#0e0e1a",
          border: "1px solid rgba(124,109,250,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-4 px-5 py-5 border-b border-white/5">
          <Search className="w-5 h-5 text-violet-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              search(e.target.value);
              setSelected(0);
            }}
            placeholder="Buscar documentación..."
            className="flex-1 bg-transparent text-white text-base outline-none placeholder-zinc-600"
            style={{ fontFamily: "Outfit, sans-serif" }}
          />
          {query && (
            <button
              onClick={clear}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map((result, i) => (
              <li key={result.href}>
                <button
                  onClick={() => {
                    router.push(result.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelected(i)}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors",
                    selected === i ? "bg-violet-500/10" : "hover:bg-white/5",
                  )}
                >
                  <span className="text-xl flex-shrink-0">
                    {result.categoryEmoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-base text-white font-medium truncate"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {result.title}
                    </p>
                    <p
                      className="text-sm text-zinc-600"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {result.category}
                    </p>
                  </div>
                  {selected === i && (
                    <ArrowRight className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p
              className="text-zinc-600 text-base"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              No se encontraron resultados para{" "}
              <span className="text-zinc-400">"{query}"</span>
            </p>
          </div>
        )}

        {/* Footer */}
        {!query && (
          <div className="px-5 py-3.5 border-t border-white/5 flex items-center gap-5">
            <span
              className="flex items-center gap-1.5 text-xs text-zinc-500"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              <kbd className="px-2 py-0.5 rounded text-xs bg-[rgba(124,109,250,0.1)] text-[#7c6dfa] border border-[rgba(124,109,250,0.2)]">
                ↑↓
              </kbd>
              navegar
            </span>
            <span
              className="flex items-center gap-1.5 text-xs text-zinc-500"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              <kbd className="px-2 py-0.5 rounded text-xs bg-[rgba(124,109,250,0.1)] text-[#7c6dfa] border border-[rgba(124,109,250,0.2)]">
                ↵
              </kbd>
              abrir
            </span>
            <span
              className="flex items-center gap-1.5 text-xs text-zinc-500"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              <kbd className="px-2 py-0.5 rounded text-xs bg-[rgba(124,109,250,0.1)] text-[#7c6dfa] border border-[rgba(124,109,250,0.2)]">
                Esc
              </kbd>
              cerrar
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
