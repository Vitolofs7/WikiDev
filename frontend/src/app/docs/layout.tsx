/**
* Define la estructura principal de las páginas de documentación, integrando la barra
* lateral de navegación con el área de contenido. Recibe los componentes secundarios
* mediante la propiedad `children` y organiza ambos elementos mediante un diseño flexible
* que garantiza la correcta distribución del espacio disponible en la interfaz.

*/
'use client'
import { DocSidebar } from '@/documentation/components/DocSidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DocSidebar />
      <div className="flex-1 min-w-0 py-10 px-20 text-lg">
        {children}
      </div>
    </div>
  )
}