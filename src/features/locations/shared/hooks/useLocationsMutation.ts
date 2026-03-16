import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLocation, updateLocation, deleteLocation, uploadLocationLogo } from '../api/locations'
import type { CreateLocationCommand, UpdateLocationCommand } from '../types/ILocation'
import { LOCATIONS_QUERY_KEY } from './useLocationsQuery'

export function useCreateLocationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (command: CreateLocationCommand) => createLocation(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] })
    },
  })
}

export function useUpdateLocationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (command: UpdateLocationCommand) => updateLocation(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] })
    },
  })
}

export function useDeleteLocationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] })
    },
  })
}

export function useUploadLocationLogoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadLocationLogo(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] })
    },
  })
}
