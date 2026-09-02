import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const publicLinks = [
  { label: 'Explorar', to: '/explorar', type: 'route' },
  { label: 'Fotógrafos', to: '/fotografos', type: 'route' },
  { label: 'Servicios', to: '/servicios', type: 'route' },
]

const authLinks = (isArtist) => [
  { label: 'Servicios', to: isArtist ? '/dashboard/services' : '/servicios', type: 'route' },
  { label: 'Reservas', to: isArtist ? '/dashboard/bookings' : '/my-bookings', type: 'route' },
  { label: 'Mensajes', to: '/chat', type: 'route' },
  { label: 'Portafolio', to: '/dashboard/portfolio', type: 'route' },
]

const profileItems = [
  { label: 'Ver Perfil', to: '/dashboard/perfil', icon: User },
]

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const isLanding = location.pathname === '/' || location.pathname === '/login'

  const [notifications] = useState([
    { id: 1, title: 'Nueva reserva recibida', body: 'Elena Mora solicitó una sesión para el 12 Jun.' },
    { id: 2, title: 'Mensaje nuevo', body: 'Tienes un mensaje de Marc Dubois en el chat.' },
  ])

  const email = user?.email ? user.email.split('@')[0] : ''
  const displayName = user?.username || email || user?.name || user?.first_name || email || 'Usuario'
  const initials = displayName.slice(0, 2).toUpperCase()
  const isOnline = isAuthenticated
  const isArtist = user?.role === 'artist'

  const navLinks = isAuthenticated ? authLinks(isArtist) : publicLinks

  const handleLogout = () => {
    setIsProfileOpen(false)
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutModal(false)
    setIsOpen(false)
  }

  useEffect(() => { setIsOpen(false); setIsProfileOpen(false); setIsNotifOpen(false) }, [location.pathname])
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-red-900/20 shadow-2xl shadow-black/50">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-md shadow-red-600/30 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-red-600/40 transition-all duration-300 ease-out will-change-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-white">LuxArts</span>
            <span className="block text-[9px] font-semibold tracking-[0.35em] text-red-500/80 uppercase">Photography</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated && !isLanding ? (
            navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium border-b-2 px-4 py-3 transition-colors ${
                    isActive
                      ? 'border-red-600 text-white'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))
          ) : (
            navLinks.map((link) =>
              link.type === 'route' ? (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-out ${
                      isActive
                        ? 'bg-red-600/10 text-red-400 border border-red-600/20 shadow-sm shadow-red-600/10'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-150 ease-out rounded-full hover:bg-zinc-900 border border-transparent"
                >
                  {link.label}
                </a>
              )
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && !isLanding ? (
            <>
              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                  <div className="relative">
                    <Bell className="w-5 h-5 text-zinc-300 hover:text-white transition-colors" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                      </span>
                    )}
                  </div>
                </button>
                {isNotifOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50">
                    <div className="p-4">
                      <p className="text-sm font-semibold text-white">Notificaciones</p>
                      {notifications.length === 0 ? (
                        <p className="mt-3 text-sm text-zinc-400">No tienes notificaciones nuevas.</p>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {notifications.map((n) => (
                            <div key={n.id} className="rounded-xl bg-zinc-800/50 p-3 border border-zinc-800">
                              <p className="text-sm font-medium text-white">{n.title}</p>
                              <p className="text-xs text-zinc-400">{n.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/60 pl-1 pr-3 py-1 hover:border-red-600/40 hover:bg-zinc-900 transition-colors"
                >
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600/80 to-red-900 border-2 border-red-600/40 text-white text-xs font-bold">
                      {initials.slice(0, 2)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                  <span className="text-sm font-medium text-zinc-200 max-w-[110px] truncate">{displayName}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 animate-[fadeIn_150ms_ease-out]">
                    <div className="px-4 py-4 border-b border-zinc-800 bg-zinc-950/40">
                      <p className="text-sm font-display font-bold text-white">{displayName}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{isArtist ? 'Fotógrafo' : 'Cliente'} • Sesión activa</p>
                    </div>
                    <div className="p-1.5">
                      {profileItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-red-600/10 transition-colors"
                          >
                            <Icon className="h-4 w-4 text-zinc-400" /> {item.label}
                          </Link>
                        )
                      })}
                    </div>
                    <div className="p-1.5 border-t border-zinc-800">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all text-sm font-medium">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 transition-all text-sm font-semibold active:scale-95">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex md:hidden items-center justify-center rounded-lg p-2.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-red-900/20 bg-zinc-950 shadow-2xl shadow-black/50 animate-[fadeIn_200ms_ease-out]">
          <div className="px-4 py-4 sm:px-6">
            {isAuthenticated && !isLanding && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-600/80 to-red-900 border-2 border-red-600/40 text-white text-sm font-bold">
                    {initials.slice(0, 2)}
                  </div>
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  <p className="text-xs text-zinc-400">{isArtist ? 'Fotógrafo' : 'Cliente'} • Sesión activa</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {isAuthenticated && !isLanding ? (
                navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-3 text-base font-medium rounded-lg transition-colors ${isActive ? 'bg-zinc-900 text-white border border-red-600/20' : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))
              ) : (
                navLinks.map((link) =>
                  link.type === 'route' ? (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `px-3 py-3 text-base font-medium rounded-lg transition-colors ${isActive ? 'bg-zinc-900 text-white border border-red-600/20' : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent'}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                )
              )}
            </div>

            <div className="mt-3 flex flex-col gap-1">
              {isAuthenticated && !isLanding && profileItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                  >
                    <Icon className="h-4 w-4 inline mr-2 -mt-0.5" /> {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-zinc-900">
              {isAuthenticated && !isLanding ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all text-sm font-medium text-center"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full px-4 py-2.5 rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 text-center text-sm font-medium transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="w-full px-4 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 text-center text-sm font-semibold transition-colors">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-lg font-semibold text-white">¿Cerrar sesión?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              ¿Estás seguro de que deseas salir? Tendrás que iniciar sesión de nuevo para acceder.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-full border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors"
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header