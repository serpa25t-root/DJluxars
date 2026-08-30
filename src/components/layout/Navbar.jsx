import { useState } from 'react'
import Button from '../common/Button'

const navLinks = [
  { label: 'Explorar', href: '#explorar' },
  { label: 'Fotógrafos', href: '#fotografos' },
  { label: 'Servicios', href: '#servicios' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-[64px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c5a253] text-zinc-950 font-display font-bold text-lg leading-none group-hover:bg-[#b8933f] transition-colors">
            L
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            LuxArts
          </span>
        </a>

        {/* Menú central - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="secondary" className="border-zinc-700">
            Iniciar Sesión
          </Button>
          <Button variant="primary">Registrarse</Button>
        </div>

        {/* Hamburguesa - Mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          aria-label="Abrir menú"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú Mobile desplegable */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 sm:px-6 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-zinc-800">
              <Button variant="secondary" className="w-full justify-center">
                Iniciar Sesión
              </Button>
              <Button variant="primary" className="w-full justify-center">
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
