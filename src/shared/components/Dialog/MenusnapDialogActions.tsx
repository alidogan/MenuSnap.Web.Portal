import { Button } from 'primereact/button'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface MenusnapDialogActionsProps {
  onSubmit?: () => void
  submitLabel?: string
  submitType?: 'button' | 'submit'
  formId?: string
  loading?: boolean
  submitDisabled?: boolean
  hideSubmit?: boolean
  submitDataTestId?: string

  onCancel?: () => void
  cancelLabel?: string
  hideCancel?: boolean

  extraActions?: ReactNode
  className?: string
}

const MenusnapDialogActions: FC<MenusnapDialogActionsProps> = ({
  onSubmit,
  submitLabel,
  submitType = 'button',
  formId,
  loading = false,
  submitDisabled = false,
  hideSubmit = false,
  submitDataTestId,

  onCancel,
  cancelLabel,
  hideCancel = false,

  extraActions,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <div className={`flex justify-end gap-2 ${className ?? ''}`}>
      {!hideCancel && (
        <Button
          type="button"
          label={cancelLabel ?? t('common.cancel')}
          onClick={onCancel}
          severity="secondary"
          outlined
          disabled={loading}
        />
      )}
      {extraActions}
      {!hideSubmit && (
        <Button
          type={submitType}
          form={formId}
          label={submitLabel ?? t('common.save')}
          onClick={onSubmit}
          loading={loading}
          disabled={submitDisabled || loading}
          data-testid={submitDataTestId}
        />
      )}
    </div>
  )
}

export default MenusnapDialogActions
