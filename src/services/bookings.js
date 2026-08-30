import api from './api'

const KEY = 'luxarts_bookings'

export const getBookings = () => {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    let migrated = false
    const fixed = list.map((b) => {
      let nb = { ...b }
      if (typeof b.price === 'number' && b.price < 10000) {
        nb.price = b.price * 1000
        migrated = true
      }
      const base = nb.base_price ?? nb.price
      if (nb.base_price == null) {
        nb.base_price = base
        migrated = true
      }
      if (nb.platform_fee == null) {
        nb.platform_fee = Math.round(base * 0.1)
        migrated = true
      }
      if (nb.artist_payout == null) {
        nb.artist_payout = base - nb.platform_fee
        migrated = true
      }
      return nb
    })
    if (migrated) saveBookings(fixed)
    return migrated ? fixed : fixed
  } catch {
    return []
  }
}

export const saveBookings = (list) => {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const addBooking = (booking) => {
  const list = getBookings()
  const next = [booking, ...list]
  saveBookings(next)
  return next
}

export const updateBookingStatus = (id, status) => {
  const list = getBookings().map((b) => (b.id === id ? { ...b, status } : b))
  saveBookings(list)
  return list
}

export const seedIfEmpty = () => {
  if (getBookings().length > 0) return
  const seed = [
    {
      id: 101,
      photographerId: 1,
      photographerName: 'Elena Mora',
      photographerAvatar: 'https://i.pravatar.cc/150?img=5',
      specialty: 'Retrato',
      clientName: 'Ana López',
      clientEmail: 'ana@estudio.com',
      date: '2026-09-10',
      service: 'Evento',
      location: 'Cartagena',
      message: 'Boda al atardecer, 80 invitados, luz natural.',
      price: 420000,
      base_price: 420000,
      platform_fee: 42000,
      artist_payout: 378000,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
    },
    {
      id: 102,
      photographerId: 2,
      photographerName: 'Marc Dubois',
      photographerAvatar: 'https://i.pravatar.cc/150?img=15',
      specialty: 'Moda',
      clientName: 'Carlos Ruiz',
      clientEmail: 'carlos@marca.com',
      date: '2026-09-18',
      service: 'Comercial',
      location: 'Bogotá',
      message: 'Campaña editorial otoño, estudio.',
      price: 750000,
      base_price: 750000,
      platform_fee: 75000,
      artist_payout: 675000,
      status: 'Confirmada',
      createdAt: new Date().toISOString(),
    },
  ]
  saveBookings(seed)
}

// --- Endpoints reales DRF (con fallback localStorage para demo) ---
export const fetchClientBookings = async () => {
  try {
    const res = await api.get('bookings/as-client/')
    const data = Array.isArray(res.data) ? res.data : res.data.results || []
    // Normaliza a formato local para UI
    return data.map(normalizeBooking)
  } catch {
    return getBookings()
  }
}

export const fetchArtistBookings = async () => {
  try {
    const res = await api.get('bookings/as-artist/')
    const data = Array.isArray(res.data) ? res.data : res.data.results || []
    return data.map(normalizeBooking)
  } catch {
    return getBookings()
  }
}

export const createBooking = async (payload) => {
  try {
    const res = await api.post('bookings/', payload)
    const created = normalizeBooking(res.data)
    addBooking(created)
    return created
  } catch (err) {
    if (err?.response?.status === 404 || !err?.response) {
      // Fallback demo ya manejado en BookingModal, pero aquí también
      const mock = {
        id: Date.now(),
        photographerId: payload.photographer,
        photographerName: payload.photographer_name || 'Fotógrafo',
        photographerAvatar: `https://i.pravatar.cc/150?img=${(payload.photographer % 70) + 1}`,
        specialty: 'General',
        clientName: 'Cliente LuxArts',
        clientEmail: 'cliente@luxarts.com',
        date: payload.date,
        service: payload.service,
        location: payload.location,
        message: payload.message,
        price: payload.price,
        base_price: payload.base_price,
        platform_fee: payload.platform_fee,
        artist_payout: payload.artist_payout,
        status: 'Pendiente',
        createdAt: new Date().toISOString(),
      }
      addBooking(mock)
      return mock
    }
    throw err
  }
}

export const acceptBooking = async (id) => {
  try {
    const res = await api.patch(`bookings/${id}/accept/`)
    const updated = normalizeBooking(res.data)
    updateBookingStatus(id, 'Confirmada')
    return updated
  } catch {
    const list = updateBookingStatus(id, 'Confirmada')
    return list.find((b) => b.id === id)
  }
}

export const rejectBooking = async (id) => {
  try {
    const res = await api.patch(`bookings/${id}/reject/`)
    const updated = normalizeBooking(res.data)
    updateBookingStatus(id, 'Rechazada')
    return updated
  } catch {
    const list = updateBookingStatus(id, 'Rechazada')
    return list.find((b) => b.id === id)
  }
}

const normalizeBooking = (raw) => {
  // Backend puede devolver price/base_price/platform_fee/artist_payout con otros nombres
  const base = raw.base_price ?? raw.price ?? 0
  const fee = raw.platform_fee ?? Math.round(base * 0.1)
  const payout = raw.artist_payout ?? base - fee
  return {
    id: raw.id,
    photographerId: raw.photographer || raw.photographerId || raw.artist || 0,
    photographerName: raw.photographer_name || raw.photographerName || raw.artist_name || 'Fotógrafo',
    photographerAvatar: raw.photographerAvatar || `https://i.pravatar.cc/150?img=${(raw.photographer % 70) + 1}`,
    specialty: raw.specialty || raw.category || 'General',
    clientName: raw.clientName || raw.client_name || raw.client || 'Cliente',
    clientEmail: raw.clientEmail || raw.client_email || '',
    date: raw.date || raw.event_date || '',
    service: raw.service || raw.service_type || '',
    location: raw.location || raw.city || '',
    message: raw.message || raw.details || '',
    price: raw.price ?? base,
    base_price: base,
    platform_fee: fee,
    artist_payout: payout,
    status: mapStatus(raw.status),
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
  }
}

const mapStatus = (s) => {
  const m = { pending: 'Pendiente', accepted: 'Confirmada', rejected: 'Rechazada', completed: 'Finalizada', Pendiente: 'Pendiente', Confirmada: 'Confirmada', Rechazada: 'Rechazada', Finalizada: 'Finalizada' }
  return m[s] || s || 'Pendiente'
}
