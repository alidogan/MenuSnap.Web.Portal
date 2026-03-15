import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/core/i18n/i18n'
import TenantModal from '../TenantModal'
import type { TenantDto } from '../../shared/types/ITenant'

function renderModal(props: Partial<Parameters<typeof TenantModal>[0]> = {}) {
  const onHide = vi.fn()
  const onSubmit = vi.fn()
  return render(
    <I18nextProvider i18n={i18n}>
      <TenantModal
        visible={true}
        onHide={onHide}
        onSubmit={onSubmit}
        {...props}
      />
    </I18nextProvider>
  )
}

describe('TenantModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty form in create mode', () => {
    renderModal()
    expect(screen.getByTestId('tenant-name-input')).toHaveValue('')
    expect(screen.getByTestId('tenant-slug-input')).toHaveValue('')
    expect(screen.getByTestId('tenant-logourl-input')).toHaveValue('')
  })

  it('pre-fills existing tenant data in edit mode', () => {
    const existing: TenantDto = {
      id: '1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      logoUrl: 'https://logo.com',
      isActive: true,
    }
    renderModal({ initialValues: existing })

    expect(screen.getByTestId('tenant-name-input')).toHaveValue('Acme Corp')
    expect(screen.getByTestId('tenant-slug-input')).toHaveValue('acme-corp')
    expect(screen.getByTestId('tenant-logourl-input')).toHaveValue('https://logo.com')
  })

  it('shows validation error when Name is empty on submit', async () => {
    const onSubmit = vi.fn()
    renderModal({ onSubmit })

    fireEvent.click(screen.getByTestId('save-tenant-button').querySelector('button')!)

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when Slug is empty on submit', async () => {
    const onSubmit = vi.fn()
    renderModal({ onSubmit })

    await userEvent.type(screen.getByTestId('tenant-name-input'), 'Acme Corp')
    fireEvent.click(screen.getByTestId('save-tenant-button').querySelector('button')!)

    await waitFor(() => {
      expect(screen.getByTestId('slug-error')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with correct data when form is valid', async () => {
    const onSubmit = vi.fn()
    renderModal({ onSubmit })

    await userEvent.type(screen.getByTestId('tenant-name-input'), 'Acme Corp')
    await userEvent.type(screen.getByTestId('tenant-slug-input'), 'acme-corp')
    fireEvent.click(screen.getByTestId('save-tenant-button').querySelector('button')!)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Acme Corp',
        slug: 'acme-corp',
        logoUrl: null,
        isActive: true,
      })
    })
  })

  it('calls onHide when cancel button is clicked', () => {
    const onHide = vi.fn()
    renderModal({ onHide })

    fireEvent.click(screen.getByText('Annuleren'))
    expect(onHide).toHaveBeenCalled()
  })

  it('shows create title in create mode', () => {
    renderModal()
    expect(screen.getByText('Tenant aanmaken')).toBeInTheDocument()
  })

  it('shows edit title in edit mode', () => {
    const existing: TenantDto = {
      id: '1', name: 'X', slug: 'x', logoUrl: null, isActive: true,
    }
    renderModal({ initialValues: existing })
    expect(screen.getByText('Tenant bewerken')).toBeInTheDocument()
  })
})
