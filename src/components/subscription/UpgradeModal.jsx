import Button from '../common/Button'

const UpgradeModal = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-red-600/25 bg-zinc-950 shadow-2xl overflow-hidden animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-amber-500 to-transparent" />
        <div className="px-6 py-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600/15 border border-red-600/30 text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-white">Has alcanzado el límite de tu Plan Free</h2>
          <p className="mt-2 text-sm text-zinc-400">Desbloquea el doble de capacidad y destaca en el catálogo.</p>

          <div className="mt-6 space-y-3 text-left rounded-xl border border-zinc-900 bg-zinc-900/40 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">✓</span>
              <div>
                <p className="text-sm font-semibold text-white">Más servicios</p>
                <p className="text-xs text-zinc-500">De 3 a 6 servicios activos en simultáneo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/15 text-red-400 border border-red-600/20">◐</span>
              <div>
                <p className="text-sm font-semibold text-white">Doble almacenamiento</p>
                <p className="text-xs text-zinc-500">30 fotos/mes y 4 videos/mes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">★</span>
              <div>
                <p className="text-sm font-semibold text-white">Prioridad #1 en el catálogo</p>
                <p className="text-xs text-zinc-500">Aparece primero en Explorar</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" className="flex-1 border-zinc-800" onClick={onClose}>Quizás luego</Button>
            <Button variant="primary" className="flex-1 shadow-lg shadow-red-600/20" onClick={onUpgrade}>Obtener Plan PRO</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradeModal
