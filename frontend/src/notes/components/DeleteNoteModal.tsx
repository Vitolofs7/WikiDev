'use client'
import { Trash2 } from 'lucide-react'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteNoteModal({ onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: '#0e0e1a',
          border: '1px solid rgba(124,109,250,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Eliminar nota
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Esta acción no se puede deshacer
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-base text-zinc-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
            ¿Estás seguro de que quieres eliminar esta nota? Se perderá todo su contenido e imágenes.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-base text-zinc-400 bg-white/5 hover:bg-white/10 transition-all"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-base text-white transition-all"
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            <span style={{ fontFamily: 'Outfit, sans-serif' }}>Eliminar nota</span>
          </button>
        </div>
      </div>
    </div>
  )
}