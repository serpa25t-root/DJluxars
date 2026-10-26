import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, CalendarDays, Image as ImageIcon, MessageCircle, Sparkles } from 'lucide-react'
import { useNotifications } from '../../context/NotificationsContext'
import { formatWhen } from '../../utils/datetime'

const typeIcon = {
  mensaje: MessageCircle,
  reserva: CalendarDays,
  contenido: ImageIcon,
  sistema: Sparkles,
}

const NotificationsBell = () => {
  const ctx = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const items = ctx?.items || []
  const unread = ctx?.unread || 0

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const handleOpen = async () => {
    const next = !open
    setOpen(next)
    if (next && unread > 0) ctx?.refresh?.()
  }

  const handleClick = async (n) => {
    if (!n.is_read) await ctx?.markRead?.([n.id])
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  const button = (
    <button
      type="button"
      onClick={handleOpen}
      aria-label={`Notificaciones${unread > 0 ? ` (${unread} sin leer)` : ''}`}
      className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
    >
      <Bell className="h-5 w-5" strokeWidth={1.8} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-4 min-w-[16px] rounded-full bg-red-600 px-1 text-[10px] font-bold text-white leading-none ring-2 ring-zinc-950">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  )

  return (
    <div className="relative" ref={ref}>
      {button}

      {open && (
        <div className="absolute right-0 mt-2 w-[19rem] sm:w-96 origin-top-right overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/70 animate-[scaleIn_180ms_var(--ease-out-expo)_both] z-50">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notificaciones</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => ctx?.markAllRead?.()}
                className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto h-8 w-8 text-zinc-700" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-zinc-400">No tienes notificaciones.</p>
                <p className="mt-1 text-xs text-zinc-600">Los mensajes, reservas y novedades de tus obras aparecerán aquí.</p>
              </div>
            ) : (
              items.map((n) => {
                const Icon = typeIcon[n.type] || Sparkles
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleClick(n)}
                    className={`flex w-full gap-3 border-b border-zinc-900/70 px-4 py-3 text-left transition-colors hover:bg-zinc-900/60 ${n.is_read ? 'opacity-70' : 'bg-red-600/5'}`}
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.is_read ? 'bg-zinc-900 text-zinc-400' : 'bg-red-600/15 text-red-400'}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className={`block truncate text-sm ${n.is_read ? 'text-zinc-300' : 'font-semibold text-white'}`}>{n.title}</span>
                        {!n.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />}
                      </span>
                      {n.body && <span className="mt-0.5 block line-clamp-2 text-xs text-zinc-500">{n.body}</span>}
                      <span className="mt-1 block text-[11px] text-zinc-600">{formatWhen(n.created_at)}</span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsBell
