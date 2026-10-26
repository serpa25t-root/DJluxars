const SERVICES_STORAGE_KEY = 'luxarts_services'

const seedServices = [
  {
    id: 'srv_1',
    title: 'Sesión Retrato Studio Pro',
    category: 'Retrato',
    departamento: 'Antioquia',
    municipio: 'Medellín',
    price: 350000,
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop',
    features: ['3 Horas de cobertura', '25 Fotos editadas en alta resolución', 'Entrega en 3 días', 'Galería privada online'],
    status: 'Activo',
    authorId: 4,
    authorName: 'chigui',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    verified: true,
  },
  {
    id: 'srv_2',
    title: 'Cobertura Bodas Premium',
    category: 'Bodas',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá',
    price: 850000,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    features: ['8 Horas de cobertura', '120 Fotos editadas', 'Álbum digital + Video teaser', '2 Fotógrafos'],
    status: 'Activo',
    authorId: 5,
    authorName: 'sofiateamo',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    verified: true,
  },
  {
    id: 'srv_3',
    title: 'Fotografía Producto E-commerce',
    category: 'Producto',
    departamento: 'Valle del Cauca',
    municipio: 'Cali',
    price: 420000,
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    features: ['4 Horas en estudio', '40 Fotos HD', 'Fondo blanco y lifestyle', 'Retoque premium'],
    status: 'Pausado',
    authorId: 4,
    authorName: 'chigui',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    verified: true,
  },
  {
    id: 'srv_4',
    title: 'Cobertura Eventos Corporativos',
    category: 'Eventos',
    departamento: 'Atlántico',
    municipio: 'Barranquilla',
    price: 480000,
    coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
    features: ['5 Horas de cobertura', '80 Fotos HD', 'Entrega express opcional', 'Galería privada'],
    status: 'Activo',
    authorId: 5,
    authorName: 'sofiateamo',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    verified: true,
  },
]

export const getServices = () => {
  try {
    const raw = localStorage.getItem(SERVICES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.__seedVersion === SEED_VERSION) {
        return parsed
      }
    }
  } catch {}
  // seed if empty
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(seedServices))
  return seedServices
}

export const saveServices = (list) => {
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(list))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('luxarts_services_updated'))
    window.dispatchEvent(new StorageEvent('storage', { key: SERVICES_STORAGE_KEY }))
  }
}

export const addService = (service) => {
  const list = getServices()
  const next = [service, ...list]
  saveServices(next)
  return next
}

export const updateService = (id, patch) => {
  const list = getServices()
  const next = list.map((s) => (s.id === id ? { ...s, ...patch } : s))
  saveServices(next)
  return next
}

export const deleteService = (id) => {
  const list = getServices()
  const next = list.filter((s) => s.id !== id)
  saveServices(next)
  return next
}

export const getServicesByAuthor = (authorId) => {
  const all = getServices()
  if (!authorId) return all
  return all.filter((s) => String(s.authorId) === String(authorId))
}
