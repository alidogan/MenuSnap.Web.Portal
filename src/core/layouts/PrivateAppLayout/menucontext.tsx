import React, { createContext, useState } from 'react'
import type { MenuContextProps } from '@/core/layouts/PrivateAppLayout/types'

export const MenuContext = createContext({} as MenuContextProps)

interface MenuProviderProps {
  children: React.ReactNode
}

export const MenuProvider = (props: MenuProviderProps) => {
  const [activeMenu, setActiveMenu] = useState('')

  const value = {
    activeMenu,
    setActiveMenu,
  }

  return (
    <MenuContext value={value}>{props.children}</MenuContext>
  )
}
