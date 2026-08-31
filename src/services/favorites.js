const KEY = (userId) => `luxarts_favorites_${userId || 'anon'}`

const seedFavorites = [
  {
    id: 'fav_1',
    title: 'Retrato en Sombra',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=600&fit=crop',
    likes: 412,
    views: 8930,
    author: 'Elena Mora',
    media_type: 'imagen',
  },
  {
    id: 'fav_2',
    title: 'Luz de Neón',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop',
    likes: 268,
    views: 5120,
    author: 'Marc Dubois',
    media_type: 'imagen',
  },
  {
    id: 'fav_3',
    title: 'Atardecer en Cartagena',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
    likes: 190,
    views: 3400,
    author: 'Sofía Reyes',
    media_type: 'imagen',
  },
]

const read = (userId) => {
  try {
    const raw = localStorage.getItem(KEY(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

const write = (userId, list) => {
  try {
    localStorage.setItem(KEY(userId), JSON.stringify(list))
  } catch {}
  return list
}

export const getFavorites = (userId) => {
  const stored = read(userId)
  if (stored) return stored
  return write(userId, seedFavorites)
}

export const toggleFavorite = (userId, item) => {
  const list = getFavorites(userId)
  const exists = list.some((f) => String(f.id) === String(item.id))
  const next = exists ? list.filter((f) => String(f.id) !== String(item.id)) : [item, ...list]
  return { list: write(userId, next), added: !exists }
}

export const removeFavorite = (userId, id) => {
  const next = getFavorites(userId).filter((f) => String(f.id) !== String(id))
  return write(userId, next)
}
