import MenusnapDialog from '@/shared/components/Dialog/MenusnapDialog'
import type { MenusnapDialogProps } from '@/shared/components/Dialog/MenusnapDialog'
import { createContext, FC, ReactNode, useMemo, useState } from 'react'

interface IDialogContext {
  closeByIndex: (index: number) => void
  pushModal: (
    children: ReactNode,
    props?: Partial<MenusnapDialogProps>
  ) => { index: number; close: () => void }
  changeLastModalProps: (props: Partial<MenusnapDialogProps>) => void
  closeAll: () => void
  closeLast: () => void
}

export const DialogContext = createContext<IDialogContext>({
  closeByIndex: () => {},
  pushModal: () => ({ index: 0, close() {} }),
  closeAll: () => {},
  closeLast: () => {},
  changeLastModalProps: () => {},
})

interface DialogProviderProps {
  children: ReactNode
}

const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<
    { children: ReactNode; dialogProps?: Partial<MenusnapDialogProps> }[]
  >([])

  const actions = useMemo(
    () => ({
      closeByIndex(index: number) {
        setModals((prev) => prev.filter((_, i) => i !== index))
      },
      pushModal(children: ReactNode, dialogProps?: Partial<MenusnapDialogProps>) {
        const index = modals.length
        setModals((prev) => [...prev, { children, dialogProps }])
        return {
          index,
          close() {
            actions.closeByIndex(index)
          },
        }
      },
      closeLast() {
        actions.closeByIndex(modals.length - 1)
      },
      closeAll() {
        setModals([])
      },
      changeLastModalProps(props: Partial<MenusnapDialogProps>) {
        setModals((prev) =>
          prev.map((modal, i) =>
            i === prev.length - 1 ? { ...modal, dialogProps: props } : modal
          )
        )
      },
    }),
    [modals]
  )

  return (
    <DialogContext value={actions}>
      {modals.map((modal, index) => (
        <MenusnapDialog
          key={index}
          open
          onClose={() => actions.closeByIndex(index)}
          style={{ ...modal.dialogProps?.style, zIndex: 1000 }}
          {...modal.dialogProps}
        >
          {modal.children}
        </MenusnapDialog>
      ))}
      {children}
    </DialogContext>
  )
}

export default DialogProvider
