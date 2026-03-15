import { useForm } from '@tanstack/react-form'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { useTranslation } from 'react-i18next'
import {
  TenantNameSchema,
  TenantSlugSchema,
  TenantLogoUrlSchema,
  type TenantDto,
  type TenantFormValues,
} from '../shared/types/ITenant'
import { MenusnapDialogActions } from '@/shared/components/Dialog'
import { useCloseLastModal } from '@/shared/hooks/useModals'

interface TenantModalProps {
  onSubmit: (values: TenantFormValues) => Promise<void>
  initialValues?: TenantDto
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

export default function TenantModal({
  onSubmit,
  initialValues,
  isSubmitting = false,
  onCancel,
}: TenantModalProps) {
  const { t } = useTranslation()
  const contextClose = useCloseLastModal()
  const close = onCancel ?? contextClose

  const form = useForm({
    defaultValues: {
      name: initialValues?.name ?? '',
      slug: initialValues?.slug ?? '',
      logoUrl: initialValues?.logoUrl ?? '',
      isActive: initialValues?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        name: value.name,
        slug: value.slug,
        logoUrl: value.logoUrl === '' ? null : (value.logoUrl ?? null),
        isActive: value.isActive,
      })
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
        validators={{ onChange: TenantNameSchema, onSubmit: TenantNameSchema }}
      >
        {(field) => {
          const error = getErrorMessage(field.state.meta.errors[0])
          const showError = field.state.meta.isTouched && error
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor="tenant-name" className="font-medium text-sm">
                {t('tenants.name')} *
              </label>
              <InputText
                id="tenant-name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={showError ? 'p-invalid' : ''}
                placeholder={t('tenants.name')}
                data-testid="tenant-name-input"
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
        validators={{ onChange: TenantSlugSchema, onSubmit: TenantSlugSchema }}
      >
        {(field) => {
          const error = getErrorMessage(field.state.meta.errors[0])
          const showError = field.state.meta.isTouched && error
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor="tenant-slug" className="font-medium text-sm">
                {t('tenants.slug')} *
              </label>
              <InputText
                id="tenant-slug"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={showError ? 'p-invalid' : ''}
                placeholder="bijv. acme-corp"
                data-testid="tenant-slug-input"
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
        name="logoUrl"
        validators={{ onBlur: TenantLogoUrlSchema }}
      >
        {(field) => {
          const error = getErrorMessage(field.state.meta.errors[0])
          const showError = field.state.meta.isBlurred && error
          return (
            <div className="flex flex-col gap-1">
              <label htmlFor="tenant-logo" className="font-medium text-sm">
                {t('tenants.logoUrl')}
              </label>
              <InputText
                id="tenant-logo"
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={showError ? 'p-invalid' : ''}
                placeholder="https://..."
                data-testid="tenant-logourl-input"
              />
              {showError && (
                <small className="p-error" role="alert">
                  {t(error)}
                </small>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="isActive">
        {(field) => (
          <div className="flex items-center gap-3">
            <label htmlFor="tenant-isactive" className="font-medium text-sm">
              {t('tenants.isActive')}
            </label>
            <InputSwitch
              inputId="tenant-isactive"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.value)}
              data-testid="tenant-isactive-toggle"
            />
          </div>
        )}
      </form.Field>

      <MenusnapDialogActions
        submitType="submit"
        onCancel={close}
        loading={isSubmitting}
        submitLabel={t('tenants.save')}
        cancelLabel={t('tenants.cancel')}
        submitDataTestId="save-tenant-button"
      />
    </form>
  )
}
