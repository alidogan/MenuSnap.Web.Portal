import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslation()
  return (
    <div className="login-page">
      <h1>MenuSnap Admin</h1>
      <p>{t('common.loading')}</p>
    </div>
  )
}
