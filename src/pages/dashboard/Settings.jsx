import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'

const Settings = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({
    firstName: user?.first_name || user?.username?.split(' ')[0] || '',
    lastName: user?.last_name || user?.username?.split(' ')[1] || '',
    phone: user?.phone_number || '',
    bio: user?.bio || '',
  })
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setToast('Cambios guardados con éxito')
    setTimeout(() => setToast(null), 2500)
  }

  const initials = (form.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración de Perfil</h1>
        <p className="text-sm text-zinc-400 mt-1">Actualiza tu información personal y foto de perfil.</p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Foto de perfil</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-red-600/30 flex items-center justify-center text-2xl font-bold text-white">
            {initials}
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 text-sm font-medium transition-colors">Subir nueva foto</button>
            <button className="px-4 py-2 rounded-full bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium transition-colors">Eliminar</button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="block text-xs font-medium tracking-wide text-zinc-300">Nombre</label>
            <input id="firstName" value={form.firstName} onChange={handleChange} placeholder="Jesús" className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/20" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="block text-xs font-medium tracking-wide text-zinc-300">Apellido</label>
            <input id="lastName" value={form.lastName} onChange={handleChange} placeholder="Serpa" className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/20" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-xs font-medium tracking-wide text-zinc-300">Teléfono</label>
          <input id="phone" value={form.phone} onChange={handleChange} placeholder="+57 300 000 0000" className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/20" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="bio" className="block text-xs font-medium tracking-wide text-zinc-300">Descripción / Bio</label>
          <textarea id="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Cuéntanos sobre ti y tu trabajo..." className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/20 resize-none" />
        </div>
        <Button type="submit" variant="primary" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-600/20">
          Guardar Cambios
        </Button>
        {toast && <p className="text-sm text-emerald-400 text-center animate-[fadeIn_200ms_ease-out]">{toast}</p>}
      </form>
    </div>
  )
}

export default Settings
