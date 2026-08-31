import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import api from '../services/api'

const sessionTypes = ['Bodas', 'Retrato', 'Moda', 'Eventos', 'Editorial', 'Producto', 'Familia', 'Newborn']

const pricingPlans = [
  {
    id: 'retrato',
    name: 'Sesión Retrato',
    price: 250000,
    per: 'sesión',
    duration: '1 hora',
    delivery: '3 días',
    features: ['20 fotos editadas', 'Galería online', '1 locación'],
    accent: false,
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop',
  },
  {
    id: 'bodas',
    name: 'Sesión Bodas',
    price: 850000,
    per: 'sesión',
    duration: '4 horas',
    delivery: '7 días',
    features: ['80 fotos editadas', 'Álbum digital', '2 fotógrafos', 'Video teaser'],
    accent: true,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
  },
  {
    id: 'moda',
    name: 'Sesión Moda / Editorial',
    price: 520000,
    per: 'sesión',
    duration: '2.5 horas',
    delivery: '5 días',
    features: ['40 fotos editadas', 'Retoque premium', 'Dirección creativa'],
    accent: false,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop',
  },
  {
    id: 'eventos',
    name: 'Eventos & Corporativo',
    price: 380000,
    per: 'sesión',
    duration: '2 horas',
    delivery: '4 días',
    features: ['50 fotos editadas', 'Entrega express opcional', 'Cobertura completa'],
    accent: false,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
  },
]

const formatCOP = (value) => `$${value.toLocaleString('es-CO')} COP`

const getLocationLabel = (artist) => {
  const ciudad = artist?.ciudad || artist?.city || ''
  const depto = artist?.departamento || artist?.department || ''
  if (ciudad && depto) return `${ciudad}, ${depto}`
  if (ciudad) return ciudad
  if (depto) return depto
  return 'Ubicación no disponible'
}

const getPriceForArtist = (artist, index) => {
  if (artist?.price) return artist.price
  const fallback = [250000, 520000, 380000, 850000]
  return fallback[index % fallback.length]
}

