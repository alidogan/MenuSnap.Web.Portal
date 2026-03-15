import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/core/i18n/i18n'
import TenantModal from '../TenantModal'
import type { TenantDto } from '../../shared/types/ITenant'

function renderModal(props: Partial<Parameters<typeof TenantModal>[0]> = {}) {
  const onCancel = props.onCancel ?? vi.fn()
  const onSubmit = props.onSubmit ?? vi.fn()
  return {
    onCancel,
    onSubmit,
    ...render(
      <I18nextProvider i18n={i18n}>
        <TenantModal onSubmit={onSubmit} onCancel={onCancel} {...props} />
      </I18nextProvider>
    ),
  }
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

    fireEvent.click(screen.getByText('Opslaan'))

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when Slug is empty on submit', async () => {
    const onSubmit = vi.fn()
    renderModal({ onSubmit })

    await userEvent.type(screen.getByTestId('tenant-name-input'), 'Acme Corp')
    fireEvent.click(screen.getByText('Opslaan'))

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
    fireEvent.click(screen.getByText('Opslaan'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Acme Corp',
        slug: 'acme-corp',
        logoUrl: null,
        isActive: true,
      })
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    renderModal({ onCancel })

    fireEvent.click(screen.getByText('Annuleren'))
    expect(onCancel).toHaveBeenCalled()
  })
})
