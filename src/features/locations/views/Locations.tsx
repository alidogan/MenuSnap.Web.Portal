import { useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useTranslation } from 'react-i18next'
import { useTenantsQuery } from '@/features/tenants/shared/hooks/useTenantsQuery'
import { useLocationsQuery } from '../shared/hooks/useLocationsQuery'
import {
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useUpdateLocationMutation,
  useUploadLocationLogoMutation,
} from '../shared/hooks/useLocationsMutation'
import { useLocationsColumns } from '../hooks/useLocationsColumns'
import LocationModal from '../components/LocationModal'
import type { LocationDto, LocationFormValues } from '../shared/types/ILocation'
import { MenusnapCard } from '@/shared/components/MenusnapCard'
import { MenusnapDataTable, TableToolbar } from '@/shared/components/DataTable'
import { SearchInput } from '@/shared/components/SearchInput'
import useModals from '@/shared/hooks/useModals'

export default function Locations() {
  const { t } = useTranslation()
  const toast = useRef<Toast>(null)
  const { pushModal } = useModals()

  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')

  const { tenants } = useTenantsQuery({ pageIndex: 0, pageSize: 100 })
  const { locations, isLoading } = useLocationsQuery(selectedTenantId)

  const createMutation = useCreateLocationMutation()
  const updateMutation = useUpdateLocationMutation()
  const deleteMutation = useDeleteLocationMutation()
  const uploadLogoMutation = useUploadLocationLogoMutation()

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadLogoMutation.isPending

  const tenantOptions = tenants.map((tenant) => ({
    label: tenant.name,
    value: tenant.id,
  }))

  const handleNew = () => {
    if (!selectedTenantId) return
    let closeModal: () => void
    const { close } = pushModal(
      <LocationModal
        onSubmit={async (values: LocationFormValues, logoFile: File | null) => {
          const result = await createMutation.mutateAsync({
            tenantId: selectedTenantId,
            name: values.name,
            slug: values.slug,
            type: values.type,
            address: values.address ?? null,
            phone: values.phone ?? null,
            description: values.description ?? null,
            isActive: values.isActive,
          })
          if (logoFile) {
            await uploadLogoMutation.mutateAsync({ id: result.data.id, file: logoFile })
          }
          closeModal()
          toast.current?.show({ severity: 'success', summary: t('common.success') })
        }}
        isSubmitting={isSubmitting}
      />,
      { titleTranslationKey: 'locations.createTitle', width: 480 }
    )
    closeModal = close
  }

  const handleEdit = (location: LocationDto) => {
    let closeModal: () => void
    const { close } = pushModal(
      <LocationModal
        onSubmit={async (values: LocationFormValues, logoFile: File | null) => {
          await updateMutation.mutateAsync({
            id: location.id,
            name: values.name,
            slug: values.slug,
            type: values.type,
            address: values.address ?? null,
            phone: values.phone ?? null,
            description: values.description ?? null,
            isActive: values.isActive,
          })
          if (logoFile) {
            await uploadLogoMutation.mutateAsync({ id: location.id, file: logoFile })
          }
          closeModal()
          toast.current?.show({ severity: 'success', summary: t('common.success') })
        }}
        initialValues={location}
        isSubmitting={isSubmitting}
      />,
      { titleTranslationKey: 'locations.editTitle', width: 480 }
    )
    closeModal = close
  }

  const handleDelete = (location: LocationDto) => {
    confirmDialog({
      message: t('locations.deleteConfirm'),
      header: t('locations.delete'),
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      defaultFocus: 'reject',
      accept: async () => {
        await deleteMutation.mutateAsync(location.id)
        toast.current?.show({ severity: 'success', summary: t('common.success') })
      },
    })
  }

  const columns = useLocationsColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const filteredLocations = searchValue
    ? locations.filter(
        (l) =>
          l.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          l.slug.toLowerCase().includes(searchValue.toLowerCase())
      )
    : locations

  const toolbar = (
    <TableToolbar
      leftElements={
        <div className="flex items-center gap-3">
          <Dropdown
            value={selectedTenantId}
            options={tenantOptions}
            onChange={(e) => {
              setSelectedTenantId(e.value)
              setSearchValue('')
            }}
            placeholder={t('locations.selectTenant')}
            style={{ minWidth: '220px' }}
            data-testid="tenant-selector"
          />
          {selectedTenantId && (
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              showClearFilters={false}
              placeholder={t('locations.search')}
            />
          )}
        </div>
      }
      rightElements={
        <Button
          label={t('locations.new')}
          icon="pi pi-plus"
          onClick={handleNew}
          disabled={!selectedTenantId}
          data-testid="new-location-button"
        />
      }
    />
  )

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      <MenusnapCard>
        <MenusnapDataTable
          columns={columns}
          value={filteredLocations}
          loading={isLoading}
          header={toolbar}
          hasCardToolbar
          data-testid="locations-table"
          emptyMessage={
            selectedTenantId
              ? t('locations.noLocations')
              : t('locations.selectTenantFirst')
          }
        />
      </MenusnapCard>
    </>
  )
}
