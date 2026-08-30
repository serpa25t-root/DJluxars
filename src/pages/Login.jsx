import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/common/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = form.email.trim()
    const password = form.password.trim()

    if (!email || !password) {
      setToast({ msg: 'Por favor, completa todos los campos.', type: 'error' })
    } else {
      setToast({ msg: 'Inicio de sesión exitoso', type: 'success' })
      console.log('Login payload:', { email, password })
    }
    setTimeout(() => setToast(null), 2800)
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

        <Button type="submit" variant="primary" className="w-full py-3.5 text-[15px] mt-2 shadow-lg shadow-red-600/20">
          Ingresar a mi Cuenta
        </Button>
      </form>

      {/* Alerta limpia en español */}
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
