import apiClient from './apiClient'

const CONVERSATIONS_STORAGE_KEY = 'luxarts_conversations'
const MESSAGES_STORAGE_PREFIX = 'luxarts_messages_'

const normalizeList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return []
}

const ensureSeed = () => {
  if (!localStorage.getItem(CONVERSATIONS_STORAGE_KEY)) {
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(seedConversations))
    Object.entries(seedMessages).forEach(([cid, msgs]) => {
      localStorage.setItem(MESSAGES_STORAGE_PREFIX + cid, JSON.stringify(msgs))
    })
  }
}

// Fallback local
const getLocalConversations = () => {
  ensureSeed()
  try {
    const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const getLocalMessages = (cid) => {
  ensureSeed()
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_PREFIX + cid)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Real API con fallback
export const getConversations = async (userId) => {
  try {
    const res = await apiClient.get('chat/conversations/')
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
  if (!conversationId) return []
  try {
    // conversationId es userId del contacto en modo real
    const res = await apiClient.get(`chat/messages/${conversationId}/`)
    if (Array.isArray(res.data)) return res.data
    return res.data
  } catch {
    return getLocalMessages(conversationId)
  }
}

export const sendMessage = async (conversationId, text, senderId = 'me') => {
  try {
    const res = await apiClient.post('chat/messages/', { receiver_id: conversationId, content: text })
    return res.data
  } catch {
    // Fallback local
    const message = { id: `m${Date.now()}`, senderId, text, timestamp: new Date().toISOString() }
    const key = MESSAGES_STORAGE_PREFIX + conversationId
    const raw = localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []
    const next = [...list, msg]
    localStorage.setItem(key, JSON.stringify(next))
    const convsRaw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
    const convs = convsRaw ? JSON.parse(convsRaw) : []
    const updated = convs.map((c) => {
      if (c.id === String(conversationId) || c.contact.id === String(conversationId)) {
        return { ...c, lastMessage: text, updatedAt: new Date().toISOString(), unread: senderId === 'me' ? c.unread : (c.unread || 0) + 1 }
      }
      return c
    })
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updated))
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
  const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
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
  localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(list))
  localStorage.setItem(MESSAGES_STORAGE_PREFIX + newId, JSON.stringify([]))
  return newId
}

/** El GET de mensajes ya marca como leídos los mensajes recibidos. */
export const markAsRead = async (conversationId) => {
  if (!conversationId) return
  try {
    // Backend marca al hacer GET, no necesita POST
    await apiClient.get(`chat/messages/${conversationId}/`)
  } catch {}
  const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
  if (!raw) return
  try {
    const list = JSON.parse(raw)
    const next = list.map((c) => (c.id === String(conversationId) || c.contact.id === String(conversationId) ? { ...c, unread: 0 } : c))
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(next))
  } catch {}
}
