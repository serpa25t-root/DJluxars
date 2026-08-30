import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

// Helpers taste — DRY
const extractErrorMsg = (error, fallback) => {
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (data.message) return data.message
  if (data.non_field_errors) return data.non_field_errors.join(' ')
  // DRF field errors
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
  if (low.includes('already exists') || low.includes('ya existe') || low.includes('already registered') || low.includes('email') && low.includes('exists')) return 'El correo ya está registrado.'
  if (low.includes('invalid') || low.includes('incorrect') || low.includes('no active') || low.includes('unable to log')) return 'Credenciales incorrectas.'
  if (low.includes('password')) return 'Contraseña no válida.'
  return msg
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Persistencia al cargar
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
    // credentials: { email, password } o { username, password }
    const email = credentials.email?.trim()
    const password = credentials.password
    const username = credentials.username || email

    const payloads = [
      { email, password },
      { username, password },
      { username: email, password },
    ]

    const endpoints = ['auth/login/', 'token/', 'users/login/', 'login/']

    let lastError = null

    for (const endpoint of endpoints) {
      for (const payload of payloads) {
        // evita payloads duplicados o vacíos
        if (!payload.password || (!payload.email && !payload.username)) continue
        try {
          const res = await api.post(endpoint, payload)
          const data = res.data

          // extrae token con tolerancia
          const newToken = data.access || data.token || data.key || data.access_token
          const newUser = data.user || data.profile || { email: payload.email || payload.username, username: payload.username }

          if (newToken) persistSession(newToken, newUser)
          else if (newUser) persistSession(null, newUser)

          return { token: newToken, user: newUser, raw: data }
        } catch (err) {
          // 404 -> probar siguiente endpoint, 400/401 -> guardar error para mensaje
          lastError = err
          if (err?.response?.status === 404) break // cambia endpoint
          // si es 400 con error de campo, no tiene sentido reintentar mismo endpoint con otro payload idéntico
          // continuamos al siguiente payload
        }
      }
      if (lastError?.response?.status !== 404) {
        // si no fue 404, los payloads ya se probaron, pasar al siguiente endpoint
      }
    }

    // Si llegamos aquí, ningún endpoint funcionó
    const msg = spanishErrorMap(extractErrorMsg(lastError, 'Credenciales incorrectas.'))
    throw new Error(msg)
  }, [persistSession])

  const register = useCallback(async (userData) => {
    // userData: { email, username, password, role, phone, name }
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

    const endpoints = ['auth/register/', 'users/register/', 'register/', 'auth/registration/']

    let lastError = null
    for (const endpoint of endpoints) {
      try {
        const res = await api.post(endpoint, payload)
        return res.data
      } catch (err) {
        lastError = err
        if (err?.response?.status === 404) continue
        // 400 valida -> no reintentar otros endpoints, propagar
        break
      }
    }

    const msg = spanishErrorMap(extractErrorMsg(lastError, 'No se pudo crear la cuenta. Verifica los datos.'))
    // mapea duplicado email específico
    if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('exist')) {
      throw new Error('El correo ya está registrado.')
    }
    // si contiene correo ya registrado, ya está mapeado
    throw new Error(msg)
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
