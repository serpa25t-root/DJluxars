import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import ComparatorModal, { CompareBar } from '../components/explore/ComparatorModal'
import BookingModal from '../components/booking/BookingModal'
import Button from '../components/common/Button'
import { getCurrentPosition, reverseGeocode, haversine } from '../services/geo'
import { useAuth } from '../context/AuthContext'
import { Search, MapPin, Calendar, Sparkles } from 'lucide-react'
import useColombiaApi from '../services/colombiaApi'

const photographers = [
  { id: 1, name: 'Elena Mora', specialty: 'Retrato', avatar: 'https://i.pravatar.cc/150?img=5', rating: 4.9, reviews: 128, price: 350000, delivery: '3 días', category: 'Retrato', lat: 4.711, lng: -74.0721, city: 'Bogotá', is_pro: true },
  { id: 2, name: 'Marc Dubois', specialty: 'Moda', avatar: 'https://i.pravatar.cc/150?img=15', rating: 4.8, reviews: 94, price: 500000, delivery: '5 días', category: 'Moda', lat: 4.65, lng: -74.1, city: 'Bogotá', is_pro: true },
  { id: 3, name: 'Sofía Reyes', specialty: 'Eventos', avatar: 'https://i.pravatar.cc/150?img=9', rating: 4.7, reviews: 76, price: 280000, delivery: '2 días', category: 'Eventos', lat: 6.2442, lng: -75.5812, city: 'Medellín', is_pro: false },
  { id: 4, name: 'Javier Ortiz', specialty: 'Editorial', avatar: 'https://i.pravatar.cc/150?img=12', rating: 4.9, reviews: 210, price: 420000, delivery: '4 días', category: 'Editorial', lat: 3.4516, lng: -76.532, city: 'Cali', is_pro: false },
  { id: 5, name: 'Lucía Vega', specialty: 'Retrato', avatar: 'https://i.pravatar.cc/150?img=32', rating: 4.6, reviews: 54, price: 180000, delivery: '2 días', category: 'Retrato', lat: 10.391, lng: -75.4794, city: 'Cartagena', is_pro: false },
  { id: 6, name: 'Andrés Silva', specialty: 'Moda', avatar: 'https://i.pravatar.cc/150?img=33', rating: 4.85, reviews: 110, price: 600000, delivery: '6 días', category: 'Moda', lat: 11.0041, lng: -74.807, city: 'Barranquilla', is_pro: true },
  { id: 7, name: 'Camila Torres', specialty: 'Eventos', avatar: 'https://i.pravatar.cc/150?img=26', rating: 4.75, reviews: 88, price: 320000, delivery: '3 días', category: 'Eventos', lat: 7.1193, lng: -73.1227, city: 'Bucaramanga', is_pro: false },
  { id: 8, name: 'Diego León', specialty: 'Editorial', avatar: 'https://i.pravatar.cc/150?img=20', rating: 4.95, reviews: 152, price: 480000, delivery: '4 días', category: 'Editorial', lat: 4.711, lng: -74.0721, city: 'Bogotá', is_pro: false },
]

const popularSearches = ['Boda', 'Retrato', 'Eventos', 'Producto', 'Moda', 'Paisajes']
const sessionTypes = ['Bodas', 'Retrato', 'Moda', 'Eventos', 'Editorial', 'Producto', 'Familia', 'Paisajes']

