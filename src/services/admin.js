import apiClient from './apiClient'

const unwrap = (res) => (Array.isArray(res?.data) ? res.data : (res?.data?.results || []))

export const getAdminStats = async () => {
  const res = await apiClient.get('admin/stats/')
  return res.data
}

export const getAdminUsers = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  const res = await apiClient.get(`admin/users/${qs ? '?' + qs : ''}`)
  return unwrap(res)
}

export const updateAdminUser = async (id, payload) => {
  const res = await apiClient.patch(`admin/users/${id}/`, payload)
  return res.data
}

export const toggleAdminUser = async (id) => {
  const res = await apiClient.post(`admin/users/${id}/toggle-active/`)
  return res.data
}

export const setAdminUserRole = async (id, role) => {
  const res = await apiClient.post(`admin/users/${id}/set-role/`, { role })
  return res.data
}

export const clearAdminUserPortfolio = async (id) => {
  const res = await apiClient.post(`admin/users/${id}/clear-portfolio/`)
  return res.data
}

export const getAdminWorks = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  const res = await apiClient.get(`admin/works/${qs ? '?' + qs : ''}`)
  return unwrap(res)
}

export const updateAdminWork = async (id, payload) => {
  const res = await apiClient.patch(`admin/works/${id}/`, payload)
  return res.data
}

export const approveAdminWork = async (id) => {
  const res = await apiClient.post(`admin/works/${id}/approve/`)
  return res.data
}

export const rejectAdminWork = async (id, reason) => {
  const res = await apiClient.post(`admin/works/${id}/reject/`, { reason })
  return res.data
}

export const getAdminBookings = async () => {
  const res = await apiClient.get('admin/bookings/')
  return unwrap(res)
}

export const getAdminPayments = async () => {
  const res = await apiClient.get('admin/payments/')
  return unwrap(res)
}
