import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { upgradeToPro, getPlan } from '../../services/subscription'

const ProSubscription = () => {
  const { user } = useAuth()
  const artistId = user?.id || user?.email || 'anon'
  const [isAnnual, setIsAnnual] = useState(false)
  const [upgraded, setUpgraded] = useState(getPlan(artistId) === 'pro')

  const handleUpgrade = () => {
    upgradeToPro(artistId)
    setUpgraded(true)
  }

  const price = isAnnual ? '$287.000 COP / año' : '$29.900 COP / mes'
  const subPrice = isAnnual ? 'Equivale a $23.900/mes' : 'Facturado mensual'

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-serif text-5xl">Eleva tu arte al <span className="text-red-600">siguiente nivel.</span></h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">Desbloquea el posicionamiento prioritario y muestra tu portafolio sin límites.</p>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-full">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${!isAnnual ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            Mensual
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            Anual <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">Ahorra 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 flex flex-col">
          <h3 className="text-lg font-bold text-white">Básico</h3>
          <p className="text-3xl font-bold text-white mt-2">$0 COP</p>
          <p className="text-sm text-zinc-400">Ideal para empezar</p>
          <ul className="mt-6 space-y-3 flex-1">
            <li className="flex items-center gap-2 text-sm text-zinc-300"><span className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">✓</span> 15 fotos por mes</li>
            <li className="flex items-center gap-2 text-sm text-zinc-300"><span className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">✓</span> 2 videos por mes</li>
            <li className="flex items-center gap-2 text-sm text-zinc-300"><span className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">✓</span> Posicionamiento estándar</li>
            <li className="flex items-center gap-2 text-sm text-zinc-300"><span className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">✓</span> Comisión 10%</li>
          </ul>
          <button disabled className="mt-8 w-full py-3 rounded-xl border border-zinc-700 text-zinc-400 font-semibold bg-transparent cursor-not-allowed">Plan Actual</button>
        </div>

        <div className="relative bg-zinc-900 border-2 border-red-600 rounded-3xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.15)] overflow-hidden flex flex-col">
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-3 py-1 rounded-bl-lg font-bold tracking-widest">RECOMENDADO</span>
          <h3 className="text-lg font-bold text-white">LuxArts PRO</h3>
          <p className="text-3xl font-bold text-white mt-2">{price}</p>
          <p className="text-sm text-zinc-400">{subPrice}</p>
          <ul className="mt-6 space-y-3 flex-1">
            <li className="flex items-center gap-2 text-sm text-white"><span className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">✓</span> Posicionamiento #1 en búsquedas</li>
            <li className="flex items-center gap-2 text-sm text-white"><span className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">✓</span> 30 fotos por mes</li>
            <li className="flex items-center gap-2 text-sm text-white"><span className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">✓</span> 4 videos de alta calidad</li>
            <li className="flex items-center gap-2 text-sm text-white"><span className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">✓</span> Soporte VIP prioritario</li>
          </ul>
          <button onClick={handleUpgrade} className="mt-8 bg-red-600 hover:bg-red-700 w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-red-600/20">
            {upgraded ? '¡Plan PRO Activado!' : 'Actualizar a PRO'}
          </button>
          {upgraded && <p className="mt-3 text-center text-sm text-emerald-400">¡Ya eres PRO! Disfruta tus beneficios.</p>}
        </div>
      </div>
    </div>
  )
}

export default ProSubscription
