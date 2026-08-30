import { useState } from 'react'
import Button from '../../components/common/Button'
import UploadModal from '../../components/portfolio/UploadModal'

const mockWorks = [
  {
    id: 1,
    title: 'Luz de Neón',
    category: 'Editorial',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
    likes: 128,
    views: 3420,
  },
  {
    id: 2,
    title: 'Retrato en Sombra',
    category: 'Retrato',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop',
    likes: 89,
    views: 2103,
  },
  {
    id: 3,
    title: 'Pasarela Nocturna',
    category: 'Moda',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
    likes: 204,
    views: 5120,
  },
  {
    id: 4,
    title: 'Votos al Atardecer',
    category: 'Bodas',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    likes: 312,
    views: 7890,
  },
  {
    id: 5,
    title: 'Geometría Urbana',
    category: 'Arquitectura',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    likes: 67,
    views: 1890,
  },
  {
    id: 6,
    title: 'Ritual de Luces',
    category: 'Eventos',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    likes: 145,
    views: 4100,
  },
]

const Portfolio = () => {
  const [works, setWorks] = useState(mockWorks)
  const [open, setOpen] = useState(false)

  const handlePublished = (newWork) => {
    setWorks((p) => [newWork, ...p])
  }

  return (
    <div className="min-h-[100dvh] bg-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-black to-black" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-red-600/60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header estilizado */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-900 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-red-400">DASHBOARD • CREADOR</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
              Mi Portafolio <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">Creador</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Gestiona tus obras con acabado cinematográfico. Cada imagen cuenta una historia.
            </p>
          </div>
          <Button variant="primary" className="self-start sm:self-auto shadow-lg shadow-red-600/20" onClick={() => setOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Subir Nueva Obra
          </Button>
        </div>

        {/* Grilla */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <article
              key={w.id}
              className="group overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300 ease-out will-change-transform"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                <img
                  src={w.image}
                  alt={w.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 rounded-full border border-red-600/30 bg-red-600/15 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold tracking-wide text-red-200">
                  {w.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white truncate">{w.title}</h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {w.likes}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {w.views.toLocaleString('es-CO')}
                  </span>
                  <span className="ml-auto h-1 w-12 rounded-full bg-zinc-800 group-hover:bg-red-600/30 transition-colors" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {works.length === 0 && (
          <div className="mt-16 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 py-16">
            <p className="text-sm text-zinc-400">Aún no tienes obras. Sube tu primera historia visual.</p>
          </div>
        )}
      </div>

      <UploadModal isOpen={open} onClose={() => setOpen(false)} onPublished={handlePublished} />
    </div>
  )
}

export default Portfolio
