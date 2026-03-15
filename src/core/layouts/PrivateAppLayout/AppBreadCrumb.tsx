import { ObjectUtils } from 'primereact/utils'
import React, { useContext, useEffect, useState } from 'react'

import { LayoutContext } from '@/core/layouts/PrivateAppLayout/layoutContext'
import type {
  AppBreadcrumbProps,
  Breadcrumb,
} from '@/core/layouts/PrivateAppLayout/types'
import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const ucfirst = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str

const AppBreadcrumb = (props: AppBreadcrumbProps) => {
  const location = useLocation()
  const pathname = location.pathname
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb | null>(null)
  const { breadcrumbs } = useContext(LayoutContext)
  const { t } = useTranslation()

  useEffect(() => {
    const filteredBreadcrumbs = breadcrumbs?.find((crumb: Breadcrumb) => {
      return crumb.to?.replace(/\/$/, '') === pathname.replace(/\/$/, '')
    })
    setBreadcrumb(filteredBreadcrumbs ?? null)
  }, [pathname, breadcrumbs])

  return (
    <div className={props.className}>
      <nav className="layout-breadcrumb">
        <ol>
          {ObjectUtils.isNotEmpty(breadcrumb) && pathname !== '/' ? (
            breadcrumb?.labels?.map((label, index) => {
              return (
                <React.Fragment key={index}>
                  {index !== 0 && (
                    <li className="layout-breadcrumb-chevron"> / </li>
                  )}
                  <li key={index}>{ucfirst(t(label))}</li>
                </React.Fragment>
              )
            })
          ) : (
            <>{pathname === '/' && <li key="home">Dashboard</li>}</>
          )}
        </ol>
      </nav>
    </div>
  )
}

export default AppBreadcrumb
