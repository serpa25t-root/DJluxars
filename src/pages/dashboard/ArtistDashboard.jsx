import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ArtistDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-12">
      {/* Hero Section */}
      <div>
        <p className="text-zinc-400">Bienvenido de nuevo, {user?.first_name || "Jesús"} 👋</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mt-2">
          Tu talento, <br /> tu historia, <br /> <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">tu legado.</span>
        </h1>
        <div className="mt-6 flex gap-4">
          <Link to="/explorar" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-red-900/20">
            Explorar Proyectos
          </Link>
          <Link to="/dashboard/portfolio" className="bg-transparent border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 text-white px-8 py-3 rounded-full font-medium transition-all">
            + Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
          <h2 className="text-sm font-semibold text-white">Resumen de actividad</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-sm text-zinc-400">Proyectos activos</p>
              <p className="text-green-500 text-sm mt-2">↑ 20% vs mes anterior</p>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-sm text-zinc-400">Solicitudes pendientes</p>
              <p className="text-green-500 text-sm mt-2">↑ 8% vs mes anterior</p>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-sm text-zinc-400">Entregas este mes</p>
              <p className="text-green-500 text-sm mt-2">↑ 12% completadas</p>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
              <p className="text-2xl font-bold text-white">96%</p>
              <p className="text-sm text-zinc-400">Satisfacción</p>
              <p className="text-green-500 text-sm mt-2">↑ 1.5% vs mes anterior</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Próximas reservas</h2>
            <Link to="/dashboard/bookings" className="text-xs font-medium text-red-400 hover:text-red-300">Ver todo →</Link>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=32" alt="Vogue" className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                <div>
                  <p className="text-sm font-medium text-white">Sesión editorial — Vogue</p>
                  <p className="text-xs text-zinc-500">12 Jun, 10:00 AM</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Confirmada</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=14" alt="Hacienda" className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                <div>
                  <p className="text-sm font-medium text-white">Boda — Hacienda Paraíso</p>
                  <p className="text-xs text-zinc-500">15 Jun, 4:00 PM</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pendiente</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100?img=26" alt="Zara" className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                <div>
                  <p className="text-sm font-medium text-white">Campaña moda — Zara TRF</p>
                  <p className="text-xs text-zinc-500">18 Jun, 9:00 AM</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pendiente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proyectos recientes */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Proyectos recientes</h2>
          <Link to="/dashboard/portfolio" className="text-sm font-medium text-red-500 hover:text-red-400">Ver todos</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          <div>
            <img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=260&fit=crop" alt="Nocturne" className="aspect-video rounded-xl object-cover hover:scale-105 transition-transform w-full" />
            <p className="mt-2 text-sm font-medium text-white">Nocturne Studio</p>
            <p className="text-xs text-zinc-400">12 fotos • Agosto 2026</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=260&fit=crop" alt="Luz" className="aspect-video rounded-xl object-cover hover:scale-105 transition-transform w-full" />
            <p className="mt-2 text-sm font-medium text-white">Luz de Neón</p>
            <p className="text-xs text-zinc-400">8 fotos • Agosto 2026</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=260&fit=crop" alt="Pasarela" className="aspect-video rounded-xl object-cover hover:scale-105 transition-transform w-full" />
            <p className="mt-2 text-sm font-medium text-white">Pasarela Nocturna</p>
            <p className="text-xs text-zinc-400">15 fotos • Agosto 2026</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=260&fit=crop" alt="Geometria" className="aspect-video rounded-xl object-cover hover:scale-105 transition-transform w-full" />
            <p className="mt-2 text-sm font-medium text-white">Geometría Urbana</p>
            <p className="text-xs text-zinc-400">10 fotos • Agosto 2026</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=260&fit=crop" alt="Ritual" className="aspect-video rounded-xl object-cover hover:scale-105 transition-transform w-full" />
            <p className="mt-2 text-sm font-medium text-white">Ritual de Luces</p>
            <p className="text-xs text-zinc-400">9 fotos • Agosto 2026</p>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-zinc-800/50 pt-10 mt-10">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">15K+</h4>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Obras</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29" />
            </svg>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">4.9/5</h4>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Calificación</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">98%</h4>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Satisfacción</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">24/7</h4>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Soporte</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistDashboard
