import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import {
  getAdminStats, getAdminUsers, toggleAdminUser, setAdminUserRole,
  getAdminWorks, approveAdminWork, rejectAdminWork,
  getAdminBookings, getAdminPayments, clearAdminUserPortfolio,
} from '../../services/admin'

const TABS = [
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'obras', label: 'Obras (moderación)' },
  { id: 'reservas', label: 'Reservas' },
  { id: 'pagos', label: 'Pagos' },
]

const badge = (s) => {
  const m = {
    aprobado: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    rechazado: 'border-red-600/30 bg-red-600/10 text-red-300',
    pendiente: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  }
  return m[s] || 'border-zinc-700 bg-zinc-800 text-zinc-300'
}

const AdminDashboard = () => {
  const [tab, setTab] = useState('usuarios')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [works, setWorks] = useState([])
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [search, setSearch] = useState('')

  const refresh = async (t = tab) => {
    setLoading(true)
    try {
      if (!stats) setStats(await getAdminStats())
      if (t === 'usuarios') setUsers(await getAdminUsers({ q: search }))
      if (t === 'obras') setWorks(await getAdminWorks({ q: search }))
      if (t === 'reservas') setBookings(await getAdminBookings())
      if (t === 'pagos') setPayments(await getAdminPayments())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh(tab) }, [tab]) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    refresh(tab)
  }

  const handleToggleUser = async (id) => {
    setActionLoading(id)
    try {
      await toggleAdminUser(id)
      await refresh('usuarios')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSetRole = async (id, role) => {
    setActionLoading(id)
    try {
      await setAdminUserRole(id, role)
      await refresh('usuarios')
    } finally {
      setActionLoading(null)
    }
  }

  const handleClearPortfolio = async (id, username) => {
    if (!window.confirm(`¿Eliminar TODO el portafolio de "${username}"? Esta acción no se puede deshacer.`)) return
    setActionLoading(id)
    try {
      const res = await clearAdminUserPortfolio(id)
      alert(`Se eliminaron ${res.deleted} obra(s).`)
      await refresh('usuarios')
      await refresh('obras')
    } finally {
      setActionLoading(null)
    }
  }

  const handleApproveWork = async (id) => {
    setActionLoading(id)
    try {
      await approveAdminWork(id)
      await refresh('obras')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectWork = async (id) => {
    const reason = window.prompt('Motivo del rechazo:', 'Contenido +18 o que infringe las normas de la plataforma.')
    if (reason === null) return
    setActionLoading(id)
    try {
      await rejectAdminWork(id, reason)
      await refresh('obras')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-900 pb-6">
          <p className="text-xs font-semibold tracking-widest text-red-400">PANEL DE ADMINISTRACIÓN</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Administrador <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">LuxArs</span></h1>
          <p className="mt-2 text-sm text-zinc-400">Gestiona usuarios, fotógrafos, obras, reservas y pagos.</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Usuarios', value: stats.users },
              { label: 'Artistas', value: stats.artists },
              { label: 'Clientes', value: stats.clients },
              { label: 'Obras', value: stats.works },
              { label: 'Rechazadas', value: stats.works_rejected },
              { label: 'Reservas', value: stats.bookings },
              { label: 'Pagos', value: stats.payments },
              { label: 'Ingresos', value: `$${Number(stats.revenue).toLocaleString('es-CO')}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
                <p className="text-[11px] tracking-widest text-zinc-500 uppercase">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 flex gap-2 border-b border-zinc-900">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-red-600 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
          <Link to="/dashboard" className="ml-auto px-4 py-2.5 text-sm text-zinc-500 hover:text-white">← Dashboard</Link>
        </div>

        {/* Búsqueda */}
        {(tab === 'usuarios' || tab === 'obras') && (
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === 'usuarios' ? 'Buscar por nombre o correo...' : 'Buscar por título o fotógrafo...'}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none"
            />
            <Button type="submit" variant="primary" className="px-5">Buscar</Button>
          </form>
        )}

        {loading ? (
          <div className="mt-10 flex justify-center"><div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" /></div>
        ) : (
          <>
            {/* Usuarios */}
            {tab === 'usuarios' && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-900">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Usuario</th>
                      <th className="px-4 py-3 text-left">Correo</th>
                      <th className="px-4 py-3 text-left">Rol</th>
                      <th className="px-4 py-3 text-left">Obras</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-zinc-900 hover:bg-zinc-900/40">
                        <td className="px-4 py-3 text-white">{u.username}</td>
                        <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={(e) => handleSetRole(u.id, e.target.value)}
                            disabled={actionLoading === u.id}
                            className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-white"
                          >
                            <option value="client">Cliente</option>
                            <option value="artist">Artista</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-300">{u.works_count ?? 0}</span>
                            {(u.works_count ?? 0) > 0 && (
                              <button
                                onClick={() => handleClearPortfolio(u.id, u.username)}
                                disabled={actionLoading === u.id}
                                className="text-xs font-semibold text-red-400 hover:text-red-300"
                              >
                                Eliminar portafolio
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.is_suspended ? 'text-red-400' : 'text-emerald-400'}`}>
                            {u.is_suspended ? 'Suspendido' : 'Activo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleToggleUser(u.id)}
                            disabled={actionLoading === u.id}
                            className={`text-xs font-semibold ${u.is_suspended ? 'text-emerald-400 hover:text-emerald-300' : 'text-red-400 hover:text-red-300'}`}
                          >
                            {u.is_suspended ? 'Activar' : 'Suspender'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="p-6 text-center text-sm text-zinc-500">Sin usuarios.</p>}
              </div>
            )}

            {/* Obras */}
            {tab === 'obras' && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-900">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Obra</th>
                      <th className="px-4 py-3 text-left">Fotógrafo</th>
                      <th className="px-4 py-3 text-left">Categoría</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {works.map((w) => (
                      <tr key={w.id} className="border-t border-zinc-900 hover:bg-zinc-900/40">
                        <td className="px-4 py-3 text-white">{w.title}</td>
                        <td className="px-4 py-3 text-zinc-400">{w.owner_username}</td>
                        <td className="px-4 py-3 text-zinc-400">{w.category}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badge(w.status)}`}>{w.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-3">
                          <button onClick={() => handleApproveWork(w.id)} disabled={actionLoading === w.id} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">Aprobar</button>
                          <button onClick={() => handleRejectWork(w.id)} disabled={actionLoading === w.id} className="text-xs font-semibold text-red-400 hover:text-red-300">Rechazar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {works.length === 0 && <p className="p-6 text-center text-sm text-zinc-500">Sin obras.</p>}
              </div>
            )}

            {/* Reservas */}
            {tab === 'reservas' && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-900">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Cliente</th>
                      <th className="px-4 py-3 text-left">Fotógrafo</th>
                      <th className="px-4 py-3 text-left">Servicio</th>
                      <th className="px-4 py-3 text-left">Fecha</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t border-zinc-900 hover:bg-zinc-900/40">
                        <td className="px-4 py-3 text-zinc-500">#{b.id}</td>
                        <td className="px-4 py-3 text-white">{b.client_name || b.client}</td>
                        <td className="px-4 py-3 text-white">{b.photographer_name || b.photographer}</td>
                        <td className="px-4 py-3 text-zinc-400">{b.service}</td>
                        <td className="px-4 py-3 text-zinc-400">{b.date}</td>
                        <td className="px-4 py-3 text-zinc-400">{b.status}</td>
                        <td className="px-4 py-3 text-right text-white">${Number(b.price || 0).toLocaleString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && <p className="p-6 text-center text-sm text-zinc-500">Sin reservas.</p>}
              </div>
            )}

            {/* Pagos */}
            {tab === 'pagos' && (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-900">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Transacción</th>
                      <th className="px-4 py-3 text-left">Cliente</th>
                      <th className="px-4 py-3 text-left">Reserva</th>
                      <th className="px-4 py-3 text-left">Método</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t border-zinc-900 hover:bg-zinc-900/40">
                        <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{String(p.transaction_id).slice(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3 text-white">{p.client}</td>
                        <td className="px-4 py-3 text-zinc-400">#{p.booking}</td>
                        <td className="px-4 py-3 text-zinc-400">{p.method}</td>
                        <td className="px-4 py-3 text-zinc-400">{p.status}</td>
                        <td className="px-4 py-3 text-right text-white">${Number(p.amount || 0).toLocaleString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && <p className="p-6 text-center text-sm text-zinc-500">Sin pagos.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
