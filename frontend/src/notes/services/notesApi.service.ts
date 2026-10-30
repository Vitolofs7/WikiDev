/**

ruta: frontend/src/notes/services/notesApi.service.ts

* Define los tipos de datos de las notas y sus imágenes asociadas, y centraliza
* las operaciones de comunicación con la API del backend. El objeto `notesApi`
* proporciona métodos para consultar notas con filtros de búsqueda, crear,
* actualizar y eliminar registros, así como gestionar la subida y eliminación
* de imágenes vinculadas a cada nota. También genera las URL necesarias para
* acceder a las imágenes almacenadas. Las peticiones utilizan la dirección base
* configurada mediante la variable de entorno `NEXT_PUBLIC_API_URL`, facilitando
* la conexión entre el frontend y el servicio de notas sin acoplar las operaciones
* a una dirección fija.

**/


const API = `${process.env.NEXT_PUBLIC_API_URL}/api/notes`

export interface NoteImage {
  id: number
  note_id: number
  filename: string
  original_name: string
  created_at: string
}

export interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  images: NoteImage[]
}

export const notesApi = {
  getAll: async (search = ''): Promise<Note[]> => {
    const url = search ? `${API}/?search=${encodeURIComponent(search)}` : `${API}/`
    const res = await fetch(url)
    return res.json()
  },

  create: async (title: string, content = ''): Promise<Note> => {
    const res = await fetch(`${API}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    return res.json()
  },

  update: async (id: number, data: { title?: string; content?: string }): Promise<Note> => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
  },

  uploadImage: async (noteId: number, file: File): Promise<Note> => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${API}/${noteId}/images`, {
      method: 'POST',
      body: form,
    })
    return res.json()
  },

  deleteImage: async (noteId: number, imageId: number): Promise<void> => {
    await fetch(`${API}/${noteId}/images/${imageId}`, { method: 'DELETE' })
  },

  getImageUrl: (filename: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/notes/images/${filename}`
  },
}