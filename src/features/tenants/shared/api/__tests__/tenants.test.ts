import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api/backend', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '@/shared/api/backend'
import { getTenants, getTenantById, createTenant, updateTenant, deleteTenant } from '../tenants'

const mockedApi = vi.mocked(api)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getTenants', () => {
  it('calls GET /tenants with correct params', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { tenants: { data: [], count: 0 } } })

    await getTenants({ pageIndex: 0, pageSize: 10 })

    expect(mockedApi.get).toHaveBeenCalledWith('/tenants', {
      params: { pageIndex: 0, pageSize: 10 },
    })
  })

  it('calls GET /tenants with default params when none provided', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { tenants: { data: [], count: 0 } } })

    await getTenants()

    expect(mockedApi.get).toHaveBeenCalledWith('/tenants', { params: {} })
  })
})

describe('getTenantById', () => {
  it('calls GET /tenants/:id with the correct id', async () => {
    const id = '123e4567-e89b-12d3-a456-426614174000'
    mockedApi.get.mockResolvedValueOnce({ data: { tenant: { id } } })

    await getTenantById(id)

    expect(mockedApi.get).toHaveBeenCalledWith(`/tenants/${id}`)
  })
})

describe('createTenant', () => {
  it('calls POST /tenants with the correct payload', async () => {
    const command = { name: 'Acme Corp', slug: 'acme-corp', logoUrl: null, isActive: true }
    mockedApi.post.mockResolvedValueOnce({ data: { id: 'new-id' } })

    await createTenant(command)

    expect(mockedApi.post).toHaveBeenCalledWith('/tenants', command)
  })
})

describe('updateTenant', () => {
  it('calls PUT /tenants with the correct payload including id', async () => {
    const command = { id: 'existing-id', name: 'Updated Corp', slug: 'updated-corp', logoUrl: null, isActive: false }
    mockedApi.put.mockResolvedValueOnce({ data: { isSuccess: true } })

    await updateTenant(command)

    expect(mockedApi.put).toHaveBeenCalledWith('/tenants', command)
  })
})

describe('deleteTenant', () => {
  it('calls DELETE /tenants/:id with the correct id', async () => {
    const id = 'delete-id'
    mockedApi.delete.mockResolvedValueOnce({ data: { isSuccess: true } })

    await deleteTenant(id)

    expect(mockedApi.delete).toHaveBeenCalledWith(`/tenants/${id}`)
  })
})
