import api from './api'
import { getBookings } from './bookings'

const getLocalStats = () => {
  const bookings = getBookings()
  const ratings = Object.values(JSON.parse(localStorage.getItem('luxarts_ratings') || '{}'))
    .map(Number)
    .filter((rating) => rating >= 1 && rating <= 5)
  const completed = bookings.filter((booking) => booking.status === 'Finalizada').length
  const average = ratings.length
    ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
    : 0
  const satisfied = ratings.length
    ? Math.round((ratings.filter((rating) => rating >= 4).length / ratings.length) * 100)
    : 0

  return { sessions: completed, rating: average, satisfaction: satisfied, supportHours: 0 }
}

export const getPlatformStats = async () => {
  try {
    const response = await api.get('bookings/stats/')
    return {
      sessions: Number(response.data.sessions) || 0,
      rating: Number(response.data.rating) || 0,
      satisfaction: Number(response.data.satisfaction) || 0,
      supportHours: Number(response.data.support_hours) || 0,
    }
  } catch {
    return getLocalStats()
  }
}
