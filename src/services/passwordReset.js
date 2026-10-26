import api from './api'

export const requestPasswordReset = async (email) => {
  const res = await api.post('users/password-reset/', { email })
  return res.data
}

export const confirmPasswordReset = async (uid, token, newPassword) => {
  const res = await api.post('users/password-reset/confirm/', {
    uid,
    token,
    new_password: newPassword,
  })
  return res.data
}
