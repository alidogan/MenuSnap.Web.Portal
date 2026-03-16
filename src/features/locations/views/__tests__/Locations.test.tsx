import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/core/i18n/i18n'
import { QueryWrapper } from '@/test/QueryWrapper'
import { DialogProvider } from '@/shared/components/Dialog'
import Locations from '../Locations'
import type { LocationDto } from '../../shared/types/ILocation'
import type { TenantDto } from '@/features/tenants/shared/types/ITenant'

const TENANT_ID = 'tenant-uuid-1'

vi.mock('@/features/tenants/shared/api/tenants', () => ({
  getTenants: vi.fn().mockResolvedValue({
    data: {
      tenants: {
        data: [
          { id: 'tenant-uuid-1', name: 'Acme Corp', slug: 'acme-corp', logoUrl: null, isActive: true },
        ] as TenantDto[],
        count: 1,
        pageIndex: 0,
        pageSize: 100,
      },
    },
  }),
}))

vi.mock('../../shared/api/locations', () => ({
  getLocations: vi.fn().mockResolvedValue({
    data: {
      locations: [
        {
          id: 'loc-1',
          tenantId: 'tenant-uuid-1',
          name: 'Grand Hotel',
          slug: 'grand-hotel',
          type: 'Hotel',
          address: 'Hoofdstraat 1',
          phone: null,
          description: null,
          logoUrl: null,
          isActive: true,
        },
        {
          id: 'loc-2',
          tenantId: 'tenant-uuid-1',
          name: 'Beach Resort',
          slug: 'beach-resort',
          type: 'Resort',
          address: null,
          phone: null,
          description: null,
          logoUrl: null,
          isActive: false,
        },
      ] as LocationDto[],
    },
  }),
  createLocation: vi.fn().mockResolvedValue({ data: { id: 'new-loc-id' } }),
  updateLocation: vi.fn().mockResolvedValue({ data: undefined }),
  deleteLocation: vi.fn().mockResolvedValue({ data: undefined }),
  uploadLocationLogo: vi.fn().mockResolvedValue({ data: { logoUrl: 'https://cdn.example.com/logo.png' } }),
}))

function renderLocations() {
  return render(
    <QueryWrapper>
      <I18nextProvider i18n={i18n}>
        <DialogProvider>
          <Locations />
        </DialogProvider>
      </I18nextProvider>
    </QueryWrapper>
  )
}

describe('Locations view', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the New button (disabled without tenant selected)', () => {
    renderLocations()
    const btn = screen.getByTestId('new-location-button')
    expect(btn).toBeInTheDocument()
  })

  it('renders the tenant selector dropdown', () => {
    renderLocations()
    expect(screen.getByTestId('tenant-selector')).toBeInTheDocument()
  })

  it('renders location rows after selecting a tenant', async () => {
    renderLocations()

    const tenantSelector = screen.getByTestId('tenant-selector')
    fireEvent.click(tenantSelector)

    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Acme Corp'))

    await waitFor(() => {
      expect(screen.getByText('Grand Hotel')).toBeInTheDocument()
      expect(screen.getByText('Beach Resort')).toBeInTheDocument()
    })
  })

  it('clicking New button opens LocationModal when tenant is selected', async () => {
    renderLocations()

    const tenantSelector = screen.getByTestId('tenant-selector')
    fireEvent.click(tenantSelector)
    await waitFor(() => screen.getByText('Acme Corp'))
    fireEvent.click(screen.getByText('Acme Corp'))

    await waitFor(() => {
      const newBtn = screen.getByTestId('new-location-button')
      const btn = newBtn.querySelector('button') ?? newBtn
      fireEvent.click(btn)
    })

    await waitFor(() => {
      expect(screen.getByTestId('location-name-input')).toBeInTheDocument()
    })
  })
})
