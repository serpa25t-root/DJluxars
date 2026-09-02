import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ArtistDashboard from './dashboard/ArtistDashboard'
import ClientDashboard from './dashboard/ClientDashboard'

const Dashboard = () => {
  const { user, loading } = useAuth()

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // SCRUM-36: alerta antes de salir accidentalmente del Dashboard
      e.preventDefault()
      e.returnValue = ''
      return ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const isArtist = user?.role === 'artist' || user?.user_type === 'artist' || user?.is_artist === true

  return isArtist ? <ArtistDashboard /> : <ClientDashboard />
}

export default Dashboard
// Guardia beforeunload para cambios sin guardar en Dashboard
