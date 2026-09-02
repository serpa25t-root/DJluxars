import { useEffect, useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getFeedPosts, addPost, toggleLike, addComment } from '../../services/feedStore'
import { Heart, MessageCircle, Send, Camera, Plus, X } from 'lucide-react'
import Button from '../../components/common/Button'

const timeAgo = (ts) => {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `hace ${hr} h`
  const day = Math.floor(hr / 24)
  return `hace ${day} d`
}

const Composer = ({ open, setOpen, onAdd, saving }) => {
  const [image, setImage] = useState('')
  const [caption, setCaption] = useState('')
  const fileRef = useRef(null)

  const pickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!image || caption.trim() === '') return
    onAdd({ image, caption })
    setImage('')
    setCaption('')
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <form onSubmit={submit} className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2"><Camera className="h-4 w-4 text-red-500" /> Nueva publicación</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                {image ? (
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    <Plus className="h-8 w-8" />
                    <span className="text-xs font-medium">Elegir foto</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-400">Descripción</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={5}
                  placeholder="Cuéntale a tu comunidad sobre esta obra..."
                  className="flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                />
                <Button type="submit" variant="primary" disabled={saving || !image || caption.trim() === ''} className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <Send className="h-4 w-4 inline mr-1.5" />
                  {saving ? 'Publicando...' : 'Publicar'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const HomeFeed = () => {
  const { user } = useAuth()
  const isArtist = user?.role === 'artist'
  const userId = String(user?.id || user?.email || 'me')
  const displayName = user?.first_name || user?.username || user?.email?.split('@')[0] || ''
  const avatarSrc = user?.avatar_url || user?.avatar || ''

  const [posts, setPosts] = useState([])
  const [composerOpen, setComposerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState({})

  const refresh = () => setPosts(getFeedPosts())

  useEffect(() => {
    refresh()
    const onUpdate = () => refresh()
    window.addEventListener('luxarts_feed_updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('luxarts_feed_updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [])

  const sorted = useMemo(() => [...posts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [posts])

  const handleLike = (postId) => {
    toggleLike(postId, userId)
    refresh()
  }

  const handleNewPost = ({ image, caption }) => {
    setSaving(true)
    // simula guardado/transferencia mínima
    setTimeout(() => {
      addPost({ image, caption, author: user })
      setSaving(false)
    }, 300)
  }

  const handleComment = (postId, text) => {
    if (!text.trim()) return
    addComment(postId, { author: displayName || 'Usuario', avatar: avatarSrc, text })
    refresh()
  }

  const CommentInput = ({ postId }) => {
    const [text, setText] = useState('')
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleComment(postId, text)
          setText('')
        }}
        className="flex items-center gap-2 border-t border-zinc-900 pt-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Añade un comentario..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
        />
        <button type="submit" disabled={!text.trim()} className="text-sm font-semibold text-red-500 hover:text-red-400 disabled:opacity-30 transition-colors">Publicar</button>
      </form>
    )
  }

  return (
    <div className="mx-auto max-w-2xl animate-[fadeIn_300ms_ease-out]">
      <div className="mb-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-600/30"
            >
              <Camera className="h-4 w-4" />
            </motion.span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">LuxArts</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">Descubre el trabajo de la comunidad.</p>
        </motion.div>
        {isArtist && (
          <button
            onClick={() => setComposerOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            Publicar
          </button>
        )}
      </div>

      <Composer open={composerOpen} setOpen={setComposerOpen} onAdd={handleNewPost} saving={saving} />

      <div className="space-y-6">
        {sorted.map((post, i) => {
          const liked = Array.isArray(post.likes) && post.likes.includes(userId)
          const likes = post.likes?.length || 0
          const comments = post.comments?.length || 0
          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden"
            >
              {/* Autor */}
              <header className="flex items-center gap-3 px-4 py-3">
                <img src={post.authorAvatar || `https://i.pravatar.cc/150`} alt={post.authorName} className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {post.authorName}
                    {post.verified && <span className="ml-1.5 text-xs text-red-400">✓ Verificado</span>}
                  </p>
                  <p className="text-xs text-zinc-500">{timeAgo(post.createdAt)}</p>
                </div>
              </header>

              {/* Imagen */}
              <div className="aspect-square w-full overflow-hidden bg-zinc-950">
                <img src={post.image} alt={post.caption || 'Publicación'} className="h-full w-full object-cover" loading="lazy" />
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-5 px-4 pt-3">
                <motion.button
                  whileTap={{ scale: 0.7 }}
                  onClick={() => handleLike(post.id)}
                  aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
                  {likes > 0 && <span>{likes}</span>}
                </motion.button>
                <button
                  onClick={() => setCommentsOpen((c) => ({ ...c, [post.id]: !c[post.id] }))}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                  {comments > 0 && <span>{comments}</span>}
                </button>
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="px-4 pt-2">
                  <p className="text-sm text-zinc-200 whitespace-pre-line">
                    <span className="font-semibold text-white">{post.authorName} </span>
                    {post.caption}
                  </p>
                </div>
              )}

              {/* Comentarios */}
              <AnimatePresence>
                {commentsOpen[post.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden px-4 pb-3"
                  >
                    {comments.length === 0 ? (
                      <p className="text-sm text-zinc-600 pt-1">Sin comentarios todavía. Sé el primero.</p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        {comments.map((c) => (
                          <div key={c.id} className="flex items-start gap-2">
                            <img src={c.avatar || `https://i.pravatar.cc/150`} alt={c.author} className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10" />
                            <p className="text-sm text-zinc-300">
                              <span className="font-semibold text-white">{c.author} </span>
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <CommentInput postId={post.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>

      {sorted.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500">
            <Camera className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-semibold text-white">{isArtist ? 'Publica tu primera obra' : 'Aún no hay publicaciones'}</p>
          <p className="mt-1 text-xs text-zinc-500">Cuando los fotógrafos compartan, aparecerá aquí.</p>
        </div>
      )}
    </div>
  )
}

export default HomeFeed