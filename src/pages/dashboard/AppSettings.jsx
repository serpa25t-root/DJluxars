import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]

const LANG_KEY = 'luxarts_language'
const THEME_KEY = 'luxarts_theme'
const NOTIF_KEY = 'luxarts_notifications'
const PRIVACY_KEY = 'luxarts_privacy'

const getStored = (key, fallback) => {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}

const SectionTitle = ({ children }) => (
  <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-600 mb-3">{children}</h3>
)

const SettingRow = ({ icon, label, description, children }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-700 transition-colors">
    <div className="flex items-center gap-4 min-w-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
)

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${checked ? 'bg-red-600' : 'bg-zinc-800'}`}
  >
    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors min-w-[120px] text-right"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
    ))}
  </select>
)

const AppSettings = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'general'

  const [language, setLanguage] = useState(() => getStored(LANG_KEY, 'es'))
  const [theme, setTheme] = useState(() => getStored(THEME_KEY, 'dark'))
  const [notifications, setNotifications] = useState(() => getStored(NOTIF_KEY, 'all') !== 'none')
  const [notifSound, setNotifSound] = useState(() => getStored('luxarts_notif_sound', 'true') === 'true')
  const [notifEmail, setNotifEmail] = useState(() => getStored('luxarts_notif_email', 'false') === 'true')
  const [notifBookings, setNotifBookings] = useState(() => getStored('luxarts_notif_bookings', 'true') === 'true')
  const [notifMessages, setNotifMessages] = useState(() => getStored('luxarts_notif_messages', 'true') === 'true')
  const [notifMarketing, setNotifMarketing] = useState(() => getStored('luxarts_notif_marketing', 'false') === 'true')

  const [profileVisible, setProfileVisible] = useState(() => getStored('luxarts_profile_visible', 'true') === 'true')
  const [showOnline, setShowOnline] = useState(() => getStored('luxarts_show_online', 'true') === 'true')
  const [allowMessages, setAllowMessages] = useState(() => getStored('luxarts_allow_messages', 'everyone') !== 'none')
  const [showPhone, setShowPhone] = useState(() => getStored('luxarts_show_phone', 'false') === 'true')

  const [toast, setToast] = useState(null)

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'privacy', label: 'Privacidad', icon: '🔒' },
    { id: 'help', label: 'Ayuda', icon: '❓' },
  ]

  const save = (key, value) => {
    try { localStorage.setItem(key, String(value)) } catch {}
  }

  const handleLanguageChange = (code) => {
    setLanguage(code)
    save(LANG_KEY, code)
    setToast('Idioma actualizado')
    setTimeout(() => setToast(null), 2000)
  }

  const handleThemeChange = (value) => {
    setTheme(value)
    save(THEME_KEY, value)
    setToast('Tema actualizado')
    setTimeout(() => setToast(null), 2000)
  }

  const handleNotifToggle = (setter, key, value) => {
    setter(value)
    save(key, value)
  }

  return (
    <div className="mx-auto max-w-3xl animate-[fadeIn_300ms_ease-out]">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">Configuración de la App</h1>
        <p className="mt-1 text-sm text-zinc-400">Personaliza tu experiencia en LuxArts.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 border-b border-zinc-900">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === t.id ? 'border-red-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <SectionTitle>Idioma y región</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
              label="Idioma"
              description="Idioma de la interfaz"
            >
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors min-w-[140px]"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-zinc-900">{l.flag} {l.label}</option>
                ))}
              </select>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Zona horaria"
              description="Tu ubicación actual"
            >
              <span className="text-sm text-zinc-400">America/Bogota (COT)</span>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              label="Moneda"
              description="Para mostrar precios"
            >
              <span className="text-sm text-zinc-400">COP ($)</span>
            </SettingRow>
          </div>

          <SectionTitle>Apariencia</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
              label="Tema"
              description="Apariencia de la interfaz"
            >
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors min-w-[120px]"
              >
                <option value="dark" className="bg-zinc-900">Oscuro</option>
                <option value="light" className="bg-zinc-900">Claro</option>
                <option value="system" className="bg-zinc-900">Sistema</option>
              </select>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              label="Calidad de imagen"
              description="Menor = carga más rápida"
            >
              <select
                defaultValue="high"
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors min-w-[120px]"
              >
                <option value="low" className="bg-zinc-900">Baja</option>
                <option value="medium" className="bg-zinc-900">Media</option>
                <option value="high" className="bg-zinc-900">Alta</option>
              </select>
            </SettingRow>
          </div>

          <SectionTitle>Cuenta</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              label="Correo electrónico"
              description={user?.email || 'No configurado'}
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Cambiar
              </button>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              label="Contraseña"
              description="Última cambio hace 30 días"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Cambiar
              </button>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
              label="Eliminar cuenta"
              description="Esta acción es irreversible"
            >
              <button className="rounded-full border border-red-900/30 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-900/30 hover:text-red-400 transition-colors">
                Eliminar
              </button>
            </SettingRow>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <SectionTitle>Notificaciones</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              }
              label="Notificaciones push"
              description="Recibe alertas en tu dispositivo"
            >
              <Toggle checked={notifications} onChange={(v) => handleNotifToggle(setNotifications, NOTIF_KEY, v)} />
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              }
              label="Sonido de notificación"
              description="Reproducir sonido al recibir"
            >
              <Toggle checked={notifSound} onChange={(v) => handleNotifToggle(setNotifSound, 'luxarts_notif_sound', v)} />
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              label="Notificaciones por email"
              description="Resumen semanal de actividad"
            >
              <Toggle checked={notifEmail} onChange={(v) => handleNotifToggle(setNotifEmail, 'luxarts_notif_email', v)} />
            </SettingRow>
          </div>

          <SectionTitle>Tipos de notificación</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              label="Reservas"
              description="Nuevas solicitudes y cambios de estado"
            >
              <Toggle checked={notifBookings} onChange={(v) => handleNotifToggle(setNotifBookings, 'luxarts_notif_bookings', v)} />
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              label="Mensajes"
              description="Nuevos mensajes de clientes"
            >
              <Toggle checked={notifMessages} onChange={(v) => handleNotifToggle(setNotifMessages, 'luxarts_notif_messages', v)} />
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              }
              label="Marketing"
              description="Promociones y ofertas especiales"
            >
              <Toggle checked={notifMarketing} onChange={(v) => handleNotifToggle(setNotifMarketing, 'luxarts_notif_marketing', v)} />
            </SettingRow>
          </div>
        </div>
      )}

      {/* Privacy */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <SectionTitle>Visibilidad del perfil</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              label="Perfil público"
              description="Visible en el catálogo de fotógrafos"
            >
              <Toggle checked={profileVisible} onChange={(v) => handleNotifToggle(setProfileVisible, 'luxarts_profile_visible', v)} />
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Mostrar estado en línea"
              description="Otros usuarios pueden ver si estás activo"
            >
              <Toggle checked={showOnline} onChange={(v) => handleNotifToggle(setShowOnline, 'luxarts_show_online', v)} />
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
              label="Mostrar teléfono"
              description="Visible en tu perfil público"
            >
              <Toggle checked={showPhone} onChange={(v) => handleNotifToggle(setShowPhone, 'luxarts_show_phone', v)} />
            </SettingRow>
          </div>

          <SectionTitle>Mensajes</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              label="Quién puede enviarte mensajes"
              description="Controla quién puede contactarte"
            >
              <Toggle checked={allowMessages} onChange={(v) => handleNotifToggle(setAllowMessages, 'luxarts_allow_messages', v ? 'everyone' : 'none')} />
            </SettingRow>
          </div>

          <SectionTitle>Datos y seguridad</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
              label="Descargar mis datos"
              description="Solicita una copia de tu información"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Solicitar
              </button>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              label="Sesiones activas"
              description="2 dispositivos conectados"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Gestionar
              </button>
            </SettingRow>
          </div>
        </div>
      )}

      {/* Help */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          <SectionTitle>Soporte</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Centro de ayuda"
              description="Preguntas frecuentes y guías"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Abrir
              </button>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              label="Contactar soporte"
              description="Chat en vivo o email"
            >
              <button className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors">
                Chat
              </button>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              label="Términos y condiciones"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Ver
              </button>
            </SettingRow>
            <SettingRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Política de privacidad"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Ver
              </button>
            </SettingRow>
          </div>

          <SectionTitle>Acerca de</SectionTitle>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-bold text-white">LuxArts</p>
            <p className="text-xs text-zinc-500">Versión 1.0.0</p>
            <p className="mt-1 text-[11px] text-zinc-600">© 2026 LuxArts. Todos los derechos reservados.</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-red-600/30 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-xl animate-[fadeIn_200ms_ease-out]">
          {toast}
        </div>
      )}
    </div>
  )
}

export default AppSettings
