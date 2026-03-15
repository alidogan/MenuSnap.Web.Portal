import { Tag } from 'primereact/tag'
import { useTranslation } from 'react-i18next'
import type { TenantDto } from '../shared/types/ITenant'
import type { MenusnapColumnProps } from '@/shared/components/DataTable'
import { TableRowActions } from '@/shared/components/DataTable'

interface UseTenantsColumnsOptions {
  onEdit: (tenant: TenantDto) => void
  onDelete: (tenant: TenantDto) => void
}

export function useTenantsColumns({ onEdit, onDelete }: UseTenantsColumnsOptions): MenusnapColumnProps<TenantDto>[] {
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
      body: (tenant) =>
        tenant.logoUrl ? (
          <img src={tenant.logoUrl} alt={tenant.name} style={{ height: '32px', objectFit: 'contain' }} />
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      field: 'isActive',
      header: t('tenants.columns.isActive'),
      body: (tenant) => (
        <Tag
          value={tenant.isActive ? t('common.yes') : t('common.no')}
          severity={tenant.isActive ? 'success' : 'danger'}
        />
      ),
    },
    {
      header: t('tenants.columns.actions'),
      style: { width: '8rem' },
      body: (tenant) => (
        <TableRowActions
          onEdit={() => onEdit(tenant)}
          onDelete={() => onDelete(tenant)}
        />
      ),
    },
  ]
}
