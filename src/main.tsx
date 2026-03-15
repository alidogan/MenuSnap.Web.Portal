import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@/core/i18n/i18n'
import '@fontsource/roboto/latin.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '@/styles/theme/menusnap/theme.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
