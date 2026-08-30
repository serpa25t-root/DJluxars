import { useState, useMemo } from 'react'

const ChatSidebar = ({ conversations, selectedId, onSelect }) => {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations
    const q = search.toLowerCase()
    return conversations.filter((c) => c.contact.name.toLowerCase().includes(q))
  }, [conversations, search])

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-900">
      <div className="p-4 border-b border-zinc-900">
        <h2 className="font-display text-lg font-bold text-white">Mensajes</h2>
        <div className="mt-3 relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contacto por nombre"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500 text-center">Sin conversaciones.</p>
        ) : (
          filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900 transition-colors ${selectedId === c.id ? 'bg-zinc-900 border-l-2 border-red-600' : 'border-l-2 border-transparent'}`}
            >
              <div className="relative">
                <img src={c.contact.avatar} alt={c.contact.name} className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                {c.contact.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate">{c.contact.name}</p>
                  {c.unread > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-md shadow-red-600/20">
                      {c.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{c.lastMessage}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatSidebar
