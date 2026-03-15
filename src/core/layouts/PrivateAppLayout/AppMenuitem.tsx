import { Ripple } from 'primereact/ripple'
import { classNames } from 'primereact/utils'
import { useContext, useEffect, useRef } from 'react'

import { useSubmenuOverlayPosition } from '@/core/layouts/PrivateAppLayout/hooks/useSubmenuOverlayPosition'
import { LayoutContext } from '@/core/layouts/PrivateAppLayout/layoutContext'
import { MenuContext } from '@/core/layouts/PrivateAppLayout/menucontext'
import type { AppMenuItemProps } from '@/core/layouts/PrivateAppLayout/types'
import { Link, useLocation } from '@tanstack/react-router'

const AppMenuitem = (props: AppMenuItemProps) => {
  const { activeMenu, setActiveMenu } = useContext(MenuContext)
  const {
    isSlim,
    isSlimPlus,
    isHorizontal,
    isDesktop,
    setLayoutState,
    layoutState,
  } = useContext(LayoutContext)
  const location = useLocation()
  const pathname = location.pathname
  const submenuRef = useRef<HTMLUListElement>(null)
  const menuitemRef = useRef<HTMLLIElement>(null)
  const item: any = props.item
  const key = props.parentKey
    ? props.parentKey + '-' + props.index
    : String(props.index)
  const isActiveRoute = item!.to && pathname === item!.to
  const active =
    activeMenu === key || !!(activeMenu && activeMenu.startsWith(key + '-'))

  useSubmenuOverlayPosition({
    target: menuitemRef.current,
    overlay: submenuRef.current,
    container:
      menuitemRef.current &&
      menuitemRef.current.closest('.layout-menu-container'),
    when:
      props.root &&
      active &&
      (isSlim() || isSlimPlus() || isHorizontal()) &&
      isDesktop(),
  })

  useEffect(() => {
    if (layoutState.resetMenu) {
      setActiveMenu('')
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        resetMenu: false,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutState.resetMenu])

  const itemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (item!.disabled) {
      event.preventDefault()
      return
    }

    if (props.root && (isSlim() || isHorizontal() || isSlimPlus())) {
      const isSubmenu =
        event.currentTarget.closest(
          '.layout-root-menuitem.active-menuitem > ul'
        ) !== null
      if (isSubmenu)
        setLayoutState((prevLayoutState) => ({
          ...prevLayoutState,
          menuHoverActive: true,
        }))
      else
        setLayoutState((prevLayoutState) => ({
          ...prevLayoutState,
          menuHoverActive: !prevLayoutState.menuHoverActive,
        }))
    }

    if (item?.command) {
      item?.command({ originalEvent: event, item: item })
    }

    if (item?.items) {
      setActiveMenu(active ? props.parentKey! : key)

      if (
        props.root &&
        !active &&
        (isSlim() || isHorizontal() || isSlimPlus())
      ) {
        setLayoutState((prevLayoutState) => ({
          ...prevLayoutState,
          overlaySubmenuActive: true,
        }))
      }
    } else {
      if (!isDesktop()) {
        setLayoutState((prevLayoutState) => ({
          ...prevLayoutState,
          staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
        }))
      }

      if (isSlim() || isSlimPlus() || isHorizontal()) {
        setLayoutState((prevLayoutState) => ({
          ...prevLayoutState,
          menuHoverActive: false,
        }))
      }

      setActiveMenu(key)
    }
  }

  const onMouseEnter = () => {
    if (
      props.root &&
      (isSlim() || isHorizontal() || isSlimPlus()) &&
      isDesktop()
    ) {
      if (!active && layoutState.menuHoverActive) {
        setActiveMenu(key)
      }
    }
  }

  const subMenu =
    item?.items && item?.visible !== false ? (
      <ul
        ref={submenuRef}
        className={classNames({ 'layout-root-submenulist': props.root })}
      >
        {item?.items.map((child: any, i: number) => {
          return (
            <AppMenuitem
              item={child}
              index={i}
              className={child.badgeClass}
              parentKey={key}
              key={child.label}
            />
          )
        })}
      </ul>
    ) : null

  return (
    <li
      ref={menuitemRef}
      className={classNames({
        'layout-root-menuitem': props.root,
        'active-menuitem': active,
      })}
    >
      {props.root && item?.visible !== false && (
        <div className="layout-menuitem-root-text">
          <span>{item?.label}</span>
        </div>
      )}
      {(!item?.to || item?.items) && item?.visible !== false ? (
        <>
          <a
            href={item?.url}
            onClick={(e) => itemClick(e)}
            className={classNames(item?.class, 'p-ripple tooltip-target')}
            target={item?.target}
            data-pr-tooltip={item?.label}
            data-pr-disabled={
              !(isSlim() && props.root && !layoutState.menuHoverActive)
            }
            tabIndex={0}
            onMouseEnter={onMouseEnter}
          >
            <i className={classNames('layout-menuitem-icon', item?.icon)}></i>
            <span className="layout-menuitem-text">{item?.label}</span>
            {item?.items && (
              <i className="pi pi-angle-down layout-submenu-toggler"></i>
            )}
            <Ripple />
          </a>
        </>
      ) : null}

      {item?.to && !item?.items && item?.visible !== false ? (
        <>
          <Link
            to={item?.to}
            replace={item?.replaceUrl}
            onClick={(e) => itemClick(e)}
            className={classNames(item?.class, 'p-ripple', {
              'active-route': isActiveRoute,
            })}
            tabIndex={0}
            onMouseEnter={onMouseEnter}
          >
            <i className={classNames('layout-menuitem-icon', item?.icon)}></i>
            <span className="layout-menuitem-text">{item?.label}</span>
            {item?.items && (
              <i className="pi pi-angle-down layout-submenu-toggler"></i>
            )}
            <Ripple />
          </Link>
        </>
      ) : null}
      {subMenu}
    </li>
  )
}

export default AppMenuitem
