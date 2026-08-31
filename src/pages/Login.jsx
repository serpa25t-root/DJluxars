import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/common/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [toast, setToast] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [registeredBanner, setRegisteredBanner] = useState(
    location.state?.registered ? location.state?.message || '¡Cuenta creada con éxito! Por favor inicia sesión.' : null
  )

  useEffect(() => {
    if (location.state?.registered) {
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
    if (errorMsg) setErrorMsg(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = form.email.trim()
    const password = form.password.trim()

    if (!email || !password) {
      setErrorMsg('Por favor, completa todos los campos.')
      return
    }
    setErrorMsg(null)

    setLoading(true)
    try {
      await login({ email, password })
      setToast({ msg: 'Inicio de sesión exitoso', type: 'success' })
      setTimeout(() => navigate("/dashboard", { replace: true }), 700)
    } catch (err) {
      const msg = err?.message || 'Credenciales incorrectas.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus datos para acceder a tu cuenta."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-red-500 hover:text-red-400 transition-colors duration-150">
            Regístrate aquí
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {registeredBanner && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex gap-3 animate-[fadeIn_200ms_ease-out]" role="status">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm leading-relaxed text-emerald-200">{registeredBanner}</p>
          </div>
        )}
        {errorMsg && (
          <div className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 flex gap-3 animate-[fadeIn_200ms_ease-out]" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm leading-relaxed text-red-200">{errorMsg}</p>
          </div>
        )}
        <Input
          label="Correo Electrónico"
          id="email"
          type="email"
          placeholder="tu@estudio.com"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          id="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-600/20" />
            Recordarme
          </label>
          <a href="#" className="text-xs font-medium text-zinc-400 hover:text-red-400 transition-colors duration-150">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full py-3.5 text-[15px] mt-2 shadow-lg shadow-red-600/20 disabled:opacity-60"
        >
          {loading ? 'Ingresando...' : 'Ingresar a mi Cuenta'}
        </Button>
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

export default Login
