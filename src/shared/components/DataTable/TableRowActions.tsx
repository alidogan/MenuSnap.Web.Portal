import { Button } from 'primereact/button'
import { FC } from 'react'

type TableRowActionsProps = {
  onEdit?: () => void
  onDelete?: () => void
}

const TableRowActions: FC<TableRowActionsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      {onEdit && (
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="secondary"
          onClick={onEdit}
          aria-label="Bewerken"
        />
      )}
      {onDelete && (
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={onDelete}
          aria-label="Verwijderen"
        />
      )}
    </div>
  )
}

export default TableRowActions
