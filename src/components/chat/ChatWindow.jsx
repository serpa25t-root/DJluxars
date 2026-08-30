import { useEffect, useRef, useState } from 'react'
import Button from '../common/Button'

const ChatWindow = ({ conversation, messages, onSend, onBack }) => {
  const [text, setText] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <p className="text-sm text-zinc-500">Selecciona un chat para comenzar.</p>
      </div>
    )
  }

  const handleSend = () => {
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-900 bg-zinc-950">
        <button onClick={onBack} className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img src={conversation.contact.avatar} alt={conversation.contact.name} className="h-9 w-9 rounded-full object-cover border border-zinc-800" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{conversation.contact.name}</p>
          <p className="text-xs text-zinc-400 truncate">{conversation.contact.specialty} • <span className="text-emerald-400">En línea</span></p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-gradient-to-b from-zinc-950 via-black to-black">
        {messages.map((m) => {
          const isMe = m.senderId === 'me'
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed border shadow-sm ${
                  isMe
                    ? 'bg-red-600/20 border-red-600/30 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                }`}
              >
                {m.text}
                <p className={`mt-1 text-[11px] ${isMe ? 'text-red-200/70' : 'text-zinc-500'}`}>
                  {new Date(m.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20"
        />
        <Button variant="primary" onClick={handleSend} className="px-6 whitespace-nowrap">
          Enviar
        </Button>
      </div>
    </div>
  )
}

export default ChatWindow
