import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePreferences } from '../../context/AppPreferencesContext'
import NotificationBell from './NotificationBell'
import { getBookings } from '../../services/bookings'

const userIcon = 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'

const artistSidebarLinks = [
  { label: 'Inicio', to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', exact: true },
  { label: 'Perfil', to: '/dashboard/perfil', icon: userIcon },
  { label: 'Historial', to: '/dashboard/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Estadísticas', to: '/dashboard/stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
{ label: 'Configuración', to: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const clientSidebarLinks = [
  { label: 'Inicio', to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', exact: true },
  { label: 'Perfil', to: '/dashboard/perfil', icon: userIcon },
  { label: 'Explorar', to: '/explorar', icon: 'M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z' },
  { label: 'Historial', to: '/dashboard/history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
{ label: 'Favoritos', to: '/dashboard/favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { label: 'Configuración', to: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const { t } = usePreferences()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [pendingBookings, setPendingBookings] = useState(0)
  const userMenuRef = useRef(null)

  useEffect(() => {
    if (!isUserMenuOpen) return
    const onPointerDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isUserMenuOpen])

  useEffect(() => {
    setIsUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    try {
      const pending = getBookings().filter((b) => b.status === 'Pendiente').length
      setPendingBookings(pending)
    } catch {
      setPendingBookings(0)
    }
  }, [location.pathname])

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutModal(false)
    setIsSidebarOpen(false)
  }
  const email = user?.email ? user.email.split('@')[0] : ''
  const displayName = user?.first_name || user?.username || email || 'Ana'
  const initials = displayName.slice(0, 1).toUpperCase()
  const isClient = user?.role === 'client'
  const sidebarLinks = isClient ? clientSidebarLinks : artistSidebarLinks

  const avatarSrc = user?.avatar_url || user?.avatar || ''
  const isProfileActive = location.pathname.startsWith('/dashboard/perfil')

  const profileItems = isClient
    ? [
        { label: t('sidebar_profile'), to: '/dashboard/perfil', icon: User },
        { label: t('sidebar_settings'), to: '/dashboard/settings', icon: Settings },
      ]
    : [
        { label: 'Ver Perfil Público', to: `/fotografos/${user?.id}`, icon: User },
        { label: t('sidebar_settings'), to: '/dashboard/settings', icon: Settings },
      ]

  // Role-specific top navigation links for desktop
  const topNavLinks = isClient
    ? [
        { label: 'Inicio', to: '/dashboard', noActive: true },
        { label: 'Explorar', to: '/explorar' },
        { label: 'Reservaciones', to: '/my-bookings', pill: true },
        { label: 'Mensajes', to: '/dashboard/mensajes' },
      ]
    : [
        { label: 'Inicio', to: '/dashboard', noActive: true },
        { label: 'Portafolio', to: '/dashboard/portfolio' },
        { label: 'Reservas', to: '/dashboard/bookings', pill: true },
        { label: 'Servicios', to: '/dashboard/services' },
        { label: 'Mensajes', to: '/dashboard/mensajes' },
      ]

  const isLinkActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <div className="flex h-screen bg-[#070709] text-white overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between p-4 ${isSidebarOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full"}`}>
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

          <div className="md:hidden mt-4 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <Link to="/dashboard/perfil" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 min-w-0">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="h-9 w-9 rounded-full object-cover ring-2 ring-red-600/40" />
              ) : (
                <span className="h-9 w-9 rounded-full bg-zinc-800 border-2 border-red-600/30 flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </span>
              )}
              <span className="min-w-0 truncate text-sm font-bold text-white">{displayName}</span>
            </Link>
            <NotificationBell />
          </div>

          <nav className="mt-6 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = link.exact ? location.pathname === link.to : location.pathname === link.to || location.pathname.startsWith(link.to + '/')
              const labelKey = {
                'Inicio': 'sidebar_home',
                'Perfil': 'sidebar_profile',
                'Explorar': 'sidebar_explore',
                'Historial': 'sidebar_history',
                'Estadísticas': 'sidebar_stats',
                'Configuración': 'sidebar_settings',
                'Portafolio': 'sidebar_portfolio',
                'Servicios': 'sidebar_services',
                'Favoritos': 'sidebar_favorites',
              }[link.label]
              const label = labelKey ? t(labelKey) : link.label
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
                  <span className="flex-1">{label}</span>
                  {link.badge && <span className="rounded-full bg-red-600 text-white text-xs font-bold px-2 py-0.5">{link.badge}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="space-y-4">
              {isClient ? (
            <div className="rounded-xl border border-red-900/30 bg-gradient-to-t from-red-900/20 to-transparent p-4">
              <h3 className="text-sm font-bold text-white">{t('sidebar_client_cta')}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{t('sidebar_client_desc')}</p>
              <Link to="/register" onClick={() => setIsSidebarOpen(false)} className="mt-4 block w-full rounded-full border border-red-900/30 bg-transparent py-2.5 text-center text-sm font-semibold text-white hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors">
                {t('sidebar_client_btn')}
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-red-900/30 bg-gradient-to-t from-red-900/20 to-transparent p-4">
              <h3 className="text-sm font-bold text-white">{t('sidebar_pro')}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{t('sidebar_pro_desc')}</p>
              <Link to="/dashboard/pro" onClick={() => setIsSidebarOpen(false)} className="mt-4 block w-full rounded-full bg-red-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                {t('sidebar_pro_btn')}
              </Link>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t('sidebar_logout')}
          </button>
        </div>
      </aside>

      {isSidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />)}

      <main className="flex-1 w-full flex flex-col h-screen overflow-hidden bg-[#070709]">
        <div className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-zinc-950 border-b border-zinc-800 shadow-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-white">LuxArts</span>
            </Link>
          </div>

<nav className="hidden md:flex items-center gap-2 text-sm">
            {topNavLinks.map((link) => {
              const isActive = link.noActive ? false : isLinkActive(link.to)
              const lblKey = {
                'Inicio': 'sidebar_home',
                'Explorar': 'sidebar_explore',
                'Reservaciones': 'sidebar_bookings',
                'Reservas': 'sidebar_bookings_artist',
                'Mensajes': 'sidebar_messages',
                'Portafolio': 'sidebar_portfolio',
                'Servicios': 'sidebar_services',
              }[link.label]
              const label = lblKey ? t(lblKey) : link.label
              if (link.pill) {
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                        : 'bg-red-600/10 text-red-400 border border-red-600/25 hover:bg-red-600 hover:text-white'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {label}
                    {pendingBookings > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[11px] font-bold text-red-600 leading-none">
                        {pendingBookings}
                      </span>
                    )}
                  </Link>
                )
              }
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-3 py-2 rounded-full transition-colors ${isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex gap-4 items-center">
            <NotificationBell />
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors ${isUserMenuOpen || isProfileActive ? 'bg-zinc-900' : 'hover:bg-zinc-900'}`}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt={displayName} className="h-8 w-8 rounded-full object-cover ring-2 ring-red-600/40" />
                ) : (
                  <span className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-red-600/30 flex items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
<span className="hidden sm:inline text-sm font-bold text-white">{displayName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-zinc-500 hidden sm:block transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 animate-[scaleIn_180ms_var(--ease-out-expo)_both]"
                >
                  <div className="flex items-center gap-3 border-b border-zinc-900 px-4 py-3">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={displayName} className="h-10 w-10 rounded-full object-cover ring-2 ring-red-600/40" />
                    ) : (
                      <span className="h-10 w-10 rounded-full bg-zinc-800 border-2 border-red-600/30 flex items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                      <p className="truncate text-xs text-zinc-500">{user?.email || `@${user?.username}`}</p>
                    </div>
                  </div>

                  <div className="p-1.5">
                    {profileItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.label}
                          type="button"
                          role="menuitem"
                          onClick={() => { setIsUserMenuOpen(false); navigate(item.to) }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                        >
                          <Icon className="h-4 w-4 text-zinc-400" />
                          {item.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="border-t border-zinc-900 p-1.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setIsUserMenuOpen(false); handleLogout() }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-950/30 hover:text-red-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          <Outlet />
        </div>
      </main>

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
    </div>
  )
}

export default DashboardLayout