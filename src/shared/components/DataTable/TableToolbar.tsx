import clsx from 'clsx'
import React, { ReactElement, ReactNode } from 'react'

export interface TableToolbarProps {
  leftElements?: ReactElement | ReactNode
  centerElements?: ReactElement | ReactNode
  rightElements?: ReactElement | ReactNode
  className?: string
  includeStyling?: boolean
}

export interface RenderElement {
  render: ReactElement | ReactNode
}

const TableToolbar: React.FC<TableToolbarProps | RenderElement> = (props) => {
  if ('render' in props) {
    return (
      <div className={clsx('mb-4', 'grid grid-cols-12 gap-4')}>
        {props.render}
      </div>
    )
  }

  const { leftElements, centerElements, rightElements, className, includeStyling } = props

  return (
    <div className={clsx(includeStyling !== false ? 'mb-4' : '', className)}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5 order-1 flex justify-center md:justify-start items-center">
          {leftElements}
        </div>
        <div className="col-span-12 md:col-span-2 order-2 flex justify-center items-center">
          {centerElements}
        </div>
        <div className="col-span-12 md:col-span-5 order-3 flex justify-center md:justify-end items-center">
          {rightElements}
        </div>
      </div>
    </div>
  )
}

export default TableToolbar
