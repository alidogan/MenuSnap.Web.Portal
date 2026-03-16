import { createFileRoute } from '@tanstack/react-router'
import Locations from '@/features/locations/views/Locations'

export const Route = createFileRoute('/_admin/admin/locations')({
  component: Locations,
})
