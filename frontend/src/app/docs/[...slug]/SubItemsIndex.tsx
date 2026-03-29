'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'

interface SubItem {
  title: string
  slug: string
}

interface Props {
  title: string
  category: string
  page: string
  subItems: SubItem[]
}

export function SubItemsIndex({ title, category, page, subItems }: Props) {
  const [filter, setFilter] = useState('')

  const filtered = subItems.filter(sub =>
    sub.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 pb-8 border-b border-white/5">
        <h1
          className="text-6xl font-extrabold text-white mb-4 tracking-tight"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {title}
        </h1>
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: "rgba(124,109,250,0.1)",
              color: "#a89cf7",
              border: "1px solid rgba(124,109,250,0.2)",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {subItems.length} apartados
          </span>
        </div>
      </div>

      {/* Filter — solo si hay más de 6 */}
      {subItems.length > 6 && (
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filtrar apartados..."
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-base text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-violet-500/30 transition-colors"
            style={{ fontFamily: "Outfit, sans-serif" }}
          />
          {filter && (
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Grid 2 columnas */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((sub) => {
            const originalIndex = subItems.findIndex(s => s.slug === sub.slug)
            return (
              <a
                key={sub.slug}
                href={`/docs/${category}/${page}/${sub.slug}`}
                className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,109,250,0.15), rgba(6,214,160,0.1))",
                    border: "1px solid rgba(124,109,250,0.2)",
                    color: "#a89cf7",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {String(originalIndex + 1).padStart(2, "0")}
                </div>
                <p
                  className="flex-1 text-base text-zinc-300 group-hover:text-white transition-colors leading-snug"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {sub.title}
                </p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 text-sm"
                  style={{ background: "rgba(124,109,250,0.15)", color: "#a89cf7" }}
                >
                  →
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-zinc-600 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
            No se encontraron apartados para{" "}
            <span className="text-zinc-400">"{filter}"</span>
          </p>
        </div>
      )}
    </div>
  )
}