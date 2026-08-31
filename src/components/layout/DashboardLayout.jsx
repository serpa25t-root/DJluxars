import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const artistSidebarLinks = [
  { label: 'Inicio', to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', exact: true },
  { label: 'Mi Portafolio', to: '/dashboard/portfolio', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Reservas', to: '/dashboard/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Historial', to: '/dashboard/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Estadísticas', to: '/dashboard/stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: 'Mensajes', to: '/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', badge: '3' },
  { label: 'Configuración', to: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const clientSidebarLinks = [
  { label: 'Inicio', to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', exact: true },
  { label: 'Explorar', to: '/explorar', icon: 'M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z' },
  { label: 'Mis Reservas', to: '/my-bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Historial', to: '/dashboard/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Favoritos', to: '/dashboard/favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { label: 'Mensajes', to: '/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', badge: '3' },
  { label: 'Configuración', to: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const displayName = user?.username || user?.email?.split('@')[0] || 'Ana'
  const initials = displayName.slice(0, 1).toUpperCase()
  const isClient = user?.role === 'client'
  const sidebarLinks = isClient ? clientSidebarLinks : artistSidebarLinks

  return (
    <div className="flex h-screen bg-[#101010] text-white overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 bg-[#101010] border-r border-red-900/30 flex flex-col justify-between p-4 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">LuxArts</span>
          </div>

          <nav className="mt-6 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = link.exact ? location.pathname === link.to : location.pathname === link.to || location.pathname.startsWith(link.to + '/')
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-red-600/10 text-red-500 border-r-2 border-red-600' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  <span className="flex-1">{link.label}</span>
                  {link.badge && <span className="rounded-full bg-red-600 text-white text-xs font-bold px-2 py-0.5">{link.badge}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="space-y-4">
          {isClient ? (
            <div className="rounded-xl border border-red-900/30 bg-gradient-to-t from-red-900/20 to-transparent p-4">
              <h3 className="text-sm font-bold text-white">¿Eres fotógrafo?</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">Únete a LuxArts y muestra tu talento al mundo.</p>
              <Link to="/register" onClick={() => setIsSidebarOpen(false)} className="mt-4 block w-full rounded-full border border-red-900/30 bg-transparent py-2.5 text-center text-sm font-semibold text-white hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors">
                Registrarme como fotógrafo
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-red-900/30 bg-gradient-to-t from-red-900/20 to-transparent p-4">
              <h3 className="text-sm font-bold text-white">Únete a LuxArts PRO</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">Desbloquea 6 servicios, 30 fotos y prioridad #1 en el catálogo.</p>
              <Link to="/dashboard/portfolio" onClick={() => setIsSidebarOpen(false)} className="mt-4 block w-full rounded-full bg-red-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                Ver Planes PRO
              </Link>
            </div>
          )}
          <button
            onClick={() => { logout(); setIsSidebarOpen(false) }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {isSidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />)}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-[#101010]/80 border-b border-red-900/30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="hidden md:flex items-center gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-white">LuxArts</span>
              <span className="rounded-full border border-red-600/30 bg-red-600/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-red-400">CINEMATIC</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/explorar" className="text-zinc-400 hover:text-white transition-colors">Explorar</Link>
            <Link to="/my-bookings" className="text-zinc-400 hover:text-white transition-colors">Mis Reservas</Link>
            <Link to="/chat" className="relative text-zinc-400 hover:text-white transition-colors">
              Mensajes<span className="ml-2 px-2 py-0.5 rounded-full bg-red-600 text-xs">3</span>
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <button className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-red-600/30 flex items-center justify-center text-xs font-bold text-white">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-zinc-200">Hola, {displayName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
