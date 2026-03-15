import { useQuery } from '@tanstack/react-query'
import { getTenants, type GetTenantsParams } from '../api/tenants'
import type { TenantDto } from '../types/ITenant'

export const TENANTS_QUERY_KEY = 'tenants'

export function useTenantsQuery(params: GetTenantsParams = {}) {
  const query = useQuery({
    queryKey: [TENANTS_QUERY_KEY, params],
    queryFn: () => getTenants(params),
  })

  const tenants: TenantDto[] = query.data?.data.tenants.data ?? []
  const totalCount = query.data?.data.tenants.count ?? 0

  return { tenants, totalCount, isLoading: query.isLoading, error: query.error }
}
