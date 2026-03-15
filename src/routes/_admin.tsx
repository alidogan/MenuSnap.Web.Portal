import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Layout from '@/core/layouts/PrivateAppLayout/layout'
import { useAuthTokenStore } from '@/core/auth/store'

const AdminLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
)

export const Route = createFileRoute('/_admin')({
  beforeLoad: () => {
    const token = useAuthTokenStore.getState().token
    if (!token) {
      throw redirect({ to: '/login' })
    }
  },
  component: AdminLayout,
})
