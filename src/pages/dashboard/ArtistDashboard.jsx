import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ArtistDashboard = () => {
  const { user } = useAuth()
  const name = user?.first_name || user?.username || user?.email?.split('@')[0] || 'Ana'

  const stats = [
    { value: '12', label: 'Proyectos activos', change: '+2 esta semana', positive: true },
    { value: '5', label: 'Solicitudes pendientes', change: '+3 nuevas', positive: true },
    { value: '8', label: 'Entregas este mes', change: '2 en revisión', positive: false },
    { value: '96%', label: 'Satisfacción', change: '+1.2% vs mes anterior', positive: true },
  ]

  const bookings = [
    { id: 1, title: 'Sesión editorial — Vogue', date: '12 Jun, 10:00 AM', avatar: 'https://i.pravatar.cc/100?img=32', status: 'Confirmada' },
    { id: 2, title: 'Boda — Hacienda Paraíso', date: '15 Jun, 4:00 PM', avatar: 'https://i.pravatar.cc/100?img=14', status: 'Pendiente' },
    { id: 3, title: 'Campaña moda — Zara TRF', date: '18 Jun, 9:00 AM', avatar: 'https://i.pravatar.cc/100?img=26', status: 'Pendiente' },
  ]

  const projects = [
    { title: 'Nocturne Studio', meta: '12 fotos • Mayo 2025', img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=260&fit=crop' },
    { title: 'Luz de Neón', meta: '8 fotos • Abril 2025', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=260&fit=crop' },
    { title: 'Pasarela Nocturna', meta: '15 fotos • Marzo 2025', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=260&fit=crop' },
    { title: 'Geometría Urbana', meta: '10 fotos • Feb 2025', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=260&fit=crop' },
    { title: 'Ritual de Luces', meta: '9 fotos • Ene 2025', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=260&fit=crop' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8">
        <p className="text-sm text-zinc-400">Bienvenida de nuevo, {name} 👋</p>
        <h1 className="mt-2 font-serif text-5xl sm:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight text-white">
          Tu talento, <br />
          tu historia, <br />
          <span className="text-red-600 font-serif">tu legado.</span>
        </h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/explorar" className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 shadow-lg shadow-red-600/20 transition-colors">
            Explorar Proyectos
          </Link>
          <Link to="/dashboard/portfolio" className="rounded-full border border-zinc-700 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-900 hover:border-zinc-600 transition-colors">
            + Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-white">Resumen de actividad</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-[#0a0a0a] border border-zinc-800/50 p-4">
                <p className="font-display text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-zinc-400">{s.label}</p>
                <p className="mt-3 text-xs font-medium text-green-500">{s.change}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Próximas reservas</h2>
            <Link to="/dashboard/bookings" className="text-xs font-medium text-red-400 hover:text-red-300">Ver todo →</Link>
          </div>
          <div className="mt-6 space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl bg-[#0a0a0a] border border-zinc-800/50 p-3">
                <img src={b.avatar} alt={b.title} className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{b.title}</p>
                  <p className="text-xs text-zinc-500">{b.date}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${b.status === 'Confirmada' ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-amber-500/15 border-amber-500/30 text-amber-300'}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proyectos recientes */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Proyectos recientes</h2>
          <Link to="/dashboard/portfolio" className="text-xs font-medium text-zinc-400 hover:text-white">Ver todos</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {projects.map((p) => (
            <div key={p.title} className="group">
              <div className="aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="mt-2 text-sm font-medium text-white truncate">{p.title}</p>
              <p className="text-xs text-zinc-400">{p.meta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 border-t border-zinc-900 pt-6">
        {[
          { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', value: '15K+', label: 'Obras' },
          { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29', value: '4.9/5', label: 'Calificación' },
          { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', value: '98%', label: 'Satisfacción' },
          { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z', value: '24/7', label: 'Soporte' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-white leading-none">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArtistDashboard
