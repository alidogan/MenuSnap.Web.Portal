import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthTokenStore {
  token: string | null
  refreshToken: string | null
  setToken: (token: string | null) => void
  setRefreshToken: (refreshToken: string | null) => void
  clearTokens: () => void
}

export const useAuthTokenStore = create<AuthTokenStore>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearTokens: () => set({ token: null, refreshToken: null }),
    }),
    { name: 'auth-tokens' }
  )
)
