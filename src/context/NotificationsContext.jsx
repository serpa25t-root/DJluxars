import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getNotifications, markNotificationsRead } from '../services/notifications'

const NotificationsContext = createContext(null)

export const useNotifications = () => useContext(NotificationsContext)

const POLL_MS = 15000

/**
 * Notificaciones reales del usuario (mensajes, reservas, moderación de obras).
 * Consulta el backend cada 15 segundos y expone el contador de no leídas.
 */
export const NotificationsProvider = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const enabled =
    isAuthenticated &&
    (typeof window === 'undefined' || localStorage.getItem('luxarts_notifications') !== 'none')

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return
    setRefreshing(true)
    try {
      const data = await getNotifications(30)
      setItems(data.items)
      setUnread(data.unread)
    } catch {
      // Sin backend o sesión expirada: mantenemos el último estado conocido
    } finally {
      setRefreshing(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (loading || !enabled) {
      setItems([])
      setUnread(0)
      return undefined
    }
    refresh()
    const id = setInterval(refresh, POLL_MS)
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [loading, enabled, refresh])

  /** Marca como leídas todas (ids=null) o las indicadas. */
  const markRead = useCallback(async (ids = null) => {
    try {
      await markNotificationsRead(ids)
    } catch {
      return // sin conexión no cambiamos el estado local
    }
    setItems((prev) =>
      prev.map((n) => (ids == null || ids.includes(n.id) ? { ...n, is_read: true } : n))
    )
    if (ids == null) setUnread(0)
    else setUnread((prev) => Math.max(0, prev - ids.length))
  }, [])

  const value = {
    items,
    unread,
    refreshing,
    refresh,
    markRead,
    markAllRead: () => markRead(null),
  }

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
