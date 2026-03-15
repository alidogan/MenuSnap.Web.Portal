import { useContext } from 'react'
import { DialogContext } from '@/shared/components/Dialog/DialogProvider'

export const useCloseLastModal = () => {
  const { closeLast } = useContext(DialogContext)
  return closeLast
}

const useModals = () => {
  const { pushModal, changeLastModalProps, closeAll, closeLast, closeByIndex } =
    useContext(DialogContext)

  return {
    pushModal,
    changeLastModalProps,
    closeAll,
    closeLast,
    closeByIndex,
  }
}

export default useModals
