import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { updateProfile } from '../../services/users'
import useColombiaApi from '../../services/colombiaApi'

const AvatarFrame = ({ src, alt, size = 'h-24 w-24', icon = 'h-6 w-6' }) =>
  src ? (
    <img src={src} alt={alt} className={`${size} rounded-full object-cover shadow-lg shadow-black/40 ring-1 ring-white/10`} />
  ) : (
    <span className={`${size} rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-white/90`}>
      <svg xmlns="http://www.w3.org/2000/svg" className={`${icon} text-zinc-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </span>
  )

const EditProfileModal = ({ isOpen, onClose, profile, onSaved }) => {
  const { departments, cities, loadingDepartments, loadingCities, loadCities, getDepartmentIdByName } = useColombiaApi()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone_number: '',
    bio: '',
    website: '',
    departamento: '',
    ciudad: '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [removeAvatarFlag, setRemoveAvatarFlag] = useState(false)
  const [removeCoverFlag, setRemoveCoverFlag] = useState(false)
  const [deptId, setDeptId] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!isOpen || !profile) return
    setForm({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      username: profile.username || '',
      phone_number: profile.phone_number || '',
      bio: profile.bio || '',
      website: profile.website || '',
      departamento: profile.departamento || '',
      ciudad: profile.ciudad || '',
    })
    setAvatarFile(null)
    setAvatarPreview(profile.avatar_url || '')
    setRemoveAvatarFlag(false)
    setCoverFile(null)
    setCoverPreview(profile.cover_url || '')
    setRemoveCoverFlag(false)
    setToast(null)
  }, [isOpen, profile])

  // Precarga ciudades cuando el usuario ya tenía departamento guardado
  useEffect(() => {
    if (!isOpen || !departments.length || !form.departamento) return
    const found = getDepartmentIdByName(form.departamento)
    if (found && String(found) !== String(deptId)) {
      setDeptId(String(found))
      loadCities(found)
    }
  }, [isOpen, departments, form.departamento, deptId, getDepartmentIdByName, loadCities])

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape' && !loading) onClose() }
    if (isOpen) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose, loading])

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [avatarFile])

  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile)
      setCoverPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [coverFile])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: value }))
  }

  const handleDepartmentChange = (e) => {
    const id = e.target.value
    setDeptId(id)
    const name = departments.find((d) => String(d.id) === String(id))?.name || ''
    setForm((p) => ({ ...p, departamento: name, ciudad: '' }))
    loadCities(id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim()) {
      setToast({ msg: 'El nombre de usuario es obligatorio.', type: 'error' })
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('first_name', form.first_name)
      fd.append('last_name', form.last_name)
      fd.append('username', form.username.trim())
      fd.append('phone_number', form.phone_number)
      fd.append('bio', form.bio)
      fd.append('website', form.website)
      fd.append('departamento', form.departamento)
      fd.append('ciudad', form.ciudad)
      if (avatarFile) fd.append('avatar', avatarFile)
      if (coverFile) fd.append('cover', coverFile)
      if (removeAvatarFlag) fd.append('avatar', '')
      // If user explicitly wants to remove cover (separate flag)
      if (removeCoverFlag) fd.append('cover', '')

      const updated = await updateProfile(fd)
      setToast({ msg: 'Perfil actualizado.', type: 'success' })
      setTimeout(() => {
        onSaved?.(updated)
        onClose()
      }, 700)
    } catch (err) {
      const data = err?.response?.data
      let msg = 'No se pudo actualizar el perfil.'
      if (data) {
        if (typeof data === 'string') msg = data
        else if (data.detail) msg = data.detail
        else if (data.username) msg = Array.isArray(data.username) ? data.username[0] : String(data.username)
        else {
          const k = Object.keys(data)[0]
          if (k) msg = Array.isArray(data[k]) ? data[k][0] : String(data[k])
        }
      }
      setToast({ msg, type: 'error' })
    } finally {
      setLoading(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !loading && onClose()} aria-hidden="true" />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 flex flex-col animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-zinc-600 via-zinc-500 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <h2 className="font-display text-lg font-bold text-white">Editar perfil</h2>
          <button onClick={onClose} disabled={loading} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors disabled:opacity-50" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Portada */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-300">Foto de portada</label>
            <div className="relative h-28 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              {!removeCoverFlag && coverPreview ? (
                <img src={coverPreview} alt="Portada" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-zinc-900 via-zinc-950 to-black" />
              )}
              <div className="absolute bottom-2 right-2 flex gap-2">
                {coverPreview && !removeCoverFlag && (
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(''); setRemoveCoverFlag(true) }}
                    className="rounded-full bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-100 transition-colors"
                  >
                    Quitar
                  </button>
                )}
                <label className="cursor-pointer rounded-full bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-100 transition-colors">
                  Cambiar
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { setCoverFile(e.target.files?.[0] || null); setRemoveCoverFlag(false) }} />
                </label>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <AvatarFrame src={removeAvatarFlag ? '' : avatarPreview} alt={form.username} />
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-full bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors">
                Cambiar foto
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { setAvatarFile(e.target.files?.[0] || null); setRemoveAvatarFlag(false) }} />
              </label>
              <button
                type="button"
                onClick={() => { setAvatarFile(null); setAvatarPreview(''); setRemoveAvatarFlag(true) }}
                className="rounded-full bg-transparent border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombre" id="first_name" value={form.first_name} onChange={handleChange} placeholder="Elena" />
            <Input label="Apellido" id="last_name" value={form.last_name} onChange={handleChange} placeholder="Mora" />
          </div>

          <Input label="Nombre de usuario" id="username" value={form.username} onChange={handleChange} placeholder="elena.mora" />
          <Input label="Teléfono" id="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+57 300 000 0000" />
          <Input label="Sitio web" id="website" value={form.website} onChange={handleChange} placeholder="https://tu-portafolio.com" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="departamento" className="block text-xs font-medium tracking-wide text-zinc-300">Departamento</label>
              <select
                id="departamento"
                value={deptId}
                onChange={handleDepartmentChange}
                disabled={loadingDepartments}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors disabled:opacity-60"
              >
                <option value="" className="bg-zinc-900">{loadingDepartments ? 'Cargando...' : 'Selecciona'}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-zinc-900">{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="ciudad" className="block text-xs font-medium tracking-wide text-zinc-300">Ciudad</label>
              <select
                id="ciudad"
                value={form.ciudad}
                onChange={(e) => setForm((p) => ({ ...p, ciudad: e.target.value }))}
                disabled={!deptId || loadingCities}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors disabled:opacity-60"
              >
                <option value="" className="bg-zinc-900">{loadingCities ? 'Cargando...' : 'Selecciona'}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name} className="bg-zinc-900">{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-xs font-medium tracking-wide text-zinc-300">Biografía</label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              maxLength={220}
              placeholder="Cuéntales quién eres y qué historias capturas..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 resize-none"
            />
            <p className="text-right text-[11px] text-zinc-600">{form.bio.length}/220</p>
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="w-full py-3.5 text-[15px] shadow-lg shadow-red-600/20 disabled:opacity-60">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>

        {toast && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border px-4 py-2 text-sm font-medium shadow-xl ${toast.type === 'success' ? 'border-white/15 bg-zinc-800 text-white' : 'border-white/15 bg-zinc-800 text-zinc-200'}`} role="alert">
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}

export default EditProfileModal
