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

export const TenantNameSchema = z.string().min(1, 'tenants.validation.nameRequired')

export const TenantSlugSchema = z
  .string()
  .min(1, 'tenants.validation.slugRequired')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'tenants.validation.slugFormat')

export const TenantLogoUrlSchema = z
  .string()
  .refine((v) => v === '' || z.url().safeParse(v).success, 'tenants.validation.logoUrlFormat')
  .nullable()
  .optional()

export const TenantSchema = z.object({
  name: TenantNameSchema,
  slug: TenantSlugSchema,
  logoUrl: TenantLogoUrlSchema,
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
