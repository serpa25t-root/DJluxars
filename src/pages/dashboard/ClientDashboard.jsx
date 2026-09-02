import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Calendar, MapPin, Camera, ArrowRight, MessageSquare, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import useColombiaApi from '../../services/colombiaApi'
import { fetchClientBookings } from '../../services/bookings'

const SESSION_TYPES = ['Retrato', 'Bodas', 'Moda', 'Producto', 'Eventos', 'Editorial', 'Familia', 'Paisajes']

const statusBadge = (status) => {
  const s = (status || '').toLowerCase()
  if (s.includes('pendiente')) return 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
  if (s.includes('confirmad') || s.includes('aceptad') || s.includes('finalizad')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
  if (s.includes('rechazad') || s.includes('cancelad')) return 'bg-red-500/10 text-red-400 border-red-500/40'
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-700'
}

const statusLabel = (status) => {
  const s = (status || '').toLowerCase()
  if (s.includes('pendiente')) return 'Pendiente de aprobación'
  if (s.includes('confirmad') || s.includes('aceptad')) return 'Confirmada'
  if (s.includes('rechazad') || s.includes('finalizad')) return status
  return status
}

const formattedDate = (d) => {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

const photographers = [
  { id: 1, name: 'Elena Mora', specialty: 'Retrato • Moda', rating: 4.9, price: 'Desde $150.000', img: 'https://i.pravatar.cc/150?img=5', cover: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop', verified: true },
  { id: 2, name: 'Marc Dubois', specialty: 'Moda • Editorial', rating: 4.8, price: 'Desde $200.000', img: 'https://i.pravatar.cc/150?img=15', cover: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', verified: true },
  { id: 3, name: 'Sofía Reyes', specialty: 'Eventos • Bodas', rating: 4.7, price: 'Desde $180.000', img: 'https://i.pravatar.cc/150?img=9', cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop', verified: true },
  { id: 4, name: 'Javier Ortiz', specialty: 'Editorial • Retrato', rating: 4.9, price: 'Desde $250.000', img: 'https://i.pravatar.cc/150?img=12', cover: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop', verified: true },
]

const inputCls = 'w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-1 focus:ring-red-600/20'

const ClientDashboard = () => {
  const { loading } = useAuth()
  const navigate = useNavigate()
  const { departments, cities, loadingDepartments, loadingCities, loadCities } = useColombiaApi()
  const [departamento, setDepartamento] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [sessionType, setSessionType] = useState('')
  const [date, setDate] = useState('')
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoadingBookings(true)
    fetchClientBookings()
      .then((data) => { if (mounted) setBookings(Array.isArray(data) ? data : []) })
      .catch(() => { if (mounted) setBookings([]) })
      .finally(() => { if (mounted) setLoadingBookings(false) })
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
        Cargando...
      </div>
    )
  }

  const handleDeptChange = (e) => {
    const val = e.target.value
    setDepartamento(val)
    setMunicipio('')
    loadCities(val)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (sessionType) params.set('category', sessionType)
    const loc = municipio || departments.find((d) => String(d.id) === departamento)?.name || ''
    if (loc) params.set('location', loc)
    if (date) params.set('date', date)
    navigate(`/explorar?${params.toString()}`)
  }

  const openChat = (b) => {
    navigate(`/dashboard/mensajes?contactId=${b.photographerId || b.clientId || b.id}&name=${encodeURIComponent(b.photographerName || 'Fotógrafo')}`)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl card-glass p-8 sm:p-10">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 text-red-500/90">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase">Panel Cliente</span>
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
            Encuentra al fotógrafo perfecto para <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent italic">cada historia.</span>
          </h1>
          <p className="mt-3 text-sm text-zinc-400 max-w-xl">Explora talento verificado, compara portafolios y reserva con confianza.</p>
        </div>
      </div>

      {/* Buscador completo */}
      <form onSubmit={handleSearch} className="card-glass p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-400 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-red-500" /> Departamento</label>
            <select value={departamento} onChange={handleDeptChange} disabled={loadingDepartments} className={inputCls}>
              <option value="">{loadingDepartments ? 'Cargando...' : 'Todo el país'}</option>
              {departments.map((d) => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-400 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-red-500" /> Municipio</label>
            <select value={municipio} onChange={(e) => setMunicipio(e.target.value)} disabled={!departamento || loadingCities} className={inputCls}>
              <option value="">{!departamento ? 'Selecciona primero' : loadingCities ? 'Cargando...' : 'Todos los municipios'}</option>
              {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-400 flex items-center gap-1.5"><Camera className="h-3.5 w-3.5 text-red-500" /> Tipo de sesión</label>
            <select value={sessionType} onChange={(e) => setSessionType(e.target.value)} className={inputCls}>
              <option value="">Cualquier sesión</option>
              {SESSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-400 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-red-500" /> Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full btn-neon px-6 py-3 text-sm">
            <Search className="h-4 w-4" /> Buscar Fotógrafos
          </button>
          <Link to="/explorar" className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/60 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            Explorar Todo el Marketplace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </form>

      {/* Reservaciones */}
      <section className="card-glass p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">Reservaciones</h2>
            <p className="mt-1 text-sm text-zinc-400">El estado de tus solicitudes con fotógrafos.</p>
          </div>
          <Link to="/my-bookings" className="text-sm font-medium text-red-500 transition-colors hover:text-red-400">Ver todas &rarr;</Link>
        </div>

        {loadingBookings ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
          </div>
        ) : bookings.filter((b) => b.status !== 'Rechazada' && b.status !== 'Finalizada').length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-800 py-14 text-center">
            <Calendar className="h-8 w-8 text-zinc-600 mx-auto" />
            <p className="mt-3 text-sm font-medium text-white">Aún no tienes reservaciones</p>
            <p className="text-xs text-zinc-500 mt-1">Explora el marketplace y reserva tu primera sesión.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.filter((b) => b.status !== 'Rechazada' && b.status !== 'Finalizada').slice(0, 4).map((b) => (
              <div key={b.id} className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-4 backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <img src={b.photographerAvatar || `https://i.pravatar.cc/100?img=${(Number(b.photographerId) % 70) + 1}`} alt={b.photographerName} className="h-11 w-11 rounded-full object-cover border border-zinc-800" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{b.photographerName}</p>
                    <p className="text-xs text-zinc-400 truncate">{b.service} • {formattedDate(b.date)}</p>
                  </div>
                </div>
                <span className={`shrink-0 w-fit rounded-full px-3 py-1 text-[11px] font-bold tracking-wide border ${statusBadge(b.status)}`}>{statusLabel(b.status)}</span>
                <button
                  onClick={() => openChat(b)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Hablar con el Fotógrafo
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recomendados */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">Fotógrafos recomendados</h2>
          <Link to="/explorar" className="text-sm font-medium text-red-500 transition-colors hover:text-red-400">Ver todos &rarr;</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {photographers.map((p) => (
            <Link key={p.id} to={`/fotografos/${p.id}`} className="group card-glass hover-ring-neon overflow-hidden p-3 transition-all duration-300 hover:scale-105">
              <div className="relative overflow-hidden rounded-2xl">
                <img src={p.cover} alt={p.name} className="aspect-square w-full object-cover border border-zinc-800 transition-transform duration-500 group-hover:scale-110" />
                {p.verified && (
                  <span className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[10px] font-bold text-red-500">✓ Verificado</span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{p.name}</p>
              <p className="text-xs text-zinc-500">{p.specialty}</p>
              <p className="mt-1.5 flex items-center justify-between text-xs text-zinc-400">
                <span>★ {p.rating}</span>
                <span className="font-bold text-white">{p.price}</span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ClientDashboard