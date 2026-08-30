import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatWindow from '../components/chat/ChatWindow'
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

  // Polling ligero cada 3s
  useEffect(() => {
    if (!selectedId) return
    pollingRef.current = setInterval(async () => {
      const data = await getMessages(selectedId)
      setMessages((prev) => {
        if (prev.length !== data.length) return data
        // compara último id
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

  const handleSend = async (text) => {
    if (!selectedId) return
    await sendMessage(selectedId, text, 'me')
    const data = await getMessages(selectedId)
    setMessages(data)
    const convs = await getConversations(user?.id)
    setConversations(convs)
  }

  const conversation = conversations.find((c) => c.id === String(selectedId) || c.contact.id === String(selectedId)) || null

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black">
      <div className="flex-1 flex flex-col md:flex-row max-h-[100dvh] overflow-hidden">
        {/* Sidebar */}
        <div className={`${showListOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-80 flex-col border-r border-zinc-900`}>
          {loadingConvs ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-8">
              <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
              <p className="mt-3 text-sm text-zinc-500">Cargando conversaciones...</p>
            </div>
          ) : (
            <ChatSidebar conversations={conversations} selectedId={selectedId} onSelect={handleSelect} />
          )}
        </div>

        {/* Ventana */}
        <div className={`${!showListOnMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-h-0 relative`}>
          {loadingMsgs ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-black">
              <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
              <p className="mt-3 text-sm text-zinc-500">Cargando mensajes...</p>
            </div>
          ) : (
            <ChatWindow
              conversation={conversation}
              messages={messages}
              onSend={handleSend}
              onBack={() => setShowListOnMobile(true)}
            />
          )}
        </div>
      </div>

      {showListOnMobile && selectedId && (
        <button
          onClick={() => setShowListOnMobile(false)}
          className="md:hidden fixed bottom-6 right-6 rounded-full bg-red-600 text-white p-4 shadow-xl shadow-red-600/20"
        >
          Volver al chat
        </button>
      )}
    </div>
  )
}

export default Chat
