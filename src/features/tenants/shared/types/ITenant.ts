import { z } from 'zod'

export interface TenantDto {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  isActive: boolean
}

export interface PaginatedResult<T> {
  pageIndex: number
  pageSize: number
  count: number
  data: T[]
}

export interface GetTenantsResponse {
  tenants: PaginatedResult<TenantDto>
}

export interface GetTenantByIdResponse {
  tenant: TenantDto
}

export interface CreateTenantResponse {
  id: string
}

export interface UpdateTenantResponse {
  isSuccess: boolean
}

export interface DeleteTenantResponse {
  isSuccess: boolean
}

export const TenantSchema = z.object({
  name: z.string().min(1, 'tenants.validation.nameRequired'),
  slug: z
    .string()
    .min(1, 'tenants.validation.slugRequired')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'tenants.validation.slugFormat'),
  logoUrl: z.string().url().nullable().or(z.literal('')).optional(),
  isActive: z.boolean(),
})

export type TenantFormValues = z.infer<typeof TenantSchema>

export interface CreateTenantCommand {
  name: string
  slug: string
  logoUrl: string | null
  isActive: boolean
}

export interface UpdateTenantCommand {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  isActive: boolean
}
