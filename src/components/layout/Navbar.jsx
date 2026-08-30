import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

const navLinks = [
  { label: 'Explorar', href: '#explorar' },
  { label: 'Fotógrafos', href: '#fotografos' },
  { label: 'Servicios', href: '#servicios' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const displayName = user?.username || user?.email?.split('@')[0] || user?.name || user?.first_name || user?.email

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
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-150 ease-out rounded-full hover:bg-zinc-900"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-zinc-300 max-w-[160px] truncate">
                {displayName}
              </span>
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

        {/* Hamburguesa - Mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors duration-150"
          aria-label="Abrir menú"
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

      {/* Menú Mobile */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-black px-4 py-4 sm:px-6 animate-[fadeIn_200ms_ease-out]">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-zinc-900">
              {isAuthenticated ? (
                <>
                  <p className="px-3 text-sm font-medium text-zinc-300 truncate">Hola, {displayName}</p>
                  <Button variant="secondary" className="w-full justify-center" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="secondary" className="w-full justify-center">
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
