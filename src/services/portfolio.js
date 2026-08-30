import api from './api'

export const getPortfolio = async () => {
  const res = await api.get('portfolio/')
  // DRF puede retornar paginado {results: []} o lista directa
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.data.results)) return res.data.results
  return res.data
}

export const createPortfolioItem = async (formData) => {
  // formData debe incluir title, description, category, file o media_type
  const res = await api.post('portfolio/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const deletePortfolioItem = async (id) => {
  const res = await api.delete(`portfolio/${id}/`)
  return res.data
}
