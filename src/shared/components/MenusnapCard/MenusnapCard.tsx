import React, { HTMLAttributes, PropsWithChildren, Ref } from 'react'

interface MenusnapCardProps {
  dialogWidth?: number
  dialogIsOpen?: boolean
  dialogPosition?: 'left' | 'right'
  ref?: Ref<HTMLDivElement>
  hasCardToolbar?: boolean
}

const MenusnapCard: React.FC<
  MenusnapCardProps & PropsWithChildren & HTMLAttributes<HTMLDivElement>
> = ({
  dialogWidth,
  dialogIsOpen,
  dialogPosition = 'right',
  children,
  style,
  ref,
  hasCardToolbar,
  ...props
}) => {
  const dynamicStyles: React.CSSProperties =
    dialogWidth && dialogIsOpen
      ? {
          [dialogPosition === 'left' ? 'marginLeft' : 'marginRight']:
            dialogWidth,
        }
      : {}

  return (
    <div
      className="card"
      ref={ref}
      style={{
        ...dynamicStyles,
        ...style,
        height: hasCardToolbar ? 'calc(100vh - 14rem)' : 'calc(100vh - 7.5rem)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default MenusnapCard
