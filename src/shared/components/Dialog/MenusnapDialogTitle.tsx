import { Button } from 'primereact/button'
import React, { type JSX, FC, ReactElement } from 'react'
import { useCloseLastModal } from '@/shared/hooks/useModals'

interface MenusnapDialogTitleProps {
  icon: JSX.Element
  title: string
  extraInfo?: JSX.Element | null
  closeDialog?: () => void
  closeIcon?: ReactElement
  showCloseIcon?: boolean
  style?: React.CSSProperties
}

const MenusnapDialogTitle: FC<MenusnapDialogTitleProps> = ({
  title,
  extraInfo,
  closeDialog,
  icon,
  closeIcon,
  showCloseIcon = true,
  style,
}) => {
  const close = useCloseLastModal()

  return (
    <div
      style={{
        padding: 0,
        margin: '16px 4px 16px 16px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style,
      }}
    >
      <p
        style={{
          color: '#4b4b4b',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
        {title}
      </p>
      {extraInfo}
      {showCloseIcon && (
        <Button
          icon={closeIcon ? undefined : 'pi pi-angle-right'}
          onClick={closeDialog ?? close}
          text
          rounded
          severity="secondary"
          aria-label="Close"
        >
          {closeIcon}
        </Button>
      )}
    </div>
  )
}

export default MenusnapDialogTitle
