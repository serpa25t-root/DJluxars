import { useState } from 'react'
import Settings from './Settings'
import AppSettings from './AppSettings'

const sections = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'app', label: 'Aplicación' },
]

const Configuracion = () => {
  const [section, setSection] = useState('perfil')

  return (
    <div className="mx-auto max-w-3xl animate-[fadeIn_300ms_ease-out]">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">Configuración</h1>
        <p className="mt-1 text-sm text-zinc-400">Administra tu perfil y personaliza tu experiencia en LuxArts.</p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 border-b border-zinc-900">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${section === s.id ? 'border-red-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'perfil' ? <Settings /> : <AppSettings />}
    </div>
  )
}

export default Configuracion