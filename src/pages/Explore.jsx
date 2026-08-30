import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FilterBar from '../components/explore/FilterBar'
import ComparatorModal, { CompareBar } from '../components/explore/ComparatorModal'
import BookingModal from '../components/booking/BookingModal'
import Button from '../components/common/Button'

const photographers = [
  { id: 1, name: 'Elena Mora', specialty: 'Retrato', avatar: 'https://i.pravatar.cc/150?img=5', rating: 4.9, reviews: 128, price: 350, delivery: '3 días', category: 'Retrato' },
  { id: 2, name: 'Marc Dubois', specialty: 'Moda', avatar: 'https://i.pravatar.cc/150?img=15', rating: 4.8, reviews: 94, price: 500, delivery: '5 días', category: 'Moda' },
  { id: 3, name: 'Sofía Reyes', specialty: 'Eventos', avatar: 'https://i.pravatar.cc/150?img=9', rating: 4.7, reviews: 76, price: 280, delivery: '2 días', category: 'Eventos' },
  { id: 4, name: 'Javier Ortiz', specialty: 'Editorial', avatar: 'https://i.pravatar.cc/150?img=12', rating: 4.9, reviews: 210, price: 420, delivery: '4 días', category: 'Editorial' },
  { id: 5, name: 'Lucía Vega', specialty: 'Retrato', avatar: 'https://i.pravatar.cc/150?img=32', rating: 4.6, reviews: 54, price: 180, delivery: '2 días', category: 'Retrato' },
  { id: 6, name: 'Andrés Silva', specialty: 'Moda', avatar: 'https://i.pravatar.cc/150?img=33', rating: 4.85, reviews: 110, price: 600, delivery: '6 días', category: 'Moda' },
  { id: 7, name: 'Camila Torres', specialty: 'Eventos', avatar: 'https://i.pravatar.cc/150?img=26', rating: 4.75, reviews: 88, price: 320, delivery: '3 días', category: 'Eventos' },
  { id: 8, name: 'Diego León', specialty: 'Editorial', avatar: 'https://i.pravatar.cc/150?img=20', rating: 4.95, reviews: 152, price: 480, delivery: '4 días', category: 'Editorial' },
]

const Explore = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [price, setPrice] = useState(800)
  const [rating, setRating] = useState(0)
  const [compare, setCompare] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const [bookingPhotographer, setBookingPhotographer] = useState(null)

  const filtered = useMemo(() => {
    return photographers.filter((p) => {
      if (category !== 'Todas' && p.category !== category) return false
      if (p.price > price) return false
      if (p.rating < rating) return false
      if (search && !`${p.name} ${p.specialty}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, category, price, rating])

  const toggleCompare = (p) => {
    setCompare((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev.filter((x) => x.id !== p.id)
      if (prev.length >= 3) return prev
      return [...prev, p]
    })
  }

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-900 pb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Descubre <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Talento Visual</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">Explora fotógrafos verificados, filtra por estilo y compara propuestas sin salir de la página.</p>

          <div className="mt-6 relative max-w-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o especialidad — ej. Moda, Retrato"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
          </div>
        </div>

        <div className="mt-6">
          <FilterBar category={category} onCategory={setCategory} price={price} onPrice={setPrice} rating={rating} onRating={setRating} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const isSelected = compare.some((c) => c.id === p.id)
            return (
              <div key={p.id} className="group rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden hover:border-red-600/25 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <img src={p.avatar} alt={p.name} className="h-12 w-12 rounded-full object-cover border border-zinc-800" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{p.name}</h3>
                      <p className="text-xs text-zinc-400">{p.specialty}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-red-500 text-xs">★</span>
                        <span className="text-xs font-semibold text-white">{p.rating.toFixed(1)}</span>
                        <span className="text-xs text-zinc-500">({p.reviews})</span>
                      </div>
                    </div>
                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-300">{p.price} USD</span>
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
                    onClick={() => setBookingPhotographer({ id: p.id, name: p.name, avatar: p.avatar, specialty: p.specialty, price: p.price })}
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