const Explore = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [price, setPrice] = useState(800000)
  const [rating, setRating] = useState(0)
  const [locationFilter, setLocationFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const { departments, cities, loadingDepartments, loadingCities, loadCities } = useColombiaApi()
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  useEffect(() => {
    const cat = searchParams.get('category')
    const loc = searchParams.get('location')
    const q = searchParams.get('q')
    const date = searchParams.get('date')
    if (cat) setCategory(cat)
    if (loc) {
      setLocationFilter(loc)
      setSelectedCity(loc)
    }
    if (q) setSearch(q)
    if (date) setDateFilter(date)
  }, [searchParams])

  // Sincroniza locationFilter derivado de selectores anidados
  useEffect(() => {
    if (selectedCity) setLocationFilter(selectedCity)
    else if (selectedDept) {
      const dept = departments.find((d) => String(d.id) === String(selectedDept))
      setLocationFilter(dept ? dept.name : '')
    } else {
      setLocationFilter('')
    }
  }, [selectedDept, selectedCity, departments])
  const [compare, setCompare] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const [bookingPhotographer, setBookingPhotographer] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationLabel, setLocationLabel] = useState('')
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [sortByDistance, setSortByDistance] = useState(false)

  const handleUseLocation = async () => {
    setLoadingLocation(true)
    try {
      const pos = await getCurrentPosition()
      setUserLocation(pos)
      try {
        const geo = await reverseGeocode(pos.lat, pos.lng)
        setLocationLabel(geo.display)
      } catch {
        setLocationLabel(`${pos.lat.toFixed(3)}, ${pos.lng.toFixed(3)}`)
      }
      setSortByDistance(true)
    } catch (err) {
      setLocationLabel(err.message || 'No se pudo obtener ubicación')
    } finally {
      setLoadingLocation(false)
    }
  }

  const filtered = useMemo(() => {
    let list = photographers.filter((p) => {
      if (category !== 'Todas' && p.category !== category) return false
      if (p.price > price) return false
      if (p.rating < rating) return false
      if (search && !`${p.name} ${p.specialty} ${p.city}`.toLowerCase().includes(search.toLowerCase())) return false
      if (locationFilter && !`${p.city}`.toLowerCase().includes(locationFilter.toLowerCase())) return false
      // Date filter: si hay fecha, filtra por disponibilidad simulada (no bloquea si no hay dato)
      if (dateFilter && p.availableDate && p.availableDate !== dateFilter) return false
      return true
    })
    if (userLocation) {
      list = list.map((p) => ({
        ...p,
        distance: p.lat && p.lng ? haversine(userLocation.lat, userLocation.lng, p.lat, p.lng) : null,
      }))
    }
    // Prioridad PRO siempre arriba, luego por distancia si está activo
    list = [...list].sort((a, b) => {
      if (a.is_pro !== b.is_pro) return b.is_pro ? 1 : -1
      if (sortByDistance && a.distance != null && b.distance != null) return a.distance - b.distance
      return 0
    })
    return list
  }, [search, category, price, rating, userLocation, sortByDistance, locationFilter, dateFilter])

  const toggleCompare = (p) => {
    setCompare((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev.filter((x) => x.id !== p.id)
      if (prev.length >= 3) return prev
      return [...prev, p]
    })
  }

  // SCRUM-32 Part 2: protección acciones públicas — redirige a /login si no autenticado
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

  const openBookingModal = handleBooking
  const handleContact = handleChat

  const handlePillClick = (pill) => {
    setCategory(pill)
    setSearch(pill)
  }

  const handleSearchBarSubmit = (e) => {
    e.preventDefault()
    // filtrado ya es reactivo, no necesita navegar, pero mantenemos URL sincronizada
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (category && category !== 'Todas') params.set('category', category)
    if (locationFilter) params.set('location', locationFilter)
    if (dateFilter) params.set('date', dateFilter)
    const qs = params.toString()
    navigate(qs ? `/explorar?${qs}` : '/explorar')
  }

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-900 pb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Descubre <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Talento Visual</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">Explora fotógrafos verificados, filtra por estilo y compara propuestas sin salir de la página.</p>
        </div>

        {/* ÚNICA barra flotante superior con Glassmorphism — SCRUM-34: p-4 + selectores anidados Colombia */}
        <section className="relative z-20 mt-6">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-4 shadow-2xl">
            <form onSubmit={handleSearchBarSubmit} className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end">
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
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Session type</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 pr-10 text-sm text-white focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all"
                  >
                    <option value="Todas">Tipo de sesión</option>
                    {sessionTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Departamento</label>
                <div className="relative">
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      const val = e.target.value
                      setSelectedDept(val)
                      setSelectedCity('')
                      if (val) loadCities(val)
                    }}
                    disabled={loadingDepartments}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3 pr-8 text-sm text-white focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all disabled:opacity-60"
                  >
                    <option value="">{loadingDepartments ? 'Cargando...' : 'Departamento'}</option>
                    {departments.map((d) => (
                      <option key={d.id} value={String(d.id)}>{d.name}</option>
                    ))}
                  </select>
                  {loadingDepartments ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-red-600" />
                  ) : (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Municipio</label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedDept || loadingCities}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3 pr-8 text-sm text-white focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all disabled:opacity-60"
                  >
                    <option value="">{!selectedDept ? 'Municipio' : loadingCities ? 'Cargando...' : 'Municipio'}</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {loadingCities ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-red-600" />
                  ) : (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder="Fecha"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all [&::-webkit-calendar-picker-indicator]:opacity-40 [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
              <div className="flex">
                <button type="submit" className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 hover:bg-red-700 hover:shadow-xl active:scale-[0.98] transition-all whitespace-nowrap">
                  <Search className="h-4 w-4" />
                  Buscar fotógrafos
                </button>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2">
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
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const isSelected = compare.some((c) => c.id === p.id)
            return (
              <div key={p.id} className="group rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden hover:border-red-600/25 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <img src={p.avatar} alt={p.name} className="h-12 w-12 rounded-full object-cover border border-zinc-800" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate inline-flex items-center gap-2">
                        {p.name}
                        {p.is_pro && (
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2 py-0.5 text-[10px] font-bold tracking-widest border border-amber-500/50 shadow-sm">
                            PRO
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-zinc-400">{p.specialty}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-red-500 text-xs">★</span>
                        <span className="text-xs font-semibold text-white">{p.rating.toFixed(1)}</span>
                        <span className="text-xs text-zinc-500">({p.reviews})</span>
                      </div>
                    </div>
                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-300">${p.price.toLocaleString('es-CO')} COP</span>
                    {p.distance != null && (
                      <span className="rounded-full border border-red-600/30 bg-red-600/15 px-2.5 py-1 text-xs font-semibold text-red-300 whitespace-nowrap">
                        A {p.distance.toFixed(1)} km de ti
                      </span>
                    )}
                  </div>
                  {/* Hover preview — miniaturas portfolio */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                    {[
                      `https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop&crop=center&auto=format`,
                      `https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=300&h=200&fit=crop&crop=center&auto=format`,
                      `https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop&crop=center&auto=format`,
                    ].map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
                        <img src={src} alt={`Portfolio ${i+1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" loading="lazy" />
                        {i === 2 && <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-white">+12</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">Entrega {p.delivery} • Base por sesión</p>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/fotografos/${p.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full text-sm py-2 border-zinc-800">Ver Perfil</Button>
                    </Link>
                    <button
                      onClick={() => toggleCompare(p)}
                      className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${isSelected ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-red-600/30 hover:text-white'}`}
                    >
                      {isSelected ? '✓ Comparando' : '+ Comparar'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleBooking({ id: p.id, name: p.name, avatar: p.avatar, specialty: p.specialty, price: p.price })}
                    className="mt-2 w-full rounded-full bg-red-600/10 border border-red-600/20 py-2 text-sm font-medium text-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    Solicitar Reserva
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 py-12">
            <p className="text-sm text-zinc-400">Sin resultados para esos filtros. Prueba con otra categoría o precio.</p>
          </div>
        )}
      </div>

      <CompareBar selected={compare} onRemove={(id) => setCompare((prev) => prev.filter((p) => p.id !== id))} onClear={() => setCompare([])} onCompare={() => setShowCompare(true)} />
      <ComparatorModal selected={compare} isOpen={showCompare} onClose={() => setShowCompare(false)} onRemove={(id) => setCompare((prev) => prev.filter((p) => p.id !== id))} onClear={() => setCompare([])} />
      <BookingModal isOpen={!!bookingPhotographer} onClose={() => setBookingPhotographer(null)} photographer={bookingPhotographer} />
    </div>
  )
}

export default Explore
