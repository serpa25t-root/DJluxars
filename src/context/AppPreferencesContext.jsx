import { createContext, useContext, useState, useEffect } from 'react'

const AppPreferencesContext = createContext(null)

const THEME_KEY = 'luxarts_theme'
const LANG_KEY = 'luxarts_language'
const NOTIF_KEY = 'luxarts_notifications'
const NOTIF_SOUND_KEY = 'luxarts_notif_sound'
const NOTIF_EMAIL_KEY = 'luxarts_notif_email'
const NOTIF_BOOKINGS_KEY = 'luxarts_notif_bookings'
const NOTIF_MESSAGES_KEY = 'luxarts_notif_messages'

const getStored = (key, fallback) => {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}

const translations = {
  es: {
    sidebar_home: 'Inicio',
    sidebar_profile: 'Perfil',
    sidebar_explore: 'Explorar',
    sidebar_bookings: 'Reservaciones',
    sidebar_bookings_artist: 'Reservas',
    sidebar_messages: 'Mensajes',
    sidebar_favorites: 'Favoritos',
    sidebar_history: 'Historial',
    sidebar_stats: 'Estadísticas',
    sidebar_settings: 'Configuración',
    sidebar_portfolio: 'Portafolio',
    sidebar_services: 'Servicios',
    sidebar_logout: 'Cerrar Sesión',
    sidebar_pro: 'Únete a LuxArts PRO',
    sidebar_pro_desc: 'Desbloquea 6 servicios, 30 fotos y prioridad #1 en el catálogo.',
    sidebar_pro_btn: 'Ver Planes PRO',
    sidebar_client_cta: '¿Eres fotógrafo?',
    sidebar_client_desc: 'Únete a LuxArts y muestra tu talento al mundo.',
    sidebar_client_btn: 'Registrarme como fotógrafo',
    notif_title: 'Notificaciones',
    notif_empty: 'No tienes notificaciones nuevas.',
    notif_booking_title: 'Nueva reserva',
    notif_msg_title: 'Mensaje nuevo',
    notif_view_bookings: 'Ver reservas',
    notif_view_chat: 'Ver mensajes',
  },
  en: {
    sidebar_home: 'Home',
    sidebar_profile: 'Profile',
    sidebar_explore: 'Explore',
    sidebar_bookings: 'Bookings',
    sidebar_bookings_artist: 'Bookings',
    sidebar_messages: 'Messages',
    sidebar_favorites: 'Favorites',
    sidebar_history: 'History',
    sidebar_stats: 'Stats',
    sidebar_settings: 'Settings',
    sidebar_portfolio: 'Portfolio',
    sidebar_services: 'Services',
    sidebar_logout: 'Log out',
    sidebar_pro: 'Join LuxArts PRO',
    sidebar_pro_desc: 'Unlock 6 services, 30 photos and #1 priority in the catalog.',
    sidebar_pro_btn: 'View PRO Plans',
    sidebar_client_cta: 'Are you a photographer?',
    sidebar_client_desc: 'Join LuxArts and show your talent to the world.',
    sidebar_client_btn: 'Sign up as photographer',
    notif_title: 'Notifications',
    notif_empty: 'No new notifications.',
    notif_booking_title: 'New booking',
    notif_msg_title: 'New message',
    notif_view_bookings: 'View bookings',
    notif_view_chat: 'View messages',
  },
  pt: {
    sidebar_home: 'Início',
    sidebar_profile: 'Perfil',
    sidebar_explore: 'Explorar',
    sidebar_bookings: 'Reservas',
    sidebar_bookings_artist: 'Reservas',
    sidebar_messages: 'Mensagens',
    sidebar_favorites: 'Favoritos',
    sidebar_history: 'Histórico',
    sidebar_stats: 'Estatísticas',
    sidebar_settings: 'Configurações',
    sidebar_portfolio: 'Portfólio',
    sidebar_services: 'Serviços',
    sidebar_logout: 'Sair',
    sidebar_pro: 'Junte-se ao LuxArts PRO',
    sidebar_pro_desc: 'Desbloqueie 6 serviços, 30 fotos e prioridade #1 no catálogo.',
    sidebar_pro_btn: 'Ver Planos PRO',
    sidebar_client_cta: 'É fotógrafo?',
    sidebar_client_desc: 'Junte-se ao LuxArts e mostre seu talento ao mundo.',
    sidebar_client_btn: 'Cadastrar como fotógrafo',
    notif_title: 'Notificações',
    notif_empty: 'Sem notificações novas.',
    notif_booking_title: 'Nova reserva',
    notif_msg_title: 'Nova mensagem',
    notif_view_bookings: 'Ver reservas',
    notif_view_chat: 'Ver mensagens',
  },
  fr: {
    sidebar_home: 'Accueil',
    sidebar_profile: 'Profil',
    sidebar_explore: 'Explorer',
    sidebar_bookings: 'Réservations',
    sidebar_bookings_artist: 'Réservations',
    sidebar_messages: 'Messages',
    sidebar_favorites: 'Favoris',
    sidebar_history: 'Historique',
    sidebar_stats: 'Statistiques',
    sidebar_settings: 'Paramètres',
    sidebar_portfolio: 'Portfolio',
    sidebar_services: 'Services',
    sidebar_logout: 'Déconnexion',
    sidebar_pro: 'Rejoindre LuxArts PRO',
    sidebar_pro_desc: 'Débloquez 6 services, 30 photos et la priorité #1 dans le catalogue.',
    sidebar_pro_btn: 'Voir les plans PRO',
    sidebar_client_cta: 'Vous êtes photographe ?',
    sidebar_client_desc: 'Rejoignez LuxArts et montrez votre talent au monde.',
    sidebar_client_btn: "S'inscrire comme photographe",
    notif_title: 'Notifications',
    notif_empty: 'Aucune nouvelle notification.',
    notif_booking_title: 'Nouvelle réservation',
    notif_msg_title: 'Nouveau message',
    notif_view_bookings: 'Voir les réservations',
    notif_view_chat: 'Voir les messages',
  },
}

