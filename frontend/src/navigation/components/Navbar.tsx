"use client";
import Link from "next/link";
import { Code2, Search, StickyNote } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#0e0e1a] border-b border-[rgba(124,109,250,0.15)]">
      <div className="flex items-center justify-center gap-8 h-20 px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#7c6dfa] to-[#06d6a0]">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span
            className="font-extrabold text-2xl text-white tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Wiki
            <span className="bg-gradient-to-r from-[#7c6dfa] to-[#06d6a0] bg-clip-text text-transparent">
              Dev
            </span>
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10" />

        {/* Notes link */}
        <Link
          href="/notes"
          className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#14141f] border border-white/10 hover:border-[#7c6dfa]/50 transition-all"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <StickyNote className="w-5 h-5 flex-shrink-0 text-[#7c6dfa]" />
          <span className="text-base text-[#52526e]">Notas</span>
        </Link>

        {/* Search */}
        <button
          className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#14141f] border border-white/10 hover:border-[#7c6dfa]/50 transition-all w-[440px]"
          aria-label="Buscar documentación"
        >
          <Search className="w-5 h-5 flex-shrink-0 text-[#7c6dfa]" />
          <span
            className="flex-1 text-left text-base text-[#52526e]"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Buscar documentación...
          </span>
          <kbd
            className="px-2 py-0.5 rounded text-xs bg-[rgba(124,109,250,0.1)] text-[#7c6dfa] border border-[rgba(124,109,250,0.2)]"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Ctrl+K
          </kbd>
        </button>
      </div>
    </header>
  );
}
