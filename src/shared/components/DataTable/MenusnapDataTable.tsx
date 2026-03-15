import { Column } from 'primereact/column'
import type { ColumnProps } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import type { DataTableProps } from 'primereact/datatable'
import React, { type JSX } from 'react'
import { useTranslation } from 'react-i18next'

export interface MenusnapColumnProps<T = any> extends Omit<ColumnProps, 'key'> {
  field?: keyof T extends string ? keyof T : string
  body?: (data: T, options?: unknown) => React.ReactNode
  visible?: boolean
}

export interface MenusnapDataTableProps<T = any>
  extends Omit<DataTableProps<T[]>, 'children'> {
  columns: MenusnapColumnProps<T>[]
  value: T[]
  hasCardToolbar?: boolean
}

const MenusnapDataTable = <T = any>({
  columns,
  value = [],
  hasCardToolbar = false,
  ...rest
}: MenusnapDataTableProps<T>): JSX.Element => {
  const { t } = useTranslation()

  return (
    <DataTable<T[]>
      {...rest}
      sortMode={rest.sortMode ?? 'multiple'}
      removableSort={rest.removableSort ?? true}
      value={value}
      stripedRows={rest.stripedRows ?? false}
      scrollable={rest.scrollable ?? true}
      scrollHeight={
        rest.scrollHeight ??
        (hasCardToolbar ? 'calc(100vh - 20.75rem)' : 'calc(100vh - 14rem)')
      }
      style={{
        borderLeft: '1px solid #dee2e6',
        borderRight: '1px solid #dee2e6',
        borderTop: rest.header ? undefined : '1px solid #dee2e6',
        ...rest.style,
      }}
      emptyMessage={rest.emptyMessage ?? t('common.noData')}
    >
      {columns
        .filter((col) => col.visible !== false)
        .map((col, index) => {
          const { visible, ...colProps } = col
          return <Column key={`col-${index}`} {...colProps} />
        })}
    </DataTable>
  )
}

export default MenusnapDataTable
