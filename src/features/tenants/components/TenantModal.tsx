import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { useTranslation } from 'react-i18next'
import { TenantSchema, type TenantDto, type TenantFormValues } from '../shared/types/ITenant'
import { MenusnapDialogActions } from '@/shared/components/Dialog'
import { useCloseLastModal } from '@/shared/hooks/useModals'

interface TenantModalProps {
  onSubmit: (values: TenantFormValues) => Promise<void>
  initialValues?: TenantDto
  isSubmitting?: boolean
  onCancel?: () => void
}

interface FormErrors {
  name?: string
  slug?: string
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

  const [name, setName] = useState(initialValues?.name ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [logoUrl, setLogoUrl] = useState(initialValues?.logoUrl ?? '')
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = (values: { name: string; slug: string; logoUrl: string; isActive: boolean }): FormErrors => {
    const result = TenantSchema.safeParse(values)
    if (result.success) return {}
    const fieldErrors: FormErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FormErrors
      if (!fieldErrors[field]) fieldErrors[field] = t(issue.message)
    }
    return fieldErrors
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate({ name, slug, logoUrl, isActive }))
  }

  const handleSubmit = async () => {
    setTouched({ name: true, slug: true })
    const fieldErrors = validate({ name, slug, logoUrl, isActive })
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return
    await onSubmit({ name, slug, logoUrl: logoUrl === '' ? null : logoUrl, isActive })
  }

  return (
    <div className="flex flex-col gap-4 pt-2" style={{ width: '440px' }}>
      <div className="flex flex-col gap-1">
        <label htmlFor="tenant-name" className="font-medium text-sm">
          {t('tenants.name')} *
        </label>
        <InputText
          id="tenant-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur('name')}
          className={touched.name && errors.name ? 'p-invalid' : ''}
          placeholder={t('tenants.name')}
          data-testid="tenant-name-input"
        />
        {touched.name && errors.name && (
          <small className="p-error" role="alert" data-testid="name-error">
            {errors.name}
          </small>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tenant-slug" className="font-medium text-sm">
          {t('tenants.slug')} *
        </label>
        <InputText
          id="tenant-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onBlur={() => handleBlur('slug')}
          className={touched.slug && errors.slug ? 'p-invalid' : ''}
          placeholder="bijv. acme-corp"
          data-testid="tenant-slug-input"
        />
        {touched.slug && errors.slug && (
          <small className="p-error" role="alert" data-testid="slug-error">
            {errors.slug}
          </small>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tenant-logo" className="font-medium text-sm">
          {t('tenants.logoUrl')}
        </label>
        <InputText
          id="tenant-logo"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://..."
          data-testid="tenant-logourl-input"
        />
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="tenant-isactive" className="font-medium text-sm">
          {t('tenants.isActive')}
        </label>
        <InputSwitch
          inputId="tenant-isactive"
          checked={isActive}
          onChange={(e) => setIsActive(e.value)}
          data-testid="tenant-isactive-toggle"
        />
      </div>

      <MenusnapDialogActions
        onSubmit={handleSubmit}
        onCancel={close}
        loading={isSubmitting}
        submitLabel={t('tenants.save')}
        cancelLabel={t('tenants.cancel')}
      />
    </div>
  )
}
