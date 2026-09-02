import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getConversations, getMessages, sendMessage, ensureConversationForContact, markAsRead } from '../services/chat'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [showListOnMobile, setShowListOnMobile] = useState(true)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [search, setSearch] = useState('')
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)

  const reloadConversations = async () => {
    const data = await getConversations(user?.id)
    setConversations(data)
    return data
  }

  const loadMessages = async (cid) => {
    if (!cid) return
    setLoadingMsgs(true)
    try {
      const data = await getMessages(cid)
      setMessages(data)
      await markAsRead(cid)
      const updated = await getConversations(user?.id)
      setConversations(updated)
    } finally {
      setLoadingMsgs(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    let mounted = true
    const init = async () => {
      setLoadingConvs(true)
      const contactId = searchParams.get('contactId')
      if (contactId) {
        const name = searchParams.get('name') || `Contacto ${contactId}`
        const cid = await ensureConversationForContact(contactId, name)
        if (!mounted) return
        setSelectedId(cid)
        setShowListOnMobile(false)
        await loadMessages(cid)
      } else {
        const convs = await getConversations(user?.id)
        if (!mounted) return
        setConversations(convs)
        if (convs.length > 0 && !selectedId) {
          setSelectedId(convs[0].id)
          await loadMessages(convs[0].id)
        }
      }
      setLoadingConvs(false)
    }
    init()
    return () => { mounted = false }
  }, [user?.id, searchParams])

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId)
    }
  }, [selectedId])

  useEffect(() => {
    if (!selectedId) return
    pollingRef.current = setInterval(async () => {
      const data = await getMessages(selectedId)
      setMessages((prev) => {
        if (prev.length !== data.length) return data
        if (prev[prev.length - 1]?.id !== data[data.length - 1]?.id) return data
        return prev
      })
      const convs = await getConversations(user?.id)
      setConversations(convs)
    }, 3000)
    return () => clearInterval(pollingRef.current)
  }, [selectedId, user?.id])

  const handleSelect = (id) => {
    setSelectedId(id)
    setShowListOnMobile(false)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const text = inputText.trim()
    if (!text || !selectedId) return
    await sendMessage(selectedId, text, 'me')
    setInputText('')
    toast.success('Mensaje enviado')
    const data = await getMessages(selectedId)
    setMessages(data)
    const convs = await getConversations(user?.id)
    setConversations(convs)
  }

  const conversation = conversations.find((c) => c.id === String(selectedId) || c.contact.id === String(selectedId)) || null

  const filteredConvs = conversations.filter((c) => {
    if (!search.trim()) return true
    return c.contact.name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="flex h-[calc(100vh-10rem)] min-h-[480px] bg-[#070709] text-white rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-black/80">
      {/* Columna Izquierda */}
      <div className="w-full md:w-[30%] min-w-[280px] lg:max-w-sm flex-shrink-0 border-r border-zinc-800/80 bg-zinc-950/50 flex flex-col">
        <div className="p-4 border-b border-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Mensajes</h2>
            <span className="text-xs text-zinc-500">{conversations.length} chats</span>
          </div>
          <div className="mt-3 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar chats"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
              <p className="mt-3 text-sm text-zinc-500">Cargando conversaciones...</p>
            </div>
          ) : filteredConvs.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500 text-center">Sin conversaciones.</p>
          ) : (
            filteredConvs.map((c) => {
              const isSelected = String(selectedId) === String(c.id) || String(selectedId) === String(c.contact.id)
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className={`p-4 border-b border-zinc-800/40 hover:bg-red-900/10 transition-colors cursor-pointer ${isSelected ? 'bg-red-600/10 border-l-4 border-red-600' : 'border-l-4 border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={c.contact.avatar} alt={c.contact.name} className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                      {c.contact.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white truncate">{c.contact.name}</p>
                        <span className="text-[11px] text-zinc-500">{new Date(c.updatedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-xs font-bold">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Mobile volver */}
        <div className="md:hidden p-3 border-t border-zinc-900">
          <button onClick={() => setShowListOnMobile(false)} className="w-full rounded-full bg-zinc-900 border border-zinc-800 py-2 text-sm text-zinc-400">Ver chat</button>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="flex-1 flex flex-col bg-[#070709]">
        {conversation ? (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950/50">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowListOnMobile(true)} className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <img src={conversation.contact.avatar} alt={conversation.contact.name} className="h-9 w-9 rounded-full object-cover border border-zinc-800" />
                <div>
                  <p className="text-sm font-semibold text-white">{conversation.contact.name}</p>
                  <p className="text-xs text-zinc-400">{conversation.contact.specialty} • <span className="text-emerald-400">En línea</span></p>
                </div>
              </div>
              <button className="rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMsgs ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
                  <p className="mt-3 text-sm text-zinc-500">Cargando mensajes...</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.senderId === 'me'
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={isMe ? 'ml-auto max-w-md bg-gradient-to-br from-red-600 to-red-700 text-white p-4 rounded-2xl rounded-tr-none shadow-[0_0_15px_rgba(239,68,68,0.2)] text-sm' : 'mr-auto max-w-md bg-zinc-800/80 text-zinc-100 p-4 rounded-2xl rounded-tl-none border border-zinc-700/50 text-sm'}>
                        <p>{m.text}</p>
                        <div className="mt-2 flex items-center justify-end gap-1">
                          <span className="text-[11px] opacity-70">{new Date(m.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <span className={`text-xs ${m.is_read ? 'text-emerald-400' : 'text-red-200'}`}>{m.is_read ? '✓✓' : '✓'}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-zinc-950/80 backdrop-blur-md border-t border-red-900/30">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 focus-within:border-red-600 transition-colors">
                <button type="button" className="rounded-full p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a2 2 0 00-2.828-2.828l-6.414 6.586a2 2 0 002.828 2.828l6.586-6.414" />
                  </svg>
                </button>
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-transparent text-sm focus:outline-none text-white placeholder:text-zinc-500"
                />
                <button type="submit" className="w-9 h-9 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#070709]">
            <p className="text-sm text-zinc-500">Selecciona un chat para comenzar.</p>
          </div>
        )}
      </div>

      {/* Mobile toggle helper */}
      <div className={`${showListOnMobile ? 'flex' : 'hidden'} md:hidden fixed inset-0 z-10 bg-black/60`} onClick={() => setShowListOnMobile(false)} />
    </div>
  )
}

export default Chat
