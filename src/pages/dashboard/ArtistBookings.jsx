import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import UpgradeModal from '../../components/subscription/UpgradeModal'
import { fetchArtistBookings, acceptBooking, rejectBooking, seedIfEmpty } from '../../services/bookings'
import { useAuth } from '../../context/AuthContext'
import { checkCanAcceptBooking, getUsage, setUsage, upgradeToPro } from '../../services/subscription'

const statusBadge = {
  Pendiente: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Confirmada: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Rechazada: 'border-zinc-700 bg-zinc-800 text-zinc-400',
  Finalizada: 'border-red-600/30 bg-red-600/10 text-red-300',
}

const ArtistBookings = () => {
  const { user } = useAuth()
  const artistId = user?.id || user?.email || 'anon'
  const [bookings, setBookings] = useState([])
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [toast, setToast] = useState(null)

  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    seedIfEmpty()
    const data = await fetchArtistBookings()
    setBookings(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handle = async (id, status) => {
    if (status === 'Confirmada') {
      const check = checkCanAcceptBooking(artistId)
      if (!check.allowed) {
        setToast(check.message)
        setShowUpgrade(true)
        setTimeout(() => setToast(null), 3000)
        return
      }
    }
    try {
      if (status === 'Confirmada') {
        await acceptBooking(id)
        const usage = getUsage(artistId)
        setUsage(artistId, { ...usage, services: usage.services + 1 })
      } else {
        await rejectBooking(id)
      }
      const data = await fetchArtistBookings()
      setBookings(data)
    } catch {
      setToast('No se pudo actualizar el estado.')
      setTimeout(() => setToast(null), 2500)
    }
  }

  const handleUpgrade = () => {
    upgradeToPro(artistId)
    setShowUpgrade(false)
    setToast('¡Plan PRO activado! Ahora tienes 6 servicios activos.')
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-900 pb-6">
          <p className="text-xs font-semibold tracking-widest text-red-400">DASHBOARD • FOTÓGRAFO</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Solicitudes Recibidas</h1>
          <p className="mt-2 text-sm text-zinc-400">Gestiona propuestas, acepta o rechaza con un toque.</p>
        </div>

        {loading ? (
          <div className="mt-10 flex flex-col items-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
            <p className="mt-3 text-sm text-zinc-500">Cargando solicitudes...</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-950">
            <table className="w-full text-sm">
            <thead className="bg-zinc-900/40 border-b border-zinc-900">
              <tr className="text-xs tracking-widest text-zinc-500">
                <th className="text-left px-4 py-3">CLIENTE</th>
                <th className="text-left px-4 py-3">FECHA</th>
                <th className="text-left px-4 py-3">SERVICIO</th>
                <th className="text-left px-4 py-3">PROPUESTA</th>
                <th className="text-left px-4 py-3">ESTADO</th>
                <th className="text-left px-4 py-3">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{b.clientName}</p>
                    <p className="text-xs text-zinc-500">{b.clientEmail}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-300">{b.date}</td>
                  <td className="px-4 py-4">
                    <p className="text-white">{b.service}</p>
                    <p className="text-xs text-zinc-500">{b.location}</p>
                  </td>
                  <td className="px-4 py-4 text-xs leading-relaxed">
                    {(() => {
                      const base = b.base_price ?? b.price
                      const fee = b.platform_fee ?? Math.round(base * 0.1)
                      const payout = b.artist_payout ?? base - fee
                      return (
                        <div className="space-y-0.5">
                          <p className="text-white">Valor del Servicio: <span className="font-semibold">${base.toLocaleString('es-CO')} COP</span></p>
                          <p className="text-red-300">Comisión LuxArts (10%): <span className="font-semibold">-${fee.toLocaleString('es-CO')} COP</span></p>
                          <p className="text-emerald-300">Ganancia Neta Fotógrafo: <span className="font-semibold">${payout.toLocaleString('es-CO')} COP</span></p>
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge[b.status] || statusBadge.Pendiente}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      {b.status === 'Pendiente' ? (
                        <>
                          <Button variant="primary" className="text-xs px-3 py-1.5" onClick={() => handle(b.id, 'Confirmada')}>
                            Aceptar Solicitud
                          </Button>
                          <Button variant="secondary" className="text-xs px-3 py-1.5 border-zinc-800" onClick={() => handle(b.id, 'Rechazada')}>
                            Rechazar Solicitud
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-zinc-500">—</span>
                      )}
                      <Link to={`/chat?contactId=${b.id}&name=${encodeURIComponent(b.clientName)}`}>
                        <Button variant="secondary" className="text-xs px-3 py-1.5 border-zinc-800">Contactar Fotógrafo</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="py-10 text-center text-sm text-zinc-500">Aún no tienes solicitudes.</p>}
          </div>
        )}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-amber-500/30 bg-zinc-900 px-4 py-2 text-sm font-medium text-amber-200 shadow-xl" role="alert">
          {toast}
        </div>
      )}
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} onUpgrade={handleUpgrade} />
    </div>
  )
}

export default ArtistBookings
