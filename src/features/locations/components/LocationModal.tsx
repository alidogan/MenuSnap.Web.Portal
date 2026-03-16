import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputSwitch } from 'primereact/inputswitch'
import { Dropdown } from 'primereact/dropdown'
import { useTranslation } from 'react-i18next'
import {
  LocationNameSchema,
  LocationSlugSchema,
  LocationTypeSchema,
  LOCATION_TYPES,
  type LocationDto,
  type LocationFormValues,
} from '../shared/types/ILocation'
import { MenusnapDialogActions } from '@/shared/components/Dialog'
import { useCloseLastModal } from '@/shared/hooks/useModals'

interface LocationModalProps {
  onSubmit: (values: LocationFormValues, logoFile: File | null) => Promise<void>
  initialValues?: LocationDto
  isSubmitting?: boolean
  onCancel?: () => void
}

function getErrorMessage(error: unknown): string | null {
  if (!error) return null
  if (typeof error === 'string') return error
  if (typeof error === 'object' && error !== null && 'message' in error)
    return (error as { message: string }).message
  return null
}

export default function LocationModal({
  onSubmit,
  initialValues,
  isSubmitting = false,
  onCancel,
}: LocationModalProps) {
  const { t } = useTranslation()
  const contextClose = useCloseLastModal()
  const close = onCancel ?? contextClose

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const locationTypeOptions = LOCATION_TYPES.map((type) => ({
    label: t(`locations.types.${type}`, type),
    value: type,
  }))

  const form = useForm({
    defaultValues: {
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
      type: (initialValues?.type ?? 'Restaurant') as LocationFormValues['type'],
      address: initialValues?.address ?? '',
      phone: initialValues?.phone ?? '',
      description: initialValues?.description ?? '',
      isActive: initialValues?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(
        {
          name: value.name,
          slug: value.slug,
          type: value.type,
          address: value.address || undefined,
          phone: value.phone || undefined,
          description: value.description || undefined,
          isActive: value.isActive,
        },
        logoFile
      )
    },
  })

  return (
    <form
      className="flex flex-col gap-4 pt-2"
      style={{ width: '440px' }}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        validators={{ onChange: LocationNameSchema, onSubmit: LocationNameSchema }}
      >
        {(field) => {
          const error = getErrorMessage(field.state.meta.errors[0])
          const showError = field.state.meta.isTouched && error
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor="location-name" className="font-medium text-sm">
                {t('locations.name')} *
              </label>
              <InputText
                id="location-name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={showError ? 'p-invalid' : ''}
                placeholder={t('locations.name')}
                data-testid="location-name-input"
              />
              {showError && (
                <small className="p-error" role="alert" data-testid="name-error">
                  {t(error)}
                </small>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field
        name="slug"
        validators={{ onChange: LocationSlugSchema, onSubmit: LocationSlugSchema }}
      >
        {(field) => {
          const error = getErrorMessage(field.state.meta.errors[0])
          const showError = field.state.meta.isTouched && error
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor="location-slug" className="font-medium text-sm">
                {t('locations.slug')} *
              </label>
              <InputText
                id="location-slug"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={showError ? 'p-invalid' : ''}
                placeholder="bijv. mijn-restaurant"
                data-testid="location-slug-input"
              />
              {showError && (
                <small className="p-error" role="alert" data-testid="slug-error">
                  {t(error)}
                </small>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field
        name="type"
        validators={{ onChange: LocationTypeSchema, onSubmit: LocationTypeSchema }}
      >
        {(field) => {
          const error = getErrorMessage(field.state.meta.errors[0])
          const showError = field.state.meta.isTouched && error
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor="location-type" className="font-medium text-sm">
                {t('locations.type')} *
              </label>
              <Dropdown
                inputId="location-type"
                value={field.state.value}
                options={locationTypeOptions}
                onChange={(e) => field.handleChange(e.value)}
                onBlur={field.handleBlur}
                className={showError ? 'p-invalid' : ''}
                data-testid="location-type-dropdown"
              />
              {showError && (
                <small className="p-error" role="alert" data-testid="type-error">
                  {t(error)}
                </small>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="address">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="location-address" className="font-medium text-sm">
              {t('locations.address')}
            </label>
            <InputText
              id="location-address"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder={t('locations.address')}
              data-testid="location-address-input"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="phone">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="location-phone" className="font-medium text-sm">
              {t('locations.phone')}
            </label>
            <InputText
              id="location-phone"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="+31 6 12345678"
              data-testid="location-phone-input"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="location-description" className="font-medium text-sm">
              {t('locations.description')}
            </label>
            <InputTextarea
              id="location-description"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              rows={3}
              placeholder={t('locations.description')}
              data-testid="location-description-input"
            />
          </div>
        )}
      </form.Field>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-sm">{t('locations.logo')}</label>
        <div className="flex items-center gap-3">
          {(logoFile || initialValues?.logoUrl) && (
            <img
              src={logoFile ? URL.createObjectURL(logoFile) : initialValues!.logoUrl!}
              alt="logo preview"
              style={{ height: '40px', objectFit: 'contain', borderRadius: '4px' }}
              data-testid="logo-preview"
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            data-testid="logo-file-input"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setLogoFile(file)
            }}
          />
          <button
            type="button"
            className="p-button p-component p-button-outlined p-button-sm"
            onClick={() => fileInputRef.current?.click()}
            data-testid="logo-upload-button"
          >
            <i className="pi pi-upload mr-2" />
            {t('locations.uploadLogo')}
          </button>
          {logoFile && (
            <span className="text-sm text-gray-600" data-testid="logo-filename">
              {logoFile.name}
            </span>
          )}
        </div>
      </div>

      <form.Field name="isActive">
        {(field) => (
          <div className="flex items-center gap-3">
            <label htmlFor="location-isactive" className="font-medium text-sm">
              {t('locations.isActive')}
            </label>
            <InputSwitch
              inputId="location-isactive"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.value)}
              data-testid="location-isactive-toggle"
            />
          </div>
        )}
      </form.Field>

      <MenusnapDialogActions
        submitType="submit"
        onCancel={close}
        loading={isSubmitting}
        submitLabel={t('locations.save')}
        cancelLabel={t('locations.cancel')}
        submitDataTestId="save-location-button"
      />
    </form>
  )
}
