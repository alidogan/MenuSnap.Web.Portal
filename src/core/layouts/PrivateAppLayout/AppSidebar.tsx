import AppMenu from '@/core/layouts/PrivateAppLayout/AppMenu'
import { MenuProvider } from '@/core/layouts/PrivateAppLayout/menucontext'
import React from 'react'

const AppSidebar = () => {
  return (
    <React.Fragment>
      <div className="layout-menu-container">
        <MenuProvider>
          <AppMenu />
        </MenuProvider>
      </div>
    </React.Fragment>
  )
}

AppSidebar.displayName = 'AppSidebar'

export default AppSidebar
