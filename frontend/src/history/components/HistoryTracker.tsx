'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useHistory } from '../hooks/useHistory'
import { navConfig } from '@/navigation/config/nav.config'

export function HistoryTracker() {
  const pathname = usePathname()
  const { addToHistory } = useHistory()

  useEffect(() => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts[0] !== 'docs' || parts.length < 3) return

    const [, category, slug] = parts
    const cat = navConfig.categories.find((c) => c.slug === category)
    const item = cat?.items.find((i) => i.slug === slug)
    if (!cat || !item) return

    addToHistory({
      href: pathname,
      title: item.title,
      category: cat.title,
    })
  }, [pathname])

  return null
}