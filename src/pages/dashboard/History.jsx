import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchArtistBookings, fetchClientBookings, seedIfEmpty } from '../../services/bookings'

const statusBadge = {
  Pendiente: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Confirmada: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Rechazada: 'border-zinc-700 bg-zinc-800 text-zinc-400',
  Finalizada: 'border-red-600/30 bg-red-600/10 text-red-300',
}

const History = () => {
  const { user } = useAuth()
  const isClient = user?.role === 'client'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      seedIfEmpty()
      const data = isClient ? await fetchClientBookings() : await fetchArtistBookings()
      setItems(data)
      setLoading(false)
    }
    load()
  }, [isClient])

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-900 pb-6">
          <p className="text-xs font-semibold tracking-widest text-red-400">
            {isClient ? 'PANEL • CLIENTE' : 'DASHBOARD • FOTÓGRAFO'}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Historial de Servicios</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isClient
              ? 'Todas tus contrataciones, pagos y estados en un solo lugar.'
              : 'Todo el registro de servicios prestados, ganancias y estados.'}
          </p>
        </div>

        {loading ? (
          <div className="mt-10 flex flex-col items-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
            <p className="mt-3 text-sm text-zinc-500">Cargando historial...</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/40 border-b border-zinc-900">
                <tr className="text-xs tracking-widest text-zinc-500">
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">{isClient ? 'FOTÓGRAFO' : 'CLIENTE'}</th>
                  <th className="text-left px-4 py-3">SERVICIO</th>
                  <th className="text-left px-4 py-3">FECHA</th>
                  <th className="text-left px-4 py-3">UBICACIÓN</th>
                  <th className="text-left px-4 py-3">VALOR</th>
                  {!isClient && <th className="text-left px-4 py-3">GANANCIA NETA</th>}
                  <th className="text-left px-4 py-3">ESTADO</th>
                  <th className="text-left px-4 py-3">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {items.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="px-4 py-4 text-zinc-500 font-mono text-xs">#{b.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">
                        {isClient ? b.photographerName : b.clientName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {isClient ? b.specialty : b.clientEmail}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-white">{b.service}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1">{b.message}</p>
                    </td>
                    <td className="px-4 py-4 text-zinc-300 whitespace-nowrap">{b.date}</td>
                    <td className="px-4 py-4 text-zinc-300">{b.location}</td>
                    <td className="px-4 py-4">
                      <p className="text-white font-semibold">
                        ${(b.base_price ?? b.price ?? 0).toLocaleString('es-CO')} COP
                      </p>
                      {!isClient && (
                        <p className="text-xs text-red-300">
                          Comisión: -${(b.platform_fee ?? 0).toLocaleString('es-CO')} COP
                        </p>
                      )}
                    </td>
                    {!isClient && (
                      <td className="px-4 py-4">
                        <p className="text-emerald-300 font-semibold">
                          ${(b.artist_payout ?? 0).toLocaleString('es-CO')} COP
                        </p>
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge[b.status] || statusBadge.Pendiente}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/chat?contactId=${b.id}&name=${encodeURIComponent(isClient ? b.photographerName : b.clientName)}`}
                        className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        Abrir chat →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-zinc-400">Aún no hay registros en tu historial.</p>
                <Link
                  to={isClient ? '/explorar' : '/dashboard'}
                  className="mt-3 inline-block text-sm font-semibold text-red-400 hover:text-red-300"
                >
                  {isClient ? 'Explorar fotógrafos →' : 'Volver al panel →'}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
