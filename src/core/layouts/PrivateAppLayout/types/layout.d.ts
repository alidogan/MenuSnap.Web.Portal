import React, {
  Dispatch,
  HTMLAttributeAnchorTarget,
  ReactNode,
  SetStateAction,
} from 'react'

export type MenuMode =
  | 'static'
  | 'overlay'
  | 'horizontal'
  | 'slim'
  | 'slim-plus'
  | 'reveal'
  | 'drawer'

export type ColorScheme = 'light' | 'dark'

export type MenuProfilePosition = 'start' | 'end'

export interface ChildContainerProps {
  children: ReactNode
}

/* Breadcrumb Types */
export interface AppBreadcrumbProps {
  className?: string
}

export interface Breadcrumb {
  labels?: string[]
  to?: string
}

export interface BreadcrumbItem {
  label: string
  to?: string
  items?: BreadcrumbItem[]
}

/* Context Types */
export type LayoutState = {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  overlaySubmenuActive: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
  sidebarActive: boolean
  anchored: boolean
  topbarMenuActive: boolean
  menuProfileActive: boolean
  rightMenuActive: boolean
  profileSidebarVisible: boolean
  resetMenu: boolean
}

export type LayoutConfig = {
  theme: string
  ripple: boolean
  inputStyle: string
  menuMode: MenuMode
  menuTheme: string
  colorScheme: ColorScheme
  scale: number
  layoutTheme: string
  componentTheme: string
  topBarTheme: string
}

export interface LayoutContextProps {
  layoutConfig: LayoutConfig
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>
  layoutState: LayoutState
  setLayoutState: Dispatch<SetStateAction<LayoutState>>
  onMenuProfileToggle: () => void
  onMenuToggle: () => void
  onTopbarMenuToggle: () => void
  showRightSidebar: () => void
  isSlim: () => boolean
  isSlimPlus: () => boolean
  isHorizontal: () => boolean
  isDesktop: () => boolean
  isSidebarActive: () => boolean
  breadcrumbs?: Breadcrumb[]
  tabs: any[]
  setTabs: Dispatch<SetStateAction<any[]>>
  openTab: (tab: any) => void
  closeTab: (tab: any) => void
  setBreadcrumbs: Dispatch<SetStateAction<Breadcrumb[]>>
}

export interface MenuContextProps {
  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>
}

/* AppTopbar Types */
export interface AppTopbarRef {
  menubutton?: HTMLButtonElement | null
  topbarmenu?: HTMLDivElement | null
  topbarmenubutton?: HTMLButtonElement | null
}

/* AppMenu Types */
type CommandProps = {
  originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  item: MenuModel
}

export interface MenuProps {
  model: MenuModel[]
}

export interface MenuModel {
  label: string
  icon?: string
  items?: MenuModel[]
  to?: string
  url?: string
  target?: HTMLAttributeAnchorTarget
  seperator?: boolean
  badgeClassName?: string
  className?: string
}

export interface UseSubmenuOverlayPositionProps {
  target: HTMLElement | null
  overlay: HTMLElement | null
  container: HTMLElement | null
  when?: any
}

export interface AppMenuItem extends MenuModel {
  items?: AppMenuItem[]
  badge?: 'updated' | 'new'
  badgeClass?: string
  class?: string
  preventExact?: boolean
  visible?: boolean
  disabled?: boolean
  replaceUrl?: boolean
  command?: ({ originalEvent, item }: CommandProps) => void
}

export interface AppMenuItemProps {
  item?: AppMenuItem
  parentKey?: string
  index?: number
  root?: boolean
  className?: string
}
