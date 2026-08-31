import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
  if (low.includes('already exists') || low.includes('ya existe') || (low.includes('email') && low.includes('exists'))) return 'Este correo electrónico ya se encuentra registrado. Inicia sesión o utiliza otro.'
  if (low.includes('invalid') || low.includes('incorrect') || low.includes('no active') || low.includes('unable to log')) return 'Credenciales incorrectas.'
  if (low.includes('password')) return 'Contraseña no válida.'
  return msg
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  // navigate disponible solo si AuthProvider está dentro de <BrowserRouter>
  // fallback seguro para tests / SSR
  let navigate = null
  try {
    navigate = useNavigate()
  } catch {
    navigate = null
  }

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await api.get('users/me/')
      const profile = res.data
      setUser(profile)
      localStorage.setItem('user', JSON.stringify(profile))
      return profile
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('access') || localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken) setToken(storedToken)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          setUser({ email: storedUser })
        }
      }
      if (storedToken) {
        await fetchUserProfile()
      }
      setLoading(false)
    }
    init()
  }, [fetchUserProfile])

  const persistSession = useCallback((access, refresh, newUser) => {
    if (access) {
      localStorage.setItem('access', access)
      localStorage.setItem('token', access)
      setToken(access)
    }
    if (refresh) localStorage.setItem('refresh', refresh)
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
      // SimpleJWT real: POST token/ con username/email
      let res
      try {
        res = await api.post('token/', { username, password })
      } catch (e) {
        if (e.response?.status === 400 || e.response?.status === 401) {
          // Fallback a users/login/ si token/ no acepta email
          res = await api.post('users/login/', { email, username, password })
        } else {
          throw e
        }
      }
      const data = res.data
      const access = data.access || data.token
      const refresh = data.refresh
      if (!access) throw new Error('Credenciales incorrectas.')

      persistSession(access, refresh, null)
      const profile = await fetchUserProfile()
      const finalUser = profile || data.user || { email, username }
      if (!profile && data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      return { token: access, user: finalUser, raw: data }
    } catch (err) {
      const msg = spanishErrorMap(extractErrorMsg(err, 'Credenciales incorrectas.'))
      throw new Error(msg)
    }
  }, [persistSession, fetchUserProfile])

  const register = useCallback(async (userData) => {
    const email = userData.email?.trim()
    const password = userData.password
    const role = userData.role
    const phone = userData.phone || userData.phone_number || ''
    const departamento = userData.departamento?.trim() || ''
    const ciudad = userData.ciudad?.trim() || ''
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
      departamento,
      ciudad,
    }

    try {
      const res = await api.post('users/register/', payload)
      return res.data
    } catch (err) {
      const msg = spanishErrorMap(extractErrorMsg(err, 'No se pudo crear la cuenta. Verifica los datos.'))
      if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('exist')) throw new Error('Este correo electrónico ya se encuentra registrado. Inicia sesión o utiliza otro.')
      throw new Error(msg)
    }
  }, [])

  // Fusiona cambios de perfil (avatar, nombre, bio...) en estado + localStorage
  const updateUser = useCallback((partial) => {
    if (!partial) return null
    setUser((prev) => {
      const next = { ...(prev || {}), ...partial }
      try {
        localStorage.setItem('user', JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    // Forzar recarga completa para limpiar estado en memoria y evitar
    // que el navegador restaure la sesión desde bfcache al usar "Atrás"
    if (typeof window !== 'undefined') {
      window.location.replace('/')
    }
    return true
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user || !!token,
    login,
    register,
    logout,
    fetchUserProfile,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
