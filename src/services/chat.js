import api from './api'

const CONV_KEY = 'luxarts_conversations'
const MSG_PREFIX = 'luxarts_messages_'

const seedConversations = [
  {
    id: '1',
    contact: { id: '1', name: 'Elena Mora', avatar: 'https://i.pravatar.cc/150?img=5', specialty: 'Retrato', online: true },
    lastMessage: '¿Podemos agendar la sesión para el jueves?',
    unread: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: '2',
    contact: { id: '2', name: 'Marc Dubois', avatar: 'https://i.pravatar.cc/150?img=15', specialty: 'Moda', online: false },
    lastMessage: 'Te envié la cotización actualizada.',
    unread: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
]

const seedMessages = {
  1: [
    { id: 'm1', senderId: '1', text: 'Hola, vi tu portafolio y me encanta tu estilo editorial.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 'm2', senderId: 'me', text: '¡Gracias! Cuéntame sobre tu proyecto.', timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
    { id: 'm3', senderId: '1', text: '¿Podemos agendar la sesión para el jueves?', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  ],
  2: [
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

// Fallback local
const getLocalConversations = () => {
  ensureSeed()
  try {
    const raw = localStorage.getItem(CONV_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const getLocalMessages = (cid) => {
  ensureSeed()
  try {
    const raw = localStorage.getItem(MSG_PREFIX + cid)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Real API con fallback
export const getConversations = async (userId) => {
  try {
    const res = await api.get('chat/conversations/')
    // Backend ya retorna formato compatible
    if (Array.isArray(res.data) && res.data.length > 0) return res.data
    // Si backend retorna vacío pero tenemos seed local, úsalo
    const local = getLocalConversations()
    return local.length ? local : res.data
  } catch {
    return getLocalConversations()
  }
}

export const getMessages = async (conversationId) => {
  try {
    // conversationId es userId del contacto en modo real
    const res = await api.get(`chat/messages/${conversationId}/`)
    if (Array.isArray(res.data)) return res.data
    return res.data
  } catch {
    return getLocalMessages(conversationId)
  }
}

export const sendMessage = async (conversationId, text, senderId = 'me') => {
  try {
    const res = await api.post('chat/messages/', { receiver_id: conversationId, content: text })
    return res.data
  } catch {
    // Fallback local
    const msg = { id: `m${Date.now()}`, senderId, text, timestamp: new Date().toISOString() }
    const key = MSG_PREFIX + conversationId
    const raw = localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []
    const next = [...list, msg]
    localStorage.setItem(key, JSON.stringify(next))
    const convsRaw = localStorage.getItem(CONV_KEY)
    const convs = convsRaw ? JSON.parse(convsRaw) : []
    const updated = convs.map((c) => {
      if (c.id === String(conversationId) || c.contact.id === String(conversationId)) {
        return { ...c, lastMessage: text, updatedAt: new Date().toISOString(), unread: senderId === 'me' ? c.unread : (c.unread || 0) + 1 }
      }
      return c
    })
    localStorage.setItem(CONV_KEY, JSON.stringify(updated))
    return msg
  }
}

export const ensureConversationForContact = async (contactId, contactName, avatar, specialty) => {
  // Intenta real: si existe conversación, retornará id igual a contactId
  try {
    const convs = await getConversations()
    const found = convs.find((c) => c.contact.id === String(contactId) || c.id === String(contactId))
    if (found) return found.id
  } catch {}
  // Fallback local
  ensureSeed()
  const raw = localStorage.getItem(CONV_KEY)
  let list = raw ? JSON.parse(raw) : []
  let conv = list.find((c) => c.contact.id === String(contactId))
  if (conv) return conv.id
  const newId = String(contactId)
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

export const markAsRead = async (conversationId) => {
  try {
    // Backend marca al hacer GET, no necesita POST
    await api.get(`chat/messages/${conversationId}/`)
  } catch {}
  const raw = localStorage.getItem(CONV_KEY)
  if (!raw) return
  try {
    const list = JSON.parse(raw)
    const next = list.map((c) => (c.id === String(conversationId) || c.contact.id === String(conversationId) ? { ...c, unread: 0 } : c))
    localStorage.setItem(CONV_KEY, JSON.stringify(next))
  } catch {}
}
