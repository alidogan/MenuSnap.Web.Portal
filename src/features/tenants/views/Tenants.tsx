import { useRef, useState } from 'react'
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

export default function Tenants() {
  const { t } = useTranslation()
  const toast = useRef<Toast>(null)

  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTenant, setEditingTenant] = useState<TenantDto | undefined>(undefined)

  const { tenants, totalCount, isLoading } = useTenantsQuery({ pageIndex: page, pageSize })
  const createMutation = useCreateTenantMutation()
  const updateMutation = useUpdateTenantMutation()
  const deleteMutation = useDeleteTenantMutation()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleNew = () => {
    setEditingTenant(undefined)
    setModalVisible(true)
  }

  const handleEdit = (tenant: TenantDto) => {
    setEditingTenant(tenant)
    setModalVisible(true)
  }

  const handleDelete = (tenant: TenantDto) => {
    confirmDialog({
      message: t('tenants.deleteConfirm'),
      header: t('tenants.delete'),
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteMutation.mutateAsync(tenant.id)
        toast.current?.show({ severity: 'success', summary: t('common.success') })
      },
    })
  }

  const handleSubmit = async (values: TenantFormValues) => {
    if (editingTenant) {
      await updateMutation.mutateAsync({ id: editingTenant.id, ...values, logoUrl: values.logoUrl ?? null })
    } else {
      await createMutation.mutateAsync({ ...values, logoUrl: values.logoUrl ?? null })
    }
    setModalVisible(false)
    toast.current?.show({ severity: 'success', summary: t('common.success') })
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

      <MenusnapCard hasCardToolbar>
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

      <TenantModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingTenant}
        isSubmitting={isSubmitting}
      />
    </>
  )
}
