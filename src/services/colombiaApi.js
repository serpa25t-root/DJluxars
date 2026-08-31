import { useState, useEffect, useCallback } from 'react'

const API_BASE = 'https://api-colombia.com/api/v1'

// Fallback estático por si la API falla o bloquea CORS
const FALLBACK_DEPARTMENTS = [
  { id: 5, name: 'Antioquia' },
  { id: 11, name: 'Bogotá D.C.' },
  { id: 13, name: 'Bolívar' },
  { id: 8, name: 'Atlántico' },
  { id: 76, name: 'Valle del Cauca' },
  { id: 68, name: 'Santander' },
  { id: 25, name: 'Cundinamarca' },
  { id: 19, name: 'Cauca' },
]

const FALLBACK_CITIES = {
  5: [{ id: 5001, name: 'Medellín' }, { id: 5002, name: 'Envigado' }, { id: 5129, name: 'Rionegro' }],
  11: [{ id: 11001, name: 'Bogotá' }],
  13: [{ id: 13001, name: 'Cartagena' }, { id: 13052, name: 'Arjona' }],
  8: [{ id: 8001, name: 'Barranquilla' }, { id: 8758, name: 'Soledad' }],
  76: [{ id: 76001, name: 'Cali' }, { id: 76520, name: 'Palmira' }],
  68: [{ id: 68001, name: 'Bucaramanga' }, { id: 68081, name: 'Barrancabermeja' }],
  25: [{ id: 25001, name: 'Soacha' }, { id: 25754, name: 'Soacha' }],
  19: [{ id: 19001, name: 'Popayán' }],
}

export const fetchDepartments = async (signal) => {
  try {
    const res = await fetch(`${API_BASE}/Department`, { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    // API retorna array con id, name, description, cityCapitalId, etc.
    // Normalizamos a {id, name}
    return data.map((d) => ({ id: d.id, name: d.name })).sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    return FALLBACK_DEPARTMENTS
  }
}

export const fetchCitiesByDepartment = async (departmentId, signal) => {
  if (!departmentId) return []
  try {
    const res = await fetch(`${API_BASE}/Department/${departmentId}/cities`, { signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data.map((c) => ({ id: c.id, name: c.name })).sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    return FALLBACK_CITIES[departmentId] || []
  }
}

export const useColombiaApi = () => {
  const [departments, setDepartments] = useState([])
  const [cities, setCities] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const [error, setError] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setLoadingDepartments(true)
    fetchDepartments(controller.signal)
      .then(setDepartments)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingDepartments(false))
    return () => controller.abort()
  }, [])

  const loadCities = useCallback(async (deptId) => {
    setSelectedDepartment(deptId)
    if (!deptId) {
      setCities([])
      return []
    }
    setLoadingCities(true)
    const controller = new AbortController()
    try {
      const data = await fetchCitiesByDepartment(deptId, controller.signal)
      setCities(data)
      return data
    } catch (e) {
      setError(e.message)
      return []
    } finally {
      setLoadingCities(false)
    }
  }, [])

  // helper para obtener departamento por nombre
  const getDepartmentIdByName = useCallback((name) => {
    const found = departments.find((d) => d.name.toLowerCase() === name.toLowerCase())
    return found?.id || null
  }, [departments])

  return {
    departments,
    cities,
    loadingDepartments,
    loadingCities,
    error,
    selectedDepartment,
    setSelectedDepartment,
    loadCities,
    getDepartmentIdByName,
  }
}

export default useColombiaApi
