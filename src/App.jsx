import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ScrollToTop from './components/common/ScrollToTop'
import BackToTop from './components/common/BackToTop'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Portfolio from './pages/dashboard/Portfolio'
import Explore from './pages/Explore'
import ArtistProfile from './pages/ArtistProfile'
import ArtistBookings from './pages/dashboard/ArtistBookings'
import ClientBookings from './pages/ClientBookings'
import Chat from './pages/Chat'

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

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth()
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-zinc-400">
        Cargando...
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explorar" element={<Explore />} />
      <Route path="/fotografos/:id" element={<ArtistProfile />} />
      <Route
        path="/dashboard/portfolio"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />
      {/* Rutas con verificación de rol */}
      <Route
        path="/dashboard/bookings"
        element={
          <ProtectedRoute roles={['artist']}>
            <ArtistBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute roles={['client']}>
            <ClientBookings />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/services" element={<Placeholder title="Mis Servicios" />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <BackToTop />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
