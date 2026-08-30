import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Portfolio from './pages/dashboard/Portfolio'

const Placeholder = ({ title }) => (
  <div className="min-h-[100dvh] flex flex-col bg-black">
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center border border-red-600/20 bg-zinc-900/60 rounded-2xl px-8 py-10 backdrop-blur-xl">
        <p className="text-sm tracking-widest text-red-400 font-semibold">LUXARTS</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400">Sección en construcción — navegación verificada.</p>
      </div>
    </div>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-zinc-400">
        Cargando...
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/portfolio"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />
      {/* Otras rutas por rol — placeholder */}
      <Route path="/dashboard/services" element={<Placeholder title="Mis Servicios" />} />
      <Route path="/dashboard/bookings" element={<Placeholder title="Solicitudes" />} />
      <Route path="/my-bookings" element={<Placeholder title="Mis Reservas" />} />
      <Route path="/chat" element={<Placeholder title="Chat" />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
