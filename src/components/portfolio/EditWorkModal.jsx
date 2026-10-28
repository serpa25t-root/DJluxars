import { useState, useEffect } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import apiClient from '../../services/apiClient'
import { updatePortfolioItem } from '../../services/portfolioApi'

const categories = ['Retrato', 'Editorial', 'Eventos', 'Moda', 'Arquitectura']

const EditWorkModal = ({ isOpen, onClose, work, onSaved }) => {
  const [form, setForm] = useState({
    title: '',
    category: 'Retrato',
    type: 'imagen',
    description: '',
    equipment: '',
    url: '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!isOpen || !work) return
    setForm({
      title: work.title || '',
      category: work.category || 'Retrato',
      type: work.media_type || (work.video_url ? 'video' : 'imagen'),
      description: work.description || '',
      equipment: work.equipment || '',
      url: work.video_url || work.videoUrl || '',
    })
    setFile(null)
    setPreview(work.image || work.file_url || null)
    setToast(null)
  }, [isOpen, work])

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  useEffect(() => {
    if (!isOpen) return
    const onEsc = (e) => { if (e.key === 'Escape' && !loading) onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [isOpen, loading, onClose])

  if (!isOpen || !work) return null

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setToast({ msg: 'Ponle un título a tu obra.', type: 'error' })
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('category', form.category)
      fd.append('media_type', form.type)
      fd.append('description', form.description)
      fd.append('equipment', form.equipment)
      if (form.type === 'video') fd.append('video_url', form.url)
      if (file) {
        fd.append('image', file)
        fd.append('file', file)
      }
      const saved = await updatePortfolioItem(work.id, fd)
      setToast({ msg: 'Obra actualizada.', type: 'success' })
      setTimeout(() => {
        onSaved?.(saved)
        onClose()
      }, 600)
    } catch (err) {
      const data = err?.response?.data
      let msg = 'No se pudo actualizar la obra.'
      if (data) {
        if (typeof data === 'string') msg = data
        else if (data.detail) msg = data.detail
        else {
          const k = Object.keys(data)[0]
          if (k) msg = Array.isArray(data[k]) ? data[k][0] : String(data[k])
        }
      }
      setToast({ msg, type: 'error' })
    } finally {
      setLoading(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !loading && onClose()} aria-hidden="true" />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 flex flex-col animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <h2 className="font-display text-lg font-bold text-white">Editar Obra</h2>
          <button onClick={onClose} disabled={loading} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors disabled:opacity-50" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4">
          <Input label="Título de la obra" id="title" value={form.title} onChange={handleChange} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300">Categoría</label>
              <select
                id="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900">{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300">Tipo de archivo</label>
              <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/40 p-1">
                {['imagen', 'video'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-all duration-150 ${form.type === t ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {t === 'imagen' ? 'Imagen' : 'Enlace de Video'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {form.type === 'imagen' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300">Archivo (opcional, reemplaza el actual)</label>
              <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-6 hover:border-red-600/30 hover:bg-zinc-900/60 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <span className="text-sm text-zinc-400">Haz clic para cambiar la imagen</span>
                )}
              </label>
            </div>
          ) : (
            <Input label="URL del video" id="url" placeholder="https://youtube.com/watch?v=..." value={form.url} onChange={handleChange} />
          )}

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-medium tracking-wide text-zinc-300">Descripción</label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Cuenta la historia detrás de la imagen..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 resize-none"
            />
          </div>

          <Input label="Equipo utilizado" id="equipment" placeholder="Canon EOS R5, 85mm f/1.4" value={form.equipment} onChange={handleChange} />

          <Button type="submit" variant="primary" disabled={loading} className="w-full py-3.5 text-[15px] shadow-lg shadow-red-600/20 disabled:opacity-60">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>

        {toast && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border px-4 py-2 text-sm font-medium shadow-xl ${toast.type === 'success' ? 'border-red-600/30 bg-zinc-900 text-white' : 'border-amber-500/30 bg-zinc-900 text-amber-200'}`} role="alert">
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}

export default EditWorkModal
