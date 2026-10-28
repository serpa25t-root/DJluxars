import { lazy, Component, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppPreferencesProvider } from './context/AppPreferencesContext'
import ScrollToTop from './components/common/ScrollToTop'
import BackToTop from './components/common/BackToTop'
import ToastProvider from './components/common/ToastProvider'
import { hasRole } from './utils/roles'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import ArtistDashboard from './pages/dashboard/ArtistDashboard'
import ClientDashboard from './pages/dashboard/ClientDashboard'
import ProSubscription from './pages/dashboard/ProSubscription'
import History from './pages/dashboard/History'
import ServiceManager from './components/dashboard/ServiceManager'
import ServiceDetail from './pages/ServiceDetail'
import Profile from './pages/dashboard/Profile'
import AppSettings from './pages/dashboard/AppSettings'
import HomeFeed from './pages/dashboard/HomeFeed'

// ✅ 1. IMPORTACIÓN INMEDIATA (Cero retraso de red para la página principal)
import Home from './pages/Home'

// ⚡ El resto se mantiene "lazy" para ahorrar memoria
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Portfolio = lazy(() => import('./pages/dashboard/Portfolio'))
const Explore = lazy(() => import('./pages/Explore'))
const Photographers = lazy(() => import('./pages/Photographers'))
const Services = lazy(() => import('./pages/Services'))
const ArtistProfile = lazy(() => import('./pages/ArtistProfile'))
const ArtistBookings = lazy(() => import('./pages/dashboard/ArtistBookings'))
const ClientBookings = lazy(() => import('./pages/ClientBookings'))
const Chat = lazy(() => import('./pages/Chat'))
const Settings = lazy(() => import('./pages/dashboard/Settings'))
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'))

const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-400">
    <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error)
    this.setState({ errorInfo })
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error de Renderizado</h1>
            {import.meta.env.PROD ? (
              <p className="text-zinc-400 mb-2 text-sm">Ha ocurrido un error inesperado. Por favor, recarga la página.</p>
            ) : (
              <>
                <p className="text-zinc-400 mb-2 font-mono text-sm">{this.state.error?.toString()}</p>
                <p className="text-zinc-500 mb-4 text-xs">{this.state.error?.message}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-left text-xs text-zinc-600 bg-zinc-900 p-4 rounded-lg overflow-auto max-h-48 mb-4">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const Placeholder = ({ title }) => (
  <div className="min-h-[100dvh] flex flex-col bg-black">
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center border border-red-600/20 bg-zinc-900/60 rounded-2xl px-8 py-10 backdrop-blur-xl">
        <p className="text-sm tracking-widest text-red-400 font-semibold">LUXARS</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">{title}</h1>
      </div>
    </div>
  </div>
)

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth()
  if (loading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.some((r) => hasRole(user, r))) return <Navigate to="/" replace />
  return children
}

const DashboardIndex = () => {
  const { user } = useAuth()
  if (user?.role === 'admin') return <AdminDashboard />
  return <HomeFeed />
}

// ✅ 2. CORRECCIÓN CRÍTICA: Renderizar la portada sin hacerla esperar por AuthContext
const HomeRoute = () => {
  return <Home />
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/fotografos" element={<Photographers />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/fotografos/:id" element={<ArtistProfile />} />
        <Route path="/servicios/:id" element={<ServiceDetail />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardIndex />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="perfil" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<ProtectedRoute roles={['artist']}><ArtistBookings /></ProtectedRoute>} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="favorites" element={<Placeholder title="Favoritos" />} />
          <Route path="stats" element={<Placeholder title="Estadísticas" />} />
          <Route path="history" element={<History />} />
          <Route path="mensajes" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="configuracion" element={<Settings />} />
          <Route path="app-settings" element={<AppSettings />} />
          <Route path="projects" element={<Placeholder title="Mis Proyectos" />} />
          <Route path="reviews" element={<Placeholder title="Valoraciones" />} />
          <Route path="pro" element={<ProSubscription />} />
        </Route>
        <Route path="/explorar" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Explore />} />
        </Route>
        <Route path="/my-bookings" element={<ProtectedRoute roles={['client']}><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<ClientBookings />} />
        </Route>
        <Route path="/chat" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Chat />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppPreferencesProvider>
            <ScrollToTop />
            <AppRoutes />
            <BackToTop />
            <ToastProvider />
          </AppPreferencesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
