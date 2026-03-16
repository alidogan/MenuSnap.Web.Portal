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
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  uploadLocationLogo,
} from '../locations'

const mockedApi = vi.mocked(api)

const TENANT_ID = 'tenant-uuid-1'
const LOCATION_ID = 'location-uuid-1'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getLocations', () => {
  it('calls GET /locations with tenantId param', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { locations: [] } })

    await getLocations(TENANT_ID)

    expect(mockedApi.get).toHaveBeenCalledWith('/locations', {
      params: { tenantId: TENANT_ID },
    })
  })
})

describe('createLocation', () => {
  it('calls POST /locations with the correct payload', async () => {
    const command = {
      tenantId: TENANT_ID,
      name: 'Grand Hotel',
      slug: 'grand-hotel',
      type: 'Hotel',
      address: 'Hoofdstraat 1',
      phone: null,
      description: null,
      isActive: true,
    }
    mockedApi.post.mockResolvedValueOnce({ data: { id: LOCATION_ID } })

    await createLocation(command)

    expect(mockedApi.post).toHaveBeenCalledWith('/locations', command)
  })
})

describe('updateLocation', () => {
  it('calls PUT /locations/:id with the body excluding id', async () => {
    const command = {
      id: LOCATION_ID,
      name: 'Updated Hotel',
      slug: 'updated-hotel',
      type: 'Resort',
      address: null,
      phone: null,
      description: null,
      isActive: false,
    }
    mockedApi.put.mockResolvedValueOnce({ data: undefined })

    await updateLocation(command)

    expect(mockedApi.put).toHaveBeenCalledWith(
      `/locations/${LOCATION_ID}`,
      {
        name: command.name,
        slug: command.slug,
        type: command.type,
        address: command.address,
        phone: command.phone,
        description: command.description,
        isActive: command.isActive,
      }
    )
  })
})

describe('deleteLocation', () => {
  it('calls DELETE /locations/:id', async () => {
    mockedApi.delete.mockResolvedValueOnce({ data: undefined })

    await deleteLocation(LOCATION_ID)

    expect(mockedApi.delete).toHaveBeenCalledWith(`/locations/${LOCATION_ID}`)
  })
})

describe('uploadLocationLogo', () => {
  it('calls PUT /locations/:id/logo with FormData and multipart header', async () => {
    const file = new File(['content'], 'logo.png', { type: 'image/png' })
    mockedApi.put.mockResolvedValueOnce({ data: { logoUrl: 'https://cdn.example.com/logo.png' } })

    await uploadLocationLogo(LOCATION_ID, file)

    expect(mockedApi.put).toHaveBeenCalledWith(
      `/locations/${LOCATION_ID}/logo`,
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  })
})
