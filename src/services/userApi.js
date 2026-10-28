import apiClient from './apiClient'

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
  const res = await apiClient.get('users/me/')
  return res.data
}

/**
 * Actualización parcial del perfil.
 * @param {FormData|object} payload - FormData si incluye avatar/cover
 */
export const updateProfile = async (payload) => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const res = isFormData
    ? await apiClient.patch('users/me/', payload)
    : await apiClient.patch('users/me/', payload)
  return res.data
}

export const removeAvatar = async () => {
  const res = await apiClient.patch('users/me/', { avatar: null, cover: null })
  return res.data
}

/**
 * Activa el rol de fotógrafo en la sesión actual (client -> both).
 * No cierra sesión: devuelve el perfil actualizado.
 * (Sin skipAuthRefresh: si el access expiró, el interceptor lo refresca y reintenta)
 */
export const becomeArtist = async ({ specialty, price, ciudad }) => {
  const res = await apiClient.post('users/me/become-artist/', { specialty, price, ciudad })
  return res.data
}

/**
 * Perfil público de cualquier usuario + stats (works, likes, views)
 */
export const getPublicProfile = async (id) => {
  const res = await apiClient.get(`users/${id}/profile/`)
  return res.data
}

/**
 * Obras públicas de un usuario
 */
export const getUserPortfolio = async (id) => {
  const res = await apiClient.get(`users/${id}/portfolio/`)
  return unwrap(res)
}
