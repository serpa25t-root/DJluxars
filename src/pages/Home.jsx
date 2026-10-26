import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Camera, Aperture, Award, ShieldCheck, Clock, Star, ChevronRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import { getPlatformStats } from '../services/platformStats'

const portfolioItems = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&fm=webp&fit=crop',
    title: 'Boda Campestre',
    category: 'Bodas',
    layout: 'tall-left',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&fm=webp&fit=crop',
    title: 'Retrato Editorial',
    category: 'Retrato',
    layout: 'horizontal-top',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fm=webp&fit=crop',
    title: 'Moda Urbana',
    category: 'Moda',
    layout: 'tall-right',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80&fm=webp&fit=crop',
    title: 'Evento Corporativo',
    category: 'Eventos',
    layout: 'horizontal-bottom-left',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&fm=webp&fit=crop',
    title: 'Producto Premium',
    category: 'Producto',
    layout: 'tall-middle',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&fm=webp&fit=crop',
    title: 'Paisaje Andino',
    category: 'Paisajes',
    layout: 'horizontal-bottom-right',
  },
]

const services = [
  {
    id: 'sesion',
    icon: Camera,
    title: 'Sesión Fotográfica',
    desc: 'Retratos, book profesional o sesión personal con dirección creativa completa.',
    price: 'Desde $350.000',
    features: ['2-3 horas de sesión', '25 fotos editadas', 'Galería privada online'],
  },
  {
    id: 'bodas',
    icon: Aperture,
    title: 'Cobertura de Bodas',
    desc: 'Cobertura cinematográfica completa del día más importante de tu vida.',
    price: 'Desde $850.000',
    features: ['8 horas de cobertura', '120 fotos editadas', 'Álbum digital + teaser'],
  },
  {
    id: 'comercial',
    icon: Award,
    title: 'Fotografía Comercial',
    desc: 'Catálogo de producto, campañas y contenido visual para tu marca.',
    price: 'Desde $420.000',
    features: ['4 horas en estudio', '40 fotos HD', 'Retoque premium'],
  },
]

const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1280&q=65&fm=webp&fit=crop',
    alt: 'Pareja durante una sesión fotográfica profesional',
  },
  {
    src: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1280&q=65&fm=webp&fit=crop',
    alt: 'Fotógrafo preparando una sesión profesional',
  },
  {
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1280&q=65&fm=webp&fit=crop',
    alt: 'Cámara profesional en una sesión fotográfica',
  },
  {
    src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1280&q=65&fm=webp&fit=crop',
    alt: 'Sesión fotográfica al aire libre',
  },
]

