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
      <Link to="/" className="app-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', marginTop: '1rem' }}>
        <img src={menusnapLogo} alt="MenuSnap" style={{ height: '2rem', width: 'auto' }} />
        <div style={{ fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.04em', whiteSpace: 'nowrap', color: 'var(--v-menuitem-text-color)' }}>
          MenuSnap
        </div>
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
