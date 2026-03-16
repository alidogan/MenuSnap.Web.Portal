import { useRef } from 'react'
import { Menu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'
import { keycloak, logout } from '@/core/auth/keycloak'
import { useTranslation } from 'react-i18next'

const TopbarProfile = () => {
  const menuRef = useRef<Menu>(null)
  const { t } = useTranslation()

  const username =
    keycloak.tokenParsed?.given_name ??
    keycloak.tokenParsed?.preferred_username ??
    t('profile', 'Profiel')

  const items: MenuItem[] = [
    {
      label: t('logout', 'Uitloggen'),
      icon: 'pi pi-sign-out',
      command: () => logout(),
    },
  ]

  return (
    <div className="topbar-profile">
      <Menu model={items} popup ref={menuRef} />
      <button
        type="button"
        className="p-link topbar-profile-button"
        onClick={(e) => menuRef.current?.toggle(e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--v-menuitem-text-color)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}
        >
          <i className="pi pi-user" />
        </span>
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{username}</span>
        <i className="pi pi-angle-down" style={{ fontSize: '0.75rem' }} />
      </button>
    </div>
  )
}

export default TopbarProfile
