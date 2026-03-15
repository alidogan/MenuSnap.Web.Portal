import { Dialog as PrimeDialog } from 'primereact/dialog'
import type { DialogProps } from 'primereact/dialog'
import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface MenusnapDialogProps {
  open: boolean
  width?: number
  maxWidth?: number
  position?: 'right' | 'center'
  closeIcon?: ReactNode
  onClose: () => void
  children: ReactNode
  title?: React.ReactNode | ((props: DialogProps) => React.ReactNode)
  titleTranslationKey?: string
  [key: string]: any
}

const MenusnapDialog: FC<MenusnapDialogProps> = ({
  children,
  open,
  onClose,
  width,
  maxWidth,
  position = 'right',
  closeIcon,
  title,
  titleTranslationKey,
  ...props
}) => {
  const { t } = useTranslation()

  const header = titleTranslationKey
    ? t(titleTranslationKey).charAt(0).toUpperCase() + t(titleTranslationKey).slice(1)
    : title

  return (
    <PrimeDialog
      closeOnEscape
      position="top"
      visible={open}
      onHide={onClose}
      header={header}
      draggable
      resizable={false}
      modal
      headerStyle={{
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
      }}
      contentStyle={{
        width: width ? `min(${width}px, 95vw)` : 'auto',
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
      }}
      {...props}
    >
      {children}
    </PrimeDialog>
  )
}

export default MenusnapDialog
