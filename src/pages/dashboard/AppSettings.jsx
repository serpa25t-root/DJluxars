import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePreferences } from '../../context/AppPreferencesContext'

const SectionTitle = ({ children }) => (
  <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-600 mb-3">{children}</h3>
)

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-4 backdrop-blur-xl transition-all duration-300">
    <div className="min-w-0">
      <p className="text-sm font-medium text-zinc-900 dark:text-white">{label}</p>
      {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
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
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black ${checked ? 'bg-red-600' : 'bg-zinc-300 dark:bg-zinc-800'}`}
  >
    <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

const AppSettings = () => {
  const {
    theme, setTheme,
    language, setLanguage,
    notifications, setNotifications,
    notifSound, setNotifSound,
    notifBookings, setNotifBookings,
    notifMessages, setNotifMessages,
  } = usePreferences()

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'general'
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notificaciones' },
  ]

  return (
    <div className="mx-auto max-w-3xl animate-[fadeIn_300ms_ease-out]">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Configuración</h1>
        <p className="mt-1 text-sm text-zinc-500">Personaliza tu experiencia en LuxArts.</p>
      </div>

      <div className="flex items-center gap-6 mb-8 border-b border-zinc-200 dark:border-zinc-900">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSearchParams({ tab: t.id })}
            className={`text-sm font-medium border-b-2 transition-colors pb-1 ${activeTab === t.id ? 'border-red-600 text-zinc-900 dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <SectionTitle>Tema</SectionTitle>
          <div className="space-y-3">
            <SettingRow label="Apariencia" description="Cambia los colores de la interfaz">
              <div className="flex gap-2">
                {[
                  { value: 'dark', label: 'Oscuro', icon: '🌙' },
                  { value: 'light', label: 'Claro', icon: '☀️' },
                  { value: 'system', label: 'Sistema', icon: '💻' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setTheme(opt.value); showToast('Tema actualizado') }}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                      theme === opt.value
                        ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-600/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="mr-1">{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </div>

          <SectionTitle>Idioma</SectionTitle>
          <div className="space-y-3">
            <SettingRow label="Idioma de la interfaz" description="Cambia el idioma del menú y ajustes">
              <select
                value={language}
                onChange={(e) => { setLanguage(e.target.value); showToast('Idioma actualizado') }}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors min-w-[140px]"
              >
                <option value="es" className="bg-white dark:bg-zinc-900">🇪🇸 Español</option>
                <option value="en" className="bg-white dark:bg-zinc-900">🇺🇸 English</option>
                <option value="pt" className="bg-white dark:bg-zinc-900">🇧🇷 Português</option>
                <option value="fr" className="bg-white dark:bg-zinc-900">🇫🇷 Français</option>
              </select>
            </SettingRow>
          </div>

          <SectionTitle>Cuenta</SectionTitle>
          <div className="space-y-3">
            <SettingRow label="Editar perfil" description="Nombre, foto, bio y más">
              <a
                href="/dashboard/configuracion"
                onClick={(e) => { e.preventDefault(); window.location.href = '/dashboard/profile' }}
                className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                Abrir
              </a>
            </SettingRow>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <SectionTitle>Notificaciones</SectionTitle>
          <div className="space-y-3">
            <SettingRow label="Notificaciones push" description="Recibe alertas en tu dispositivo">
              <Toggle checked={notifications} onChange={(v) => { setNotifications(v); showToast(v ? 'Notificaciones activadas' : 'Notificaciones desactivadas') }} />
            </SettingRow>
            <SettingRow label="Sonido de notificación" description="Reproducir sonido al recibir">
              <Toggle checked={notifSound} onChange={(v) => { setNotifSound(v); showToast(v ? 'Sonido activado' : 'Sonido desactivado') }} />
            </SettingRow>
          </div>

          <SectionTitle>Tipos de notificación</SectionTitle>
          <div className="space-y-3">
            <SettingRow label="Reservas" description="Nuevas solicitudes y cambios de estado">
              <Toggle checked={notifBookings} onChange={(v) => { setNotifBookings(v); showToast(v ? 'Reservas activadas' : 'Reservas desactivadas') }} />
            </SettingRow>
            <SettingRow label="Mensajes" description="Nuevos mensajes de clientes">
              <Toggle checked={notifMessages} onChange={(v) => { setNotifMessages(v); showToast(v ? 'Mensajes activados' : 'Mensajes desactivados') }} />
            </SettingRow>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-red-600/30 bg-zinc-900 dark:bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-xl animate-[fadeIn_200ms_ease-out]">
          {toast}
        </div>
      )}
    </div>
  )
}

export default AppSettings
