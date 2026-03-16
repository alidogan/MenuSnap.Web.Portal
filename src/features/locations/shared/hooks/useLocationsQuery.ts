import { useQuery } from '@tanstack/react-query'
import { getLocations } from '../api/locations'
import type { LocationDto } from '../types/ILocation'

export const LOCATIONS_QUERY_KEY = 'locations'

export function useLocationsQuery(tenantId: string | null) {
  const query = useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, tenantId],
    queryFn: () => getLocations(tenantId!),
    enabled: !!tenantId,
  })

  const locations: LocationDto[] = query.data?.data.locations ?? []

  return { locations, isLoading: query.isLoading, error: query.error }
}
