'use client'
import { useState, useEffect, useCallback } from 'react'
import { notesApi, Note } from '@/notes/services/notesApi.service'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await notesApi.getAll(search)
      setNotes(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300)
    return () => clearTimeout(timer)
  }, [fetchNotes])

  const createNote = async (title: string) => {
    const note = await notesApi.create(title)
    setNotes(prev => [note, ...prev])
    return note
  }

  const updateNote = async (id: number, data: { title?: string; content?: string }) => {
    const updated = await notesApi.update(id, data)
    setNotes(prev => prev.map(n => n.id === id ? updated : n))
    return updated
  }

  const deleteNote = async (id: number) => {
    await notesApi.delete(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const uploadImage = async (noteId: number, file: File) => {
    const updated = await notesApi.uploadImage(noteId, file)
    setNotes(prev => prev.map(n => n.id === noteId ? updated : n))
    return updated
  }

  const deleteImage = async (noteId: number, imageId: number) => {
    await notesApi.deleteImage(noteId, imageId)
    setNotes(prev => prev.map(n =>
      n.id === noteId
        ? { ...n, images: n.images.filter(img => img.id !== imageId) }
        : n
    ))
  }

  return {
    notes,
    loading,
    search,
    setSearch,
    createNote,
    updateNote,
    deleteNote,
    uploadImage,
    deleteImage,
    fetchNotes,
  }
}