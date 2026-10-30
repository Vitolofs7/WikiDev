/**

ruta: frontend/src/history/components/HistoryTracker.tsx

* Registra automáticamente el historial de navegación del usuario en el módulo
* de documentación de WikiDev. Detecta los cambios de ruta, identifica la categoría
* y el documento visitado mediante la configuración de navegación y almacena su
* dirección, título y categoría a través del hook `useHistory`. Comprueba que la
* ruta corresponda a un documento válido antes de registrar la visita y evita
* añadir entradas para páginas que no pertenecen a la estructura documental.
* No renderiza elementos visuales, ya que su función se limita a sincronizar
* la navegación con el historial de documentos consultados.

**/


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
  }, [pathname, addToHistory])

  return null
}