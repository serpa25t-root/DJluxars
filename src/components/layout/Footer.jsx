const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-900 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-display text-xl font-semibold tracking-tight text-white">LuxArs</span>
            </a>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              La plataforma definitiva para fotógrafos profesionales. Exhibe tu portafolio cinematográfico,
              conecta con clientes y lleva tu arte al siguiente nivel.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-600/20 bg-red-600/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-300">Cinematic Crimson • Dark Studio</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Explorar</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#explorar" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Galería destacada</a></li>
              <li><a href="#fotografos" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Fotógrafos</a></li>
              <li><a href="#servicios" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Servicios</a></li>
              <li><a href="#unirme" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Únete como fotógrafo</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#privacidad" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Política de privacidad</a></li>
              <li><a href="#terminos" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Términos y condiciones</a></li>
              <li><a href="#cookies" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Política de cookies</a></li>
              <li><a href="#contacto" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900 pt-8">
          <p className="text-sm text-zinc-500">
            © {currentYear} LuxArs. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
