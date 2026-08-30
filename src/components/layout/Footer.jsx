const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c5a253] text-zinc-950 font-display font-bold text-lg">
                L
              </div>
              <span className="font-display text-xl font-semibold tracking-tight text-white">
                LuxArts
              </span>
            </a>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              La plataforma definitiva para fotógrafos profesionales. Exhibe tu portafolio,
              conecta con clientes y lleva tu arte al siguiente nivel.
            </p>
          </div>

          {/* Navegación rápida */}
          <div>
            <h3 className="text-sm font-semibold text-white">Explorar</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#explorar" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Galería destacada
                </a>
              </li>
              <li>
                <a href="#fotografos" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Fotógrafos
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#unirme" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Únete como fotógrafo
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#privacidad" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#terminos" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Política de cookies
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Derechos reservados */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 md:flex-row">
          <p className="text-sm text-zinc-500">
            © {currentYear} LuxArts. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" aria-label="Instagram" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" aria-label="Behance" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.65.665 1.43.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.63.165-1.27.25-1.95.25H0V4.51h6.938v-.007zM7.545 9.64c.39 0 .72-.08 1-.24.28-.17.49-.4.65-.7.16-.3.24-.66.24-1.08 0-.34-.06-.65-.18-.92-.12-.27-.3-.49-.53-.66-.23-.17-.52-.3-.86-.4-.34-.1-.73-.15-1.17-.15H3.622v3.9h3.923v-.75zm-.193 6.03c.42 0 .78-.06 1.09-.18.31-.12.56-.3.75-.53.19-.24.33-.52.42-.85.09-.33.14-.7.14-1.1 0-.44-.06-.83-.19-1.17-.13-.34-.32-.62-.59-.84-.27-.22-.62-.39-1.06-.5-.44-.11-.95-.17-1.55-.17H3.622v5.48h3.73v-.14zM18.416 6.29h4.92v1.36h-4.92V6.29zM15.05 13.38c0-.44.06-.83.18-1.18.12-.35.3-.66.53-.93.23-.27.52-.5.88-.7.36-.2.78-.36 1.27-.49.48-.13 1.03-.2 1.64-.2.63 0 1.2.08 1.7.23.5.15.92.38 1.26.68.34.3.6.7.77 1.19.17.49.26 1.08.26 1.77v1.03h-6.44c.03.48.15.88.36 1.2.21.32.49.58.83.78.34.2.73.34 1.17.42.44.08.9.12 1.37.12.44 0 .87-.04 1.29-.11.42-.07.78-.18 1.08-.32v1.36c-.32.11-.7.2-1.15.27-.45.07-.93.1-1.45.1-.92 0-1.72-.13-2.4-.39-.68-.26-1.25-.62-1.7-1.08-.45-.46-.79-1-1.01-1.64-.22-.64-.33-1.34-.33-2.11h-.04zm5.2-1.22c0-.32-.05-.59-.14-.83-.09-.23-.23-.43-.41-.59-.18-.16-.4-.28-.67-.37-.27-.09-.58-.13-.93-.13-.34 0-.65.05-.93.15-.28.1-.52.24-.72.43-.2.19-.36.43-.48.73-.12.3-.2.65-.24 1.06h4.55v-.45z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
