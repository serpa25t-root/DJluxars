import apiClient from './apiClient'

/**
 * Pasarela de pago FICTICIA de LuxArts.
 * Todos los endpoints viven en /api/payments/.
 */

const unwrap = (res) => (Array.isArray(res?.data) ? res.data : (res?.data?.results || []))

export const createPayment = async ({ bookingId, method = 'tarjeta' }) => {
  const res = await apiClient.post('payments/', { booking_id: bookingId, method })
  return res.data
}

export const getPaymentByBooking = async (bookingId) => {
  try {
    const res = await apiClient.get(`payments/by-booking/${bookingId}/`)
    return res.data
  } catch {
    return null
  }
}

export const getMyPayments = async () => {
  try {
    const res = await apiClient.get('payments/')
    return unwrap(res)
  } catch {
    return []
  }
}
