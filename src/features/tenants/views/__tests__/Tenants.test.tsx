import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/core/i18n/i18n'
import { QueryWrapper } from '@/test/QueryWrapper'
import Tenants from '../Tenants'
import type { TenantDto } from '../../shared/types/ITenant'

vi.mock('../../shared/api/tenants', () => ({
  getTenants: vi.fn().mockResolvedValue({
    data: {
      tenants: {
        data: [
          { id: '1', name: 'Acme Corp', slug: 'acme-corp', logoUrl: null, isActive: true },
          { id: '2', name: 'Beta Corp', slug: 'beta-corp', logoUrl: null, isActive: false },
        ] as TenantDto[],
        count: 2,
        pageIndex: 0,
        pageSize: 10,
      },
    },
  }),
  createTenant: vi.fn().mockResolvedValue({ data: { id: 'new-id' } }),
  updateTenant: vi.fn().mockResolvedValue({ data: { isSuccess: true } }),
  deleteTenant: vi.fn().mockResolvedValue({ data: { isSuccess: true } }),
}))

function renderTenants() {
  return render(
    <QueryWrapper>
      <I18nextProvider i18n={i18n}>
        <Tenants />
      </I18nextProvider>
    </QueryWrapper>
  )
}

describe('Tenants view', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    renderTenants()
    expect(screen.getByText('Tenants')).toBeInTheDocument()
  })

  it('renders the New button', () => {
    renderTenants()
    expect(screen.getByTestId('new-tenant-button')).toBeInTheDocument()
  })

  it('renders tenant rows after loading', async () => {
    renderTenants()
    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
      expect(screen.getByText('Beta Corp')).toBeInTheDocument()
    })
  })

  it('clicking New button opens TenantModal', async () => {
    renderTenants()
    const newBtn = screen.getByTestId('new-tenant-button')
    fireEvent.click(newBtn.querySelector('button') ?? newBtn)
    await waitFor(() => {
      expect(screen.getByText('Tenant aanmaken')).toBeInTheDocument()
    })
  })

  it('renders the search input', () => {
    renderTenants()
    expect(screen.getByPlaceholderText('Zoeken...')).toBeInTheDocument()
  })
})
