import type { ColumnProps } from 'primereact/column'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { useTranslation } from 'react-i18next'
import type { TenantDto } from '../shared/types/ITenant'

interface UseTenantsColumnsOptions {
  onEdit: (tenant: TenantDto) => void
  onDelete: (tenant: TenantDto) => void
}

export function useTenantsColumns({ onEdit, onDelete }: UseTenantsColumnsOptions): ColumnProps[] {
  const { t } = useTranslation()

  return [
    {
      field: 'name',
      header: t('tenants.columns.name'),
      sortable: true,
    },
    {
      field: 'slug',
      header: t('tenants.columns.slug'),
      sortable: true,
    },
    {
      field: 'logoUrl',
      header: t('tenants.columns.logoUrl'),
      body: (tenant: TenantDto) =>
        tenant.logoUrl ? (
          <img src={tenant.logoUrl} alt={tenant.name} style={{ height: '32px', objectFit: 'contain' }} />
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      field: 'isActive',
      header: t('tenants.columns.isActive'),
      body: (tenant: TenantDto) => (
        <Tag
          value={tenant.isActive ? t('common.yes') : t('common.no')}
          severity={tenant.isActive ? 'success' : 'danger'}
        />
      ),
    },
    {
      header: t('tenants.columns.actions'),
      style: { width: '8rem' },
      body: (tenant: TenantDto) => (
        <div className="flex gap-1">
          <Button
            icon="pi pi-pencil"
            className="p-button-text p-button-sm"
            onClick={() => onEdit(tenant)}
            aria-label={t('tenants.edit')}
            tooltip={t('tenants.edit')}
          />
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-sm p-button-danger"
            onClick={() => onDelete(tenant)}
            aria-label={t('tenants.delete')}
            tooltip={t('tenants.delete')}
          />
        </div>
      ),
    },
  ]
}
