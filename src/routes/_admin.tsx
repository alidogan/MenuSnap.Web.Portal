import { createFileRoute, redirect } from '@tanstack/react-router'
import AppLayout from '@/core/layouts/AppLayout/AppLayout'
import { useAuthTokenStore } from '@/core/auth/store'

export const Route = createFileRoute('/_admin')({
  beforeLoad: () => {
    const token = useAuthTokenStore.getState().token
    if (!token) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})