export function AppPreferencesProvider({ children }) {
  const [theme, setThemeState] = useState(() => getStored(THEME_KEY, 'dark'))
  const [language, setLanguageState] = useState(() => getStored(LANG_KEY, 'es'))
  const [notifications, setNotifications] = useState(() => getStored(NOTIF_KEY, 'true') === 'true')
  const [notifSound, setNotifSound] = useState(() => getStored(NOTIF_SOUND_KEY, 'true') === 'true')
  const [notifEmail, setNotifEmail] = useState(() => getStored(NOTIF_EMAIL_KEY, 'false') === 'true')
  const [notifBookings, setNotifBookings] = useState(() => getStored(NOTIF_BOOKINGS_KEY, 'true') === 'true')
  const [notifMessages, setNotifMessages] = useState(() => getStored(NOTIF_MESSAGES_KEY, 'true') === 'true')

  const savePref = (key, value) => {
    try { localStorage.setItem(key, String(value)) } catch {}
  }

  const setTheme = (value) => {
    setThemeState(value)
    savePref(THEME_KEY, value)
  }

  const setLanguage = (code) => {
    setLanguageState(code)
    savePref(LANG_KEY, code)
  }

  const t = (key) => translations[language]?.[key] || translations.es[key] || key

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'light') {
      root.classList.add('light')
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add('dark')
    }
  }, [theme])

  return (
    <AppPreferencesContext.Provider value={{
      theme, setTheme,
      language, setLanguage,
      notifications, setNotifications,
      notifSound, setNotifSound,
      notifEmail, setNotifEmail,
      notifBookings, setNotifBookings,
      notifMessages, setNotifMessages,
      t,
    }}>
      {children}
    </AppPreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const ctx = useContext(AppPreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within AppPreferencesProvider')
  return ctx
}
