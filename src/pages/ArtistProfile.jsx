import { useParams, Link } from 'react-router-dom'
import Button from '../components/common/Button'

const mockProfiles = {
  1: { name: 'Elena Mora', specialty: 'Retrato', avatar: 'https://i.pravatar.cc/150?img=5', banner: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop', rating: 4.9, price: 350, delivery: '3 días', bio: 'Fotógrafa editorial con base en Bogotá. Trabajo con luz natural y narrativa íntima para retratos que perduran.', equipment: 'Canon EOS R5, 85mm f/1.4, Profoto B10', photos: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop'] },
  2: { name: 'Marc Dubois', specialty: 'Moda', avatar: 'https://i.pravatar.cc/150?img=15', banner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop', rating: 4.8, price: 500, delivery: '5 días', bio: 'Moda y editorial en París. Colaboro con diseñadores emergentes y revistas independientes.', equipment: 'Sony A7R IV, 50mm f/1.2 GM', photos: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop'] },
}

const defaults = { name: 'Artista LuxArts', specialty: 'Editorial', avatar: 'https://i.pravatar.cc/150?img=12', banner: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=400&fit=crop', rating: 4.8, price: 300, delivery: '4 días', bio: 'Creador visual verificado en LuxArts. Portafolio curado con acabado cinematográfico.', equipment: 'Canon EOS R6, 35mm f/1.4', photos: ['https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop'] }

const ArtistProfile = () => {
  const { id } = useParams()
  const p = mockProfiles[id] || defaults

  return (
    <div className="min-h-[100dvh] bg-black">
      {/* Banner cinemático */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src={p.banner} alt={p.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mx-auto max-w-7xl flex items-end gap-4">
            <img src={p.avatar} alt={p.name} className="h-20 w-20 rounded-2xl border-2 border-white/20 object-cover shadow-xl" />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{p.name}</h1>
              <p className="text-sm text-zinc-300">{p.specialty} • <span className="text-red-400">★ {p.rating.toFixed(1)}</span> • ${p.price}/sesión</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
              <h2 className="text-sm font-semibold tracking-widest text-zinc-400">BIOGRAFÍA</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{p.bio}</p>
              <div className="mt-4 rounded-xl border border-zinc-900 bg-zinc-900/40 px-4 py-3">
                <p className="text-xs font-semibold tracking-widest text-zinc-500">EQUIPO</p>
                <p className="mt-1 text-sm text-zinc-300">{p.equipment}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold tracking-widest text-zinc-400 mb-3">PORTAFOLIO</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.photos.map((src, i) => (
                  <div key={i} className="group overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900 aspect-[4/3] hover:border-red-600/30 transition-colors">
                    <img src={src} alt={`Obra ${i+1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-red-600/20 bg-zinc-950 p-6 shadow-xl shadow-black/30">
              <p className="text-xs font-semibold tracking-widest text-red-400">RESERVA</p>
              <p className="mt-2 text-2xl font-bold text-white">${p.price} <span className="text-sm font-normal text-zinc-500">/ sesión</span></p>
              <p className="text-xs text-zinc-500">Entrega estimada {p.delivery}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Calificación</span><span className="text-red-400 font-semibold">★ {p.rating.toFixed(1)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Especialidad</span><span className="text-white">{p.specialty}</span></div>
              </div>
              <Button variant="primary" className="w-full mt-6 py-3.5">Solicitar Reserva</Button>
              <Link to="/explorar" className="mt-3 block text-center text-sm text-zinc-500 hover:text-white">← Volver al catálogo</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistProfile
