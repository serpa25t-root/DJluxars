import { useState, useEffect } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { checkCanUpload } from '../../services/subscription'
import { createPortfolioItem } from '../../services/portfolio'

const categories = ['Retrato', 'Editorial', 'Eventos', 'Moda', 'Arquitectura']

const UploadModal = ({ isOpen, onClose, onPublished, onLimitReached }) => {
  const { user } = useAuth()
  const artistId = user?.id || user?.email || 'anon'
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
    if (!isOpen) {
      setForm({ title: '', category: 'Retrato', type: 'imagen', description: '', equipment: '', url: '' })
      setFile(null)
      setPreview(null)
      setToast(null)
    }
  }, [isOpen])

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreview(null)
    }
  }, [file])

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
    if (form.type === 'imagen' && !file) {
      setToast({ msg: 'Selecciona una imagen para subir.', type: 'error' })
      return
    }
    if (form.type === 'video' && !form.url.trim()) {
      setToast({ msg: 'Pega el enlace del video.', type: 'error' })
      return
    }
    const check = checkCanUpload(artistId, form.type)
    if (!check.allowed) {
      setToast({ msg: check.message, type: 'error' })
      setTimeout(() => {
        onClose()
        onLimitReached?.()
      }, 1000)
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
      if (form.type === 'imagen' && file) fd.append('image', file)
      if (form.type === 'video') fd.append('video_url', form.url)
      if (form.type === 'imagen' && file) fd.append('file', file)

      // Usa servicio real con parsers multipart
      try {
        await createPortfolioItem(fd)
      } catch (err) {
        if (err?.response?.status === 404) {
          await api.post('works/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        } else {
          throw err
        }
      }

      setToast({ msg: 'Obra publicada con éxito.', type: 'success' })
      setTimeout(() => {
        onPublished?.({
          id: Date.now(),
          title: form.title,
          category: form.category,
          image: preview || 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
          likes: 0,
          views: 0,
          type: form.type,
          media_type: form.type,
        })
        onClose()
      }, 600)
    } catch (err) {
      if (err?.response?.status === 400) {
        const data = err.response.data
        const msgLow = JSON.stringify(data).toLowerCase()
        if (msgLow.includes('límite') || msgLow.includes('limite') || msgLow.includes('quota') || msgLow.includes('plan')) {
          setToast({ msg: 'Has alcanzado el límite de tu Plan Free.', type: 'error' })
          setTimeout(() => {
            onClose()
            onLimitReached?.()
          }, 900)
          return
        }
      }
      const data = err?.response?.data
      let msg = 'No se pudo publicar. Verifica los datos.'
      if (data) {
        if (typeof data === 'string') msg = data
        else if (data.detail) msg = data.detail
        else {
          const k = Object.keys(data)[0]
          if (k) msg = Array.isArray(data[k]) ? data[k][0] : String(data[k])
        }
      } else if (!err?.response) {
        msg = 'No se encontró el servicio en el servidor. Verifica las rutas de la API.'
      }
      setToast({ msg, type: 'error' })
    } finally {
      setLoading(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 flex flex-col animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <h2 className="font-display text-lg font-bold text-white">Subir Nueva Obra</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4">
          <Input label="Título de la obra" id="title" placeholder="Atardecer en Cartagena" value={form.title} onChange={handleChange} required />

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
              <label className="block text-xs font-medium tracking-wide text-zinc-300">Archivo</label>
              <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-6 hover:border-red-600/30 hover:bg-zinc-900/60 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-sm text-zinc-400">Arrastra o haz clic para subir</span>
                    <span className="text-xs text-zinc-500">PNG, JPG hasta 10MB</span>
                  </>
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
            {loading ? 'Publicando...' : 'Publicar en Portafolio'}
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

export default UploadModal
