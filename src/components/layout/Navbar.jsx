import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

const publicLinks = [
  { label: 'Explorar', to: '/explorar', type: 'route' },
  { label: 'Fotógrafos', href: '#fotografos', type: 'anchor' },
  { label: 'Servicios', href: '#servicios', type: 'anchor' },
]

const artistLinks = [
  { label: 'Mi Portafolio', to: '/dashboard/portfolio', type: 'route' },
  { label: 'Mis Servicios', to: '/dashboard/services', type: 'route' },
  { label: 'Solicitudes', to: '/dashboard/bookings', type: 'route' },
]

const clientLinks = [
  { label: 'Explorar', to: '/explorar', type: 'route' },
  { label: 'Mis Reservas', to: '/my-bookings', type: 'route' },
  { label: 'Chat', to: '/chat', type: 'route' },
]

const roleBadge = {
  artist: 'Fotógrafo',
  client: 'Cliente',
  admin: 'Admin',
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const role = user?.role
  const displayName = user?.username || user?.email?.split('@')[0] || user?.name || user?.first_name || user?.email || 'Usuario'
  const badgeLabel = roleBadge[role] || null

  let navLinks = publicLinks
  if (isAuthenticated) {
    if (role === 'artist') navLinks = artistLinks
    else if (role === 'client') navLinks = clientLinks
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  // Cierra al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Cierra al redimensionar a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/70">
      <nav className="mx-auto flex h-[64px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo -> / */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-600/20 group-hover:bg-red-700 group-hover:shadow-red-600/30 transition-all duration-200 ease-out will-change-transform group-active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            LuxArts
          </span>
          <span className="hidden sm:inline-flex ml-1 rounded-full border border-red-600/30 bg-red-600/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-red-400">
            CINEMATIC
          </span>
        </Link>

        {/* Menú central - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.type === 'route' ? (
              <Link
                key={link.label}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-150 ease-out rounded-full hover:bg-zinc-900"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-150 ease-out rounded-full hover:bg-zinc-900"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Perfil + CTAs - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 max-w-[200px]">
                <span className="text-sm font-medium text-zinc-200 truncate">{displayName}</span>
                {badgeLabel && (
                  <span className="inline-flex items-center rounded-full border border-red-600/30 bg-red-600/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-red-300 whitespace-nowrap">
                    {badgeLabel}
                  </span>
                )}
              </div>
              <Button variant="secondary" className="border-zinc-800" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" className="border-zinc-800">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Registrarse</Button>
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa - Mobile: block md:hidden */}
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

      {/* Drawer / Dropdown Mobile */}
      {isOpen && (
        <div className="md:hidden border-t border-red-600/20 bg-zinc-950 shadow-xl shadow-black/50 animate-[fadeIn_200ms_ease-out]">
          <div className="px-4 py-4 sm:px-6">
            {isAuthenticated && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-600/20 bg-red-600/10 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  {badgeLabel && <p className="text-xs text-red-300">{badgeLabel}</p>}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {navLinks.map((link) =>
                link.type === 'route' ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-zinc-900">
              {isAuthenticated ? (
                <Button variant="secondary" className="w-full justify-center border-zinc-800" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="secondary" className="w-full justify-center border-zinc-800">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="primary" className="w-full justify-center">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
