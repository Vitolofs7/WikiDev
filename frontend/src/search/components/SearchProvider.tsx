/**

ruta: frontend/src/search/components/SearchProvider.tsx

* Proporciona un contexto global para controlar la apertura del modal de búsqueda
* en la aplicación. Mantiene el estado de visibilidad del buscador y registra un
* manejador de teclado que permite abrirlo mediante el atajo Ctrl+K o Cmd+K,
* evitando el comportamiento predeterminado del navegador. Renderiza los componentes
* hijos junto con `SearchModal`, al que transmite el estado de apertura y la función
* para cerrarlo. Gestiona el registro y la limpieza del evento de teclado durante
* el ciclo de vida del componente, permitiendo acceder a la búsqueda desde cualquier
* sección envuelta por este proveedor.

**/


'use client'
import { useState, useEffect } from 'react'
import { SearchModal } from './SearchModal'

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {children}
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}