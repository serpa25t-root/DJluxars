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
import DashboardLayout from './components/layout/DashboardLayout'
import ArtistDashboard from './pages/dashboard/ArtistDashboard'
import ClientDashboard from './pages/dashboard/ClientDashboard'
import Settings from './pages/dashboard/Settings'
import ProSubscription from './pages/dashboard/ProSubscription'

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

const DashboardIndex = () => {
  const { user } = useAuth()
  if (user?.role === 'client') return <ClientDashboard />
  return <ArtistDashboard />
}

const HomeRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-zinc-400">
        Cargando...
      </div>
    )
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Home />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explorar" element={<Explore />} />
      <Route path="/fotografos/:id" element={<ArtistProfile />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardIndex />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="bookings" element={<ProtectedRoute roles={['artist']}><ArtistBookings /></ProtectedRoute>} />
        <Route path="services" element={<Placeholder title="Mis Servicios" />} />
        <Route path="favorites" element={<Placeholder title="Favoritos" />} />
        <Route path="stats" element={<Placeholder title="Estadísticas" />} />
        <Route path="settings" element={<Settings />} />
        <Route path="configuracion" element={<Settings />} />
        <Route path="projects" element={<Placeholder title="Mis Proyectos" />} />
        <Route path="reviews" element={<Placeholder title="Valoraciones" />} />
        <Route path="pro" element={<ProSubscription />} />
      </Route>
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute roles={['client']}>
            <ClientBookings />
          </ProtectedRoute>
        }
      />
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
