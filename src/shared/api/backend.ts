import axios from 'axios'
import { useAuthTokenStore } from '@/core/auth/store'
import { keycloak } from '@/core/auth/keycloak'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthTokenStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { setToken, clearTokens } = useAuthTokenStore.getState()
      try {
        const refreshed = await keycloak.updateToken(30)
        if (refreshed && keycloak.token) {
          setToken(keycloak.token)
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`
          return api(originalRequest)
        }
      } catch {
        clearTokens()
        keycloak.login()
      }
    }
    return Promise.reject(error)
  }
)

export default api
