import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rutas dinámicas por rol — placeholder para validar navegación SPA */}
          <Route path="/dashboard/portfolio" element={<Placeholder title="Mi Portafolio" />} />
          <Route path="/dashboard/services" element={<Placeholder title="Mis Servicios" />} />
          <Route path="/dashboard/bookings" element={<Placeholder title="Solicitudes" />} />
          <Route path="/my-bookings" element={<Placeholder title="Mis Reservas" />} />
          <Route path="/chat" element={<Placeholder title="Chat" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
