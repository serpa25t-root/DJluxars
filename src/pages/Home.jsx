import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <main className="flex-1">
        {/* HERO — Cinematic Crimson & Deep Black */}
        <section className="relative overflow-hidden bg-black">
          {/* Base + gradient */}
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-black to-black" />
          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Crimson glows — tasteful, not overwhelming */}
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-red-600/10 blur-[130px] pointer-events-none will-change-transform" />
          <div className="absolute top-[30%] -right-32 h-[520px] w-[520px] rounded-full bg-red-900/15 blur-[110px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

          {/* Subtle letterbox top accent */}
          <div className="absolute top-0 left-0 h-[2px] w-full bg-red-600/80" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            {/* Top eyebrow */}
            <div
              className="flex justify-center lg:justify-start animate-[fadeInUp_600ms_var(--ease-out-quart)_both]"
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />
                <span className="text-xs font-semibold tracking-widest text-red-300">PORTAFOLIOS EDITORIALES • TALENTO VERIFICADO</span>
              </div>
            </div>

            {/* Alternative distribution: Editorial asymmetric — text left 60%, mosaic right 40% but with overlap */}
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-6">
              {/* Left — Typography led */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <h1
                  className="font-display text-[34px] font-bold tracking-tight text-white sm:text-5xl lg:text-[58px] lg:leading-[0.95] animate-[fadeInUp_600ms_var(--ease-out-quart)_80ms_both]"
                >
                  <span className="block">Captura y exhibe</span>
                  <span className="block bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent pb-1">
                    el arte de tu lente
                  </span>
                </h1>

                <p
                  className="mt-5 max-w-2xl mx-auto lg:mx-0 text-[15px] leading-relaxed text-zinc-400 sm:text-[17px] animate-[fadeInUp_600ms_var(--ease-out-quart)_140ms_both]"
                >
                  Exhibe tu portafolio con calidad cinemática y conecta con clientes listos para contratar tu talento. La plataforma exclusiva para fotógrafos y creadores visuales.
                </p>

                <div
                  className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-[fadeInUp_600ms_var(--ease-out-quart)_200ms_both]"
                >
                  <Link to="/explorar">
                    <Button
                      variant="primary"
                      className="px-8 py-3.5 text-[15px] shadow-xl shadow-red-600/20 hover:shadow-red-600/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Explorar Galería
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary" className="px-8 py-3.5 text-[15px] border-zinc-800 hover:border-red-600/30">
                      Unirme como Fotógrafo
                    </Button>
                  </Link>
                </div>

                {/* Social proof — red stars */}
                <div
                  className="mt-9 flex items-center gap-6 justify-center lg:justify-start animate-[fadeIn_500ms_ease-out_300ms_both]"
                >
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/100?img=33" alt="Fotógrafo 1" className="h-9 w-9 rounded-full border-2 border-black object-cover" />
                    <img src="https://i.pravatar.cc/100?img=14" alt="Fotógrafo 2" className="h-9 w-9 rounded-full border-2 border-black object-cover" />
                    <img src="https://i.pravatar.cc/100?img=47" alt="Fotógrafo 3" className="h-9 w-9 rounded-full border-2 border-black object-cover" />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-zinc-900 text-xs font-semibold text-white">
                      +2k
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-500 tracking-widest text-sm">★★★★★</span>
                      <span className="text-sm font-semibold text-white">4.9/5</span>
                      <span className="ml-1 rounded-full bg-red-600/15 border border-red-600/20 px-2 py-0.5 text-[11px] font-semibold text-red-300">1.2k reseñas</span>
                    </div>
                    <p className="text-xs text-zinc-500">Confianza de estudios y marcas</p>
                  </div>
                </div>

                {/* Mini stats — inline, cinematic */}
                <div className="mt-10 grid grid-cols-3 gap-4 border-t border-zinc-900 pt-6 max-w-xl mx-auto lg:mx-0">
                  <div>
                    <p className="font-display text-2xl font-bold text-white">15k<span className="text-red-600">+</span></p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Obras</p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4">
                    <p className="font-display text-2xl font-bold text-white">98<span className="text-red-600">%</span></p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Satisfacción</p>
                  </div>
                  <div className="border-l border-zinc-900 pl-4">
                    <p className="font-display text-2xl font-bold text-white">24/7</p>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Soporte</p>
                  </div>
                </div>
              </div>

              {/* Right — Cinematic mosaic with red glow borders */}
              <div className="lg:col-span-5 relative">
                <div
                  className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:gap-3 animate-[scaleIn_700ms_var(--ease-out-expo)_180ms_both] will-change-transform"
                >
                  {/* Left column */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] border border-zinc-900 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-600/15 transition-all duration-300 ease-out will-change-transform">
                      <img
                        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=750&fit=crop&crop=center"
                        alt="Retrato editorial cinematográfico"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {/* Top red accent line on hover */}
                      <div className="absolute top-0 left-0 h-0.5 w-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-xs font-semibold tracking-wide text-white">Retrato Editorial</p>
                        <p className="text-[11px] text-zinc-300">por Elena Mora • <span className="text-red-400">S35mm</span></p>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/3] border border-zinc-900 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300 ease-out">
                      <img
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=450&fit=crop"
                        alt="Cámara en estudio oscuro"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Right column — offset */}
                  <div className="space-y-3 sm:space-y-4 pt-6">
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/3] border border-zinc-900 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-600/10 transition-all duration-300 ease-out">
                      <img
                        src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=450&fit=crop"
                        alt="Paisaje nocturno cinematográfico"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] border border-zinc-900 hover:border-red-600/30 hover:shadow-xl hover:shadow-red-600/15 transition-all duration-300 ease-out">
                      <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop&crop=faces"
                        alt="Moda editorial"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">Moda • París</p>
                          <p className="text-[11px] text-zinc-300">por Marc Dubois</p>
                        </div>
                        <span className="rounded-full bg-red-600 text-white border border-red-500/30 px-2.5 py-1 text-[11px] font-bold shadow-md shadow-red-600/30">
                          4.9 ★
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vertical film sprocket decor */}
                  <div className="pointer-events-none absolute -right-2 top-6 bottom-6 hidden lg:flex flex-col justify-between opacity-20">
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                    <div className="w-1.5 h-3 bg-zinc-700 rounded-sm" />
                  </div>
                </div>

                {/* Floating card — red glow */}
                <div className="absolute -bottom-5 left-2 sm:left-0 flex items-center gap-3 rounded-2xl border border-red-600/20 bg-zinc-900/90 backdrop-blur-xl px-4 py-3 shadow-xl shadow-black/50 hover:shadow-red-600/10 hover:border-red-600/30 transition-all duration-300 ease-out animate-[fadeInUp_500ms_var(--ease-out-quart)_600ms_both]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 text-red-400 border border-red-600/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">+12k sesiones</p>
                    <p className="text-xs text-zinc-400">reservadas este mes</p>
                  </div>
                  <div className="ml-2 hidden sm:flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom red line + trusted by */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-zinc-500 border-t border-zinc-900 pt-6 animate-[fadeIn_500ms_ease-out_700ms_both]">
              <span className="font-medium tracking-widest uppercase">Confían en LuxArts</span>
              <span className="hidden sm:block h-3 w-px bg-zinc-800" />
              <div className="flex items-center gap-6 opacity-60">
                <span className="font-display font-semibold tracking-widest">VOGUE</span>
                <span className="font-display font-semibold tracking-widest">GQ</span>
                <span className="font-display font-semibold tracking-widest">KINOFOLK</span>
                <span className="font-display font-semibold tracking-widest">ESQUIRE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats — black with red dividers */}
        <section className="border-y border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-zinc-900">
              <div className="text-center px-2">
                <p className="font-display text-3xl font-bold text-white">15k<span className="text-red-600">+</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Obras Publicadas</p>
              </div>
              <div className="text-center px-2">
                <p className="font-display text-3xl font-bold text-white">98<span className="text-red-600">%</span></p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Satisfacción</p>
              </div>
              <div className="text-center px-2">
                <p className="font-display text-3xl font-bold text-white">2.5k</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Reservas Activas</p>
              </div>
              <div className="text-center px-2">
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
