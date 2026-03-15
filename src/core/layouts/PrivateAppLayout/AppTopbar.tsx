import AppBreadcrumb from '@/core/layouts/PrivateAppLayout/AppBreadCrumb'
import { LayoutContext } from '@/core/layouts/PrivateAppLayout/layoutContext'
import type { AppTopbarRef } from '@/core/layouts/PrivateAppLayout/types'
import menusnapLogo from '@/assets/menusnap-logo.png'
import { Link } from '@tanstack/react-router'
import React, { useContext, useImperativeHandle, useRef } from 'react'

const AppTopbar = ({ ref }: { ref?: React.Ref<AppTopbarRef> }) => {
  const { onMenuToggle, tabs } = useContext(LayoutContext)
  const menubuttonRef = useRef<HTMLButtonElement>(null)

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
  }))

  return (
    <div className="layout-topbar">
      <Link to="/" className="app-logo">
        <img src={menusnapLogo} alt="MenuSnap" style={{ height: '2rem', width: 'auto' }} />
      </Link>

      <AppBreadcrumb />

      <button
        ref={menubuttonRef}
        className="topbar-menubutton p-link"
        type="button"
        onClick={onMenuToggle}
      >
        <span></span>
      </button>

      <ul className="topbar-menu">
        {tabs.length === 0 && <li className="topbar-menu-empty"></li>}
      </ul>
    </div>
  )
}

export default AppTopbar
