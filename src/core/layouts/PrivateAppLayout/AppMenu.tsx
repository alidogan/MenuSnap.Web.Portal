import AppSubMenu from '@/core/layouts/PrivateAppLayout/AppSubMenu'
import { LayoutContext } from '@/core/layouts/PrivateAppLayout/layoutContext'
import type { MenuModel } from '@/core/layouts/PrivateAppLayout/types'
import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const createMenuModel = (t: (key: string) => string): MenuModel[] => [
  {
    label: t('nav.tenants'),
    icon: 'pi pi-building pi-fw',
    to: '/tenants',
  },
]

const AppMenu = () => {
  const { t } = useTranslation()
  const { setBreadcrumbs } = useContext(LayoutContext)

  const model = useMemo(() => createMenuModel(t), [t])

  useEffect(() => {
    const breadcrumbs = model
      .filter((item) => item.to)
      .map((item) => ({ labels: [item.label], to: item.to }))
    setBreadcrumbs(breadcrumbs)
  }, [model, setBreadcrumbs])

  return <AppSubMenu model={model} />
}

export default AppMenu
