import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { fetchClientBookings, seedIfEmpty } from '../services/bookingsStore'

const statusBadge = {
  Pendiente: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Confirmada: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Finalizada: 'border-red-600/30 bg-red-600/10 text-red-300',
  Rechazada: 'border-zinc-700 bg-zinc-800 text-zinc-400',
}

const ClientBookings = () => {
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState({})
  const [payingBooking, setPayingBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const [bs, ps] = await Promise.all([fetchClientBookings(), getMyPayments()])
    setBookings(bs)
    const map = {}
    ps.forEach((p) => { map[p.booking] = p })
    setPayments(map)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const rateBooking = async (bookingId) => {
    const input = window.prompt('Califica la sesión de 1 a 5 estrellas:')
    const rating = Number(input)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return
    try {
      await saveBookingRating(bookingId, rating)
      setBookings((current) => current.map((booking) => (
        booking.id === bookingId ? { ...booking, rating } : booking
      )))
    } catch (error) {
      window.alert(error?.response?.data?.detail || error.message || 'No se pudo guardar la calificación.')
    }
  }

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-900 pb-6">
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Mis Reservas</h1>
          <p className="mt-2 text-sm text-zinc-400">Revisa el estado de tus contrataciones y contacta a tu fotógrafo.</p>
        </div>

        {loading ? (
          <div className="mt-8 flex flex-col items-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
            <p className="mt-3 text-sm text-zinc-500">Cargando reservas...</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden hover:border-red-600/20 hover:shadow-lg hover:shadow-red-600/10 transition-all">
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <img src={b.photographerAvatar} alt={b.photographerName} className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.photographerName}</p>
                        <p className="text-xs text-zinc-500">{b.specialty} • {b.service}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusBadge[b.status] || statusBadge.Pendiente}`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-zinc-500">Fecha</span><span className="text-white">{b.date}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Ubicación</span><span className="text-white truncate ml-4">{b.location}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Total a pagar</span><span className="font-bold text-white">${(b.price ?? b.base_price ?? 0).toLocaleString('es-CO')} COP</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Pago</span><span className={`font-semibold ${payments[b.id] ? 'text-emerald-400' : 'text-amber-300'}`}>{payments[b.id] ? `Pagado (${String(payments[b.id].transaction_id).slice(0,8).toUpperCase()})` : 'Pendiente'}</span></div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-zinc-400 line-clamp-2">{b.message}</p>

                    <div className="mt-4 flex gap-2">
                      {b.status === 'Confirmada' && !payments[b.id] && (
                        <button
                          type="button"
                          onClick={() => setPayingBooking(b)}
                          className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                          Pagar ahora
                        </button>
                      )}
                      <Link to={`/chat?contactId=${b.photographerId}&name=${encodeURIComponent(b.photographerName)}`} className="flex-1">
                        <Button variant="secondary" className="w-full text-sm py-2 border-zinc-800">Contactar Fotógrafo</Button>
                      </Link>
                      <Link to={`/fotografos/${b.photographerId}`} className="flex-1">
                        <Button variant="primary" className="w-full text-sm py-2">Ver Perfil</Button>
                      </Link>
                    </div>
                    {b.status === 'Finalizada' && (
                      <button
                        type="button"
                        onClick={() => rateBooking(b.id)}
                        className="mt-3 text-xs font-semibold text-amber-300 hover:text-amber-200"
                      >
                        {b.rating ? `Calificación guardada: ${b.rating}/5` : 'Calificar sesión'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {bookings.length === 0 && (
              <div className="mt-10 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 py-12">
                <p className="text-sm text-zinc-400">Aún no tienes reservas.</p>
                <Link to="/explorar" className="mt-3 inline-block text-sm font-semibold text-red-400 hover:text-red-300">Explorar fotógrafos →</Link>
              </div>
            )}
          </>
        )}
      </div>
      <PaymentModal
        isOpen={!!payingBooking}
        onClose={() => setPayingBooking(null)}
        booking={payingBooking}
        onPaid={(payment) => {
          if (payingBooking) {
            setPayments((prev) => ({ ...prev, [payingBooking.id]: payment }))
          }
          setPayingBooking(null)
        }}
      />
    </div>
  )
}

export default ClientBookings
