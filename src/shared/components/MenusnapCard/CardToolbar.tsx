import { Button } from 'primereact/button'
import { CSSTransition } from 'primereact/csstransition'
import React, { FC, useRef, useState } from 'react'

type ContentItem = {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

interface CardToolbarProps {
  contents?: ContentItem[]
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  collapsable?: boolean
  className?: string
  style?: React.CSSProperties
  dialogWidth?: number
  dialogIsOpen?: boolean
  dialogPosition?: 'left' | 'right'
}

const CardToolbar: FC<CardToolbarProps> = ({
  contents,
  leftContent,
  rightContent,
  collapsable = false,
  className = '',
  style,
  dialogWidth,
  dialogIsOpen,
  dialogPosition = 'right',
}) => {
  const rows: ContentItem[] =
    contents && contents.length > 0
      ? contents
      : [{ leftContent, rightContent }]

  const firstRow = rows[0]
  const otherRows = rows.slice(1)

  const [expanded, setExpanded] = useState(!collapsable)
  const groupRef = useRef<HTMLDivElement>(null)

  const dynamicStyles: React.CSSProperties =
    dialogWidth && dialogIsOpen
      ? {
          [dialogPosition === 'left' ? 'marginLeft' : 'marginRight']:
            dialogWidth,
        }
      : {}

  return (
    <div className={`card ${className}`} style={{ ...dynamicStyles, ...style }}>
      <div className="flex items-center justify-between">
        {firstRow.leftContent && (
          <div className="card-toolbar-left flex flex-row flex-1 min-w-0">
            {firstRow.leftContent}
          </div>
        )}
        <div className="card-toolbar-right flex flex-row shrink-0">
          {firstRow.rightContent}
          {collapsable && otherRows.length > 0 && (
            <Button
              style={{ marginLeft: '1rem' }}
              size="small"
              icon={expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
              className="p-button-text"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            />
          )}
        </div>
      </div>

      {collapsable ? (
        <CSSTransition
          nodeRef={groupRef}
          classNames="p-toggleable-content"
          in={expanded}
          timeout={{ enter: 300, exit: 250 }}
          unmountOnExit
        >
          <div ref={groupRef} className="overflow-hidden">
            <div style={{ marginTop: '1.5rem' }}>
              {otherRows.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between"
                  style={{
                    marginBottom:
                      idx < otherRows.length - 1 ? '1.5rem' : undefined,
                  }}
                >
                  {item.leftContent && (
                    <div className="card-toolbar-left flex flex-row flex-1 min-w-0">
                      {item.leftContent}
                    </div>
                  )}
                  {item.rightContent && (
                    <div className="card-toolbar-right flex flex-row shrink-0">
                      {item.rightContent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CSSTransition>
      ) : (
        otherRows.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            {otherRows.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between"
                style={{
                  marginBottom:
                    idx < otherRows.length - 1 ? '1.5rem' : undefined,
                }}
              >
                {item.leftContent && (
                  <div className="card-toolbar-left flex flex-row flex-1 min-w-0">
                    {item.leftContent}
                  </div>
                )}
                {item.rightContent && (
                  <div className="card-toolbar-right flex flex-row shrink-0">
                    {item.rightContent}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default CardToolbar
