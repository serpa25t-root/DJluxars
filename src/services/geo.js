export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no disponible en este navegador.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })

export const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'es' },
  })
  if (!res.ok) throw new Error('No se pudo obtener la ubicación.')
  const data = await res.json()
  const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || data.address?.state || ''
  const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || ''
  const display = suburb ? `${suburb}, ${city}` : city || data.display_name || 'Ubicación detectada'
  return { city, suburb, display, raw: data }
}

export const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
