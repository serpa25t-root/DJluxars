import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Navbar />

      {/* HERO — Dark Mode Aesthetic */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Fondos decorativos - gradiente + textura */}
          <div className="absolute inset-0 bg-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900" />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }} />
          {/* Glow dorado sutil */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-[#c5a253]/10 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-900/10 blur-[100px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
              {/* Columna Izquierda - Texto */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium tracking-wide text-zinc-300">
                    Más de 2.500 fotógrafos profesionales
                  </span>
                </div>

                <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
                  Captura y exhibe
                  <span className="block bg-gradient-to-r from-[#c5a253] to-[#e8c97a] bg-clip-text text-transparent">
                    el arte de tu lente
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-base leading-relaxed text-zinc-400 sm:text-lg">
                  La plataforma exclusiva donde los fotógrafos crean portafolios cinematográficos
                  y los clientes encuentran al profesional perfecto para inmortalizar sus momentos.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button variant="primary" className="px-8 py-3.5 text-base shadow-xl shadow-[#c5a253]/20">
                    Explorar Galería
                  </Button>
                  <Button variant="secondary" className="px-8 py-3.5 text-base">
                    Unirme como Fotógrafo
                  </Button>
                </div>

                {/* Social proof */}
                <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    <img
                      src="https://i.pravatar.cc/100?img=33"
                      alt="Fotógrafo 1"
                      className="h-9 w-9 rounded-full border-2 border-zinc-950 object-cover"
                    />
                    <img
                      src="https://i.pravatar.cc/100?img=14"
                      alt="Fotógrafo 2"
                      className="h-9 w-9 rounded-full border-2 border-zinc-950 object-cover"
                    />
                    <img
                      src="https://i.pravatar.cc/100?img=47"
                      alt="Fotógrafo 3"
                      className="h-9 w-9 rounded-full border-2 border-zinc-950 object-cover"
                    />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-950 bg-zinc-800 text-xs font-semibold text-white">
                      +2k
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★★★★★</span>
                      <span className="text-sm font-semibold text-white">4.9/5</span>
                    </div>
                    <p className="text-xs text-zinc-500">Valoración de clientes</p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Grid Fotográfico */}
              <div className="relative lg:h-[520px]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Imagen grande izquierda */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] group">
                      <img
                        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=750&fit=crop&crop=center"
                        alt="Retrato artístico"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xs font-medium text-white/90">Retrato Editorial</p>
                        <p className="text-[11px] text-white/60">por Elena Mora</p>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/3] group">
                      <img
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=450&fit=crop"
                        alt="Cámara profesional"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {/* Columna derecha */}
                  <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/3] group">
                      <img
                        src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=450&fit=crop"
                        alt="Paisaje nocturno"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] group">
                      <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop&crop=faces"
                        alt="Moda editorial"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-white/90">Moda • París</p>
                          <p className="text-[11px] text-white/60">por Marc Dubois</p>
                        </div>
                        <span className="rounded-full bg-white/15 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-white">
                          4.9 ★
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge flotante */}
                <div className="absolute -bottom-4 left-4 sm:-left-4 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl px-4 py-3 shadow-2xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">+12k sesiones</p>
                    <p className="text-xs text-zinc-400">reservadas este mes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de características / Stats */}
        <section className="border-y border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">15k+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Obras publicadas</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">98%</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Satisfacción</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">2.5k</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Fotógrafos verificados</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">24/7</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Soporte dedicado</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
