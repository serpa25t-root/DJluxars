const categories = ['Todas', 'Retrato', 'Moda', 'Eventos', 'Editorial']

const FilterBar = ({ category, onCategory, price, onPrice, rating, onRating }) => {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onCategory(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium border transition-all duration-150 ${
              category === c
                ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Precio máximo por sesión</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="50000"
              max="1500000"
              step="50000"
              value={price}
              onChange={(e) => onPrice(Number(e.target.value))}
              className="flex-1 accent-red-600"
            />
            <span className="text-sm font-semibold text-white whitespace-nowrap">${price.toLocaleString('es-CO')} COP</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Calificación mínima</label>
          <div className="flex gap-2">
            {[0, 4, 4.5, 4.8].map((v) => (
              <button
                key={v}
                onClick={() => onRating(v)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  rating === v
                    ? 'bg-red-600/15 border-red-600/40 text-red-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {v === 0 ? 'Todas' : `${v} ★+`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
