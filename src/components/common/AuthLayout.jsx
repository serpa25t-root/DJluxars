import { Link } from 'react-router-dom'

/**
 * AuthLayout taste — contenedor cinemático reutilizable
 * Fondo negro profundo, borde con brillo rojo sutil, grain, glows
 */
const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-black">
      {/* Header minimal — logo a home */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[64px] flex items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-600/20 group-hover:bg-red-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-white">LuxArts</span>
            <span className="hidden sm:inline-flex rounded-full border border-red-600/30 bg-red-600/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-red-400">CINEMATIC</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 overflow-hidden">
        {/* fondo */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-black to-black" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-red-600/70" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative w-full max-w-md animate-[fadeInUp_500ms_var(--ease-out-quart)_both]">
          {/* Tarjeta */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* top accent */}
            <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent opacity-80" />
            <div className="p-6 sm:p-8">
              <div className="text-center">
                <h1 className="font-display text-2xl font-bold tracking-tight text-white">{title}</h1>
                {subtitle && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{subtitle}</p>}
              </div>
              <div className="mt-6">{children}</div>
              {footer && <div className="mt-6 text-center text-sm text-zinc-400 border-t border-zinc-800 pt-6">{footer}</div>}
            </div>
          </div>

          {/* glow sutil bajo tarjeta */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-20 w-[80%] rounded-full bg-red-600/10 blur-2xl pointer-events-none -z-10" />
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
