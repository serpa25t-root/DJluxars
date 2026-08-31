import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Star, Award, ArrowRight, Sparkles, Camera, Calendar } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import BookingModal from '../components/booking/BookingModal'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const categories = ['Todas', 'Boda', 'Bodas', 'Retrato', 'Moda', 'Eventos', 'Editorial', 'Producto', 'Paisajes', 'Familia']
const popularSearches = ['Boda', 'Retrato', 'Eventos', 'Producto', 'Moda', 'Paisajes']

const mockPhotographers = [
  { id: 1, username: 'elena_mora', first_name: 'Elena', last_name: 'Mora', name: 'Elena Mora', avatar: 'https://i.pravatar.cc/150?img=5', profile_picture: 'https://i.pravatar.cc/150?img=5', category: 'Retrato', role: 'artist', ciudad: 'Medellín', departamento: 'Antioquia', city: 'Medellín', price: 350000, rating: 4.9, reviews: 128 },
  { id: 2, username: 'marc_dubois', first_name: 'Marc', last_name: 'Dubois', name: 'Marc Dubois', avatar: 'https://i.pravatar.cc/150?img=15', profile_picture: 'https://i.pravatar.cc/150?img=15', category: 'Moda', role: 'artist', ciudad: 'Bogotá', departamento: 'Cundinamarca', city: 'Bogotá', price: 500000, rating: 4.8, reviews: 94 },
  { id: 3, username: 'sofia_reyes', first_name: 'Sofía', last_name: 'Reyes', name: 'Sofía Reyes', avatar: 'https://i.pravatar.cc/150?img=9', profile_picture: 'https://i.pravatar.cc/150?img=9', category: 'Eventos', role: 'artist', ciudad: 'Cali', departamento: 'Valle del Cauca', city: 'Cali', price: 280000, rating: 4.7, reviews: 76 },
  { id: 4, username: 'javier_ortiz', first_name: 'Javier', last_name: 'Ortiz', name: 'Javier Ortiz', avatar: 'https://i.pravatar.cc/150?img=12', profile_picture: 'https://i.pravatar.cc/150?img=12', category: 'Editorial', role: 'artist', ciudad: 'Cartagena', departamento: 'Bolívar', city: 'Cartagena', price: 420000, rating: 4.9, reviews: 210 },
  { id: 5, username: 'lucia_vega', first_name: 'Lucía', last_name: 'Vega', name: 'Lucía Vega', avatar: 'https://i.pravatar.cc/150?img=32', profile_picture: 'https://i.pravatar.cc/150?img=32', category: 'Retrato', role: 'artist', ciudad: 'Cartagena', departamento: 'Bolívar', city: 'Cartagena', price: 320000, rating: 4.6, reviews: 54 },
  { id: 6, username: 'andres_silva', first_name: 'Andrés', last_name: 'Silva', name: 'Andrés Silva', avatar: 'https://i.pravatar.cc/150?img=33', profile_picture: 'https://i.pravatar.cc/150?img=33', category: 'Moda', role: 'artist', ciudad: 'Barranquilla', departamento: 'Atlántico', city: 'Barranquilla', price: 600000, rating: 4.85, reviews: 110 },
  { id: 7, username: 'camila_torres', first_name: 'Camila', last_name: 'Torres', name: 'Camila Torres', avatar: 'https://i.pravatar.cc/150?img=26', profile_picture: 'https://i.pravatar.cc/150?img=26', category: 'Boda', role: 'artist', ciudad: 'Bucaramanga', departamento: 'Santander', city: 'Bucaramanga', price: 380000, rating: 4.75, reviews: 88 },
  { id: 8, username: 'diego_leon', first_name: 'Diego', last_name: 'León', name: 'Diego León', avatar: 'https://i.pravatar.cc/150?img=20', profile_picture: 'https://i.pravatar.cc/150?img=20', category: 'Paisajes', role: 'artist', ciudad: 'Bogotá', departamento: 'Cundinamarca', city: 'Bogotá', price: 280000, rating: 4.95, reviews: 152 },
]

