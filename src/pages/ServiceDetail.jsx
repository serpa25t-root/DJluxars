import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Star, MapPin, Check, Share2, Heart, Calendar, Clock, ShieldCheck, Award, MessageSquare, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getServices } from '../services/serviceStore'
import BookingModal from '../components/booking/BookingModal'

const categoryImages = {
  Retrato: [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
  ],
  Bodas: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop',
  ],
  Moda: [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=600&fit=crop',
  ],
  Producto: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
  ],
  Eventos: [
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
  ],
  Editorial: [
    'https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
  ],
  Familia: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542037104857-4bb4b9fe2433?w=800&h=600&fit=crop',
  ],
  Paisajes: [
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  ],
}

const ServiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const services = getServices()
    const found = services.find((s) => String(s.id) === String(id))
    if (found) {
      setService(found)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-white">Servicio no encontrado</p>
          <p className="text-sm text-zinc-400 mt-2">El paquete que buscas no existe o fue eliminado.</p>
          <button onClick={() => navigate('/explorar')} className="mt-6 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
            Explorar servicios
          </button>
        </div>
      </div>
    )
  }

  const gallery = categoryImages[service.category] || categoryImages.Retrato
  const locationText = service.municipio ? `${service.municipio}, ${service.departamento}` : service.departamento || 'Colombia'
  const features = service.features || []
  const rating = service.rating || 4.8
  const reviews = service.reviews || 24

  const openBooking = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setBookingOpen(true)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Enlace copiado al portapapeles')
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      {/* Header flotante */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="rounded-full p-2.5 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button onClick={() => setLiked((v) => !v)} className={`rounded-full p-2.5 border transition-colors ${liked ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'}`}>
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-28">
        {/* Título y rating */}
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{service.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="h-4 w-4 fill-amber-400" /> {rating}
            </span>
            <span className="text-zinc-500">• {reviews} reseñas</span>
            <span className="text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <MapPin className="h-3.5 w-3.5" /> {locationText}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="rounded-full bg-red-600/10 border border-red-600/20 text-red-400 px-2.5 py-0.5 text-xs font-bold">{service.category}</span>
          </div>
        </div>

        {/* Galería tipo Airbnb */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-3xl overflow-hidden mb-8">
          <div className="relative h-64 sm:h-80 lg:h-96 cursor-pointer group" onClick={() => { setLightboxIdx(0); setLightbox(true) }}>
            <img src={gallery[0]} alt={service.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="hidden sm:grid grid-cols-2 grid-rows-2 gap-2">
            {gallery.slice(1, 5).map((img, i) => (
              <div key={i} className="relative h-full cursor-pointer group overflow-hidden" onClick={() => { setLightboxIdx(i + 1); setLightbox(true) }}>
                <img src={img} alt={`${service.title} ${i + 2}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-8">
            {/* Perfil del autor */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-900">
              <img src={service.authorAvatar} alt={service.authorName} className="h-14 w-14 rounded-full object-cover border-2 border-zinc-800" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{service.authorName}</p>
                <p className="text-xs text-zinc-400">Fotógrafo profesional • {service.category}</p>
              </div>
              {service.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-bold">
                  <ShieldCheck className="h-3 w-3" /> Verificado
                </span>
              )}
            </div>

            {/* Lo que incluye */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Lo que incluye este paquete</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm text-zinc-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Términos del servicio */}
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
              <h2 className="text-lg font-bold text-white mb-3">Términos del servicio</h2>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-zinc-500" /> Entrega estimada en 3-7 días hábiles según complejidad.</li>
                <li className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-zinc-500" /> La fecha debe confirmarse mínimo con 48h de anticipación.</li>
                <li className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-zinc-500" /> Calidad garantizada o reembolso del 50%.</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-zinc-500" /> Pago seguro escrow a través de LuxArts.</li>
              </ul>
            </div>
          </div>

          {/* Columna derecha: Card fija */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl shadow-black/40">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl font-bold text-white">${Number(service.price).toLocaleString('es-CO')}</span>
                <span className="text-sm text-zinc-400">COP</span>
              </div>
              <p className="text-xs text-zinc-500 mb-5">Precio fijo por sesión • Sin costos ocultos</p>

              <button onClick={openBooking} className="w-full rounded-full bg-red-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-red-700 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all">
                Solicitar este Paquete
              </button>
              <button onClick={() => navigate(`/chat?photographer=${service.authorId}`)} className="mt-3 w-full rounded-full border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors">
                <MessageSquare className="h-4 w-4 inline mr-1.5" /> Enviar mensaje al fotógrafo
              </button>

              <div className="mt-5 pt-5 border-t border-zinc-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Servicio</span>
                  <span className="text-white font-medium">{service.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Ubicación</span>
                  <span className="text-white font-medium">{locationText}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Comisión plataforma</span>
                  <span className="text-zinc-300">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón fijo móvil */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-zinc-800 p-4 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-white">${Number(service.price).toLocaleString('es-CO')} <span className="text-xs font-normal text-zinc-400">COP</span></p>
          </div>
          <button onClick={openBooking} className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all">
            Solicitar
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          >
            <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 z-10">
              <X className="h-6 w-6" />
            </button>
            <button onClick={() => setLightboxIdx((i) => (i - 1 + gallery.length) % gallery.length)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 z-10">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={() => setLightboxIdx((i) => (i + 1) % gallery.length)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 z-10">
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              src={gallery[lightboxIdx]}
              alt="Galería"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <button key={i} onClick={() => setLightboxIdx(i)} className={`h-1.5 rounded-full transition-all ${i === lightboxIdx ? 'w-6 bg-red-600' : 'w-1.5 bg-zinc-600'}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        photographer={{ id: service.authorId, name: service.authorName, avatar: service.authorAvatar, specialty: service.category, price: service.price }}
      />
    </div>
  )
}

export default ServiceDetail
