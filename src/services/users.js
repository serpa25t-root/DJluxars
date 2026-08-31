import api from './api'

const unwrap = (res) => {
  const data = res?.data
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return data
}

/**
 * Perfil del usuario autenticado (incluye avatar_url, cover_url, bio, ubicación)
 */
export const getMe = async () => {
  const res = await api.get('users/me/')
  return res.data
}

/**
 * Actualización parcial del perfil.
 * @param {FormData|object} payload - FormData si incluye avatar/cover
 */
export const updateProfile = async (payload) => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const res = isFormData
    ? await api.patch('users/me/', payload)
    : await api.patch('users/me/', payload)
  return res.data
}

export const removeAvatar = async () => {
  const res = await api.patch('users/me/', { avatar: null, cover: null })
  return res.data
}

/**
 * Perfil público de cualquier usuario + stats (works, likes, views)
 */
export const getPublicProfile = async (id) => {
  const res = await api.get(`users/${id}/profile/`)
  return res.data
}

/**
 * Obras públicas de un usuario
 */
export const getUserPortfolio = async (id) => {
  const res = await api.get(`users/${id}/portfolio/`)
  return unwrap(res)
}
