import { Tag } from 'primereact/tag'
import { useTranslation } from 'react-i18next'
import type { LocationDto } from '../shared/types/ILocation'
import type { MenusnapColumnProps } from '@/shared/components/DataTable'
import { TableRowActions } from '@/shared/components/DataTable'

interface UseLocationsColumnsOptions {
  onEdit: (location: LocationDto) => void
  onDelete: (location: LocationDto) => void
}

export function useLocationsColumns({ onEdit, onDelete }: UseLocationsColumnsOptions): MenusnapColumnProps<LocationDto>[] {
  const { t } = useTranslation()

  return [
    {
      field: 'name',
      header: t('locations.columns.name'),
      sortable: true,
    },
    {
      field: 'type',
      header: t('locations.columns.type'),
      sortable: true,
      body: (location) => (
        <span>{t(`locations.types.${location.type}`, location.type)}</span>
      ),
    },
    {
      field: 'address',
      header: t('locations.columns.address'),
      body: (location) =>
        location.address ? (
          <span>{location.address}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      field: 'logoUrl',
      header: t('locations.columns.logo'),
      body: (location) =>
        location.logoUrl ? (
          <img
            src={location.logoUrl}
            alt={location.name}
            style={{ height: '32px', objectFit: 'contain' }}
          />
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      field: 'isActive',
      header: t('locations.columns.isActive'),
      body: (location) => (
        <Tag
          value={location.isActive ? t('common.yes') : t('common.no')}
          severity={location.isActive ? 'success' : 'danger'}
        />
      ),
    },
    {
      header: t('locations.columns.actions'),
      style: { width: '8rem' },
      body: (location) => (
        <TableRowActions
          onEdit={() => onEdit(location)}
          onDelete={() => onDelete(location)}
        />
      ),
    },
  ]
}
