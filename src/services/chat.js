const CONV_KEY = 'luxarts_conversations'
const MSG_PREFIX = 'luxarts_messages_'

const seedConversations = [
  {
    id: 'c1',
    contact: {
      id: '1',
      name: 'Elena Mora',
      avatar: 'https://i.pravatar.cc/150?img=5',
      specialty: 'Retrato',
      online: true,
    },
    lastMessage: '¿Podemos agendar la sesión para el jueves?',
    unread: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'c2',
    contact: {
      id: '2',
      name: 'Marc Dubois',
      avatar: 'https://i.pravatar.cc/150?img=15',
      specialty: 'Moda',
      online: false,
    },
    lastMessage: 'Te envié la cotización actualizada.',
    unread: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
]

const seedMessages = {
  c1: [
    { id: 'm1', senderId: '1', text: 'Hola, vi tu portafolio y me encanta tu estilo editorial.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 'm2', senderId: 'me', text: '¡Gracias! Cuéntame sobre tu proyecto.', timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
    { id: 'm3', senderId: '1', text: '¿Podemos agendar la sesión para el jueves?', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  ],
  c2: [
    { id: 'm4', senderId: 'me', text: 'Hola Marc, ¿disponible para evento en Bogotá?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'm5', senderId: '2', text: 'Te envié la cotización actualizada.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  ],
}

const ensureSeed = () => {
  if (!localStorage.getItem(CONV_KEY)) {
    localStorage.setItem(CONV_KEY, JSON.stringify(seedConversations))
    Object.entries(seedMessages).forEach(([cid, msgs]) => {
      localStorage.setItem(MSG_PREFIX + cid, JSON.stringify(msgs))
    })
  }
}

export const getConversations = (userId) => {
  ensureSeed()
  try {
    const raw = localStorage.getItem(CONV_KEY)
    const list = raw ? JSON.parse(raw) : []
    // Para demo, retornamos todas; userId se usa para filtrar si hace falta
    if (userId) return list
    return list
  } catch {
    return []
  }
}

export const getMessages = (conversationId) => {
  ensureSeed()
  try {
    const raw = localStorage.getItem(MSG_PREFIX + conversationId)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const sendMessage = (conversationId, text, senderId = 'me') => {
  const msg = { id: `m${Date.now()}`, senderId, text, timestamp: new Date().toISOString() }
  const key = MSG_PREFIX + conversationId
  const raw = localStorage.getItem(key)
  const list = raw ? JSON.parse(raw) : []
  const next = [...list, msg]
  localStorage.setItem(key, JSON.stringify(next))

  // Actualiza conversación
  const convsRaw = localStorage.getItem(CONV_KEY)
  const convs = convsRaw ? JSON.parse(convsRaw) : []
  const updated = convs.map((c) => {
    if (c.id === conversationId) {
      return { ...c, lastMessage: text, updatedAt: new Date().toISOString(), unread: senderId === 'me' ? c.unread : (c.unread || 0) + 1 }
    }
    return c
  })
  localStorage.setItem(CONV_KEY, JSON.stringify(updated))
  return msg
}

export const ensureConversationForContact = (contactId, contactName, avatar, specialty) => {
  ensureSeed()
  const raw = localStorage.getItem(CONV_KEY)
  let list = raw ? JSON.parse(raw) : []
  let conv = list.find((c) => c.contact.id === String(contactId))
  if (conv) return conv.id
  const newId = `c${Date.now()}`
  const newConv = {
    id: newId,
    contact: {
      id: String(contactId),
      name: contactName || `Contacto ${contactId}`,
      avatar: avatar || `https://i.pravatar.cc/150?img=${(Number(contactId) % 70) + 1}`,
      specialty: specialty || 'General',
      online: true,
    },
    lastMessage: 'Conversación iniciada',
    unread: 0,
    updatedAt: new Date().toISOString(),
  }
  list = [newConv, ...list]
  localStorage.setItem(CONV_KEY, JSON.stringify(list))
  localStorage.setItem(MSG_PREFIX + newId, JSON.stringify([]))
  return newId
}

export const markAsRead = (conversationId) => {
  const raw = localStorage.getItem(CONV_KEY)
  if (!raw) return
  const list = JSON.parse(raw)
  const next = list.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
  localStorage.setItem(CONV_KEY, JSON.stringify(next))
}
