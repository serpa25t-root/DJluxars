import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Calendar, DollarSign, Percent, ArrowRight, MessageSquare, Check, X, Loader2, Package, Star, ChevronUp, ChevronDown, Sparkles, TrendingUp, Camera, CalendarCheck2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchArtistBookings, acceptBooking, rejectBooking } from '../../services/bookings'
import ServiceManager from '../../components/dashboard/ServiceManager'

const TABS = [
  { id: 'pendiente', label: 'Pendientes', value: 'Pendiente' },
  { id: 'confirmada', label: 'Confirmadas', value: 'Confirmada' },
  { id: 'completada', label: 'Completadas', value: 'Completada' },
]

const ArtistDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('reservas')
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
    const projected = ingresos * 1.25
    const total = bookings.length || 1
    const tasa = Math.round((confirmed.length / total) * 100)
    const avgResponse = 2.4 // Demo: horas promedio de respuesta
    const uniqueViews = 847 // Demo: vistas únicas del mes
    const avgTicket = confirmed.length ? Math.round(confirmed.reduce((s, b) => s + (Number(b.artist_payout ?? b.price ?? 0)), 0) / confirmed.length) : 0
    return {
      ingresos,
      projected,
      confirmadas: confirmed.length,
      tasa,
      avgResponse,
      uniqueViews,
      avgTicket,
      trend: +12, // Demo: +12% vs mes anterior
    }
  }, [bookings])

  const formatCOP = (v) => {
    const n = Number(v)
    return isNaN(n) ? '$0 COP' : `$${n.toLocaleString('es-CO')} COP`
  }
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
      toast.success('Reserva aceptada exitosamente')
    } catch {
      toast.error('No se pudo aceptar la reserva')
    } finally {
      setActionLoading(null)
    }
  }
  const handleReject = async (id) => {
    setActionLoading(id)
    try {
      await rejectBooking(id)
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'Rechazada' } : b))
      toast.success('Reserva rechazada')
    } catch {
      toast.error('No se pudo rechazar la reserva')
    } finally {
      setActionLoading(null)
    }
  }
  const handleChat = (b) => {
    const pid = b.clientId || b.photographerId || b.id
    navigate(`/dashboard/mensajes?contactId=${pid}&name=${encodeURIComponent(b.clientName || b.photographerName || '')}`)
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

  const glassCard = 'rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-6 hover:border-red-600/20 hover:shadow-lg hover:shadow-red-600/5 transition-all'

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
        Cargando...
      </div>
    )
  }

  return (
    <div className="space-y-12 bg-[#070708] text-white">
      {/* Header — título atractivo con tipografía display */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/70 via-zinc-900/40 to-transparent backdrop-blur-xl p-8 sm:p-10">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-red-900/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 text-red-500/90">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase">Studio Command Center</span>
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
            Bienvenido, <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent italic">{user?.first_name || user?.username || 'Artista'}</span>
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
            <Camera className="h-4 w-4 text-red-500" />
            <span className="font-medium text-zinc-300">Controlas tus solicitudes, ingresos y talento en tiempo real.</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> {metrics.confirmadas} solicitudes confirmadas</span>
            <span className="h-3 w-px bg-zinc-800" />
            <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400" /> Perfil activo</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/dashboard/portfolio" className="inline-flex items-center gap-2 rounded-full btn-neon px-6 py-3 text-sm">
              <Camera className="h-4 w-4" /> Editar Portafolio
            </Link>
            <Link to={`/fotografos/${user?.id}`} className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/60 backdrop-blur-md px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <ArrowRight className="h-4 w-4" /> Ver Perfil Público
            </Link>
          </div>
        </div>
      </div>

      {/* Métricas Financieras — 4 Cards Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={glassCard}>
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-500"><DollarSign className="h-5 w-5" /></span>
            <div className={`flex items-center gap-1 text-xs font-semibold ${metrics.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {metrics.trend >= 0 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {Math.abs(metrics.trend)}%
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Ingresos del Mes</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatCOP(metrics.ingresos)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className={glassCard}>
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><CalendarCheck2 className="h-5 w-5" /></span>
            <span className="text-xs font-semibold text-zinc-500">{bookings.length} solicitudes</span>
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Reservas Confirmadas</p>
          <p className="mt-1 text-2xl font-bold text-white">{metrics.confirmadas}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }} className={glassCard}>
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400"><Percent className="h-5 w-5" /></span>
            <span className="text-xs font-semibold text-zinc-500">Todas tus reservas</span>
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Tasa de Aprobación</p>
          <p className="mt-1 text-2xl font-bold text-white">{metrics.tasa}%</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }} className={glassCard}>
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400"><Star className="h-5 w-5" /></span>
            <span className="text-xs font-semibold text-zinc-500">Por sesión</span>
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Ticket Promedio</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatCOP(metrics.avgTicket)}</p>
        </motion.div>
      </div>

      {/* Secciones principales: Solicitudes | Servicios */}
      <div className="flex items-center gap-2 p-1 rounded-full bg-zinc-900 border border-zinc-800 w-fit">
        <button onClick={() => setActiveSection('reservas')} className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${activeSection === 'reservas' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}>
          <Calendar className="h-4 w-4" /> Reservas
        </button>
        <button onClick={() => setActiveSection('servicios')} className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${activeSection === 'servicios' ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-400 hover:text-white'}`}>
          <Package className="h-4 w-4" /> Servicios
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'servicios' ? (
          <motion.div key="servicios" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <ServiceManager />
          </motion.div>
        ) : (
          <motion.div key="reservas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {/* Tabs reservas */}
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
                <p className="text-xs text-zinc-500 mt-1">Cuando recibas reservas aparecerán aquí.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((b) => (
                  <div key={b.id} className="card-glass hover-ring-neon flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <img src={b.photographerAvatar || `https://i.pravatar.cc/100?img=${(Number(b.photographerId) % 70) + 1}`} alt={b.clientName} className="h-11 w-11 rounded-full object-cover border border-zinc-800" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{b.clientName}</p>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest border ${activeTab === 'Pendiente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]' : activeTab === 'Confirmada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : 'bg-zinc-700/30 text-zinc-300 border-zinc-700'}`}>{b.status}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-400">{b.service}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(b.date)}</span>
                          {b.location && <span>{b.location}</span>}
                          <span className="inline-flex items-center gap-1 font-semibold text-white"><DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {formatCOP(b.price)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                      {activeTab === 'Pendiente' ? (
                        <>
                          <button
                            onClick={() => handleAccept(b.id)}
                            disabled={actionLoading === b.id}
                            className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-60"
                          >
                            {actionLoading === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Aceptar
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            disabled={actionLoading === b.id}
                            className="inline-flex items-center justify-center gap-1 rounded-full border border-red-500/40 bg-red-600/10 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-60"
                          >
                            <X className="h-3 w-3" /> Rechazar
                          </button>
                          <button onClick={() => handleChat(b)} className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                            <MessageSquare className="h-3 w-3" /> Chat
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleChat(b)} className="inline-flex items-center justify-center gap-2 rounded-full btn-neon px-5 py-2.5 text-xs">
                          <MessageSquare className="h-4 w-4" /> Ir al Chat <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ArtistDashboard
