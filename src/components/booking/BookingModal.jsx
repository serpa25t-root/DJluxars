import { useState, useEffect } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { addBooking } from '../../services/bookings'

const services = [
  { value: 'Sesión Studio', factor: 1 },
  { value: 'Exterior', factor: 1.2 },
  { value: 'Evento', factor: 1.5 },
  { value: 'Comercial', factor: 2 },
]

const BookingModal = ({ isOpen, onClose, photographer }) => {
  const { user } = useAuth()
  const [form, setForm] = useState({ date: '', service: 'Sesión Studio', location: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!isOpen) setToast(null)
  }, [isOpen])

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose])

  if (!isOpen || !photographer) return null

  const base = photographer.price || 350000
  const factor = services.find((s) => s.value === form.service)?.factor || 1
  const estimated = Math.round(base * factor)

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.date || !form.location.trim() || !form.message.trim()) {
      setToast({ msg: 'Completa fecha, ubicación y detalles.', type: 'error' })
      setTimeout(() => setToast(null), 2800)
      return
    }
    setLoading(true)
    const payload = {
      photographer: photographer.id,
      photographer_name: photographer.name,
      date: form.date,
      service: form.service,
      location: form.location,
      message: form.message,
      price: estimated,
    }
    try {
      await api.post('bookings/', payload)
      setToast({ msg: 'Solicitud enviada con éxito.', type: 'success' })
    } catch (err) {
      // Mock exitoso si 404/red
      if (err?.response?.status === 404 || !err?.response || err?.code === 'ERR_NETWORK') {
        setToast({ msg: 'Solicitud enviada con éxito. (modo demo)', type: 'success' })
      } else {
        const msg = err?.response?.data?.detail || 'No se pudo enviar la solicitud.'
        setToast({ msg, type: 'error' })
        setLoading(false)
        setTimeout(() => setToast(null), 3000)
        return
      }
    }

    // Persistencia local para paneles
    addBooking({
      id: Date.now(),
      photographerId: photographer.id,
      photographerName: photographer.name,
      photographerAvatar: photographer.avatar,
      specialty: photographer.specialty,
      clientName: user?.username || user?.email?.split('@')[0] || 'Cliente LuxArts',
      clientEmail: user?.email || 'cliente@luxarts.com',
      date: form.date,
      service: form.service,
      location: form.location,
      message: form.message,
      price: estimated,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
    })

    setTimeout(() => {
      setToast(null)
      onClose()
    }, 900)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Solicitar Reserva</h2>
            <p className="text-xs text-zinc-400">Con {photographer.name} • {photographer.specialty}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4">
          <Input label="Fecha del evento" id="date" type="date" value={form.date} onChange={handleChange} required />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-300">Tipo de servicio</label>
            <select
              id="service"
              value={form.service}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            >
              {services.map((s) => (
                <option key={s.value} value={s.value} className="bg-zinc-900">{s.value}</option>
              ))}
            </select>
          </div>
          <Input label="Ubicación / Ciudad" id="location" placeholder="Bogotá, Cartagena..." value={form.location} onChange={handleChange} required />
          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-medium tracking-wide text-zinc-300">Mensaje / Detalles del proyecto</label>
            <textarea
              id="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder="Cuéntale al fotógrafo sobre tu proyecto..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 resize-none"
              required
            />
          </div>

          <div className="rounded-xl border border-red-600/20 bg-red-600/10 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest text-red-300 font-semibold">TARIFA ESTIMADA</p>
              <p className="text-sm text-zinc-400">Base ${base.toLocaleString('es-CO')} × {factor} ({form.service})</p>
            </div>
            <p className="text-xl font-bold text-white">${estimated.toLocaleString('es-CO')} <span className="text-xs font-normal text-zinc-400">COP</span></p>
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="w-full py-3.5 disabled:opacity-60">
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </form>

        {toast && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border px-4 py-2 text-sm font-medium shadow-xl ${toast.type === 'success' ? 'border-red-600/30 bg-zinc-900 text-white' : 'border-amber-500/30 bg-zinc-900 text-amber-200'}`} role="alert">
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingModal
