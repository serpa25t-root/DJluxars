import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { becomeArtist } from '../../services/userApi'

const formatPrice = (v) => {
  const digits = v.replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('es-CO')
}

const BecomeArtistModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [form, setForm] = useState({ specialty: '', price: '', ciudad: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    setForm({ specialty: '', price: '', ciudad: user?.ciudad || '' })
    setSuccess(false)
    setErrors(null)
    setError(null)
  }, [isOpen, user?.ciudad])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: id === 'price' ? formatPrice(value) : value }))
  }

  const priceDigits = form.price.replace(/\D/g, '')
  const isValid = form.specialty.trim().length >= 2 && Number(priceDigits) > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitting(true)
    setErrors(null)
    setError(null)
    try {
      const profile = await becomeArtist({
        specialty: form.specialty.trim(),
        price: Number(priceDigits),
        ciudad: form.ciudad.trim(),
      })
      setSuccess(true)
      onSuccess?.(profile)
    } catch (err) {
      const status = err?.response?.status
      if (status === 401) {
        setError('Tu sesión expiró. Cierra el modal, vuelve a iniciar sesión e inténtalo de nuevo.')
      } else {
        const data = err?.response?.data
        if (data && typeof data === 'object' && !data.detail) setErrors(data)
        else setError(data?.detail || 'No se pudo activar tu perfil. Intenta de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Activa tu perfil de fotógrafo</h2>
            <p className="text-xs text-zinc-400">Misma cuenta, sin volver a iniciar sesión</p>
          </div>
          <button onClick={handleClose} disabled={submitting} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/15 border border-red-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">¡Ya eres fotógrafo!</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Tu cuenta ahora es dual: puedes publicar tu portafolio y también reservar sesiones como cliente.
            </p>
            <Button type="button" variant="primary" onClick={handleClose} className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700">
              Entendido
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs leading-relaxed text-zinc-400">
              Conservas tu cuenta de cliente: podrás seguir reservando fotos. Tu perfil profesional aparecerá en la sección de fotógrafos.
            </p>

            <Input
              label="Especialidad"
              id="specialty"
              placeholder="Retrato, Moda, Eventos..."
              value={form.specialty}
              onChange={handleChange}
              required
            />
            <Input
              label="Tarifa base por sesión (COP)"
              id="price"
              type="text"
              inputMode="numeric"
              placeholder="350.000"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              label="Ciudad (opcional)"
              id="ciudad"
              placeholder="Bogotá"
              value={form.ciudad}
              onChange={handleChange}
            />

            {Object.keys(errors || {}).length > 0 && (
              <ul className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm text-red-300 space-y-1">
                {Object.entries(errors).map(([field, msgs]) => (
                  <li key={field}>{Array.isArray(msgs) ? msgs[0] : msgs}</li>
                ))}
              </ul>
            )}
            {error && (
              <p className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm text-red-300">{error}</p>
            )}

            <Button type="submit" variant="primary" disabled={submitting || !isValid} className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60">
              {submitting ? 'Activando perfil...' : 'Activar mi perfil de fotógrafo'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default BecomeArtistModal
