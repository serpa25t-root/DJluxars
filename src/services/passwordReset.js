import apiClient from './apiClient'

export const requestPasswordReset = async (email) => {
  const res = await apiClient.post('users/password-reset/', { email })
  return res.data
}

export const confirmPasswordReset = async (uid, token, newPassword) => {
  const res = await apiClient.post('users/password-reset/confirm/', {
    uid,
    token,
    new_password: newPassword,
  })
  return res.data
}
