import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, CheckCircle2, Percent, ArrowRight, MessageSquare, Check, X, Briefcase, Eye, Loader2, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchArtistBookings, acceptBooking, rejectBooking } from '../../services/bookings'

const TABS = [
  { id: 'pendiente', label: 'Pendientes', value: 'Pendiente' },
  { id: 'confirmada', label: 'Confirmadas', value: 'Confirmada' },
  { id: 'completada', label: 'Completadas', value: 'Completada' },
]

const ArtistDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Pendiente')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchArtistBookings()
        setBookings(Array.isArray(data) ? data : [])
      } catch {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return bookings.filter((b) => norm(b.status) === norm(activeTab))
  }, [bookings, activeTab])

  const metrics = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const confirmed = bookings.filter((b) => b.status?.toLowerCase().includes('confirmada'))
    const monthConfirmed = confirmed.filter((b) => {
      const d = new Date(b.date || b.createdAt)
      return d.getMonth() === month && d.getFullYear() === year
    })
    const ingresos = monthConfirmed.reduce((sum, b) => sum + (Number(b.artist_payout ?? b.price ?? 0)), 0)
    const total = bookings.length || 1
    const tasa = Math.round((confirmed.length / total) * 100)
    return {
      ingresos,
      confirmadas: confirmed.length,
      tasa,
    }
  }, [bookings])

  const formatCOP = (v) => `$${Number(v).toLocaleString('es-CO')} COP`
  const formatDate = (d) => {
    if (!d) return '—'
    try {
      const date = new Date(d)
      return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return d }
  }

  const handleAccept = async (id) => {
    setActionLoading(id)
    try {
      await acceptBooking(id)
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'Confirmada' } : b))
    } finally {
      setActionLoading(null)
    }
  }
  const handleReject = async (id) => {
    setActionLoading(id)
    try {
      await rejectBooking(id)
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'Rechazada' } : b))
    } finally {
      setActionLoading(null)
    }
  }
  const handleChat = (b) => {
    const pid = b.clientId || b.photographerId || b.id
    navigate(`/chat?photographer=${pid}`)
  }

  const counts = useMemo(() => {
    const c = { Pendiente: 0, Confirmada: 0, Completada: 0 }
    bookings.forEach((b) => {
      const s = b.status || ''
      if (s.toLowerCase().includes('pendiente')) c.Pendiente++
      else if (s.toLowerCase().includes('confirmada')) c.Confirmada++
      else if (s.toLowerCase().includes('completada')) c.Completada++
    })
    return c
  }, [bookings])

  return (
    <div className="space-y-8 bg-[#070708] text-white">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8">
        <div className="absolute -top-20 right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
        <div className="relative">
          <p className="text-sm text-zinc-400">Studio Command Center</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Bienvenido, <span className="text-red-600">{user?.first_name || user?.username || 'Artista'}</span></h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">Gestiona tus reservas en tiempo real, controla tus ingresos y mantén tu portafolio impecable.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard/portfolio" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors">
              <Briefcase className="h-4 w-4" /> Editar Portafolio
            </Link>
            <Link to={`/fotografos/${user?.id || ''}`} className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors">
              <Eye className="h-4 w-4" /> Ver Perfil Público <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Métricas Financieras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-6 hover:border-red-600/20 hover:shadow-lg hover:shadow-red-600/5 transition-all">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-500"><DollarSign className="h-5 w-5" /></span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Ingresos del Mes ($COP)</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatCOP(metrics.ingresos)}</p>
          <p className="mt-1 text-xs text-zinc-500">Solo reservas confirmadas del mes actual</p>
        </div>
        <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-6 hover:border-red-600/20 hover:shadow-lg hover:shadow-red-600/5 transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Reservas Confirmadas</p>
          <p className="mt-1 text-2xl font-bold text-white">{metrics.confirmadas}</p>
          <p className="mt-1 text-xs text-zinc-500">Total históricas confirmadas</p>
        </div>
        <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-6 hover:border-red-600/20 hover:shadow-lg hover:shadow-red-600/5 transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Percent className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Tasa de Aprobación</p>
          <p className="mt-1 text-2xl font-bold text-white">{metrics.tasa}%</p>
          <p className="mt-1 text-xs text-zinc-500">Confirmadas / Totales</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
        {TABS.map((t) => {
          const active = activeTab === t.value
          const count = counts[t.value] || 0
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.value)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border transition-all ${active ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20' : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700'}`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${active ? 'bg-white text-red-600' : 'bg-zinc-800 text-zinc-300'}`}>{count}</span>
            </button>
          )
        })}
        <Link to="/dashboard/bookings" className="ml-auto text-xs font-medium text-zinc-400 hover:text-white">Ver gestión completa →</Link>
      </div>

      {/* Lista de reservas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-3xl h-48 bg-zinc-900 border border-zinc-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 py-16 text-center">
          <Calendar className="h-8 w-8 text-zinc-600 mx-auto" />
          <p className="mt-3 text-sm font-medium text-white">Sin reservas {activeTab.toLowerCase()}</p>
          <p className="text-xs text-zinc-500 mt-1">Cuando recibas solicitudes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="group flex flex-col rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-5 hover:border-red-600/20 hover:shadow-xl hover:shadow-red-600/5 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={b.photographerAvatar || `https://i.pravatar.cc/100?img=${(b.photographerId % 70) + 1}`} alt={b.clientName} className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                  <div>
                    <p className="text-sm font-semibold text-white">{b.clientName}</p>
                    <p className="text-xs text-zinc-400">{b.service}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest border ${activeTab === 'Pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : activeTab === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-700/30 text-zinc-300 border-zinc-700'}`}>{b.status}</span>
              </div>
              <div className="mt-4 space-y-1.5 text-xs">
                <p className="flex items-center gap-1.5 text-zinc-400"><Calendar className="h-3.5 w-3.5" /> {formatDate(b.date)}</p>
                <p className="flex items-center gap-1.5 font-semibold text-white"><DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {formatCOP(b.price)}</p>
                {b.location && <p className="text-zinc-500 truncate">{b.location}</p>}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {activeTab === 'Pendiente' ? (
                  <>
                    <button
                      onClick={() => handleAccept(b.id)}
                      disabled={actionLoading === b.id}
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                    >
                      {actionLoading === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Aceptar
                    </button>
                    <button
                      onClick={() => handleReject(b.id)}
                      disabled={actionLoading === b.id}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 disabled:opacity-60 transition-colors"
                    >
                      <X className="h-3 w-3" /> Rechazar
                    </button>
                    <button onClick={() => handleChat(b)} className="inline-flex items-center justify-center gap-1 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 hover:border-red-600 transition-colors">
                      <MessageSquare className="h-3 w-3" /> Chat
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleChat(b)} className="col-span-3 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors">
                      <MessageSquare className="h-4 w-4" /> Ir al Chat <ArrowRight className="h-3 w-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ArtistDashboard
