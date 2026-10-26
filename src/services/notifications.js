import apiClient from './apiClient'

const unwrap = (res) => {
  const data = res?.data
  if (Array.isArray(data)) return data
  return Array.isArray(data?.results) ? data.results : []
}

/** Notificaciones recientes del usuario autenticado. */
export const getNotifications = async (limit = 30) => {
  const res = await apiClient.get(`notifications/?limit=${limit}`)
  return {
    items: unwrap(res),
    unread: res?.data?.unread ?? 0,
  }
}

export const getUnreadCount = async () => {
  const res = await apiClient.get('notifications/unread-count/')
  return res?.data?.count ?? 0
}

/** Marca como leídas: markRead() todas, o markRead([id1, id2]) algunas. */
export const markNotificationsRead = async (ids = null) => {
  const payload = Array.isArray(ids) && ids.length ? { ids } : { all: true }
  const res = await apiClient.post('notifications/read/', payload)
  return res?.data?.updated ?? 0
}

export const clearNotifications = async () => {
  const res = await apiClient.delete('notifications/')
  return res?.data?.deleted ?? 0
}
