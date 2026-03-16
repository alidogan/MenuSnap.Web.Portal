import { createFileRoute } from '@tanstack/react-router'
import Tenants from '@/features/tenants/views/Tenants'

export const Route = createFileRoute('/_admin/admin/tenants')({
  component: Tenants,
})
