import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMe } from '../../services/users'
import { getPortfolio, deletePortfolioItem } from '../../services/portfolio'
import { fetchClientBookings } from '../../services/bookings'
import { getFavorites, removeFavorite } from '../../services/favorites'
import { getPlan } from '../../services/subscription'
import EditProfileModal from '../../components/profile/EditProfileModal'
import UploadModal from '../../components/portfolio/UploadModal'
import UpgradeModal from '../../components/subscription/UpgradeModal'

const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center sm:items-start">
    <span className="text-lg font-bold text-white sm:text-xl">{value}</span>
    <span className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">{label}</span>
  </div>
)

const GridTile = ({ item, onOpen, onDelete, deleting, deletingId }) => (
  <article className="group relative aspect-square overflow-hidden bg-zinc-900">
    <button type="button" onClick={() => onOpen(item)} className="block h-full w-full" aria-label={item.title}>
      {item.media_type === 'video' ? (
        <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.26a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ) : (
        <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform" />
      )}
    </button>

    {item.media_type === 'video' && (
      <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white backdrop-blur-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.26a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    )}

    {/* Overlay estilo Instagram */}
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-6 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-white" viewBox="0 0 24 24">
          <path d="M12 21s-7.5-4.7-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2 4.3-9.5 9-9.5 9z" />
        </svg>
        {item.likes ?? 0}
      </span>
      <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {(item.views ?? 0).toLocaleString('es-CO')}
      </span>
    </div>

    {onDelete && (
      <button
        type="button"
        onClick={() => onDelete(item)}
        disabled={deleting && deletingId === item.id}
        className="absolute left-2 top-2 rounded-full bg-black/70 p-1.5 text-zinc-300 opacity-0 backdrop-blur-md transition-opacity hover:bg-red-600 hover:text-white group-hover:opacity-100 disabled:opacity-50"
        aria-label="Eliminar"
      >
        {deleting && deletingId === item.id ? (
          <span className="block h-3.5 w-3.5 rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>
    )}
  </article>
)

const Profile = () => {
  const { user, updateUser } = useAuth()
  const isClient = user?.role === 'client'
  const artistId = user?.id || user?.email || 'anon'

  const [profile, setProfile] = useState(null)
  const [works, setWorks] = useState([])
  const [favorites, setFavorites] = useState([])
  const [bookingsCount, setBookingsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('posts')
  const [editOpen, setEditOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState(null)

  const loadProfile = async () => {
    setLoading(true)
    try {
      const me = await getMe()
      setProfile(me)
      updateUser(me)
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const loadWorks = async () => {
    try {
      const data = await getPortfolio()
      const list = Array.isArray(data) ? data : []
      setWorks(
        list.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.file_url || item.image_url || item.image || item.video_url,
          media_type: item.media_type || (item.video_url ? 'video' : 'imagen'),
          likes: item.likes ?? 0,
          views: item.views ?? 0,
        }))
      )
    } catch {
      setWorks([])
    }
  }

  const loadClientData = async () => {
    setFavorites(getFavorites(artistId))
    try {
      const data = await fetchClientBookings()
      setBookingsCount(Array.isArray(data) ? data.length : 0)
    } catch {
      setBookingsCount(0)
    }
  }

  useEffect(() => {
    loadProfile()
    if (isClient) loadClientData()
    else loadWorks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId, isClient])

  useEffect(() => {
    if (!lightbox) return
    const onEsc = (e) => { if (e.key === 'Escape') setLightbox(null) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [lightbox])

  const data = profile || user || {}
  const displayName = data.name || [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || 'Usuario'
  const username = data.username || data.email?.split('@')[0] || 'usuario'
  const initials = displayName.slice(0, 1).toUpperCase()
  const plan = getPlan(artistId)

  const totals = useMemo(() => {
    const likes = works.reduce((s, w) => s + (Number(w.likes) || 0), 0)
    const views = works.reduce((s, w) => s + (Number(w.views) || 0), 0)
    return { likes, views, works: works.length }
  }, [works])

  const tabs = isClient
    ? [{ id: 'saved', label: 'Guardados' }]
    : [
        { id: 'posts', label: 'Publicaciones' },
        { id: 'videos', label: 'Videos' },
      ]

  const activeTab = isClient ? 'saved' : tab

  const visibleItems = isClient
    ? favorites
    : activeTab === 'videos'
      ? works.filter((w) => w.media_type === 'video')
      : works

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSaved = (updated) => {
    setProfile((prev) => ({ ...(prev || {}), ...updated }))
    updateUser(updated)
    showToast('Perfil actualizado')
  }

  const handlePublished = () => {
    setUploadOpen(false)
    loadWorks()
    showToast('Obra publicada en tu perfil')
  }

  const handleDeleteWork = async (item) => {
    setDeletingId(item.id)
    try {
      await deletePortfolioItem(item.id)
      setWorks((prev) => prev.filter((w) => w.id !== item.id))
    } catch {
      setWorks((prev) => prev.filter((w) => w.id !== item.id))
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteFavorite = (item) => {
    setFavorites(removeFavorite(artistId, item.id))
  }

  return (
    <div className="mx-auto max-w-5xl animate-[fadeIn_300ms_ease-out]">
      {/* Portada */}
      <div className="relative h-40 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 sm:h-56">
        {data.cover_url ? (
          <img src={data.cover_url} alt="Portada" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-zinc-900 via-zinc-950 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-black/10 to-transparent" />
      </div>

      {/* Cabecera de perfil estilo Instagram */}
      <section className="-mt-12 px-4 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative h-28 w-28 shrink-0 rounded-full shadow-2xl shadow-black/60 ring-1 ring-white/15 ring-offset-4 ring-offset-[#070709]">
            <div className="h-full w-full overflow-hidden rounded-full bg-zinc-800">
              {data.avatar_url ? (
                <img src={data.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white/90">{initials}</span>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">{username}</h1>
              {!isClient && plan === 'pro' && (
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-black">PRO</span>
              )}
              <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                {isClient ? 'Cliente' : 'Fotógrafo'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-6 sm:gap-8">
              {isClient ? (
                <>
                  <StatItem value={favorites.length} label="Guardados" />
                  <StatItem value={bookingsCount} label="Reservas" />
                </>
              ) : (
                <>
                  <StatItem value={totals.works} label="Publicaciones" />
                  <StatItem value={totals.likes.toLocaleString('es-CO')} label="Me gusta" />
                  <StatItem value={totals.views.toLocaleString('es-CO')} label="Vistas" />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="rounded-full border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-sm font-semibold text-white hover:border-zinc-700 hover:bg-zinc-800 transition-colors"
            >
              Editar perfil
            </button>
            {!isClient ? (
              <Link
                to={`/fotografos/${user?.id || ''}`}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
              >
                Ver perfil público
              </Link>
            ) : (
              <Link
                to="/dashboard/settings"
                className="rounded-full border border-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
              >
                Configuración
              </Link>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 space-y-1.5">
          <p className="text-sm font-semibold text-white">{displayName}</p>
          {data.bio && <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">{data.bio}</p>}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-zinc-500">
            {[data.ciudad, data.departamento].filter(Boolean).length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {[data.ciudad, data.departamento].filter(Boolean).join(', ')}
              </span>
            )}
            {data.phone_number && <span>{data.phone_number}</span>}
            {data.website && (
              <a href={data.website} target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300 transition-colors">
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-8 flex items-center justify-center gap-10 border-t border-zinc-900">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mt-px border-t-2 px-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === t.id ? 'border-zinc-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grilla estilo Instagram */}
      {loading ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-sm bg-zinc-900" />
          ))}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-white">
            {isClient ? 'Aún no tienes guardados' : 'Aún no hay publicaciones'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {isClient ? 'Guarda los trabajos que te inspiren desde el explorador.' : 'Sube tu primera obra y aparecerá en tu perfil.'}
          </p>
          {!isClient && (
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
            >
              Subir obra
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {!isClient && (
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-600 hover:text-white transition-colors"
              aria-label="Subir nueva obra"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 group-hover:border-zinc-600 group-hover:bg-zinc-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="text-[11px] font-semibold tracking-widest uppercase">Nueva</span>
            </button>
          )}
          {visibleItems.map((item) => (
            <GridTile
              key={item.id}
              item={item}
              onOpen={setLightbox}
              onDelete={isClient ? handleDeleteFavorite : handleDeleteWork}
              deleting={deletingId !== null}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={() => setLightbox(null)}>
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl animate-[scaleIn_250ms_var(--ease-out-expo)_both]"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.media_type === 'video' ? (
              <div className="flex aspect-[4/3] items-center justify-center bg-zinc-900 text-zinc-500">Video: {lightbox.image}</div>
            ) : (
              <img src={lightbox.image} alt={lightbox.title} className="max-h-[70vh] w-full object-contain bg-black" />
            )}
            <div className="flex items-center justify-between gap-4 border-t border-zinc-900 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{lightbox.title}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {lightbox.likes ?? 0} me gusta · {(lightbox.views ?? 0).toLocaleString('es-CO')} vistas
                </p>
              </div>
              <button onClick={() => setLightbox(null)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors" aria-label="Cerrar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-white/15 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white shadow-xl animate-[fadeIn_200ms_ease-out]">
          {toast}
        </div>
      )}

      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} profile={profile || user} onSaved={handleSaved} />
      {!isClient && (
        <>
          <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onPublished={handlePublished} onLimitReached={() => { setUploadOpen(false); setShowUpgrade(true) }} />
          <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} onUpgrade={() => setShowUpgrade(false)} />
        </>
      )}
    </div>
  )
}

export default Profile
