import { createFileRoute } from '@tanstack/react-router'
import AdminOverview from '@/features/admin/views/AdminOverview'

export const Route = createFileRoute('/_admin/admin/')({
  component: AdminOverview,
})
