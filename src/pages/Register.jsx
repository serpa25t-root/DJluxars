import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/common/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import useColombiaApi from '../services/colombiaData'

const roleLabelEs = { client: 'Cliente', artist: 'Fotógrafo' }

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', departamento: '', ciudad: '', password: '' })
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const { departments, cities, loadingDepartments, loadingCities, loadCities } = useColombiaApi()
  const [deptId, setDeptId] = useState('')

  useEffect(() => {
    // Si ya hay departamento en form (por autocompletado), precargar ciudades
    if (form.departamento && departments.length) {
      const found = departments.find((d) => d.name === form.departamento)
      if (found) {
        setDeptId(String(found.id))
        loadCities(found.id)
      }
    }
  }, [departments, form.departamento, loadCities])

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
    if (errorMsg) setErrorMsg(null)
  }

  const handleDepartamentoChange = (e) => {
    const val = e.target.value
    // val es id o nombre? usamos id como value para fetch, pero guardamos name en form
    const selected = departments.find((d) => String(d.id) === val || d.name === val)
    const name = selected ? selected.name : val
    const id = selected ? String(selected.id) : ''
    setDeptId(id)
    setForm((prev) => ({ ...prev, departamento: name, ciudad: '' }))
    if (id) loadCities(id)
    else loadCities('')
    if (errorMsg) setErrorMsg(null)
  }

  const handleCiudadChange = (e) => {
    const val = e.target.value
    setForm((prev) => ({ ...prev, ciudad: val }))
    if (errorMsg) setErrorMsg(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, phone, departamento, ciudad } = form
    const password = form.password.trim()
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.')
      return
    }

    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)
    try {
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), departamento: departamento.trim(), ciudad: ciudad.trim(), password })
      navigate('/login', { replace: true, state: { registered: true, message: '¡Cuenta creada con éxito! Por favor inicia sesión.' } })
      return
    } catch (err) {
      const raw = err?.message || ''
      const low = raw.toLowerCase()
      if (low.includes('no se encontró el servicio') || low.includes('network error') || err?.response?.status === 500 || err?.response?.status === 404) {
        setErrorMsg('No fue posible conectar con el servicio de registro. Inténtalo de nuevo en unos minutos.')
      } else if (low.includes('ya se encuentra registrado') || (low.includes('email') && low.includes('exist')) || low.includes('ya está registrado')) {
        setErrorMsg('Este correo electrónico ya se encuentra registrado. Inicia sesión o utiliza otro.')
      } else if (low.includes('completa todos los campos')) {
        setErrorMsg('Por favor completa todos los campos requeridos.')
      } else {
        setErrorMsg(raw || 'No fue posible conectar con el servicio de registro. Inténtalo de nuevo en unos minutos.')
      }
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
        {errorMsg && (
          <div className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 flex gap-3 animate-[fadeIn_200ms_ease-out]" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm leading-relaxed text-red-200">{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex gap-3" role="status">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm leading-relaxed text-emerald-200">{successMsg}</p>
          </div>
        )}

        <Input label="Nombre completo" id="name" placeholder="Ana López" value={form.name} onChange={handleChange} required autoComplete="name" />
        <Input label="Correo Electrónico" id="email" type="email" placeholder="ana@estudio.com" value={form.email} onChange={handleChange} required autoComplete="email" />
        <Input label="Teléfono" id="phone" type="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={handleChange} required autoComplete="tel" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="departamento" className="block text-xs font-medium tracking-wide text-zinc-300">Departamento</label>
            <div className="relative">
              <select
                id="departamento"
                value={deptId}
                onChange={handleDepartamentoChange}
                disabled={loadingDepartments}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all disabled:opacity-60"
              >
                <option value="">{loadingDepartments ? 'Cargando departamentos...' : 'Selecciona departamento'}</option>
                {departments.map((d) => (
                  <option key={d.id} value={String(d.id)}>{d.name}</option>
                ))}
              </select>
              {loadingDepartments && <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-red-600" />}
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ciudad" className="block text-xs font-medium tracking-wide text-zinc-300">Ciudad</label>
            <div className="relative">
              <select
                id="ciudad"
                value={form.ciudad}
                onChange={handleCiudadChange}
                disabled={!deptId || loadingCities}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all disabled:opacity-60"
              >
                <option value="">{!deptId ? 'Selecciona departamento primero' : loadingCities ? 'Cargando municipios...' : 'Selecciona ciudad'}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {loadingCities && <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-red-600" />}
            </div>
          </div>
        </div>
        <Input label="Contraseña" id="password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={handleChange} required autoComplete="new-password" />

        <Button type="submit" variant="primary" disabled={loading} className="w-full py-3.5 text-[15px] shadow-lg shadow-red-600/20 disabled:opacity-60">
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-zinc-500">
          Al crear tu cuenta aceptas los <a href="#" className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300">Términos</a> y la{' '}
          <a href="#" className="underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300">Política de privacidad</a>.
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
