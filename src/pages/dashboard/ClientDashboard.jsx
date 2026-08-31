import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ClientDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const name = user?.first_name || user?.username || user?.email?.split('@')[0] || 'Ana'

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/explorar?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`)
  }

  const photographers = [
    { id: 1, name: 'Elena Mora', specialty: 'Retrato • Moda', rating: 4.9, price: 'Desde $150.000', img: 'https://i.pravatar.cc/150?img=5', cover: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop' },
    { id: 2, name: 'Marc Dubois', specialty: 'Moda • Editorial', rating: 4.8, price: 'Desde $200.000', img: 'https://i.pravatar.cc/150?img=15', cover: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop' },
    { id: 3, name: 'Sofía Reyes', specialty: 'Eventos • Bodas', rating: 4.7, price: 'Desde $180.000', img: 'https://i.pravatar.cc/150?img=9', cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop' },
    { id: 4, name: 'Javier Ortiz', specialty: 'Editorial • Retrato', rating: 4.9, price: 'Desde $250.000', img: 'https://i.pravatar.cc/150?img=12', cover: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* Hero Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Hola, {name} 👋</p>
              <h1 className="font-serif text-5xl leading-tight mt-2 font-light tracking-tight text-white">
                Encuentra al fotógrafo <br /> perfecto para <span className="text-red-600">cada</span> <br /> <span className="text-red-600">historia.</span>
              </h1>
              <p className="mt-3 text-sm text-zinc-400 max-w-xl">Explora talento verificado, compara portafolios y reserva con confianza cinemática.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop" alt="Lente cámara" className="aspect-video rounded-2xl object-cover w-64 md:w-80 hidden md:block border border-zinc-800" />
          </div>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-2 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-transparent px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <input placeholder="Tipo de foto" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent flex-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none" />
            </div>
            <div className="hidden sm:flex flex-1 items-center gap-2 bg-transparent px-3 py-2 border-l border-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input placeholder="Ubicación" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-transparent flex-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none" />
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md shadow-red-600/20 transition-colors">Buscar fotógrafos</button>
          </form>
          <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
            <span>Búsquedas populares:</span>
            <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">Boda</span>
            <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">Retrato</span>
            <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">Eventos</span>
            <span className="px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">Moda</span>
          </div>

          {/* Fotógrafos Recomendados */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Fotógrafos recomendados</h2>
              <Link to="/explorar"><span className="text-red-500 text-sm flex items-center gap-1 hover:text-red-400 transition-colors">Ver todas &rarr;</span></Link>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {photographers.map((p) => (
                <div key={p.id} className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-800/50 hover:border-red-900/30 transition-colors group">
                  <div className="relative">
                    <img src={p.cover} alt={p.name} className="aspect-square rounded-xl object-cover w-full border border-zinc-800" />
                    <button className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-red-500 border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white flex items-center gap-1">{p.name} <span className="text-red-500">✓</span></p>
                  <p className="text-xs text-zinc-500">{p.specialty}</p>
                  <p className="mt-1 text-xs text-zinc-400">★ {p.rating} <span className="text-zinc-600">•</span> {p.price}</p>
                  <p className="text-xs font-bold text-white mt-1">{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-6">
            <h3 className="text-sm font-semibold text-white">Mis próximas reservas</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-[#101010] border border-zinc-800 p-3">
                <img src="https://i.pravatar.cc/100?img=32" alt="Vogue" className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Sesión editorial — Vogue</p>
                  <p className="text-xs text-zinc-500">12 Jun, 10:00 AM</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Confirmada</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#101010] border border-zinc-800 p-3">
                <img src="https://i.pravatar.cc/100?img=14" alt="Hacienda" className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Boda — Hacienda Paraíso</p>
                  <p className="text-xs text-zinc-500">15 Jun, 4:00 PM</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pendiente</span>
              </div>
            </div>
            <Link to="/my-bookings"><span className="text-red-500 text-sm flex items-center gap-1 hover:text-red-400 transition-colors">Ver todas &rarr;</span></Link>
          </div>

          <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/50">
            <h3 className="text-sm font-semibold text-white">Explorar por Categoría</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: 'Boda', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                { label: 'Retrato', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { label: 'Eventos', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { label: 'Moda', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
                { label: 'Producto', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m0-10v10' },
                { label: 'Arquitectura', icon: 'M3 21h18M3 7v14M21 7v14M6 7V4a1 1 0 011-1h10a1 1 0 011 1v3M9 21V11a2 2 0 012-2h2a2 2 0 012 2v10' },
              ].map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-2 rounded-xl bg-[#101010] border border-zinc-800 p-3 hover:border-red-900/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                  </svg>
                  <span className="text-xs font-medium text-zinc-300">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden p-6 border border-zinc-800/50">
            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop" alt="Proyecto" className="absolute inset-0 h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/60 to-transparent" />
            <div className="relative">
              <h3 className="text-sm font-bold text-white">¿Tienes un proyecto en mente?</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300">Publica tu proyecto y recibe propuestas de fotógrafos verificados en minutos.</p>
              <Link to="/explorar" className="mt-4 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                Publicar proyecto
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.586-5.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-2.828 0l-4-4a2 2 0 012.828-2.828L9 14.586l7.586-7.586a2 2 0 012.828 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Fotógrafos verificados</p>
            <p className="text-xs text-zinc-500">Identidad y portafolio revisados</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Chat directo</p>
            <p className="text-xs text-zinc-500">Negocia sin intermediarios</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Reserva segura</p>
            <p className="text-xs text-zinc-500">Confirma con un toque</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Calidad garantizada</p>
            <p className="text-xs text-zinc-500">Satisfacción 98%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
