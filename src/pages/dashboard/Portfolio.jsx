import { useState, useEffect } from 'react'
import Button from '../../components/common/Button'
import UploadModal from '../../components/portfolio/UploadModal'
import UpgradeModal from '../../components/subscription/UpgradeModal'
import { getUsage, getLimits, getPlan, incrementUsage, upgradeToPro, setUsage as setSubUsage } from '../../services/subscription'
import { useAuth } from '../../context/AuthContext'
import { getPortfolio, deletePortfolioItem } from '../../services/portfolio'

const mockFallback = [
  {
    id: 1,
    title: 'Luz de Neón',
    category: 'Editorial',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
    file_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
    likes: 128,
    views: 3420,
    media_type: 'imagen',
  },
  {
    id: 2,
    title: 'Retrato en Sombra',
    category: 'Retrato',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop',
    file_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop',
    likes: 89,
    views: 2103,
    media_type: 'imagen',
  },
]

const Portfolio = () => {
  const { user } = useAuth()
  const artistId = user?.id || user?.email || 'anon'
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [usage, setUsage] = useState(getUsage(artistId))
  const [plan, setPlan] = useState(getPlan(artistId))
  const limits = getLimits(artistId)

  const syncUsageFromWorks = (list) => {
    const photos = list.filter((w) => (w.media_type || 'imagen') !== 'video').length
    const videos = list.filter((w) => w.media_type === 'video').length
    const current = getUsage(artistId)
    const next = { ...current, photos, videos }
    // Mantén services como está (viene de bookings), solo sincroniza media
    setUsage(next)
    setSubUsage(artistId, next)
  }

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const data = await getPortfolio()
      const list = Array.isArray(data) ? data : []
      const normalized = list.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.file_url || item.image || item.file || item.video_url || 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
        file_url: item.file_url || item.image,
        likes: item.likes ?? 0,
        views: item.views ?? 0,
        media_type: item.media_type || (item.video_url ? 'video' : 'imagen'),
      }))
      setWorks(normalized)
      syncUsageFromWorks(normalized)
    } catch {
      // Fallback demo si backend no responde
      setWorks(mockFallback)
      syncUsageFromWorks(mockFallback)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks()
    setPlan(getPlan(artistId))
  }, [artistId])

  const handleOpenUpload = () => {
    setOpen(true)
  }

  const handlePublished = (newWork) => {
    // El modal ya hizo POST real; aquí solo sincronizamos UI y cuotas
    const enriched = {
      id: newWork.id || Date.now(),
      title: newWork.title,
      category: newWork.category,
      image: newWork.image || newWork.file_url,
      file_url: newWork.image || newWork.file_url,
      likes: 0,
      views: 0,
      media_type: newWork.media_type || newWork.type || 'imagen',
    }
    setWorks((p) => [enriched, ...p])
    const type = enriched.media_type === 'video' ? 'video' : 'imagen'
    incrementUsage(artistId, type)
    setUsage(getUsage(artistId))
  }

  const handleQuotaError = () => {
    setOpen(false)
    setShowUpgrade(true)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deletePortfolioItem(id)
      const next = works.filter((w) => w.id !== id)
      setWorks(next)
      syncUsageFromWorks(next)
    } catch {
      // Fallback demo: elimina local aunque API falle
      const next = works.filter((w) => w.id !== id)
      setWorks(next)
      syncUsageFromWorks(next)
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpgrade = () => {
    upgradeToPro(artistId)
    setPlan('pro')
    setUsage(getUsage(artistId))
    setShowUpgrade(false)
  }

  const bar = (current, max) => Math.min(100, Math.round((current / max) * 100))

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-black to-black" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-red-600/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-900 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-400">DASHBOARD • CREADOR {plan === 'pro' && <span className="ml-2 inline-flex items-center rounded-full bg-amber-500 text-black px-2 py-0.5 text-[10px] font-bold tracking-widest">PRO</span>}</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
              Mi Portafolio <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Creador</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">Gestiona tus obras con acabado cinematográfico. Cada imagen cuenta una historia.</p>
          </div>
          <Button variant="primary" className="self-start sm:self-auto shadow-lg shadow-red-600/20" onClick={handleOpenUpload}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Subir Nueva Obra
          </Button>
        </div>

        {/* Indicador de consumo sincronizado con backend */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Fotos', current: usage.photos, max: limits.photos },
            { label: 'Videos', current: usage.videos, max: limits.videos },
            { label: 'Servicios Activos', current: usage.services, max: limits.services },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-widest text-zinc-400">{item.label}</p>
                <p className="text-xs font-bold text-white">{item.current}/{item.max}</p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-900 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.current >= item.max ? 'bg-red-600' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                  style={{ width: `${bar(item.current, item.max)}%` }}
                />
              </div>
              {item.current >= item.max && <p className="mt-1 text-[11px] text-red-400">Límite alcanzado</p>}
            </div>
          ))}
        </div>

        {/* Grilla con spinners */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
            <p className="mt-4 text-sm text-zinc-400">Cargando portafolio...</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-3 gap-1 sm:gap-2">
            <button
              type="button"
              onClick={handleOpenUpload}
              className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-red-600/40 hover:text-white transition-colors"
              aria-label="Subir nueva obra"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 group-hover:border-red-600/50 group-hover:bg-red-600/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="text-[11px] font-semibold tracking-widest uppercase">Nueva</span>
            </button>

            {works.map((w) => (
              <article
                key={w.id}
                className="group relative aspect-square overflow-hidden bg-zinc-900"
              >
                {w.media_type === 'video' ? (
                  <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.26a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ) : (
                  <img src={w.image} alt={w.title} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform" loading="lazy" />
                )}

                <span className="absolute left-2 top-2 rounded-full border border-red-600/30 bg-red-600/15 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-200">
                  {w.category}
                </span>

                <button
                  onClick={() => handleDelete(w.id)}
                  disabled={deletingId === w.id}
                  className="absolute right-2 top-2 rounded-full bg-black/70 backdrop-blur-md p-1.5 text-zinc-300 hover:bg-red-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label="Eliminar obra"
                >
                  {deletingId === w.id ? (
                    <span className="h-3.5 w-3.5 block rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>

                {/* Overlay estilo Instagram */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-6">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                        <path d="M12 21s-7.5-4.7-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2 4.3-9.5 9-9.5 9z" />
                      </svg>
                      {w.likes}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {w.views.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[90%] truncate text-xs font-medium text-zinc-200">{w.title}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && works.length === 0 && (
          <div className="mt-16 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 py-16">
            <p className="text-sm text-zinc-400">Aún no tienes obras. Sube tu primera historia visual.</p>
          </div>
        )}
      </div>

      <UploadModal isOpen={open} onClose={() => setOpen(false)} onPublished={handlePublished} onLimitReached={() => setShowUpgrade(true)} />
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} onUpgrade={() => { upgradeToPro(artistId); setPlan('pro'); setUsage(getUsage(artistId)); setShowUpgrade(false)}} />
    </div>
  )
}

export default Portfolio
