import api from '@/shared/api/backend'
import type {
  CreateTenantCommand,
  CreateTenantResponse,
  DeleteTenantResponse,
  GetTenantByIdResponse,
  GetTenantsResponse,
  UpdateTenantCommand,
  UpdateTenantResponse,
} from '../types/ITenant'

export interface GetTenantsParams {
  pageIndex?: number
  pageSize?: number
}

export const getTenants = (params: GetTenantsParams = {}) =>
  api.get<GetTenantsResponse>('/tenants', { params })

export const getTenantById = (id: string) =>
  api.get<GetTenantByIdResponse>(`/tenants/${id}`)

export const createTenant = (command: CreateTenantCommand) =>
  api.post<CreateTenantResponse>('/tenants', command)

export const updateTenant = (command: UpdateTenantCommand) =>
  api.put<UpdateTenantResponse>('/tenants', command)

export const deleteTenant = (id: string) =>
  api.delete<DeleteTenantResponse>(`/tenants/${id}`)
