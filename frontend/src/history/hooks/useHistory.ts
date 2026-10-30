/**

ruta: frontend/src/history/hooks/useHistory.ts

* Proporciona un hook personalizado para gestionar el historial de navegación de WikiDev,
* almacenando los documentos visitados en `localStorage` para conservarlos entre sesiones.
* Define la estructura de cada entrada y limita el historial a los cinco documentos más
* recientes. La función `addToHistory` evita duplicados por dirección, actualiza la fecha
* de visita y sitúa el documento al principio de la lista, mientras que `clearHistory`
* elimina todas las entradas almacenadas. Utiliza un estado inicial perezoso para recuperar
* los datos una sola vez y memoriza las funciones de actualización mediante `useCallback`.
* También contempla posibles errores de acceso o persistencia en el almacenamiento local.

**/


'use client'
import { useCallback, useState } from 'react'

export interface HistoryItem {
  href: string
  title: string
  category: string
  visitedAt: number
}

const MAX_ITEMS = 5
const STORAGE_KEY = 'wikidev_history'

function readStoredHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useHistory() {
  // Estado inicial perezoso: localStorage se lee una sola vez, al crear el estado,
  // sin pasar por un efecto que dispare un render adicional.
  const [history, setHistory] = useState<HistoryItem[]>(readStoredHistory)

  // useCallback: identidad estable entre renders, para poder incluirla sin
  // problemas en el array de dependencias de un useEffect en quien la consuma.
  const addToHistory = useCallback((item: Omit<HistoryItem, 'visitedAt'>) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.href !== item.href)
      const next = [{ ...item, visitedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { history, addToHistory, clearHistory }
}