const Home = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [featuredArtists, setFeaturedArtists] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Floating search state
  const [searchType, setSearchType] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchDate, setSearchDate] = useState('')

  const mockArtists = [
    { id: 1, first_name: 'Elena', last_name: 'Mora', name: 'Elena Mora', profile_picture: 'https://i.pravatar.cc/150?img=5', category: 'Retrato', avatar: 'https://i.pravatar.cc/150?img=5', ciudad: 'Medellín', departamento: 'Antioquia', price: 250000 },
    { id: 2, first_name: 'Marc', last_name: 'Dubois', name: 'Marc Dubois', profile_picture: 'https://i.pravatar.cc/150?img=15', category: 'Moda', avatar: 'https://i.pravatar.cc/150?img=15', ciudad: 'Bogotá', departamento: 'Cundinamarca', price: 520000 },
    { id: 3, first_name: 'Sofía', last_name: 'Reyes', name: 'Sofía Reyes', profile_picture: 'https://i.pravatar.cc/150?img=9', category: 'Eventos', avatar: 'https://i.pravatar.cc/150?img=9', ciudad: 'Cali', departamento: 'Valle del Cauca', price: 380000 },
    { id: 4, name: 'Javier Ortiz', first_name: 'Javier', last_name: 'Ortiz', profile_picture: 'https://i.pravatar.cc/150?img=12', category: 'Editorial', avatar: 'https://i.pravatar.cc/150?img=12', ciudad: 'Cartagena', departamento: 'Bolívar', price: 850000 },
  ]

  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      try {
        const response = await api.get('users/?role=artist')
        const data = response.data.results || response.data
        setFeaturedArtists(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeaturedArtists()
  }, [])

  const displayArtists = featuredArtists.length > 0 ? featuredArtists : (!isLoading ? mockArtists : [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchType) params.set('category', searchType)
    if (searchLocation) params.set('location', searchLocation)
    if (searchDate) params.set('date', searchDate)
    const qs = params.toString()
    navigate(qs ? `/explorar?${qs}` : '/explorar')
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <main className="flex-1">
        {/* HERO — Cinematic Crimson & Deep Black */}
        <section className="relative overflow-hidden bg-black">
          {/* Base + gradient */}
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-black to-black" />
          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Crimson glows — tasteful, not overwhelming */}
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-red-600/10 blur-[130px] pointer-events-none will-change-transform" />
          <div className="absolute top-[30%] -right-32 h-[520px] w-[520px] rounded-full bg-red-900/15 blur-[110px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

          {/* Subtle letterbox top accent */}
          <div className="absolute top-0 left-0 h-[2px] w-full bg-red-600/80" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            {/* Top eyebrow */}
            <div
              className="flex justify-center lg:justify-start animate-[fadeInUp_600ms_var(--ease-out-quart)_both]"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />
                <span className="text-xs font-semibold tracking-widest text-red-300">PORTAFOLIOS EDITORIALES • TALENTO VERIFICADO</span>
              </div>
            </div>

            {/* Editorial asymmetric — text left 60%, mosaic right 40% */}
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-6">
              {/* Left — Typography led */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <h1
                  className="font-display text-[34px] font-bold tracking-tight text-white sm:text-5xl lg:text-[58px] lg:leading-[0.95] animate-[fadeInUp_600ms_var(--ease-out-quart)_80ms_both]"
                >
                  <span className="block">Captura y exhibe</span>
                  <span className="block bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent pb-1">
                    el arte de tu lente
                  </span>
                </h1>

                <p
                  className="mt-5 max-w-2xl mx-auto lg:mx-0 text-[15px] leading-relaxed text-zinc-400 sm:text-[17px] animate-[fadeInUp_600ms_var(--ease-out-quart)_140ms_both]"
                >
                  Exhibe tu portafolio con calidad cinemática y conecta con clientes listos para contratar tu talento. La plataforma exclusiva para fotógrafos y creadores visuales.
                </p>

                <div
                  className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-[fadeInUp_600ms_var(--ease-out-quart)_200ms_both]"
                >
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button
                        variant="primary"
                        className="px-8 py-3.5 text-[15px] shadow-xl shadow-red-600/20 hover:shadow-red-600/30"
                      >
                        Continuar a mi cuenta
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/explorar">
                        <Button
                          variant="primary"
                          className="px-8 py-3.5 text-[15px] shadow-xl shadow-red-600/20 hover:shadow-red-600/30"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Explorar Galería
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button variant="secondary" className="px-8 py-3.5 text-[15px] border-zinc-800 hover:border-red-600/30">
                          Unirme como Fotógrafo
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Social proof — red stars */}
                <div
                  className="mt-9 flex items-center gap-6 justify-center lg:justify-start animate-[fadeIn_500ms_ease-out_300ms_both]"
                >
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/100?img=33" alt="Fotógrafo 1" className="h-9 w-9 rounded-full border-2 border-black object-cover" />
                    <img src="https://i.pravatar.cc/100?img=14" alt="Fotógrafo 2" className="h-9 w-9 rounded-full border-2 border-black object-cover" />
                    <img src="https://i.pravatar.cc/100?img=47" alt="Fotógrafo 3" className="h-9 w-9 rounded-full border-2 border-black object-cover" />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-zinc-900 text-xs font-semibold text-white">
                      +2k
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-500 tracking-widest text-sm">★★★★★</span>
                      <span className="text-sm font-semibold text-white">4.9/5</span>
                      <span className="ml-1 rounded-full bg-red-600/15 border border-red-600/20 px-2 py-0.5 text-[11px] font-semibold text-red-300">1.2k reseñas</span>
                    </div>
                    <p className="text-xs text-zinc-500">Confianza de estudios y marcas</p>
                  </div>
                </div>

                {/* Mini stats — inline, cinematic */}
                <div className="mt-10 grid grid-cols-3 gap-4 border-t border-zinc-900 pt-6 max-w-xl mx-auto lg:mx-0">
                  <div>
                    <p className="font-display text-2xl font-bold text-white">15k<span className="text-red-600">+</span></p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Obras</p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4">
                    <p className="font-display text-2xl font-bold text-white">98<span className="text-red-600">%</span></p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Satisfacción</p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4">
                    <p className="font-display text-2xl font-bold text-white">24/7</p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Soporte</p>
                  </div>
                </div>
              </div>

              {/* Right — Cinematic mosaic with red glow borders */}
              <div className="lg:col-span-5 relative">
                <div
                  className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:gap-3 animate-[scaleIn_700ms_var(--ease-out-expo)_180ms_both] will-change-transform"
                >
                  {/* Left column */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] border border-zinc-900 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-600/15 transition-all duration-300 ease-out will-change-transform">
                      <img
                        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=750&fit=crop&crop=center"
                        alt="Retrato editorial cinematográfico"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {/* Top red accent line on hover */}
                      <div className="absolute top-0 left-0 h-0.5 w-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-xs font-semibold tracking-wide text-white">Retrato Editorial</p>
                        <p className="text-[11px] text-zinc-300">por Elena Mora • <span className="text-red-400">S35mm</span></p>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/3] border border-zinc-900 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300 ease-out">
                      <img
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=450&fit=crop"
                        alt="Cámara en estudio oscuro"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Right column — offset */}
                  <div className="space-y-3 sm:space-y-4 pt-6">
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/3] border border-zinc-900 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300 ease-out">
                      <img
                        src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=450&fit=crop"
                        alt="Paisaje nocturno cinematográfico"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] border border-zinc-900 hover:border-red-600/30 hover:shadow-xl hover:shadow-red-600/15 transition-all duration-300 ease-out">
                      <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop&crop=faces"
                        alt="Moda editorial"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">Moda • París</p>
                          <p className="text-[11px] text-zinc-300">por Marc Dubois</p>
                        </div>
                        <span className="rounded-full bg-red-600 text-white border border-red-500/30 px-2.5 py-1 text-[11px] font-bold shadow-md shadow-red-600/30">
                          4.9 ★
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vertical film sprocket decor */}
                  <div className="pointer-events-none absolute -right-2 top-6 bottom-6 hidden lg:flex flex-col justify-between opacity-20">
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                  </div>
                </div>

                {/* Floating card — red glow */}
                <div className="absolute -bottom-5 left-2 sm:left-0 flex items-center gap-3 rounded-2xl border border-red-600/20 bg-zinc-900/90 backdrop-blur-xl px-4 py-3 shadow-xl shadow-black/50 hover:shadow-red-600/10 hover:border-red-600/30 transition-all duration-300 ease-out animate-[fadeInUp_500ms_var(--ease-out-quart)_600ms_both]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 text-red-400 border border-red-600/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">+12k sesiones</p>
                    <p className="text-xs text-zinc-400">reservadas este mes</p>
                  </div>
                  <div className="ml-2 hidden sm:flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom red line + trusted by */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-zinc-500 border-t border-zinc-900 pt-6 animate-[fadeIn_500ms_ease-out_700ms_both]">
              <span className="font-medium tracking-widest uppercase">Confían en LuxArts</span>
              <span className="hidden sm:block h-3 w-px bg-zinc-800" />
              <div className="flex items-center gap-6 opacity-60">
                <span className="font-display font-semibold tracking-widest">VOGUE</span>
                <span className="font-display font-semibold tracking-widest">GQ</span>
                <span className="font-display font-semibold tracking-widest">KINOFOLK</span>
                <span className="font-display font-semibold tracking-widest">ESQUIRE</span>
              </div>
            </div>
          </div>
        </section>

        {/* BUSCADOR FLOTANTE — Glassmorphism Dark/Crimson */}
        <section className="relative z-20 -mt-6 sm:-mt-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <form
              onSubmit={handleSearchSubmit}
              className="relative rounded-[20px] sm:rounded-[28px] border border-zinc-800/60 bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden animate-[fadeInUp_500ms_var(--ease-out-quart)_400ms_both]"
            >
              {/* Top crimson accent */}
              <div className="absolute top-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-[70%] rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr_1fr_auto] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/60">
                {/* Tipo de sesión */}
                <div className="px-5 sm:px-6 py-4 sm:py-5">
                  <label className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tipo de sesión
                  </label>
                  <div className="mt-2 relative">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 pr-10 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all"
                    >
                      <option value="">Bodas, Retrato, Moda...</option>
                      {sessionTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="px-5 sm:px-6 py-4 sm:py-5">
                  <label className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Ubicación
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Medellín, Antioquia..."
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all"
                    />
                  </div>
                </div>

                {/* Fecha */}
                <div className="px-5 sm:px-6 py-4 sm:py-5">
                  <label className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Fecha
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      placeholder="Seleccionar fecha"
                      onFocus={(e) => e.target.showPicker?.()}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:invert"
                    />
                    {!searchDate && (
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 hidden sm:block">Seleccionar fecha</span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-center p-4 sm:p-5 bg-zinc-950/40">
                  <button
                    type="submit"
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30 active:scale-[0.98] transition-all duration-200 will-change-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
                    </svg>
                    Buscar
                  </button>
                </div>
              </div>

              {/* bottom hint */}
              <div className="border-t border-zinc-800/50 bg-zinc-950/30 px-5 sm:px-6 py-2.5 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="hidden sm:inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  +2.5k fotógrafos verificados
                </span>
                <span className="hidden sm:block h-3 w-px bg-zinc-800" />
                <span>Prueba: “Retrato en Medellín” o “Bodas en Antioquia”</span>
              </div>
            </form>
          </div>
        </section>

        {/* FOTÓGRAFOS RECOMENDADOS — con ubicación real + tarifa + Contactar -> /chat */}
        <section className="py-16 bg-zinc-950 border-t border-zinc-900 mt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-white">Fotógrafos Recomendados</h2>
                <p className="mt-2 text-sm text-zinc-400">Talento verificado, listo para tu próximo proyecto</p>
              </div>
              <Link to="/explorar" className="hidden sm:inline-flex text-sm font-medium text-red-500 hover:text-red-400 transition-colors">Ver todos →</Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-zinc-900 rounded-3xl h-[380px] border border-zinc-800" />
                  ))
                : displayArtists.map((artist, idx) => {
                    const locationLabel = getLocationLabel(artist)
                    const price = getPriceForArtist(artist, idx)
                    return (
                      <div
                        key={artist?.id || artist?.username || idx}
                        className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 hover:border-red-900/30 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-300"
                      >
                        <Link to={`/fotografos/${artist?.id || 1}`} className="block">
                          <div className="aspect-[4/3] overflow-hidden bg-zinc-900">
                            <img
                              src={artist?.profile_picture || artist?.avatar || `https://i.pravatar.cc/300?img=${(artist?.id % 70) + 1}`}
                              alt={artist?.name || `${artist?.first_name || ''} ${artist?.last_name || ''}`.trim() || 'Fotógrafo'}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                        <div className="flex flex-1 flex-col p-4">
                          <Link to={`/fotografos/${artist?.id || 1}`} className="hover:text-red-400 transition-colors">
                            <h3 className="font-semibold text-white truncate">{artist?.name || `${artist?.first_name || ''} ${artist?.last_name || ''}`.trim() || artist?.username || 'Fotógrafo'}</h3>
                          </Link>
                          <p className="text-xs text-zinc-500 mt-1">{artist?.category || artist?.specialty || 'General'} • {artist?.role || 'artist'}</p>
                          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{locationLabel}</span>
                          </p>
                          <p className="mt-3 text-sm font-bold text-white">
                            {formatCOP(price)} <span className="font-normal text-zinc-500 text-xs">/ sesión</span>
                          </p>
                          <div className="mt-4 mt-auto flex gap-2">
                            <Link to={`/fotografos/${artist?.id || 1}`} className="flex-1">
                              <span className="flex w-full items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors">
                                Ver perfil
                              </span>
                            </Link>
                            <Link to={`/chat?photographer=${artist?.id || ''}`} className="flex-1">
                              <span className="flex w-full items-center justify-center gap-1.5 rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Contactar
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
            </div>
            <div className="mt-6 flex justify-center sm:hidden">
              <Link to="/explorar" className="text-sm font-medium text-red-500 hover:text-red-400">Ver todos →</Link>
            </div>
          </div>
        </section>

        {/* TARIFAS Y SERVICIOS — reemplaza "Consultar precio" con tarifas claras */}
        <section id="servicios" className="py-16 sm:py-20 bg-black border-t border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/10 px-3 py-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-widest text-red-300 uppercase">Tarifas transparentes</span>
              </div>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Tarifas y Servicios
              </h2>
              <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-zinc-400">
                Precios claros por sesión. Sin regateos, sin “consultar precio”. Elige el formato que se ajusta a tu historia.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col overflow-hidden rounded-[22px] border bg-zinc-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 will-change-transform ${
                    plan.accent
                      ? 'border-red-600/30 shadow-lg shadow-red-600/15 hover:shadow-red-600/20 hover:border-red-600/40'
                      : 'border-zinc-800 hover:border-zinc-700 hover:shadow-black/40'
                  }`}
                >
                  {plan.accent && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-400" />
                  )}
                  {plan.accent && (
                    <div className="absolute top-3 right-3 rounded-full bg-red-600 text-white px-2.5 py-1 text-[10px] font-bold tracking-widest border border-red-500/30 shadow-md">
                      MÁS POPULAR
                    </div>
                  )}
                  <div className="h-36 overflow-hidden bg-zinc-900">
                    <img src={plan.image} alt={plan.name} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 h-36 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent pointer-events-none" style={{ top: 0 }} />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6 pt-4">
                    <h3 className="font-display text-lg font-bold text-white tracking-tight">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold tracking-tight text-white">{formatCOP(plan.price)}</span>
                      <span className="text-xs font-medium text-zinc-500">/ {plan.per}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{plan.duration} • Entrega en {plan.delivery}</p>
                    <ul className="mt-4 space-y-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/chat" className="mt-6 block">
                      <span
                        className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                          plan.accent
                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30'
                            : 'bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
                        }`}
                      >
                        Contactar
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-zinc-500">
              Tarifas base referenciales. El precio final se acuerda con el fotógrafo en el chat. Sin comisiones ocultas.
            </p>
          </div>
        </section>

        {/* Stats — black with red dividers */}
        <section className="border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-zinc-900">
              <div className="text-center px-2">
                <p className="font-display text-3xl font-bold text-white">15k<span className="text-red-600">+</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Obras Publicadas</p>
              </div>
              <div className="text-center px-2">
                <p className="font-display text-3xl font-bold text-white">98<span className="text-red-600">%</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Satisfacción</p>
              </div>
              <div className="text-center px-2">
                <p className="font-display text-3xl font-bold text-white">2.5k</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Reservas Activas</p>
              </div>
              <div className="text-center px-2">
                <p className="font-display text-3xl font-bold text-white">24/7</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Soporte dedicado</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
