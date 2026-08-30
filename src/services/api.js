import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor de peticiones: adjunta JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Para multipart/form-data dejar que el navegador ponga el boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuestas: manejo global opcional
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No forzamos logout automático aquí para mantener taste limpio;
    // el AuthContext decide según código 401 si hace falta.
    return Promise.reject(error)
  }
)

export default api
