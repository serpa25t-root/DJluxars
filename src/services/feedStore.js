const POSTS_KEY = 'luxarts_feed_posts'

const seedPosts = [
  {
    id: 'post_1',
    authorId: 1,
    authorName: 'Elena Mora',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    verified: true,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=800&fit=crop',
    caption: 'Nueva sesión de retrato en estudio. Luz natural y emociones reales. 🎞️ #Retrato #Estudio',
    likes: ['u1', 'u2'],
    comments: [
      { id: 'c1', author: 'Sofía Reyes', avatar: 'https://i.pravatar.cc/150?img=9', text: '¡Impecable composición! 👏' },
      { id: 'c2', author: 'Marc Dubois', avatar: 'https://i.pravatar.cc/150?img=15', text: 'Me encanta el manejo de luz.' },
    ],
    createdAt: Date.now() - 1000 * 60 * 25,
  },
  {
    id: 'post_2',
    authorId: 2,
    authorName: 'Marc Dubois',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    verified: true,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=800&fit=crop',
    caption: 'Boda de ensueño en Bogotá. 8 horas de cobertura llena de momentos irrepetibles. 💍 #Bodas',
    likes: ['u3'],
    comments: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'post_3',
    authorId: 3,
    authorName: 'Sofía Reyes',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    verified: true,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=800&fit=crop',
    caption: 'Cobertura de evento corporativo en Medellín. Profesionalismo y estilo. ✨ #Eventos',
    likes: [],
    comments: [{ id: 'c3', author: 'Javier Ortiz', avatar: 'https://i.pravatar.cc/150?img=12', text: 'Gran trabajo de equipo.' }],
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
]

const load = () => {
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  localStorage.setItem(POSTS_KEY, JSON.stringify(seedPosts))
  return seedPosts
}

const persist = (posts) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  window.dispatchEvent(new CustomEvent('luxarts_feed_updated'))
}

export const getFeedPosts = () => load()

export const addPost = ({ image, caption, author }) => {
  const posts = load()
  const newPost = {
    id: `post_${Date.now()}`,
    authorId: author?.id || 0,
    authorName: author?.first_name || author?.username || 'Fotógrafo',
    authorAvatar: author?.avatar_url || author?.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60)}`,
    verified: author?.role === 'artist',
    image,
    caption,
    likes: [],
    comments: [],
    createdAt: Date.now(),
  }
  const next = [newPost, ...posts]
  persist(next)
  return newPost
}

export const toggleLike = (postId, userId) => {
  const posts = load()
  const next = posts.map((p) => {
    if (p.id !== postId) return p
    const has = Array.isArray(p.likes) && p.likes.includes(userId)
    return { ...p, likes: has ? p.likes.filter((u) => u !== userId) : [...(p.likes || []), userId] }
  })
  persist(next)
}

export const addComment = (postId, { author, avatar, text }) => {
  const posts = load()
  const next = posts.map((p) => {
    if (p.id !== postId) return p
    const comment = { id: `c_${Date.now()}`, author, avatar, text }
    return { ...p, comments: [...(p.comments || []), comment] }
  })
  persist(next)
  return next.find((p) => p.id === postId)
}