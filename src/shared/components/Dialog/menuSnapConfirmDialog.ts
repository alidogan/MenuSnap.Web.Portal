import { confirmDialog } from 'primereact/confirmdialog'
import type { ConfirmDialogProps } from 'primereact/confirmdialog'

type MenuSnapConfirmDialogOptions = ConfirmDialogProps & {
  variant?: 'danger' | 'default'
}

export const menuSnapConfirmDialog = ({
  variant = 'danger',
  ...rest
}: MenuSnapConfirmDialogOptions) => {
  confirmDialog({
    icon: 'pi pi-exclamation-triangle',
    defaultFocus: 'reject',
    closable: false,
    dismissableMask: true,
    ...(variant === 'danger' && {
      acceptClassName: 'p-button-danger',
    }),
    ...rest,
  })
}
