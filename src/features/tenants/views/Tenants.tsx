import { useRef } from 'react'
import { Button } from 'primereact/button'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useTranslation } from 'react-i18next'
import { useTenantsQuery } from '../shared/hooks/useTenantsQuery'
import { useCreateTenantMutation, useDeleteTenantMutation, useUpdateTenantMutation } from '../shared/hooks/useTenantsMutation'
import { useTenantsColumns } from '../hooks/useTenantsColumns'
import TenantModal from '../components/TenantModal'
import type { TenantDto, TenantFormValues } from '../shared/types/ITenant'
import { MenusnapCard } from '@/shared/components/MenusnapCard'
import { MenusnapDataTable, TableToolbar } from '@/shared/components/DataTable'
import { SearchInput } from '@/shared/components/SearchInput'
import useModals from '@/shared/hooks/useModals'
import { useState } from 'react'

export default function Tenants() {
  const { t } = useTranslation()
  const toast = useRef<Toast>(null)
  const { pushModal } = useModals()

  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [searchValue, setSearchValue] = useState('')

  const { tenants, totalCount, isLoading } = useTenantsQuery({ pageIndex: page, pageSize })
  const createMutation = useCreateTenantMutation()
  const updateMutation = useUpdateTenantMutation()
  const deleteMutation = useDeleteTenantMutation()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleNew = () => {
    let closeModal: () => void
    const { close } = pushModal(
      <TenantModal
        onSubmit={async (values) => {
          await createMutation.mutateAsync({ ...values, logoUrl: values.logoUrl ?? null })
          closeModal()
          toast.current?.show({ severity: 'success', summary: t('common.success') })
        }}
        isSubmitting={isSubmitting}
      />,
      { titleTranslationKey: 'tenants.createTitle', width: 480 }
    )
    closeModal = close
  }

  const handleEdit = (tenant: TenantDto) => {
    let closeModal: () => void
    const { close } = pushModal(
      <TenantModal
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({ id: tenant.id, ...values, logoUrl: values.logoUrl ?? null })
          closeModal()
          toast.current?.show({ severity: 'success', summary: t('common.success') })
        }}
        initialValues={tenant}
        isSubmitting={isSubmitting}
      />,
      { titleTranslationKey: 'tenants.editTitle', width: 480 }
    )
    closeModal = close
  }

  const handleDelete = (tenant: TenantDto) => {
    confirmDialog({
      message: t('tenants.deleteConfirm'),
      header: t('tenants.delete'),
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      defaultFocus: 'reject',
      accept: async () => {
        await deleteMutation.mutateAsync(tenant.id)
        toast.current?.show({ severity: 'success', summary: t('common.success') })
      },
    })
  }

  const columns = useTenantsColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const filteredTenants = searchValue
    ? tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          t.slug.toLowerCase().includes(searchValue.toLowerCase())
      )
    : tenants

  const toolbar = (
    <TableToolbar
      leftElements={
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          showClearFilters={false}
          placeholder={t('tenants.search')}
        />
      }
      rightElements={
        <Button
          label={t('tenants.new')}
          icon="pi pi-plus"
          onClick={handleNew}
          data-testid="new-tenant-button"
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
          value={filteredTenants}
          loading={isLoading}
          lazy
          paginator
          rows={pageSize}
          totalRecords={totalCount}
          onPage={(e) => setPage(e.page ?? 0)}
          header={toolbar}
          hasCardToolbar
          data-testid="tenants-table"
        />
      </MenusnapCard>
    </>
  )
}
