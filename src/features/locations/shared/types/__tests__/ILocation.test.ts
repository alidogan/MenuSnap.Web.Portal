import { describe, it, expect } from 'vitest'
import { LocationSchema } from '../ILocation'

describe('LocationSchema', () => {
  const validBase = {
    name: 'Grand Hotel',
    slug: 'grand-hotel',
    type: 'Hotel' as const,
    isActive: true,
  }

  it('passes validation with required fields only', () => {
    const result = LocationSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })

  it('passes validation with all fields provided', () => {
    const result = LocationSchema.safeParse({
      ...validBase,
      address: 'Hoofdstraat 1, Amsterdam',
      phone: '+31 20 1234567',
      description: 'A fine hotel',
    })
    expect(result.success).toBe(true)
  })

  it('passes validation with isActive set to false', () => {
    const result = LocationSchema.safeParse({ ...validBase, isActive: false })
    expect(result.success).toBe(true)
  })

  it('fails when name is empty', () => {
    const result = LocationSchema.safeParse({ ...validBase, name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('name'))
      expect(issue).toBeDefined()
      expect(issue?.message).toBe('locations.validation.nameRequired')
    }
  })

  it('fails when slug is empty', () => {
    const result = LocationSchema.safeParse({ ...validBase, slug: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('slug'))
      expect(issue).toBeDefined()
      expect(issue?.message).toBe('locations.validation.slugRequired')
    }
  })

  it('fails when slug contains uppercase letters', () => {
    const result = LocationSchema.safeParse({ ...validBase, slug: 'Grand-Hotel' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('slug'))
      expect(issue?.message).toBe('locations.validation.slugFormat')
    }
  })

  it('fails when slug contains spaces', () => {
    const result = LocationSchema.safeParse({ ...validBase, slug: 'grand hotel' })
    expect(result.success).toBe(false)
  })

  it('passes with valid slug using multiple hyphens', () => {
    const result = LocationSchema.safeParse({ ...validBase, slug: 'grand-hotel-amsterdam' })
    expect(result.success).toBe(true)
  })

  it('fails when type is an invalid value', () => {
    const result = LocationSchema.safeParse({ ...validBase, type: 'InvalidType' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('type'))
      expect(issue?.message).toBe('locations.validation.typeRequired')
    }
  })

  it('passes for each valid LocationType', () => {
    const validTypes = ['Restaurant', 'Hotel', 'BungalowPark', 'Resort', 'Camping', 'Online', 'Kiosk']
    for (const type of validTypes) {
      const result = LocationSchema.safeParse({ ...validBase, type })
      expect(result.success, `Expected ${type} to be valid`).toBe(true)
    }
  })

  it('passes when phone is an empty string', () => {
    const result = LocationSchema.safeParse({ ...validBase, phone: '' })
    expect(result.success).toBe(true)
  })
})
