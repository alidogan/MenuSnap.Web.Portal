import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/core/i18n/i18n'
import LocationModal from '../LocationModal'
import type { LocationDto } from '../../shared/types/ILocation'

function renderModal(props: Partial<Parameters<typeof LocationModal>[0]> = {}) {
  const onCancel = props.onCancel ?? vi.fn()
  const onSubmit = props.onSubmit ?? vi.fn()
  return {
    onCancel,
    onSubmit,
    ...render(
      <I18nextProvider i18n={i18n}>
        <LocationModal onSubmit={onSubmit} onCancel={onCancel} {...props} />
      </I18nextProvider>
    ),
  }
}

describe('LocationModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty form in create mode', () => {
    renderModal()
    expect(screen.getByTestId('location-name-input')).toHaveValue('')
    expect(screen.getByTestId('location-slug-input')).toHaveValue('')
    expect(screen.getByTestId('location-address-input')).toHaveValue('')
  })

  it('pre-fills existing location data in edit mode', () => {
    const existing: LocationDto = {
      id: '1',
      tenantId: 'tenant-1',
      name: 'Grand Hotel',
      slug: 'grand-hotel',
      type: 'Hotel',
      address: 'Hoofdstraat 1',
      phone: '+31 20 1234567',
      description: 'A fine hotel',
      logoUrl: null,
      isActive: true,
    }
    renderModal({ initialValues: existing })

    expect(screen.getByTestId('location-name-input')).toHaveValue('Grand Hotel')
    expect(screen.getByTestId('location-slug-input')).toHaveValue('grand-hotel')
    expect(screen.getByTestId('location-address-input')).toHaveValue('Hoofdstraat 1')
    expect(screen.getByTestId('location-phone-input')).toHaveValue('+31 20 1234567')
  })

  it('shows name validation error after typing then clearing', async () => {
    renderModal()

    await userEvent.type(screen.getByTestId('location-name-input'), 'a')
    await userEvent.clear(screen.getByTestId('location-name-input'))

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument()
    })
  })

  it('shows slug validation error after typing then clearing', async () => {
    renderModal()

    await userEvent.type(screen.getByTestId('location-slug-input'), 'a')
    await userEvent.clear(screen.getByTestId('location-slug-input'))

    await waitFor(() => {
      expect(screen.getByTestId('slug-error')).toBeInTheDocument()
    })
  })

  it('shows slug format error for invalid slug', async () => {
    renderModal()

    await userEvent.type(screen.getByTestId('location-slug-input'), 'Invalid Slug!')

    await waitFor(() => {
      expect(screen.getByTestId('slug-error')).toBeInTheDocument()
    })
  })

  it('shows validation errors on submit with empty required name field', async () => {
    const onSubmit = vi.fn()
    renderModal({ onSubmit })

    fireEvent.click(screen.getByTestId('save-location-button'))

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with correct data when form is valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderModal({ onSubmit })

    await userEvent.type(screen.getByTestId('location-name-input'), 'Grand Hotel')
    await userEvent.type(screen.getByTestId('location-slug-input'), 'grand-hotel')
    fireEvent.click(screen.getByTestId('save-location-button'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Grand Hotel',
          slug: 'grand-hotel',
          type: 'Restaurant',
          isActive: true,
        }),
        null
      )
    })
  })

  it('passes logoFile to onSubmit when a file is selected', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderModal({ onSubmit })

    await userEvent.type(screen.getByTestId('location-name-input'), 'Grand Hotel')
    await userEvent.type(screen.getByTestId('location-slug-input'), 'grand-hotel')

    const file = new File(['logo content'], 'logo.png', { type: 'image/png' })
    const fileInput = screen.getByTestId('logo-file-input')
    await userEvent.upload(fileInput, file)

    expect(screen.getByTestId('logo-filename')).toHaveTextContent('logo.png')

    fireEvent.click(screen.getByTestId('save-location-button'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Grand Hotel' }),
        file
      )
    })
  })

  it('shows logo preview when editing a location with a logoUrl', () => {
    const existing: LocationDto = {
      id: '1',
      tenantId: 'tenant-1',
      name: 'Grand Hotel',
      slug: 'grand-hotel',
      type: 'Hotel',
      address: null,
      phone: null,
      description: null,
      logoUrl: 'https://cdn.example.com/logo.png',
      isActive: true,
    }
    renderModal({ initialValues: existing })

    const preview = screen.getByTestId('logo-preview')
    expect(preview).toHaveAttribute('src', 'https://cdn.example.com/logo.png')
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    renderModal({ onCancel })

    fireEvent.click(screen.getByText('Annuleren'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('clears name error after typing a valid value', async () => {
    renderModal()

    await userEvent.type(screen.getByTestId('location-name-input'), 'a')
    await userEvent.clear(screen.getByTestId('location-name-input'))
    await waitFor(() => expect(screen.getByTestId('name-error')).toBeInTheDocument())

    await userEvent.type(screen.getByTestId('location-name-input'), 'Grand Hotel')
    await waitFor(() => expect(screen.queryByTestId('name-error')).not.toBeInTheDocument())
  })
})
