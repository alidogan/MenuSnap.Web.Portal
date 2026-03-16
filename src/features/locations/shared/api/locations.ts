import api from '@/shared/api/backend'
import type {
  CreateLocationCommand,
  CreateLocationResponse,
  GetLocationsResponse,
  UpdateLocationCommand,
  UploadLogoResponse,
} from '../types/ILocation'

export const getLocations = (tenantId: string) =>
  api.get<GetLocationsResponse>('/locations', { params: { tenantId } })

export const createLocation = (command: CreateLocationCommand) =>
  api.post<CreateLocationResponse>('/locations', command)

export const updateLocation = (command: UpdateLocationCommand) =>
  api.put<void>(`/locations/${command.id}`, {
    name: command.name,
    slug: command.slug,
    type: command.type,
    address: command.address,
    phone: command.phone,
    description: command.description,
    isActive: command.isActive,
  })

export const deleteLocation = (id: string) =>
  api.delete<void>(`/locations/${id}`)

export const uploadLocationLogo = (id: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.put<UploadLogoResponse>(`/locations/${id}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
