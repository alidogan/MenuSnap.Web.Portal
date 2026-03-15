import React, { useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useTranslation } from 'react-i18next'
import { useTenantsQuery } from '../shared/hooks/useTenantsQuery'
import { useCreateTenantMutation, useDeleteTenantMutation, useUpdateTenantMutation } from '../shared/hooks/useTenantsMutation'
import { useTenantsColumns } from '../hooks/useTenantsColumns'
import TenantModal from '../components/TenantModal'
import type { TenantDto, TenantFormValues } from '../shared/types/ITenant'

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

  return (
    <div className="tenants-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="tenants-page__header">
        <h1 className="tenants-page__title">{t('tenants.title')}</h1>
        <div className="tenants-page__toolbar">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('tenants.search')}
              aria-label={t('tenants.search')}
            />
          </span>
          <span data-testid="new-tenant-button">
            <Button
              label={t('tenants.new')}
              icon="pi pi-plus"
              onClick={handleNew}
            />
          </span>
        </div>
      </div>

      <DataTable
        value={filteredTenants}
        loading={isLoading}
        lazy
        paginator
        rows={pageSize}
        totalRecords={totalCount}
        onPage={(e) => setPage(e.page ?? 0)}
        emptyMessage={t('common.loading')}
        data-testid="tenants-table"
      >
        {columns.map((col, idx) => (
          <Column key={String(col.field ?? col.header ?? idx)} {...col} />
        ))}
      </DataTable>

      <TenantModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingTenant}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
