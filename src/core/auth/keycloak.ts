import Keycloak from 'keycloak-js'
import { useAuthTokenStore } from './store'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

export async function initKeycloak(): Promise<boolean> {
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  })

  if (authenticated) {
    const { setToken, setRefreshToken } = useAuthTokenStore.getState()
    setToken(keycloak.token ?? null)
    setRefreshToken(keycloak.refreshToken ?? null)

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then((refreshed) => {
        if (refreshed) {
          useAuthTokenStore.getState().setToken(keycloak.token ?? null)
          useAuthTokenStore.getState().setRefreshToken(keycloak.refreshToken ?? null)
        }
      }).catch(() => {
        useAuthTokenStore.getState().clearTokens()
      })
    }
  }

  return authenticated
}

export function logout() {
  useAuthTokenStore.getState().clearTokens()
  keycloak.logout({ redirectUri: window.location.origin + '/login' })
}
