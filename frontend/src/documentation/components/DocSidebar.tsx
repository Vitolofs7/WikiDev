"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navConfig } from "@/navigation/config/nav.config";
import { cn } from "@/shared/utils/cn";
import { useHistory } from "@/history/hooks/useHistory";
import { Clock, Search, Home } from "lucide-react";
import { SearchModal } from "@/search/components/SearchModal";

const categoryIcons: Record<string, React.ReactNode> = {
  javascript: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
    </svg>
  ),
  python: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.867s-.109-3.403 3.347-3.403h5.764s3.236.052 3.236-3.13V3.395S18.28 0 11.914 0zm-3.21 1.96a1.042 1.042 0 1 1 0 2.084 1.042 1.042 0 0 1 0-2.083zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.867s.109 3.403-3.347 3.403h-5.764s-3.236-.052-3.236 3.13v5.137S5.72 24 12.086 24zm3.21-1.96a1.042 1.042 0 1 1 0-2.084 1.042 1.042 0 0 1 0 2.083z" />
    </svg>
  ),
  algorithms: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  ),
};

const categoryColors: Record<string, string> = {
  javascript: "#f7df1e",
  python: "#3776ab",
  algorithms: "#a89cf7",
};

export function DocSidebar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { history = [], clearHistory } = useHistory();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <aside
        className="w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-white/5 flex flex-col"
        style={{ background: "#0a0a14" }}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-5 px-2 py-1 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c6dfa, #06d6a0)" }}
            >
              <span className="text-white font-extrabold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                W
              </span>
            </div>
            <span
              className="font-extrabold text-xl text-white"
              style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}
            >
              Wiki
              <span style={{
                background: "linear-gradient(90deg, #7c6dfa, #06d6a0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Dev
              </span>
            </span>
          </Link>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 w-full text-left transition-all group"
            style={{
              background: "#14141f",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Search className="w-5 h-5 text-[#7c6dfa] flex-shrink-0" />
            <span className="flex-1 text-base text-[#52526e]" style={{ fontFamily: "Outfit, sans-serif" }}>
              Buscar...
            </span>
            <kbd
              className="px-2 py-0.5 rounded text-xs bg-[rgba(124,109,250,0.1)] text-[#7c6dfa] border border-[rgba(124,109,250,0.2)]"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Ctrl+K
            </kbd>
          </button>

          {/* Home */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-base transition-all",
              pathname === "/"
                ? "text-white bg-white/8"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5",
            )}
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Inicio</span>
          </Link>

          {/* Divider */}
          <div className="h-px bg-white/5 mb-4" />

          {/* Nav */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {navConfig.categories.map((category) => {
              const isActive = pathname.startsWith(`/docs/${category.slug}`);
              const color = categoryColors[category.slug] || "#a89cf7";
              const icon = categoryIcons[category.slug];

              return (
                <Link
                  key={category.slug}
                  href={`/docs/${category.slug}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all group relative",
                    isActive
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5",
                  )}
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(124,109,250,0.12), rgba(6,214,160,0.04))",
                        border: "1px solid rgba(124,109,250,0.2)",
                      }}
                    />
                  )}
                  <span
                    className="relative z-10 w-5 h-5 flex items-center justify-center flex-shrink-0"
                    style={{ color: isActive ? color : "#52526e" }}
                  >
                    {icon}
                  </span>
                  <span className="relative z-10 font-medium">{category.title}</span>
                  {isActive && (
                    <span className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Recent */}
          {history.length > 0 && (
            <div className="pt-4 border-t border-white/5 mb-4">
              <div className="flex items-center justify-between mb-2 px-2">
                <p
                  className="text-xs font-bold uppercase tracking-widest text-zinc-600"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Recientes
                </p>
                <button
                  onClick={clearHistory}
                  className="text-xs text-zinc-600 hover:text-violet-400 transition-colors"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  limpiar
                </button>
              </div>
              <ul className="space-y-0.5">
                {history.map((item: import("@/history/hooks/useHistory").HistoryItem) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group",
                      pathname === item.href
                        ? "text-white bg-white/5"
                        : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5",
                    )}
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    <Clock className="w-4 h-4 flex-shrink-0 text-zinc-700 group-hover:text-violet-400 transition-colors" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-white/5">
            <p
              className="text-xs text-zinc-700 px-2"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              wikidev v0.1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}