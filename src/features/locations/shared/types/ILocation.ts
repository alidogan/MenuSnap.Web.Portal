import { z } from 'zod'

export const LOCATION_TYPES = [
  'Restaurant',
  'Hotel',
  'BungalowPark',
  'Resort',
  'Camping',
  'Online',
  'Kiosk',
] as const

export type LocationType = (typeof LOCATION_TYPES)[number]

export interface LocationDto {
  id: string
  tenantId: string
  name: string
  slug: string
  type: string
  address: string | null
  phone: string | null
  description: string | null
  logoUrl: string | null
  isActive: boolean
}

export interface GetLocationsResponse {
  locations: LocationDto[]
}

export interface CreateLocationResponse {
  id: string
}

export interface UploadLogoResponse {
  logoUrl: string
}

export const LocationNameSchema = z.string().min(1, 'locations.validation.nameRequired')

export const LocationSlugSchema = z
  .string()
  .min(1, 'locations.validation.slugRequired')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'locations.validation.slugFormat')

export const LocationTypeSchema = z
  .string()
  .refine(
    (val): val is LocationType => LOCATION_TYPES.includes(val as LocationType),
    { message: 'locations.validation.typeRequired' }
  )

export const LocationPhoneSchema = z
  .string()
  .refine(
    (v) => v === '' || /^[+\d\s\-()]{0,20}$/.test(v),
    'locations.validation.phoneFormat'
  )
  .optional()

export const LocationSchema = z.object({
  name: LocationNameSchema,
  slug: LocationSlugSchema,
  type: LocationTypeSchema,
  address: z.string().optional(),
  phone: LocationPhoneSchema,
  description: z.string().optional(),
  isActive: z.boolean(),
})

export type LocationFormValues = z.infer<typeof LocationSchema>

export interface CreateLocationCommand {
  tenantId: string
  name: string
  slug: string
  type: string
  address: string | null
  phone: string | null
  description: string | null
  isActive: boolean
}

export interface UpdateLocationCommand {
  id: string
  name: string
  slug: string
  type: string
  address: string | null
  phone: string | null
  description: string | null
  isActive: boolean
}
