const PLAN_KEY = (id) => `luxarts_plan_${id || 'anon'}`
const USAGE_KEY = (id) => {
  const month = new Date().toISOString().slice(0, 7)
  return `luxarts_usage_${id || 'anon'}_${month}`
}

const LIMITS = {
  free: { services: 3, photos: 15, videos: 2, label: 'Free' },
  pro: { services: 6, photos: 30, videos: 4, label: 'PRO' },
}

export const getPlan = (artistId) => {
  try {
    return localStorage.getItem(PLAN_KEY(artistId)) || 'free'
  } catch {
    return 'free'
  }
}

export const setPlan = (artistId, plan) => {
  localStorage.setItem(PLAN_KEY(artistId), plan)
}

export const getLimits = (artistId) => {
  const plan = getPlan(artistId)
  return LIMITS[plan] || LIMITS.free
}

export const getUsage = (artistId) => {
  try {
    const raw = localStorage.getItem(USAGE_KEY(artistId))
    if (raw) return JSON.parse(raw)
  } catch {}
  return { photos: 0, videos: 0, services: 0 }
}

export const setUsage = (artistId, usage) => {
  localStorage.setItem(USAGE_KEY(artistId), JSON.stringify(usage))
}

export const incrementUsage = (artistId, type) => {
  const usage = getUsage(artistId)
  if (type === 'video') usage.videos += 1
  else usage.photos += 1
  setUsage(artistId, usage)
  return usage
}

export const checkCanUpload = (artistId, type) => {
  const plan = getPlan(artistId)
  const limits = LIMITS[plan]
  const usage = getUsage(artistId)
  const key = type === 'video' ? 'videos' : 'photos'
  const current = usage[key]
  const max = limits[key]
  if (current >= max) {
    return {
      allowed: false,
      message: `Has alcanzado el límite de ${max} ${key} de tu Plan ${plan === 'free' ? 'Free' : 'PRO'}.`,
      usage: current,
      limit: max,
      plan,
    }
  }
  return { allowed: true, usage: current, limit: max, plan }
}

export const checkCanAcceptBooking = (artistId) => {
  const plan = getPlan(artistId)
  const limits = LIMITS[plan]
  const usage = getUsage(artistId)
  if (usage.services >= limits.services) {
    return {
      allowed: false,
      message: `Has alcanzado el límite de ${limits.services} servicios activos de tu Plan ${plan === 'free' ? 'Free' : 'PRO'}.`,
      usage: usage.services,
      limit: limits.services,
      plan,
    }
  }
  return { allowed: true, usage: usage.services, limit: limits.services, plan }
}

export const upgradeToPro = (artistId) => {
  setPlan(artistId, 'pro')
  return LIMITS.pro
}

// Seed para demo: algunos fotógrafos son PRO
export const isProUser = (artistId) => getPlan(artistId) === 'pro'
