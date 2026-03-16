import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initKeycloak } from '@/core/auth/keycloak'
import '@/core/i18n/i18n'
import '@/tailwind.css'
import '@fontsource/roboto/latin.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '@/styles/theme/menusnap/theme.scss'
import '@/core/layouts/PrivateAppLayout/styles/layout/layout.scss'

initKeycloak().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
