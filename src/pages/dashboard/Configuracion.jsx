import { Link } from 'react-router-dom'
import AppSettings from './AppSettings'

const Configuracion = () => {
  return (
    <div className="mx-auto max-w-3xl animate-[fadeIn_300ms_ease-out]">
      <div className="mb-6">
        <Link
          to="/dashboard/perfil"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a mi perfil
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">Configuración</h1>
        <p className="mt-1 text-sm text-zinc-400">Personaliza tu experiencia en LuxArts.</p>
      </div>

      <AppSettings />
    </div>
  )
}

export default Configuracion