const Home = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const [platformStats, setPlatformStats] = useState({
    sessions: 0,
    rating: 0,
    satisfaction: 0,
    supportHours: 0,
  })

  const loadStats = () => {
    getPlatformStats().then(setPlatformStats)
  }

  useEffect(() => {
    loadStats()
    window.addEventListener('luxarts-stats-updated', loadStats)
    return () => window.removeEventListener('luxarts-stats-updated', loadStats)
  }, [])

  const handleExplore = () => navigate('/fotografos')
  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/fotografos')
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length)
    }, 6500)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-lux-dark text-white selection:bg-lux-accent selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ══════════════════════════════════════════════════════════════
            HERO — Estudio cinematográfico
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[100svh] flex items-center overflow-hidden">
          {/* Carrusel de imágenes cinematográficas */}
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <img
                key={slide.src}
                src={slide.src}
                srcSet={`${slide.src.replace('w=1280', 'w=640')} 640w, ${slide.src} 1280w`}
                sizes="100vw"
                width="1280"
                height="853"
                alt={slide.alt}
                aria-hidden={index !== activeHeroSlide}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover ${
                  index === 0 && activeHeroSlide === 0
                    ? 'opacity-100'
                    : `transition-opacity duration-[1400ms] ease-in-out ${
                        index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
                      }`
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-lux-dark via-lux-dark/80 to-lux-dark/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-lux-dark via-transparent to-lux-dark/60" />
            {/* Viñeta cinematográfica */}
            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
          </div>

          {/* Contenido */}
          <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="animate-[fadeInUp_700ms_var(--ease-out-quart)_both]">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-lux-accent animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-[0.25em] text-zinc-300 uppercase">
                    Estudio de Fotografía
                  </span>
                </span>
              </div>

              {/* Título principal */}
              <h1 className="mt-8 font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight animate-[fadeInUp_700ms_var(--ease-out-quart)_100ms_both]">
                <span className="block text-white">Capturamos</span>
                <span className="block text-white">tu esencia,</span>
                <span className="block font-display italic font-normal text-lux-accent">creamos arte.</span>
              </h1>

              {/* Descripción */}
              <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-zinc-400 animate-[fadeInUp_700ms_var(--ease-out-quart)_200ms_both]">
                Conectamos tu visión con fotógrafos excepcionales. Cada imagen cuenta una historia, cada historia merece ser inmortalizada.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-[fadeInUp_700ms_var(--ease-out-quart)_300ms_both]">
                <button
                  onClick={handleExplore}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-lux-accent px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-lux-accent/25 hover:bg-lux-accentHover hover:shadow-lux-accent/40 active:scale-[0.98] transition-all duration-300"
                >
                  Explorar fotógrafos
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <a
                  href="#portafolio"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-300"
                >
                  Ver portafolio
                </a>
              </div>

              {/* Stats inline */}
              <div className="mt-14 flex items-center gap-8 animate-[fadeInUp_700ms_var(--ease-out-quart)_400ms_both]">
                <div className="flex -space-x-2.5">
                  {[33, 14, 47, 25].map((img) => (
                    <img
                      key={img}
                      src={`https://i.pravatar.cc/80?img=${img}`}
                      alt="Cliente LuxArs"
                      className="h-9 w-9 rounded-full border-2 border-lux-dark object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.round(platformStats.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-600'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-sm font-bold text-white">{platformStats.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{platformStats.sessions} sesiones realizadas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Indicador scroll */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-[fadeIn_1000ms_var(--ease-out-quart)_800ms_both]">
            <span className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
          </div>

          <div className="absolute bottom-8 right-6 flex items-center gap-2 sm:right-8 lg:right-12">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Ver imagen ${index + 1} del carrusel`}
                aria-current={index === activeHeroSlide ? 'true' : undefined}
                onClick={() => setActiveHeroSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeHeroSlide
                    ? 'w-8 bg-lux-accent'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PORTAFOLIO — Galería editorial
        ══════════════════════════════════════════════════════════════ */}
        <section id="portafolio" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 reveal">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.3em] text-lux-accent uppercase">
                  Portafolio
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Trabajos que
                  <span className="font-display italic font-normal text-lux-accent"> inspiran</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
                Una selección de nuestros mejores trabajos. Cada proyecto refleja la visión única de nuestros fotógrafos.
              </p>
            </div>

            {/* Grid masonry */}
            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {portfolioItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900 cursor-pointer reveal"
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-lux-accent uppercase">
                      {item.category}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  {/* Hover border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-lux-accent/0 group-hover:border-lux-accent/40 transition-colors duration-500" />
                </div>
              ))}
            </div>

            {/* CTA ver más */}
            <div className="mt-10 text-center reveal">
              <button
                onClick={handleExplore}
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-7 py-3 text-sm font-semibold text-white hover:border-lux-accent/40 hover:bg-zinc-900 transition-all duration-300"
              >
                Ver todo el portafolio
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SERVICIOS — Tarjetas elegantes
        ══════════════════════════════════════════════════════════════ */}
        <section id="servicios" className="py-24 sm:py-32 bg-lux-surface">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            {/* Encabezado */}
            <div className="text-center max-w-2xl mx-auto reveal">
              <span className="text-[11px] font-semibold tracking-[0.3em] text-lux-accent uppercase">
                Servicios
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Experiencias
                <span className="font-display italic font-normal text-lux-accent"> fotográficas</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-500">
                Elige la experiencia que se adapta a tu historia. Tarifas transparentes y entrega garantizada.
              </p>
            </div>

            {/* Grid de servicios */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, idx) => {
                const Icon = service.icon
                return (
                  <div
                    key={service.id}
                    className="group relative rounded-2xl border border-zinc-800/60 bg-lux-dark p-8 hover:border-lux-accent/30 hover:shadow-xl hover:shadow-lux-accent/5 transition-all duration-500 reveal"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    {/* Icono */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lux-accent/10 border border-lux-accent/20 text-lux-accent group-hover:bg-lux-accent group-hover:text-white transition-all duration-500">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Contenido */}
                    <h3 className="mt-6 font-display text-xl font-bold text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                      {service.desc}
                    </p>

                    {/* Features */}
                    <ul className="mt-5 space-y-2">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                          <span className="h-1 w-1 rounded-full bg-lux-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Precio + CTA */}
                    <div className="mt-8 flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-white">
                        {service.price}
                      </span>
                      <button
                        onClick={handleBooking}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-lux-accent hover:border-lux-accent transition-all duration-300"
                      >
                        Reservar
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            RESERVA — CTA cinematográfico
        ══════════════════════════════════════════════════════════════ */}
        <section id="reserva" className="relative py-24 sm:py-32 overflow-hidden">
          {/* Fondo */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&q=80&fm=webp&fit=crop"
              alt="Cámara en estudio"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-lux-dark/85" />
            <div className="absolute inset-0 bg-gradient-to-b from-lux-dark via-transparent to-lux-dark" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center">
            <div className="reveal">
              <span className="text-[11px] font-semibold tracking-[0.3em] text-lux-accent uppercase">
                Reserva tu sesión
              </span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                ¿Listo para capturar
                <span className="font-display italic font-normal text-lux-accent"> algo increíble?</span>
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-zinc-400">
                Únete a miles de clientes que ya encontraron a su fotógrafo ideal. Tu próxima gran historia está a un clic de distancia.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleBooking}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-lux-accent px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-lux-accent/25 hover:bg-lux-accentHover hover:shadow-lux-accent/40 active:scale-[0.98] transition-all duration-300"
                >
                  Reservar ahora
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-300"
                >
                  Crear cuenta
                </Link>
              </div>

              {/* Badges de confianza */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-zinc-500">
                <span className="inline-flex items-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Reservas seguras
                </span>
                <span className="inline-flex items-center gap-2 text-xs">
                  <Clock className="h-4 w-4" />
                  Entrega garantizada
                </span>
                <span className="inline-flex items-center gap-2 text-xs">
                  <Award className="h-4 w-4 text-amber-500" />
                  Calidad verificada
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            STATS — Barra de estadísticas
        ══════════════════════════════════════════════════════════════ */}
        <section className="border-y border-zinc-800/50 bg-lux-surface">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: platformStats.sessions, label: 'Sesiones realizadas' },
                { value: platformStats.rating.toFixed(1), label: 'Calificación promedio' },
                { value: `${platformStats.satisfaction}%`, label: 'Clientes satisfechos' },
                { value: `${platformStats.supportHours}h`, label: 'Soporte disponible' },
              ].map((stat, idx) => (
                <div key={stat.label} className="text-center reveal" style={{ transitionDelay: `${idx * 80}ms` }}>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium tracking-[0.15em] text-zinc-500 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            MARCAS — Footer de confianza
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <p className="text-center text-[11px] font-semibold tracking-[0.3em] text-zinc-600 uppercase reveal">
              Equipo profesional recomendado
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-40 grayscale reveal">
              {['Canon', 'Sony', 'Nikon', 'Fujifilm', 'DJI', 'Profoto'].map((brand) => (
                <span key={brand} className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-500">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home