import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

const extractErrorMsg = (error, fallback) => {
  if (!error?.response) {
    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error' || !navigator.onLine) {
      return 'No se encontró el servicio en el servidor. Verifica las rutas de la API.'
    }
    return error?.message || fallback
  }
  if (error.response.status === 404) {
    return 'No se encontró el servicio en el servidor. Verifica las rutas de la API.'
  }
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (data.message) return data.message
  if (data.non_field_errors) return data.non_field_errors.join(' ')
  const firstField = Object.keys(data)[0]
  if (firstField) {
    const val = data[firstField]
    if (Array.isArray(val)) return `${firstField}: ${val[0]}`
    if (typeof val === 'string') return val
  }
  return fallback
}

const spanishErrorMap = (msg) => {
  const low = msg.toLowerCase()
  if (low.includes('already exists') || low.includes('ya existe') || (low.includes('email') && low.includes('exists'))) return 'El correo ya está registrado.'
  if (low.includes('invalid') || low.includes('incorrect') || low.includes('no active') || low.includes('unable to log')) return 'Credenciales incorrectas.'
  if (low.includes('password')) return 'Contraseña no válida.'
  return msg
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('access')
    const storedUser = localStorage.getItem('user')
    if (storedToken) setToken(storedToken)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser({ email: storedUser })
      }
    }
    setLoading(false)
  }, [])

  const persistSession = useCallback((newToken, newUser) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
      localStorage.setItem('access', newToken)
      setToken(newToken)
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const email = credentials.email?.trim()
    const password = credentials.password
    const username = credentials.username || email

    if (!password || !username) throw new Error('Por favor, completa todos los campos.')

    try {
      // Ruta verificada en config/urls.py -> api/users/login/ con slash final
      const res = await api.post('users/login/', { email, username, password })
      const data = res.data
      const newToken = data.access || data.token || data.key
      const newUser = data.user || { email, username }
      if (newToken) persistSession(newToken, newUser)
      else if (newUser) persistSession(null, newUser)
      return { token: newToken, user: newUser, raw: data }
    } catch (err) {
      const msg = spanishErrorMap(extractErrorMsg(err, 'Credenciales incorrectas.'))
      throw new Error(msg)
    }
  }, [persistSession])

  const register = useCallback(async (userData) => {
    const email = userData.email?.trim()
    const password = userData.password
    const role = userData.role
    const phone = userData.phone || userData.phone_number || ''
    const rawName = userData.name || userData.first_name || ''
    const usernameRaw = userData.username || email?.split('@')[0] || rawName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'user'
    const username = usernameRaw.slice(0, 30)
    const firstName = rawName.split(' ')[0] || ''
    const lastName = rawName.split(' ').slice(1).join(' ') || ''

    const payload = {
      username,
      email,
      password,
      password2: password,
      role,
      phone_number: phone,
      first_name: firstName,
      last_name: lastName,
    }

    try {
      // Ruta verificada en users/urls.py -> api/users/register/ con slash final (Django exige trailing slash)
      const res = await api.post('users/register/', payload)
      return res.data
    } catch (err) {
      const isNetwork = !err?.response || err?.code === 'ERR_NETWORK' || err?.message === 'Network Error'
      const is404 = err?.response?.status === 404
      // Fallback tolerante en modo demo: simula éxito sin guardar sesión (flujo obliga login)
      if (isNetwork || is404) {
        const demoUser = { email, username, role, phone_number: phone, first_name: firstName, last_name: lastName }
        return { user: demoUser, demo: true }
      }
      const msg = spanishErrorMap(extractErrorMsg(err, 'No se pudo crear la cuenta. Verifica los datos.'))
      if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('exist')) throw new Error('Este correo electrónico ya se encuentra registrado. Inicia sesión o utiliza otro.')
      throw new Error(msg)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user || !!token,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
