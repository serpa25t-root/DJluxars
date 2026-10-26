import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { createPayment } from '../../services/payments'

const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length < 3) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

const PaymentModal = ({ isOpen, onClose, booking, onPaid }) => {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  if (!isOpen || !booking) return null

  const amount = booking.price ?? booking.base_price ?? 0

  const handleChange = (e) => {
    const { id, value } = e.target
    let v = value
    if (id === 'number') v = formatCard(value)
    if (id === 'expiry') v = formatExpiry(value)
    if (id === 'cvv') v = value.replace(/\D/g, '').slice(0, 4)
    setForm((p) => ({ ...p, [id]: v }))
  }

  const isValid =
    form.name.trim().length > 2 &&
    form.number.replace(/\s/g, '').length === 16 &&
    /^\d{2}\/\d{2}$/.test(form.expiry) &&
    form.cvv.length >= 3

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return
    setProcessing(true)
    setError(null)
    // Simula el procesamiento de la pasarela (ficticio)
    await new Promise((r) => setTimeout(r, 1600))
    try {
      const payment = await createPayment({ bookingId: booking.id, method: 'tarjeta' })
      setSuccess(payment)
      onPaid?.(payment)
    } catch (err) {
      setError(err?.response?.data?.detail || 'El pago fue rechazado por la pasarela ficticia.')
    } finally {
      setProcessing(false)
    }
  }

  const handleClose = () => {
    setSuccess(null)
    setError(null)
    setForm({ name: '', number: '', expiry: '', cvv: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !processing && handleClose()} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Pasarela de pago (ficticia)</h2>
            <p className="text-xs text-zinc-400">Simulación — no se cobra dinero real</p>
          </div>
          <button onClick={handleClose} disabled={processing} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Pago aprobado</h3>
            <p className="mt-1 text-sm text-zinc-400">Transacción {String(success.transaction_id).slice(0, 8).toUpperCase()}</p>
            <p className="mt-3 text-2xl font-bold text-emerald-400">${Number(success.amount).toLocaleString('es-CO')} COP</p>
            <p className="mt-1 text-xs text-zinc-500">Comisión plataforma: ${Number(success.platform_fee).toLocaleString('es-CO')} • Fotógrafo: ${Number(success.artist_payout).toLocaleString('es-CO')}</p>
            <Button type="button" variant="primary" onClick={handleClose} className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-widest text-zinc-400 font-semibold">TOTAL A PAGAR</p>
                <p className="text-lg font-bold text-white">${amount.toLocaleString('es-CO')} COP</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">FICTICIO</span>
            </div>

            <Input label="Nombre en la tarjeta" id="name" placeholder="Juan Pérez" value={form.name} onChange={handleChange} required />
            <Input label="Número de tarjeta" id="number" placeholder="4242 4242 4242 4242" value={form.number} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Vencimiento (MM/AA)" id="expiry" placeholder="12/26" value={form.expiry} onChange={handleChange} required />
              <Input label="CVV" id="cvv" placeholder="123" value={form.cvv} onChange={handleChange} required />
            </div>

            {error && (
              <p className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm text-red-300">{error}</p>
            )}

            <Button type="submit" variant="primary" disabled={processing || !isValid} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">
              {processing ? 'Procesando pago...' : `Pagar $${amount.toLocaleString('es-CO')}`}
            </Button>
            <p className="text-center text-[11px] text-zinc-600">Usa cualquier número de 16 dígitos. La pasarela es simulada.</p>
          </form>
        )}
      </div>
    </div>
  )
}

export default PaymentModal
