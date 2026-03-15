import { describe, it, expect } from 'vitest'
import { TenantSchema } from '../ITenant'

describe('TenantSchema', () => {
  it('passes validation with all valid fields', () => {
    const result = TenantSchema.safeParse({
      name: 'Acme Corp',
      slug: 'acme-corp',
      logoUrl: 'https://example.com/logo.png',
      isActive: true,
    })
    expect(result.success).toBe(true)
  })

  it('passes validation with null logoUrl', () => {
    const result = TenantSchema.safeParse({
      name: 'Acme Corp',
      slug: 'acme-corp',
      logoUrl: null,
      isActive: false,
    })
    expect(result.success).toBe(true)
  })

  it('passes validation with empty logoUrl string', () => {
    const result = TenantSchema.safeParse({
      name: 'Acme Corp',
      slug: 'acme-corp',
      logoUrl: '',
      isActive: true,
    })
    expect(result.success).toBe(true)
  })

  it('fails when name is empty', () => {
    const result = TenantSchema.safeParse({
      name: '',
      slug: 'acme-corp',
      isActive: true,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const nameIssue = result.error.issues.find((i) => i.path.includes('name'))
      expect(nameIssue).toBeDefined()
      expect(nameIssue?.message).toBe('tenants.validation.nameRequired')
    }
  })

  it('fails when slug is empty', () => {
    const result = TenantSchema.safeParse({
      name: 'Acme Corp',
      slug: '',
      isActive: true,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const slugIssue = result.error.issues.find((i) => i.path.includes('slug'))
      expect(slugIssue).toBeDefined()
      expect(slugIssue?.message).toBe('tenants.validation.slugRequired')
    }
  })

  it('fails when slug contains uppercase letters', () => {
    const result = TenantSchema.safeParse({
      name: 'Acme Corp',
      slug: 'Acme-Corp',
      isActive: true,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const slugIssue = result.error.issues.find((i) => i.path.includes('slug'))
      expect(slugIssue?.message).toBe('tenants.validation.slugFormat')
    }
  })

  it('fails when slug contains spaces', () => {
    const result = TenantSchema.safeParse({
      name: 'Acme Corp',
      slug: 'acme corp',
      isActive: true,
    })
    expect(result.success).toBe(false)
  })

  it('passes with valid slug using multiple hyphens', () => {
    const result = TenantSchema.safeParse({
      name: 'My Company',
      slug: 'my-company-nl',
      isActive: true,
    })
    expect(result.success).toBe(true)
  })
})