const Photographers = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [photographers, setPhotographers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [bookingPhotographer, setBookingPhotographer] = useState(null)

  // Protección SCRUM-32 Part 2
  const handleBooking = (photographer) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setBookingPhotographer(photographer)
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
  const handlePillClick = (pill) => {
    setCategory(pill)
    setSearch(pill)
  }

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const res = await api.get('users/?role=artist')
        const data = res.data.results || res.data
        if (Array.isArray(data) && data.length > 0) {
          setPhotographers(data)
        } else {
          setPhotographers(mockPhotographers)
        }
      } catch {
        setPhotographers(mockPhotographers)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPhotographers()
  }, [])

  // Void to satisfy linter for unused handlers required by spec
  void handleContact; void openBookingModal

  const getLocationLabel = (p) => {
    const ciudad = p.ciudad || p.city || ''
    const depto = p.departamento || p.department || ''
    if (ciudad && depto) return `${ciudad}, ${depto}`
    if (ciudad) return ciudad
    if (depto) return depto
    return 'Ubicación no disponible'
  }

  const filtered = useMemo(() => {
    return photographers.filter((p) => {
      const name = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.username || ''
      if (search && !name.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'Todas') {
        const cat = p.category || p.specialty || p.role || ''
        // normaliza Boda/Bodas
        const normCat = cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const normFilter = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        if (normCat !== normFilter && !(normFilter === 'boda' && normCat === 'bodas') && !(normFilter === 'bodas' && normCat === 'boda')) return false
      }
      if (location) {
        const locLabel = getLocationLabel(p).toLowerCase()
        if (!locLabel.includes(location.toLowerCase())) return false
      }
      return true
    })
  }, [photographers, search, category, location])

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
            <div className="inline-flex items-center gap-2.5 rounded-full border border-red-600/20 bg-red-600/10 px-4 py-1.5 backdrop-blur-md animate-[fadeInUp_500ms_var(--ease-out-quart)_both]">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse shadow-sm shadow-red-600/50" />
              <span className="text-[11px] font-semibold tracking-widest text-red-300 uppercase">Directorio Verificado</span>
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] animate-[fadeInUp_600ms_var(--ease-out-quart)_80ms_both]">
              Directorio de <span className="text-red-600 font-serif italic font-normal">Talento Visual</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-zinc-400 animate-[fadeInUp_600ms_var(--ease-out-quart)_140ms_both]">
              Descubre fotógrafos excepcionales, filtra por especialidad y ubicación, y conecta con el profesional ideal para tu historia.
            </p>
          </div>
        </section>

        {/* Barra de filtros Glassmorphism — integrada desde Home (SCRUM-33 Part 2) */}
        <section className="relative z-20 -mt-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-4">
                {/* Search query */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><Search className="h-3.5 w-3.5" /> Search query</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="¿Qué tipo de fotografía estás buscando?"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all"
                    />
                  </div>
                </div>
                {/* Session type */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Session type</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 pr-10 text-sm text-white focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all"
                    >
                      <option value="Todas">Tipo de sesión</option>
                      {categories.filter(c=>c!=='Todas').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </div>
                </div>
                {/* Location */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ubicación"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all"
                  />
                </div>
                {/* Date */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Fecha"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>
              {/* Búsquedas populares pills — filtros rápidos */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-500 mr-1">Búsquedas populares:</span>
                {popularSearches.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => handlePillClick(pill)}
                    className="rounded-full border border-zinc-800 bg-zinc-800/50 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-red-600/30 hover:bg-red-600/10 hover:text-white transition-colors"
                  >
                    {pill}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{filtered.length} fotógrafos encontrados</span>
                {(search || category !== 'Todas' || location || date) && (
                  <button onClick={() => { setSearch(''); setCategory('Todas'); setLocation(''); setDate('') }} className="ml-auto text-xs font-medium text-red-400 hover:text-red-300 transition-colors">Limpiar filtros →</button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Grid de tarjetas Dark/Crimson */}
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="mx-auto max-w-7xl">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-3xl h-[320px] bg-zinc-900 border border-zinc-800" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 py-16">
                <Camera className="h-8 w-8 text-zinc-600 mx-auto" />
                <p className="mt-3 text-sm text-zinc-400">Sin resultados para esos filtros.</p>
                <button onClick={() => { setSearch(''); setCategory('Todas'); setLocation(''); setDate('') }} className="mt-4 text-sm font-medium text-red-500 hover:text-red-400">Limpiar filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => {
                  const name = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.username
                  const avatar = p.profile_picture || p.avatar || `https://i.pravatar.cc/150?img=${(p.id % 70) + 1}`
                  const cat = p.category || p.specialty || 'General'
                  const price = p.price || 350000
                  const rating = p.rating || 4.8
                  const reviews = p.reviews || 0
                  const loc = getLocationLabel(p)
                  return (
                    <div key={p.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl hover:border-red-600/25 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-300">
                      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img src={avatar} alt={name} className="h-14 w-14 rounded-2xl object-cover border border-zinc-800" />
                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[10px]"><Award className="h-3 w-3 text-emerald-400" /></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{name}</h3>
                            <p className="text-xs text-zinc-400 mt-0.5">{cat}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-semibold text-white">{Number(rating).toFixed(1)}</span>
                              <span className="text-xs text-zinc-500">({reviews})</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <p className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                            <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            <span className="truncate">{loc}</span>
                          </p>
                          <p className="text-sm font-bold text-white">{formatCOP(price)} <span className="font-normal text-zinc-500 text-xs">/ sesión</span></p>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2 mt-auto">
                          <Link to={`/fotografos/${p.id}`} className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors">
                            Ver Perfil
                          </Link>
                          <button
                            onClick={() => handleBooking({ id: p.id, name, avatar, specialty: cat, price })}
                            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-red-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors"
                          >
                            Solicitar Reserva
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                        {/* secondary chat link subtle */}
                        <button
                          onClick={() => handleChat(p.id)}
                          className="mt-2 w-full text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          ¿Dudas? Enviar mensaje →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BookingModal isOpen={!!bookingPhotographer} onClose={() => setBookingPhotographer(null)} photographer={bookingPhotographer} />
    </div>
  )
}

export default Photographers
