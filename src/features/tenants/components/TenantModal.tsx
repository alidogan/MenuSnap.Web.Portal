import React, { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { TenantSchema, type TenantDto, type TenantFormValues } from '../shared/types/ITenant'

interface TenantModalProps {
  visible: boolean
  onHide: () => void
  onSubmit: (values: TenantFormValues) => void | Promise<void>
  initialValues?: TenantDto
  isSubmitting?: boolean
}

interface FormErrors {
  name?: string
  slug?: string
}

export default function TenantModal({
  visible,
  onHide,
  onSubmit,
  initialValues,
  isSubmitting = false,
}: TenantModalProps) {
  const { t } = useTranslation()
  const isEdit = !!initialValues

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (visible) {
      setName(initialValues?.name ?? '')
      setSlug(initialValues?.slug ?? '')
      setLogoUrl(initialValues?.logoUrl ?? '')
      setIsActive(initialValues?.isActive ?? true)
      setErrors({})
      setTouched({})
    }
  }, [visible, initialValues])

  const validate = (values: { name: string; slug: string; logoUrl: string; isActive: boolean }): FormErrors => {
    const result = TenantSchema.safeParse(values)
    if (result.success) return {}
    const fieldErrors: FormErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FormErrors
      if (!fieldErrors[field]) {
        fieldErrors[field] = t(issue.message)
      }
    }
    return fieldErrors
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldErrors = validate({ name, slug, logoUrl, isActive })
    setErrors(fieldErrors)
  }

  const handleSubmit = async () => {
    const allTouched = { name: true, slug: true }
    setTouched(allTouched)
    const fieldErrors = validate({ name, slug, logoUrl, isActive })
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    await onSubmit({
      name,
      slug,
      logoUrl: logoUrl === '' ? null : logoUrl,
      isActive,
    })
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        label={t('tenants.cancel')}
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
        type="button"
        disabled={isSubmitting}
      />
      <span data-testid="save-tenant-button">
        <Button
          label={t('tenants.save')}
          icon="pi pi-check"
          loading={isSubmitting}
          onClick={handleSubmit}
          type="button"
        />
      </span>
    </div>
  )

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={isEdit ? t('tenants.editTitle') : t('tenants.createTitle')}
      footer={footer}
      style={{ width: '480px' }}
      modal
    >
      <div className="flex flex-col gap-4 pt-2">
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
            aria-label={t('tenants.name')}
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
            aria-label={t('tenants.slug')}
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
            aria-label={t('tenants.logoUrl')}
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
            aria-label={t('tenants.isActive')}
            data-testid="tenant-isactive-toggle"
          />
        </div>
      </div>
    </Dialog>
  )
}
