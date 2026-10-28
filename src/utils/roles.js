/**
 * Capabilidades de rol para una sola cuenta (patrón MercadoLibre).
 *
 * - 'client'  -> solo capacidades de cliente
 * - 'artist'  -> solo capacidades de fotógrafo
 * - 'both'    -> cliente + fotógrafo (NUNCA admin)
 * - 'admin'   -> solo administración
 *
 * Usar SIEMPRE este helper en vez de comparar `user.role === 'artist'`,
 * o los usuarios duales ('both') no verán sus secciones.
 */
export const hasRole = (user, role) => {
  const userRole = user?.role
  if (!userRole) return false
  if (userRole === 'both') return role === 'client' || role === 'artist'
  return userRole === role
}
