import { Button } from 'primereact/button'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClearFilters?: () => void
  showClearFilters?: boolean
  placeholder?: string
  searchClassName?: string
  inputClassName?: string
  className?: string
  disabled?: boolean
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClearFilters,
  showClearFilters = true,
  placeholder,
  searchClassName,
  inputClassName = 'w-full',
  className = 'flex gap-2',
  disabled = false,
}) => {
  const { t } = useTranslation()

  return (
    <div className={className}>
      <IconField iconPosition="left" className={searchClassName}>
        <InputIcon className="pi pi-search" />
        <InputText
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? t('tenants.search')}
          className={inputClassName}
          disabled={disabled}
        />
      </IconField>

      {showClearFilters && onClearFilters && (
        <Button
          icon="pi pi-filter-slash"
          label={t('common.clear')}
          className="p-button-outlined p-button-secondary"
          onClick={onClearFilters}
          tooltip={t('common.clearFilters')}
          tooltipOptions={{ position: 'top' }}
          disabled={disabled}
        />
      )}
    </div>
  )
}

export default SearchInput
