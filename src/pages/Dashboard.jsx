import { useEffect } from 'react'
import ArtistDashboard from './dashboard/ArtistDashboard'

const Dashboard = () => {
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

  return <ArtistDashboard />
}

export default Dashboard
// Guardia beforeunload para cambios sin guardar en Dashboard
