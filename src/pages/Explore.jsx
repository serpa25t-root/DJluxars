import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import ComparatorModal, { CompareBar } from '../components/explore/ComparatorModal'
import BookingModal from '../components/booking/BookingModal'
import Button from '../components/common/Button'
import { getCurrentPosition, reverseGeocode, haversine } from '../services/geo'
import { useAuth } from '../context/AuthContext'
import { Search, MapPin, Calendar, Sparkles, DollarSign } from 'lucide-react'
import useColombiaApi from '../services/colombiaApi'
import { getServices } from '../services/serviceStore'

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
  const [price, setPrice] = useState(1000000)
  const [rating, setRating] = useState(0)
  const [locationFilter, setLocationFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const { departments, cities, loadingDepartments, loadingCities, loadCities } = useColombiaApi()
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [allServices, setAllServices] = useState([])

  useEffect(() => {
    setAllServices(getServices())
    const onStorage = () => setAllServices(getServices())
    window.addEventListener('storage', onStorage)
    window.addEventListener('luxarts_services_updated', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('luxarts_services_updated', onStorage)
    }
  }, [])

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
    // SCRUM-35: filtrar SERVICIOS por Nombre, Categoría, Departamento, Municipio y Rango Precio
    let list = allServices.filter((s) => {
      if (category !== 'Todas' && s.category !== category) return false
      if (s.price > price) return false
      if (search && !`${s.title} ${s.category}`.toLowerCase().includes(search.toLowerCase())) return false
      if (locationFilter) {
        const loc = `${s.municipio || ''} ${s.departamento || ''} ${s.city || ''}`.toLowerCase()
        if (!loc.includes(locationFilter.toLowerCase())) return false
      }
      if (dateFilter && s.availableDate && s.availableDate !== dateFilter) return false
      return true
    })
    // Si no hay servicios, fallback a fotógrafos transformados (por si localStorage vacío)
    if (list.length === 0 && allServices.length === 0) {
      // fallback photographers como servicios temporales
      let pList = photographers.filter((p) => {
        if (category !== 'Todas' && p.category !== category) return false
        if (p.price > price) return false
        if (search && !`${p.name} ${p.specialty} ${p.city}`.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      // transform to service shape
      return pList.map((p) => ({
        id: `photographer-${p.id}`,
        title: `${p.specialty} con ${p.name}`,
        category: p.category,
        departamento: p.city === 'Bogotá' ? 'Cundinamarca' : p.city === 'Medellín' ? 'Antioquia' : 'Bolívar',
        municipio: p.city,
        price: p.price,
        coverImage: p.avatar.replace('150', '600'),
        features: [`${p.delivery} entrega`, `${p.rating} ★ calificación`, `Base por sesión`],
        authorName: p.name,
        authorAvatar: p.avatar,
        verified: p.is_pro,
      }))
    }
    // Orden por precio ascendente para marketplace
    return [...list].sort((a, b) => a.price - b.price)
  }, [allServices, search, category, price, rating, userLocation, sortByDistance, locationFilter, dateFilter])

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

        {/* ÚNICA barra flotante superior con Glassmorphism — SCRUM-34/35: p-4 + selectores anidados Colombia + precio */}
        <section className="relative z-20 mt-6">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-4 shadow-2xl">
            <form onSubmit={handleSearchBarSubmit} className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end">
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
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Precio COP</label>
                <div className="relative">
                  <select
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3 pr-8 text-sm text-white focus:border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/15 transition-all"
                  >
                    <option value={1000000}>Hasta $1.000.000</option>
                    <option value={800000}>Hasta $800.000</option>
                    <option value={500000}>Hasta $500.000</option>
                    <option value={350000}>Hasta $350.000</option>
                    <option value={10000000}>Sin límite</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
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

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const isSelected = compare.some((c) => c.id === s.id)
            const isService = !!s.title
            const cover = s.coverImage || s.avatar || `https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop`
            const category = s.category || s.specialty || 'General'
            const location = s.municipio ? `${s.municipio}, ${s.departamento}` : s.departamento || s.city || s.location || ''
            const features = s.features || (s.delivery ? [`${s.delivery} entrega`, `${s.rating ? s.rating+'★' : ''} calificación`.trim()] : [])
            const authorName = s.authorName || s.name || 'Fotógrafo'
            const authorAvatar = s.authorAvatar || s.avatar || `https://i.pravatar.cc/150?img=${(Number(String(s.id).slice(-2)) % 70) + 1}`
            const verified = s.verified ?? s.is_pro ?? false
            return (
              <div key={s.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl hover:border-red-600/20 hover:shadow-xl hover:shadow-red-600/5 transition-all duration-300 will-change-transform">
                {/* Imagen Portada con hover zoom suave */}
                <div className="relative h-48 overflow-hidden bg-zinc-900">
                  <img src={cover} alt={s.title || s.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="rounded-full bg-red-600 text-white px-2.5 py-1 text-[10px] font-bold tracking-widest border border-red-500/30 shadow-md">{category}</span>
                    {location && <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white px-2.5 py-1 text-[10px] font-medium">{location}</span>}
                  </div>
                  {verified && <span className="absolute top-3 right-3 rounded-full bg-white text-black px-2 py-1 text-[10px] font-bold flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Verificado</span>}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-base font-bold text-white leading-tight line-clamp-2">{s.title || `${s.specialty} con ${s.name}`}</h3>
                  {isService && features.length > 0 ? (
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{features.slice(0, 3).join(' • ')}</p>
                  ) : (
                    <p className="mt-2 text-xs text-zinc-400">Entrega {s.delivery} • Base por sesión</p>
                  )}
                  {isService && features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-zinc-300"><span className="h-1 w-1 rounded-full bg-red-500" />{f}</li>
                      ))}
                    </ul>
                  )}
                  {/* Strip autor */}
                  <div className="mt-4 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-2 py-1.5">
                    <img src={authorAvatar} alt={authorName} className="h-7 w-7 rounded-full object-cover border border-zinc-800" />
                    <span className="text-xs font-medium text-white truncate flex-1">{authorName}</span>
                    {verified && <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">Verificado</span>}
                  </div>
                  {/* Precio fijo destacado */}
                  <p className="mt-4 text-lg font-bold tracking-tight text-white">{`$${Number(s.price).toLocaleString('es-CO')} COP`}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link to={`/fotografos/${String(s.authorId || s.id).replace('srv_','')}`} className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 transition-colors">
                      Ver Perfil
                    </Link>
                    <button
                      onClick={() => toggleCompare(s)}
                      className={`rounded-full px-3 py-2 text-xs font-medium border transition-colors ${isSelected ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-red-600/30 hover:text-white'}`}
                    >
                      {isSelected ? '✓ Comparando' : '+ Comparar'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleBooking({ id: s.id, name: s.title || s.name, avatar: cover, specialty: category, price: s.price })}
                    className="mt-2 w-full rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors"
                  >
                    Reservar Servicio
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
