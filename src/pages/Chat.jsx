import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatWindow from '../components/chat/ChatWindow'
import { getConversations, getMessages, sendMessage, ensureConversationForContact, markAsRead } from '../services/chat'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [showListOnMobile, setShowListOnMobile] = useState(true)

  const reloadConversations = () => {
    setConversations(getConversations(user?.id))
  }

  useEffect(() => {
    reloadConversations()
    // Si viene ?contactId=, crea/selecciona conversación
    const contactId = searchParams.get('contactId')
    if (contactId) {
      const name = searchParams.get('name') || `Contacto ${contactId}`
      const cid = ensureConversationForContact(contactId, name)
      setSelectedId(cid)
      setShowListOnMobile(false)
      // limpia query para no re-crear
      // setSearchParams({})
    } else {
      const convs = getConversations(user?.id)
      if (convs.length > 0 && !selectedId) setSelectedId(convs[0].id)
    }
  }, [user?.id])

  useEffect(() => {
    if (selectedId) {
      setMessages(getMessages(selectedId))
      markAsRead(selectedId)
      setConversations(getConversations(user?.id))
    }
  }, [selectedId])

  const handleSelect = (id) => {
    setSelectedId(id)
    setShowListOnMobile(false)
  }

  const handleSend = (text) => {
    if (!selectedId) return
    sendMessage(selectedId, text, 'me')
    setMessages(getMessages(selectedId))
    reloadConversations()
  }

  const conversation = conversations.find((c) => c.id === selectedId) || null

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black">
      <div className="flex-1 flex flex-col md:flex-row max-h-[100dvh] overflow-hidden">
        {/* Sidebar */}
        <div className={`${showListOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-80 flex-col border-r border-zinc-900`}>
          <ChatSidebar conversations={conversations} selectedId={selectedId} onSelect={handleSelect} />
        </div>

        {/* Ventana */}
        <div className={`${!showListOnMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-h-0`}>
          <ChatWindow
            conversation={conversation}
            messages={messages}
            onSend={handleSend}
            onBack={() => setShowListOnMobile(true)}
          />
        </div>
      </div>

      {/* Botón volver en móvil cuando no hay selección */}
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
