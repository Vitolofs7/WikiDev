/**
* Renderiza una lista de notas y permite seleccionar una para su edición.
* Muestra el título, una vista previa del contenido, la fecha de última
* actualización y, cuando existen, el número de imágenes asociadas. Destaca
* visualmente la nota seleccionada para facilitar su identificación y presenta
* un estado vacío cuando no hay notas disponibles. Recibe la colección de notas,
* el identificador de la selección actual y la función de selección mediante
* sus propiedades. Utiliza la utilidad `cn` para combinar dinámicamente las
* clases CSS según el estado de cada elemento.

*/


'use client'
import { Note } from '@/notes/services/notes.service'
import { cn } from '@/shared/utils/cn'
import { FileText, ImageIcon } from 'lucide-react'

interface Props {
  notes: Note[]
  selectedId: number | null
  onSelect: (note: Note) => void
}

export function NotesList({ notes, selectedId, onSelect }: Props) {
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-zinc-700">
        <FileText className="w-10 h-10 mb-2" />
        <p className="text-base">
          No hay notas
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-1 px-2">
      {notes.map(note => (
        <li key={note.id}>
          <button
            onClick={() => onSelect(note)}
            className={cn(
              'w-full text-left px-3 py-3 rounded-xl transition-all',
              selectedId === note.id
                ? 'bg-violet-500/10 border border-violet-500/20'
                : 'hover:bg-white/5 border border-transparent'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p
                className={cn(
                  'text-base font-medium truncate',
                  selectedId === note.id ? 'text-white' : 'text-zinc-300'
                )}
              >
                {note.title || 'Sin título'}
              </p>
              {note.images.length > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  <ImageIcon className="w-4 h-4 text-zinc-600" />
                  <span className="text-xs text-zinc-600">{note.images.length}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-zinc-600 mt-0.5 truncate">
              {note.content ? note.content.slice(0, 60) + (note.content.length > 60 ? '...' : '') : 'Sin contenido'}
            </p>
            <p className="text-xs text-zinc-700 mt-1">
              {formatDate(note.updated_at)}
            </p>
          </button>
        </li>
      ))}
    </ul>
  )
}