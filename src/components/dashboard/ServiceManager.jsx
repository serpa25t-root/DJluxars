import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Upload, MapPin, Tag, DollarSign, Image as ImageIcon, CheckCircle2, PauseCircle, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import useColombiaApi from '../../services/colombiaApi'
import api from '../../services/api'
import { getServicesByAuthor, addService, updateService, deleteService } from '../../services/serviceStore'
import { useAuth } from '../../context/AuthContext'

const categories = ['Retrato', 'Bodas', 'Moda', 'Producto', 'Eventos', 'Editorial', 'Familia', 'Paisajes']

const ServiceWizard = ({ isOpen, onClose, onSave, editData, user }) => {
  const { departments, cities, loadingDepartments, loadingCities, loadCities } = useColombiaApi()
  const [form, setForm] = useState({
    title: '',
    category: 'Retrato',
    departamento: '',
    municipio: '',
    price: 450000,
    featuresText: '3 Horas de cobertura\n25 Fotos editadas en alta resolución\nEntrega en 3 días',
    coverImage: '',
    status: 'Activo',
  })
  const [deptId, setDeptId] = useState('')
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || '',
        category: editData.category || 'Retrato',
        departamento: editData.departamento || '',
        municipio: editData.municipio || '',
        price: editData.price || 450000,
        featuresText: (editData.features || []).join('\n'),
        coverImage: editData.coverImage || '',
        status: editData.status || 'Activo',
      })
      setPreview(editData.coverImage || '')
      if (editData.departamento && departments.length) {
        const found = departments.find((d) => d.name === editData.departamento)
        if (found) {
          setDeptId(String(found.id))
          loadCities(found.id)
        }
      }
    } else {
      setForm({
        title: '',
        category: 'Retrato',
        departamento: '',
        municipio: '',
        price: 450000,
        featuresText: '3 Horas de cobertura\n25 Fotos editadas en alta resolución\nEntrega en 3 días',
        coverImage: '',
        status: 'Activo',
      })
      setPreview('')
      setDeptId('')
    }
  }, [editData, isOpen, departments, loadCities])

  const handleDeptChange = (e) => {
    const val = e.target.value
    const selected = departments.find((d) => String(d.id) === val)
    const name = selected ? selected.name : ''
    setDeptId(val)
    setForm((p) => ({ ...p, departamento: name, municipio: '' }))
    if (val) loadCities(val)
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target.result
      setPreview(url)
      setForm((p) => ({ ...p, coverImage: url }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price) return
    setSaving(true)
    const features = form.featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
    const payload = {
      id: editData?.id || `srv_${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      departamento: form.departamento,
      municipio: form.municipio,
      price: Number(form.price),
      coverImage: form.coverImage || `https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop`,
      features,
      status: form.status,
      authorId: user?.id || 1,
      authorName: user?.username || user?.first_name || 'Fotógrafo LuxArts',
      authorAvatar: `https://i.pravatar.cc/150?img=${((user?.id || 1) % 70) + 1}`,
      verified: true,
    }
    try {
      // Intento API real
      await api.post('portfolio/', {
        title: payload.title,
        category: payload.category,
        price: payload.price,
        description: features.join(', '),
      })
    } catch {
      // fallback silencioso a local
    }
    onSave(payload, !!editData)
    setSaving(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <div>
            <h2 className="font-display text-lg font-bold text-white">{editData ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h2>
            <p className="text-xs text-zinc-400">Completa los datos del paquete</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-300 flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Nombre del Paquete/Servicio</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder='Ej. "Sesión de Retrato Studio Pro"' required className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300">Categoría</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-red-600/50 focus:outline-none">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Precio Fijo en COP</label>
              <input type="number" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="450000" required className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Departamento</label>
              <div className="relative">
                <select value={deptId} onChange={handleDeptChange} disabled={loadingDepartments} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-red-600/50 focus:outline-none disabled:opacity-60">
                  <option value="">{loadingDepartments ? 'Cargando...' : 'Selecciona departamento'}</option>
                  {departments.map((d) => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Municipio</label>
              <div className="relative">
                <select value={form.municipio} onChange={(e) => setForm((p) => ({ ...p, municipio: e.target.value }))} disabled={!deptId || loadingCities} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-red-600/50 focus:outline-none disabled:opacity-60">
                  <option value="">{!deptId ? 'Municipio' : loadingCities ? 'Cargando...' : 'Selecciona municipio'}</option>
                  {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide text-zinc-300">Lo que incluye (una por línea)</label>
            <textarea value={form.featuresText} onChange={(e) => setForm((p) => ({ ...p, featuresText: e.target.value }))} rows={4} placeholder="Ej.&#10;3 Horas de cobertura&#10;25 Fotos editadas&#10;Entrega en 3 días" className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none resize-none" />
            <div className="flex flex-wrap gap-1.5">
              {form.featuresText.split('\n').filter(Boolean).map((f, i) => (
                <span key={i} className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">{f.trim()}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300 flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Foto de portada</label>
              <input value={form.coverImage} onChange={(e) => { setForm((p) => ({ ...p, coverImage: e.target.value })); setPreview(e.target.value) }} placeholder="https://.../cover.jpg" className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">o</span>
                <label className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 cursor-pointer">
                  <Upload className="h-3.5 w-3.5" /> Subir archivo
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>
              {preview && <img src={preview} alt="preview" className="mt-2 h-32 w-full rounded-xl object-cover border border-zinc-800" />}
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-wide text-zinc-300">Estado</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-red-600/50 focus:outline-none">
                <option value="Activo">Activo</option>
                <option value="Pausado">Pausado</option>
              </select>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <p className="text-xs text-zinc-400">Vista previa estado:</p>
                <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border ${form.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {form.status === 'Activo' ? <CheckCircle2 className="h-3 w-3" /> : <PauseCircle className="h-3 w-3" />} {form.status}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 shadow-lg shadow-red-600/20 disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? 'Guardando...' : editData ? 'Guardar Cambios' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ServiceManager = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [editService, setEditService] = useState(null)

  useEffect(() => {
    setServices(getServicesByAuthor(user?.id))
  }, [user?.id])

  const handleSave = (payload, isEdit) => {
    if (isEdit) {
      const next = updateService(payload.id, payload)
      setServices(next.filter((s) => String(s.authorId) === String(user?.id) || !user?.id))
      toast.success('Servicio actualizado correctamente')
    } else {
      const next = addService(payload)
      setServices(next.filter((s) => String(s.authorId) === String(user?.id) || !user?.id))
      toast.success('Servicio publicado exitosamente')
    }
  }

  const handleEdit = (srv) => {
    setEditService(srv)
    setIsWizardOpen(true)
  }
  const handleDelete = (id) => {
    const next = deleteService(id)
    setServices(next.filter((s) => String(s.authorId) === String(user?.id) || !user?.id))
    toast.success('Servicio eliminado')
  }
  const handleToggleStatus = (srv) => {
    const nextStatus = srv.status === 'Activo' ? 'Pausado' : 'Activo'
    const next = updateService(srv.id, { status: nextStatus })
    setServices(next.filter((s) => String(s.authorId) === String(user?.id) || !user?.id))
    toast.success(`Servicio ${nextStatus.toLowerCase()}`)
  }

  const formatCOP = (v) => `$${Number(v).toLocaleString('es-CO')} COP`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Servicios</h2>
          <p className="text-xs text-zinc-500">Gestiona tus paquetes publicados</p>
        </div>
        <button onClick={() => { setEditService(null); setIsWizardOpen(true) }} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors">
          <Plus className="h-4 w-4" /> Crear Nuevo Servicio
        </button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 py-16 text-center">
          <Award className="h-8 w-8 text-zinc-600 mx-auto" />
          <p className="mt-3 text-sm font-medium text-white">Aún no has creado servicios</p>
          <p className="text-xs text-zinc-500 mt-1">Crea tu primer paquete para aparecer en Explorar</p>
          <button onClick={() => setIsWizardOpen(true)} className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">+ Crear Nuevo Servicio</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl hover:border-zinc-700 transition-all">
              <div className="relative h-40 overflow-hidden bg-zinc-900">
                <img src={srv.coverImage} alt={srv.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest border backdrop-blur-md ${srv.status === 'Activo' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-amber-500/90 text-black border-amber-400'}`}>{srv.status}</span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white">{srv.category}</span>
                </div>
                <span className="absolute bottom-3 right-3 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-3 py-1 text-xs font-bold text-white">{formatCOP(srv.price)}</span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-white text-sm leading-tight">{srv.title}</h3>
                <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{srv.departamento}{srv.municipio ? `, ${srv.municipio}` : ''} • {srv.category}</p>
                <ul className="mt-3 space-y-1 flex-1">
                  {(srv.features || []).slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-zinc-300"><span className="h-1 w-1 rounded-full bg-red-500" />{f}</li>
                  ))}
                </ul>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button onClick={() => handleEdit(srv)} className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"><Pencil className="h-3 w-3" /> Editar</button>
                  <button onClick={() => handleToggleStatus(srv)} className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:border-zinc-700">{srv.status === 'Activo' ? <PauseCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}{srv.status === 'Activo' ? 'Pausar' : 'Activar'}</button>
                  <button onClick={() => handleDelete(srv.id)} className="inline-flex items-center justify-center gap-1 rounded-full bg-red-600/10 border border-red-600/20 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-600 hover:text-white"><Trash2 className="h-3 w-3" /> Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceWizard isOpen={isWizardOpen} onClose={() => { setIsWizardOpen(false); setEditService(null) }} onSave={handleSave} editData={editService} user={user} />
    </div>
  )
}

export default ServiceManager
