/**

ruta: frontend/src/app/notes/page.tsx

* Gestiona la interfaz principal del módulo de notas, coordinando la búsqueda,
* selección, creación, edición y eliminación de notas mediante el hook useNotes.
* Integra la lista de notas con el editor correspondiente y sincroniza el estado
* de la nota seleccionada tras las operaciones de actualización y gestión de imágenes.
* También proporciona indicadores de carga y una vista inicial cuando no hay
* ninguna nota seleccionada.

**/


'use client'
import { useState } from 'react'
import { useNotes } from '@/notes/hooks/useNotes'
import { NotesList } from '@/notes/components/NotesList'
import { NoteEditor } from '@/notes/components/NoteEditor'
import { Note } from '@/notes/services/notesApi.service'
import { Plus, Search, StickyNote } from 'lucide-react'
import Link from 'next/link'

export default function NotesPage() {
  const {
    notes,
    loading,
    search,
    setSearch,
    createNote,
    updateNote,
    deleteNote,
    uploadImage,
    deleteImage,
  } = useNotes()

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const handleCreate = async () => {
    const note = await createNote('Nueva nota')
    setSelectedNote(note)
  }

  const handleDelete = async (id: number) => {
    await deleteNote(id)
    if (selectedNote?.id === id) setSelectedNote(null)
  }

  const handleUpdate = async (id: number, data: { title?: string; content?: string }) => {
    const updated = await updateNote(id, data)
    if (selectedNote?.id === id) setSelectedNote(updated)
    return updated
  }

  const handleUploadImage = async (noteId: number, file: File) => {
    const updated = await uploadImage(noteId, file)
    if (selectedNote?.id === noteId) setSelectedNote(updated)
    return updated
  }

  const handleDeleteImage = async (noteId: number, imageId: number) => {
    await deleteImage(noteId, imageId)
    if (selectedNote?.id === noteId) {
      setSelectedNote(prev =>
        prev ? { ...prev, images: prev.images.filter(img => img.id !== imageId) } : null
      )
    }
  }

  return (
    <div className="relative -mt-(--navbar-h) flex min-h-screen bg-[#080810]">
      {/* Sidebar */}
      <div className="w-80 shrink-0 border-r border-white/5 flex flex-col bg-[#0a0a14]">
        {/* Header */}
        <div className="px-5 pt-7 pb-5">
          <div className="flex items-center justify-between mb-5">
            <Link href="/" className="flex items-center gap-3">
              <StickyNote className="w-5 h-5 text-violet-400" />
              <span className="text-xl font-bold text-white">
                Notas
              </span>
            </Link>
            <button
              onClick={handleCreate}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar notas..."
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-base text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-violet-500/30 transition-colors"
            />
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : (
            <NotesList
              notes={notes}
              selectedId={selectedNote?.id ?? null}
              onSelect={setSelectedNote}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-sm text-zinc-600">
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </p>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <NoteEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onUploadImage={handleUploadImage}
            onDeleteImage={handleDeleteImage}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-700">
            <StickyNote className="w-14 h-14 mb-5" />
            <p className="text-2xl font-medium text-zinc-500 mb-2">
              Selecciona una nota
            </p>
            <p className="text-base text-zinc-600">
              o crea una nueva con el botón +
            </p>
          </div>
        )}
      </div>
    </div>
  )
}