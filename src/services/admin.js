import api from './api'

const unwrap = (res) => (Array.isArray(res?.data) ? res.data : (res?.data?.results || []))

export const getAdminStats = async () => {
  const res = await api.get('admin/stats/')
  return res.data
}

export const getAdminUsers = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  const res = await api.get(`admin/users/${qs ? '?' + qs : ''}`)
  return unwrap(res)
}

export const updateAdminUser = async (id, payload) => {
  const res = await api.patch(`admin/users/${id}/`, payload)
  return res.data
}

export const toggleAdminUser = async (id) => {
  const res = await api.post(`admin/users/${id}/toggle-active/`)
  return res.data
}

export const setAdminUserRole = async (id, role) => {
  const res = await api.post(`admin/users/${id}/set-role/`, { role })
  return res.data
}

export const clearAdminUserPortfolio = async (id) => {
  const res = await api.post(`admin/users/${id}/clear-portfolio/`)
  return res.data
}

export const getAdminWorks = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  const res = await api.get(`admin/works/${qs ? '?' + qs : ''}`)
  return unwrap(res)
}

export const updateAdminWork = async (id, payload) => {
  const res = await api.patch(`admin/works/${id}/`, payload)
  return res.data
}

export const approveAdminWork = async (id) => {
  const res = await api.post(`admin/works/${id}/approve/`)
  return res.data
}

export const rejectAdminWork = async (id, reason) => {
  const res = await api.post(`admin/works/${id}/reject/`, { reason })
  return res.data
}

export const getAdminBookings = async () => {
  const res = await api.get('admin/bookings/')
  return unwrap(res)
}

export const getAdminPayments = async () => {
  const res = await api.get('admin/payments/')
  return unwrap(res)
}
