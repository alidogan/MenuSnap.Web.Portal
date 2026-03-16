import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

interface AdminItem {
  id: string
  name: string
  icon: string
  path: string
}

const FAVORITES_STORAGE_KEY = 'admin.overview.favorites'

function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
}

export default function AdminOverview() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const adminItems = useMemo<AdminItem[]>(
    () => [
      {
        id: 'tenants',
        name: t('tenants.title', 'Tenants'),
        icon: 'pi-users',
        path: '/admin/tenants',
      },
    ],
    [t]
  )

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const stored = loadFavorites()
    const availableIds = new Set(adminItems.map((item) => item.id))
    return stored.filter((id) => availableIds.has(id))
  })

  const [favoritesCollapsed, setFavoritesCollapsed] = useState(false)
  const [othersCollapsed, setOthersCollapsed] = useState(false)

  const favoriteItems = useMemo(
    () =>
      favoriteIds
        .map((id) => adminItems.find((item) => item.id === id))
        .filter((item): item is AdminItem => Boolean(item)),
    [favoriteIds, adminItems]
  )

  const otherItems = useMemo(
    () => adminItems.filter((item) => !favoriteIds.includes(item.id)),
    [favoriteIds, adminItems]
  )

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id]
      saveFavorites(updated)
      return updated
    })
  }

  const renderRow = (item: AdminItem, isLast: boolean) => {
    const isFavorite = favoriteIds.includes(item.id)
    return (
      <div
        key={item.id}
        data-testid={`admin-item-${item.id}`}
        className={`${isLast ? 'mb-0' : 'mb-2'} cursor-pointer`}
        style={{
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s',
          backgroundColor: '#ffffff',
          padding: '0 1rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
        onClick={() => navigate({ to: item.path })}
      >
        <div className="flex items-center gap-4 w-full">
          <i
            className={`pi ${isFavorite ? 'pi-star-fill' : 'pi-star'}`}
            style={{
              color: isFavorite ? '#fbbf24' : '#94a3b8',
              fontSize: '1.2rem',
            }}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(item.id)
            }}
          />
          <div className="flex items-center gap-4 flex-1" style={{ minWidth: '200px' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                color: 'rgb(73, 162, 52)',
              }}
            >
              <i className={`pi ${item.icon}`} />
            </div>
            <span className="font-semibold text-surface-900 dark:text-surface-0">
              {item.name}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderSection = (
    title: string,
    isCollapsed: boolean,
    toggle: () => void,
    items: AdminItem[]
  ) => (
    <div className="mb-6">
      <div
        className="flex items-center p-4 cursor-pointer mb-4"
        onClick={toggle}
      >
        <div className="flex items-center gap-2" style={{ marginRight: '2rem' }}>
          <i
            className={`pi ${isCollapsed ? 'pi-chevron-right' : 'pi-chevron-down'} text-600`}
            style={{ fontSize: '0.875rem' }}
          />
          <span className="font-medium text-surface-700 dark:text-surface-100">
            {title} ({items.length})
          </span>
        </div>
      </div>
      {!isCollapsed && (
        <div>
          {items.map((item, index) => renderRow(item, index === items.length - 1))}
        </div>
      )}
    </div>
  )

  return (
    <div className="p-6">
      {favoriteItems.length > 0 &&
        renderSection(
          t('favorites', 'Favorieten'),
          favoritesCollapsed,
          () => setFavoritesCollapsed((prev) => !prev),
          favoriteItems
        )}
      {otherItems.length > 0 &&
        renderSection(
          t('other', 'Overig'),
          othersCollapsed,
          () => setOthersCollapsed((prev) => !prev),
          otherItems
        )}
    </div>
  )
}
