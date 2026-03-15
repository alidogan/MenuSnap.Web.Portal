import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import nl from './locales/nl.json'

i18n
  .use(initReactI18next)
  .init({
    lng: 'nl',
    fallbackLng: 'nl',
    resources: { nl: { translation: nl } },
    interpolation: { escapeValue: false },
  })

export default i18n
