import { useState, useCallback } from 'react'
import Fuse from 'fuse.js'
import { navConfig } from '@/navigation/config/nav.config'

export interface SearchResult {
  title: string
  category: string
  categoryEmoji: string
  slug: string
  href: string
}

const searchItems: SearchResult[] = navConfig.categories.flatMap((cat) =>
  cat.items.map((item) => ({
    title: item.title,
    category: cat.title,
    categoryEmoji: cat.emoji,
    slug: item.slug,
    href: `/docs/${cat.slug}/${item.slug}`,
  }))
)

const fuse = new Fuse(searchItems, {
  keys: ['title', 'category'],
  threshold: 0.4,
})

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  const search = useCallback((q: string) => {
    setQuery(q)
    if (!q.trim()) {
      setResults([])
      return
    }
    setResults(fuse.search(q).map((r) => r.item))
  }, [])

  const clear = useCallback(() => {
    setQuery('')
    setResults([])
  }, [])

  return { query, results, search, clear }
}