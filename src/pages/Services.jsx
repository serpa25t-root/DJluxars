import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Heart, Package, CalendarDays, Clock, Image as ImageIcon, Award, ShieldCheck, Check, ArrowRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import BookingModal from '../components/booking/BookingModal'
import { useAuth } from '../context/AuthContext'

const packages = [
  {
    id: 'retrato',
    title: 'Sesión Retrato Personal',
    desc: 'Ideal para marca personal, LinkedIn y book profesional con dirección creativa.',
    icon: User,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop',
    price: 350000,
    features: ['3 Horas de sesión', '25 Fotos editadas en alta resolución', 'Galería privada online', '1 Locación a elección', 'Entrega en 3 días'],
    accent: false,
  },
  {
    id: 'bodas',
    title: 'Cobertura de Bodas Premium',
    desc: 'Cobertura cinematográfica completa con 2 fotógrafos y álbum digital.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    price: 850000,
    features: ['8 Horas de cobertura', '120 Fotos editadas en alta resolución', 'Álbum digital + Video teaser', '2 Fotógrafos profesionales', 'Entrega en 7 días'],
    accent: true,
  },
  {
    id: 'producto',
    title: 'Fotografía de Producto',
    desc: 'Catálogo impecable para e-commerce y campañas con retoque premium.',
    icon: Package,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    price: 420000,
    features: ['4 Horas de sesión en estudio', '40 Fotos editadas en alta resolución', 'Fondo blanco y lifestyle', 'Retoque premium incluido', 'Entrega en 5 días'],
    accent: false,
  },
  {
    id: 'eventos',
    title: 'Cobertura de Eventos',
    desc: 'Eventos corporativos y sociales con entrega express y cobertura completa.',
    icon: CalendarDays,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
    price: 480000,
    features: ['5 Horas de cobertura', '80 Fotos editadas en alta resolución', 'Galería privada online', 'Entrega express opcional', 'Cobertura completa del evento'],
    accent: false,
  },
]

const Services = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [bookingPhotographer, setBookingPhotographer] = useState(null)

  const handleBooking = (pkg) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setBookingPhotographer({ id: pkg.id, name: pkg.title, avatar: pkg.image, specialty: pkg.title, price: pkg.price })
  }
  const handleChat = (pkgId) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/chat?photographer=${pkgId}`)
  }
  const handleContact = handleChat
  const openBookingModal = handleBooking

  void handleContact; void openBookingModal

  const formatCOP = (v) => `$${Number(v).toLocaleString('es-CO')} COP`

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-white selection:bg-red-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        {/* Header cinemático */}
        <section className="relative overflow-hidden bg-[#08080a] border-b border-zinc-900/60">
          <div className="absolute inset-0 bg-[#08080a]" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[1100px] rounded-full bg-red-600/[0.07] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95]">
              Experiencias y Paquetes de <span className="text-red-600 font-serif italic font-normal">Fotografía Profesional</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-zinc-400">
              Elige la experiencia que se adapta a tu historia. Tarifas transparentes y entrega garantizada.
            </p>
          </div>
        </section>

        {/* Grid Paquetes */}
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => {
                const Icon = pkg.icon
                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 will-change-transform ${
                      pkg.accent
                        ? 'bg-zinc-900/80 border-red-600/25 shadow-lg shadow-red-600/10 hover:shadow-red-600/20'
                        : 'bg-zinc-900/60 border-zinc-800/60 hover:border-zinc-700 hover:shadow-black/40'
                    }`}
                  >
                    {pkg.accent && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-red-400" />}
                    {pkg.accent && <div className="absolute top-3 right-3 rounded-full bg-red-600 text-white px-2.5 py-1 text-[10px] font-bold tracking-widest border border-red-500/30 shadow-md">MÁS POPULAR</div>}
                    <div className="relative h-40 overflow-hidden bg-zinc-900">
                      <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6 pt-4">
                      <h3 className="font-display text-base font-bold text-white tracking-tight leading-tight">{pkg.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">{pkg.desc}</p>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-xl font-bold tracking-tight text-white">{formatCOP(pkg.price)}</span>
                      </div>
                      <ul className="mt-4 space-y-2 flex-1">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 shrink-0">
                              <Check className="h-3 w-3" />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 space-y-2">
                        <button
                          onClick={() => handleBooking(pkg)}
                          className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                            pkg.accent
                              ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20'
                              : 'bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
                          }`}
                        >
                          Reservar Servicio
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleChat(pkg.id)}
                          className="w-full text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          ¿Dudas? Hablar con asesor →
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-400"><Clock className="h-3 w-3" /> Entrega rápida</span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-400"><ShieldCheck className="h-3 w-3 text-emerald-500" /> Garantizado</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-zinc-500 border-t border-zinc-900 pt-6">
              <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-amber-400" /> Calidad garantizada</span>
              <span className="hidden sm:block h-3 w-px bg-zinc-800" />
              <span className="inline-flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Alta resolución</span>
              <span className="hidden sm:block h-3 w-px bg-zinc-800" />
              <span>Galería privada • Pago simulado • Soporte 24/7</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BookingModal isOpen={!!bookingPhotographer} onClose={() => setBookingPhotographer(null)} photographer={bookingPhotographer} />
    </div>
  )
}

export default Services
