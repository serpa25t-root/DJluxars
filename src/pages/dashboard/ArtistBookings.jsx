import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import { getBookings, updateBookingStatus, seedIfEmpty } from '../../services/bookings'

const statusBadge = {
  Pendiente: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Confirmada: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Rechazada: 'border-zinc-700 bg-zinc-800 text-zinc-400',
  Finalizada: 'border-red-600/30 bg-red-600/10 text-red-300',
}

const ArtistBookings = () => {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    seedIfEmpty()
    setBookings(getBookings())
  }, [])

  const handle = (id, status) => {
    const next = updateBookingStatus(id, status)
    setBookings([...next])
  }

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-900 pb-6">
          <p className="text-xs font-semibold tracking-widest text-red-400">DASHBOARD • FOTÓGRAFO</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Solicitudes Recibidas</h1>
          <p className="mt-2 text-sm text-zinc-400">Gestiona propuestas, acepta o rechaza con un toque.</p>
        </div>

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
                  <td className="px-4 py-4 font-semibold text-white">${b.price.toLocaleString('es-CO')} COP</td>
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
      </div>
    </div>
  )
}

export default ArtistBookings
