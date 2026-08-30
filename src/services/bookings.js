const KEY = 'luxarts_bookings'

export const getBookings = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
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
      price: 420,
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
      price: 750,
      status: 'Confirmada',
      createdAt: new Date().toISOString(),
    },
  ]
  saveBookings(seed)
}
