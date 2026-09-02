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

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-700 transition-colors">
    <div className="flex items-center gap-4 min-w-0">
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
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notificaciones' },
    { id: 'privacy', label: 'Privacidad' },
    { id: 'help', label: 'Ayuda' },
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
    <div className="animate-[fadeIn_300ms_ease-out]">
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 border-b border-zinc-900">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === t.id ? 'border-red-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <SectionTitle>Idioma y región</SectionTitle>
          <div className="space-y-3">
            <SettingRow
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
              label="Zona horaria"
              description="Tu ubicación actual"
            >
              <span className="text-sm text-zinc-400">America/Bogota (COT)</span>
            </SettingRow>
            <SettingRow
              label="Moneda"
              description="Para mostrar precios"
            >
              <span className="text-sm text-zinc-400">COP ($)</span>
            </SettingRow>
          </div>

          <SectionTitle>Apariencia</SectionTitle>
          <div className="space-y-3">
            <SettingRow
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
              label="Correo electrónico"
              description={user?.email || 'No configurado'}
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Cambiar
              </button>
            </SettingRow>
            <SettingRow
              label="Contraseña"
              description="Última cambio hace 30 días"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Cambiar
              </button>
            </SettingRow>
            <SettingRow
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
              label="Notificaciones push"
              description="Recibe alertas en tu dispositivo"
            >
              <Toggle checked={notifications} onChange={(v) => handleNotifToggle(setNotifications, NOTIF_KEY, v)} />
            </SettingRow>
            <SettingRow
              label="Sonido de notificación"
              description="Reproducir sonido al recibir"
            >
              <Toggle checked={notifSound} onChange={(v) => handleNotifToggle(setNotifSound, 'luxarts_notif_sound', v)} />
            </SettingRow>
            <SettingRow
              label="Notificaciones por email"
              description="Resumen semanal de actividad"
            >
              <Toggle checked={notifEmail} onChange={(v) => handleNotifToggle(setNotifEmail, 'luxarts_notif_email', v)} />
            </SettingRow>
          </div>

          <SectionTitle>Tipos de notificación</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              label="Reservas"
              description="Nuevas solicitudes y cambios de estado"
            >
              <Toggle checked={notifBookings} onChange={(v) => handleNotifToggle(setNotifBookings, 'luxarts_notif_bookings', v)} />
            </SettingRow>
            <SettingRow
              label="Mensajes"
              description="Nuevos mensajes de clientes"
            >
              <Toggle checked={notifMessages} onChange={(v) => handleNotifToggle(setNotifMessages, 'luxarts_notif_messages', v)} />
            </SettingRow>
            <SettingRow
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
              label="Perfil público"
              description="Visible en el catálogo de fotógrafos"
            >
              <Toggle checked={profileVisible} onChange={(v) => handleNotifToggle(setProfileVisible, 'luxarts_profile_visible', v)} />
            </SettingRow>
            <SettingRow
              label="Mostrar estado en línea"
              description="Otros usuarios pueden ver si estás activo"
            >
              <Toggle checked={showOnline} onChange={(v) => handleNotifToggle(setShowOnline, 'luxarts_show_online', v)} />
            </SettingRow>
            <SettingRow
              label="Mostrar teléfono"
              description="Visible en tu perfil público"
            >
              <Toggle checked={showPhone} onChange={(v) => handleNotifToggle(setShowPhone, 'luxarts_show_phone', v)} />
            </SettingRow>
          </div>

          <SectionTitle>Mensajes</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              label="Quién puede enviarte mensajes"
              description="Controla quién puede contactarte"
            >
              <Toggle checked={allowMessages} onChange={(v) => handleNotifToggle(setAllowMessages, 'luxarts_allow_messages', v ? 'everyone' : 'none')} />
            </SettingRow>
          </div>

          <SectionTitle>Datos y seguridad</SectionTitle>
          <div className="space-y-3">
            <SettingRow
              label="Descargar mis datos"
              description="Solicita una copia de tu información"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Solicitar
              </button>
            </SettingRow>
            <SettingRow
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
              label="Centro de ayuda"
              description="Preguntas frecuentes y guías"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Abrir
              </button>
            </SettingRow>
            <SettingRow
              label="Contactar soporte"
              description="Chat en vivo o email"
            >
              <button className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors">
                Chat
              </button>
            </SettingRow>
            <SettingRow
              label="Términos y condiciones"
            >
              <button className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                Ver
              </button>
            </SettingRow>
            <SettingRow
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
