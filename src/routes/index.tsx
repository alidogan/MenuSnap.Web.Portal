import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthTokenStore } from '@/core/auth/store'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = useAuthTokenStore.getState().token
    throw redirect({ to: token ? '/admin' : '/login' })
  },
  component: () => null,
})
