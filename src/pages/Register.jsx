import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/common/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const roles = [
  {
    id: 'client',
    label: 'Cliente',
    desc: 'Busco contratar fotógrafos para mis eventos o proyectos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'artist',
    label: 'Fotógrafo',
    desc: 'Quiero publicar mi portafolio y ofrecer mis servicios',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

const roleLabelEs = { client: 'Cliente', artist: 'Fotógrafo' }

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('client')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, phone, password } = form
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setToast({ msg: 'Por favor, completa todos los campos.', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setLoading(true)
    try {
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, role })
      setToast({ msg: 'Cuenta creada correctamente. Redirigiendo al login…', type: 'success' })
      setTimeout(() => navigate('/login'), 900)
    } catch (err) {
      const msg = err?.message || 'No se pudo crear la cuenta. Verifica los datos.'
      setToast({ msg, type: 'error' })
      setTimeout(() => setToast(null), 3500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Crea tu cuenta para comenzar a explorar o publicar servicios."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-red-500 hover:text-red-400 transition-colors duration-150">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <p className="block text-xs font-medium tracking-wide text-zinc-300 mb-2">Quiero registrarme como:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => {
              const active = role === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`relative text-left rounded-xl border p-4 transition-all duration-200 will-change-transform active:scale-[0.98] ${
                    active
                      ? 'border-red-600/50 bg-red-600/10 shadow-md shadow-red-600/15'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                  aria-pressed={active}
                >
                  {active && <div className="absolute top-0 left-0 h-0.5 w-full bg-red-600 rounded-t-xl" />}
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-200 ${active ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {r.icon}
                  </div>
                  <p className={`mt-3 text-sm font-semibold leading-none ${active ? 'text-white' : 'text-zinc-200'}`}>{r.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{r.desc}</p>
                  {active && (
                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50 animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-center text-xs text-zinc-500">
            Seleccionado: <span className="font-semibold text-red-400">{roleLabelEs[role]}</span>
          </p>
        </div>

        <Input label="Nombre completo" id="name" placeholder="Ana López" value={form.name} onChange={handleChange} required autoComplete="name" />
        <Input label="Correo Electrónico" id="email" type="email" placeholder="ana@estudio.com" value={form.email} onChange={handleChange} required autoComplete="email" />
        <Input label="Teléfono" id="phone" type="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={handleChange} required autoComplete="tel" />
        <Input label="Contraseña" id="password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={handleChange} required autoComplete="new-password" />

        <Button type="submit" variant="primary" disabled={loading} className="w-full py-3.5 text-[15px] shadow-lg shadow-red-600/20 disabled:opacity-60">
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-zinc-500">
          Al crear tu cuenta aceptas los <a href="#" className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300">Términos</a> y la{' '}
          <a href="#" className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300">Política de privacidad</a>.
        </p>
      </form>

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-xl animate-[fadeInUp_300ms_var(--ease-out-quart)_both] ${
            toast.type === 'success'
              ? 'border-red-600/30 bg-zinc-900 text-white shadow-red-600/20'
              : 'border-amber-500/30 bg-zinc-900 text-amber-200 shadow-amber-500/20'
          }`}
          role="alert"
        >
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${toast.type === 'success' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`} />
            {toast.msg}
          </span>
        </div>
      )}
    </AuthLayout>
  )
}

export default Register
