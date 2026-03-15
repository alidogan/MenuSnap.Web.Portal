import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTenant, updateTenant, deleteTenant } from '../api/tenants'
import type { CreateTenantCommand, UpdateTenantCommand } from '../types/ITenant'
import { TENANTS_QUERY_KEY } from './useTenantsQuery'

export function useCreateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (command: CreateTenantCommand) => createTenant(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TENANTS_QUERY_KEY] })
    },
  })
}

export function useUpdateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (command: UpdateTenantCommand) => updateTenant(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TENANTS_QUERY_KEY] })
    },
  })
}

export function useDeleteTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TENANTS_QUERY_KEY] })
    },
  })
}
