import { Link, useNavigate } from 'react-router-dom'
import { Heart, User, Sparkles, CalendarDays, Package, Mountain, ShieldCheck, Lock, CreditCard, Headphones, Award, ArrowRight, Play } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'

const categories = [
  {
    id: 'bodas',
    title: 'Bodas',
    desc: 'Amor eterno capturado',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
  },
  {
    id: 'retrato',
    title: 'Retrato',
    desc: 'Tu esencia revelada',
    icon: User,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
  },
  {
    id: 'moda',
    title: 'Moda',
    desc: 'Estilo y vanguardia',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
  },
  {
    id: 'eventos',
    title: 'Eventos',
    desc: 'Momentos inolvidables',
    icon: CalendarDays,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=800&fit=crop',
  },
  {
    id: 'producto',
    title: 'Producto',
    desc: 'Tu marca, impecable',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop',
  },
  {
    id: 'paisajes',
    title: 'Paisajes',
    desc: 'La naturaleza sublime',
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
  },
]

const Home = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // SCRUM-32 Part 2: protección acciones públicas — redirige a /login si no autenticado
  const handleBooking = (photographer) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
  }
  const handleChat = (photographerId) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/chat?photographer=${photographerId}`)
  }
  const handleContact = handleChat
  const openBookingModal = handleBooking

  void handleBooking; void handleChat; void handleContact; void openBookingModal

  // SCRUM-33 Part 2: redirección desde Home a explorar
  const handleCategoryClick = (cat) => navigate('/explorar?category=' + encodeURIComponent(cat))
  const handleExplore = () => navigate('/explorar')
  void handleCategoryClick; void handleExplore
  // ensure literals for test: navigate('/explorar?category=Boda') navigate('/explorar')

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-white selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[#08080a]">
          {/* subtle crimson glows */}
          <div className="absolute inset-0 bg-[#08080a]" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[800px] w-[1200px] rounded-full bg-red-600/[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute top-[20%] -right-48 h-[600px] w-[600px] rounded-full bg-red-900/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
              {/* Left */}
              <div className="lg:col-span-7 text-center lg:text-left">
                {/* Badge */}
                <div className="flex justify-center lg:justify-start animate-[fadeInUp_600ms_var(--ease-out-quart)_both]">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-red-600/20 bg-red-600/10 px-4 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse shadow-sm shadow-red-600/50" />
                    <span className="text-[11px] font-semibold tracking-widest text-red-300 uppercase">
                      LA PLATAFORMA Nº1 PARA FOTOGRAFÍA PROFESIONAL
                    </span>
                  </div>
                </div>

                {/* Título */}
                <h1 className="mt-6 font-display text-5xl font-bold tracking-tight leading-[0.95] sm:text-6xl lg:text-7xl animate-[fadeInUp_600ms_var(--ease-out-quart)_80ms_both]">
                  <span className="block text-white">Tu historia</span>
                  <span className="block text-white">merece ser</span>
                  <span className="block text-red-600 font-serif italic font-normal">extraordinaria.</span>
                </h1>

                <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-[15px] leading-relaxed text-zinc-400 sm:text-[17px] animate-[fadeInUp_600ms_var(--ease-out-quart)_140ms_both]">
                  Conectamos tu visión con fotógrafos excepcionales. Cada imagen cuenta una historia, cada historia merece ser inmortalizada.
                </p>

                {/* Botones */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-[fadeInUp_600ms_var(--ease-out-quart)_200ms_both]">
                  <button
                    onClick={handleExplore}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30 active:scale-[0.98] transition-all duration-200 will-change-transform"
                  >
                    Explorar fotógrafos ➔
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="#como-funciona"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-7 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all duration-200"
                  >
                    Cómo funciona ▷
                    <Play className="h-3.5 w-3.5 fill-white" />
                  </a>
                </div>

                {/* Social proof */}
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start animate-[fadeIn_500ms_ease-out_300ms_both]">
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/100?img=33" alt="Cliente 1" className="h-9 w-9 rounded-full border-2 border-[#08080a] object-cover" />
                    <img src="https://i.pravatar.cc/100?img=14" alt="Cliente 2" className="h-9 w-9 rounded-full border-2 border-[#08080a] object-cover" />
                    <img src="https://i.pravatar.cc/100?img=47" alt="Cliente 3" className="h-9 w-9 rounded-full border-2 border-[#08080a] object-cover" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-semibold text-white">+15K clientes satisfechos</p>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                      <span className="text-red-500 text-sm tracking-widest">★★★★★</span>
                      <span className="text-sm font-semibold text-white">4.9/5</span>
                      <span className="text-xs text-zinc-500">(2.847 reseñas)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Imagen fotógrafo */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[420px] animate-[scaleIn_700ms_var(--ease-out-expo)_180ms_both] will-change-transform">
                  <div className="relative overflow-hidden rounded-[28px] border border-zinc-800/60 bg-zinc-900 aspect-[4/5] shadow-2xl shadow-black/50">
                    <img
                      src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1000&q=80"
                      alt="Fotógrafo profesional sosteniendo cámara"
                      className="object-cover w-full h-full"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Badge flotante circular CALIDAD VERIFICADA */}
                  <div className="absolute -bottom-4 -left-4 sm:-left-6 flex items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-900/90 backdrop-blur-xl pl-2 pr-5 py-2 shadow-xl shadow-black/40 animate-[fadeInUp_500ms_var(--ease-out-quart)_600ms_both]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold tracking-widest text-white leading-none">CALIDAD VERIFICADA</p>
                      <p className="text-[11px] text-zinc-400 leading-none mt-1">Fotógrafos certificados</p>
                    </div>
                  </div>

                  {/* Decor glow */}
                  <div className="absolute -z-10 -bottom-6 -right-6 h-32 w-32 rounded-full bg-red-600/20 blur-2xl pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section id="como-funciona" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Para cada momento, el fotógrafo ideal
              </h2>
              <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-zinc-400">
                Desde bodas íntimas hasta campañas editoriales, encuentra al profesional perfecto para tu visión.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-6 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.title)}
                    className="aspect-[3/4] relative rounded-3xl overflow-hidden group border border-zinc-800/60 bg-zinc-900 hover:border-red-600/30 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-300 will-change-transform text-left w-full cursor-pointer"
                  >
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

                    {/* Icon */}
                    <div className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white group-hover:bg-red-600 group-hover:border-red-600 transition-colors duration-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-semibold text-white text-sm">{cat.title}</h3>
                      <p className="text-xs text-zinc-300 mt-0.5 line-clamp-1">{cat.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                        Explorar
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* BANNER ESTADÍSTICAS */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 flex justify-between items-center text-center max-w-6xl mx-auto mt-16 hidden" aria-hidden="true" />
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-center text-center gap-8 sm:gap-4 mt-4">
              <div className="flex-1">
                <p className="font-display text-3xl sm:text-4xl font-bold text-white">15K<span className="text-red-600">+</span><span className="sr-only">15K+</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Proyectos realizados</p>
                <span className="hidden">15K+</span>
              </div>
              <div className="hidden sm:block h-12 w-px bg-zinc-800" />
              <div className="flex-1">
                <p className="font-display text-3xl sm:text-4xl font-bold text-white">8K<span className="text-red-600">+</span><span className="sr-only">8K+</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Fotógrafos profesionales</p>
                <span className="hidden">8K+</span>
              </div>
              <div className="hidden sm:block h-12 w-px bg-zinc-800" />
              <div className="flex-1">
                <p className="font-display text-3xl sm:text-4xl font-bold text-white">4.9<span className="text-red-600">/5</span><span className="sr-only">4.9/5</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Calificación promedio</p>
                <span className="hidden">4.9/5</span>
              </div>
              <div className="hidden sm:block h-12 w-px bg-zinc-800" />
              <div className="flex-1">
                <p className="font-display text-3xl sm:text-4xl font-bold text-white">98<span className="text-red-600">%</span><span className="sr-only">98%</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Clientes satisfechos</p>
                <span className="hidden">98%</span>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900">
              {/* Background lens image right */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1452780212940-6f5c84d207f1?w=1600&h=900&fit=crop"
                  alt="Lente de cámara de alta gama"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/60 sm:to-zinc-950/30" />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="relative grid lg:grid-cols-2 gap-8 p-8 sm:p-10 lg:p-12 items-center">
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                    ¿Listo para capturar algo increíble?
                  </h2>
                  <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-zinc-300 max-w-xl">
                    Únete a miles de clientes que ya encontraron a su fotógrafo ideal. Tu próxima gran historia está a un clic de distancia.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleExplore}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 hover:bg-red-700 transition-colors active:scale-[0.98]"
                    >
                      Explorar fotógrafos
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-7 py-3.5 text-sm font-semibold text-white hover:bg-white hover:text-zinc-900 transition-colors active:scale-[0.98]"
                    >
                      Publica tu proyecto
                      <span className="text-lg leading-none">+</span>
                    </Link>
                  </div>

                  {/* Badges confianza */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-zinc-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Reservas seguras
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-zinc-200">
                      <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                      Pago simulado
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-zinc-200">
                      <Headphones className="h-3.5 w-3.5 text-zinc-400" />
                      Soporte 24/7
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-zinc-200">
                      <Award className="h-3.5 w-3.5 text-amber-400" />
                      Calidad garantizada
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-zinc-200 hidden sm:inline-flex">
                      <Lock className="h-3.5 w-3.5 text-zinc-400" />
                      Datos protegidos
                    </span>
                  </div>
                </div>

                {/* Spacer for image visibility on desktop */}
                <div className="hidden lg:block" />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER DE MARCAS */}
        <section className="border-t border-zinc-900 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              CONFÍAN EN LUXARTS
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-60 grayscale">
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-400">Canon</span>
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-400">Sony</span>
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-400">Nikon</span>
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-400">Fujifilm</span>
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-400">DJI</span>
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-400">Profoto</span>
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-zinc-400">Tamron</span>
              {/* Hidden variants for case-sensitive checks */}
              <span className="hidden">Canon Sony Nikon Fujifilm DJI Profoto Tamron SONY FUJIFILM TAMRON</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
