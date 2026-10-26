/**
 * Utilidades de fecha/hora con formato estilo WhatsApp (es-CO).
 */

const DIA = 24 * 60 * 60 * 1000

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

const parse = (value) => {
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** 3:04 p. m. */
export const formatTime = (value) => {
  const d = parse(value)
  if (!d) return ''
  return d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
}

/** Etiqueta del día: Hoy / Ayer / lunes / 12 de octubre de 2026 */
export const formatDayLabel = (value) => {
  const d = parse(value)
  if (!d) return ''
  const hoy = startOfDay(new Date())
  const fecha = startOfDay(d)
  const diff = Math.round((hoy - fecha) / DIA)

  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff > 1 && diff < 7) {
    return d.toLocaleDateString('es-CO', { weekday: 'long' })
  }
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Para notificaciones: "Hoy, 3:04 p. m." / "12/10/2026, 3:04 p. m." */
export const formatWhen = (value) => {
  const d = parse(value)
  if (!d) return ''
  const label = formatDayLabel(d)
  if (label === 'Hoy' || label === 'Ayer') return `${label}, ${formatTime(d)}`
  const fecha = d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${fecha}, ${formatTime(d)}`
}

/** Clave de día (YYYY-MM-DD) para agrupar mensajes como WhatsApp */
export const dayKey = (value) => {
  const d = parse(value)
  if (!d) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Para listas compactas (sidebar de chat): hora hoy, "Ayer", o 12/10/2026 */
export const formatShortWhen = (value) => {
  const d = parse(value)
  if (!d) return ''
  const label = formatDayLabel(d)
  if (label === 'Hoy') return formatTime(d)
  if (label === 'Ayer') return 'Ayer'
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
