import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePreferences } from '../../context/AppPreferencesContext'
import { getBookings } from '../../services/bookings'
import { getConversations } from '../../services/chat'

const NotificationBell = () => {
  const { t, notifSound, notifications, notifBookings, notifMessages } = usePreferences()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const ref = useRef(null)
  const navigate = useNavigate()

  const buildItems = async () => {
    const list = []
    if (notifications) {
      if (notifBookings) {
        const bookings = getBookings().filter((b) => b.status === 'Pendiente')
        bookings.slice(0, 3).forEach((b) => {
          list.push({ id: `b-${b.id}`, kind: 'booking', title: `${t('notif_booking_title')}: ${b.photographerName || b.clientName}`, body: b.service || '', path: '/dashboard/bookings' })
        })
      }
      if (notifMessages) {
        try {
          const convs = await getConversations()
          const unread = (convs || []).filter((c) => c.unread > 0)
          unread.slice(0, 3).forEach((c) => {
            list.push({ id: `m-${c.id}`, kind: 'message', title: t('notif_msg_title'), body: c.contact?.name || '', path: '/dashboard/mensajes' })
          })
        } catch {}
      }
    }
    setItems(list)
  }

  useEffect(() => {
    if (!open) return
    buildItems()
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const id = setInterval(buildItems, 10000)
    return () => clearInterval(id)
  }, [open])

  useEffect(() => {
    if (items.length > 0 && notifSound && notifBookings) {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=')
        audio.volume = 0.3
        audio.play().catch(() => {})
      } catch {}
    }
  }, [items.length])

  const handleClick = (item) => {
    setOpen(false)
    navigate(item.path)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Notificaciones"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {items.length > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50">
          <div className="p-4">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t('notif_title')}</p>
            {items.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">{t('notif_empty')}</p>
            ) : (
              <div className="mt-3 space-y-2">
                {items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className="w-full text-left rounded-xl bg-zinc-100 dark:bg-zinc-800/50 p-3 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/40 transition-colors"
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{n.title}</p>
                    <p className="text-xs text-zinc-500">{n.body}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
