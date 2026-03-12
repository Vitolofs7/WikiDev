'use client'
import { useState, useEffect } from 'react'

export interface HistoryItem {
  href: string
  title: string
  category: string
  visitedAt: number
}

const MAX_ITEMS = 5
const STORAGE_KEY = 'wikidev_history'

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const addToHistory = (item: Omit<HistoryItem, 'visitedAt'>) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.href !== item.href)
      const next = [{ ...item, visitedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const clearHistory = () => {
    setHistory([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return { history, addToHistory, clearHistory }
}