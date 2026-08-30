import Button from '../common/Button'

const ComparatorModal = ({ selected, onRemove, onClear, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col animate-[scaleIn_250ms_var(--ease-out-expo)_both]">
        <div className="h-[2px] w-full bg-gradient-to-r from-red-600 to-transparent" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <h2 className="font-display text-lg font-bold text-white">Comparar Creadores</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/30">
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest text-zinc-500">ATRIBUTO</th>
                {selected.map((p) => (
                  <th key={p.id} className="text-left px-4 py-3 min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                      <span className="font-semibold text-white">{p.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              <tr>
                <td className="px-4 py-3 text-zinc-400">Especialidad</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-white font-medium">{p.specialty}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-400">Precio base</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-white font-semibold">${p.price} <span className="text-zinc-500 font-normal">/ sesión</span></td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-400">Calificación</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-red-400 font-semibold">★ {p.rating.toFixed(1)}</span>
                    <span className="ml-1 text-zinc-500">({p.reviews})</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-400">Entrega</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-zinc-300">{p.delivery}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-400">Acción</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="primary" className="text-xs px-4 py-2">Contratar</Button>
                      <button onClick={() => onRemove(p.id)} className="text-xs text-zinc-500 hover:text-white px-2">Quitar</button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-900 flex justify-between">
          <button onClick={onClear} className="text-sm text-zinc-500 hover:text-white">Limpiar comparación</button>
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  )
}

// Barra flotante
export const CompareBar = ({ selected, onRemove, onCompare, onClear }) => {
  if (selected.length === 0) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl">
      <div className="rounded-2xl border border-red-600/25 bg-zinc-950/90 backdrop-blur-xl shadow-xl shadow-black/50 px-4 py-3 flex items-center gap-3 animate-[fadeInUp_300ms_var(--ease-out-quart)_both]">
        <div className="flex -space-x-2">
          {selected.map((p) => (
            <div key={p.id} className="relative">
              <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover" />
              <button onClick={() => onRemove(p.id)} className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-white flex items-center justify-center hover:bg-red-600">×</button>
            </div>
          ))}
          {selected.length < 3 && (
            <div className="h-8 w-8 rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-500 text-xs">
              +{3 - selected.length}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{selected.length} creador{selected.length > 1 ? 'es' : ''} seleccionado{selected.length > 1 ? 's' : ''}</p>
          <p className="text-xs text-zinc-500 hidden sm:block">Máximo 3 para comparar lado a lado</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="hidden sm:inline text-xs text-zinc-500 hover:text-white px-2">Limpiar</button>
          <Button variant="primary" onClick={onCompare} className="text-sm px-4 py-2 whitespace-nowrap">Comparar Creadores</Button>
        </div>
      </div>
    </div>
  )
}

export default ComparatorModal
