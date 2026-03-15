import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const navItems = [
  { to: '/tenants', labelKey: 'nav.tenants', icon: 'pi pi-building' },
]

export default function AppLayout() {
  const { t } = useTranslation()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="app-sidebar__logo">
          <span className="app-sidebar__logo-text">MenuSnap</span>
          <small className="app-sidebar__logo-sub">Admin Portal</small>
        </div>
        <nav className="app-sidebar__nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`app-sidebar__nav-item${currentPath.startsWith(item.to) ? ' app-sidebar__nav-item--active' : ''}`}
            >
              <i className={item.icon} />
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
