/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

import { useActions } from '@stackflow/react'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { useRef } from 'react'

import type { GlobalVars } from '../basicUIPlugin.css'
import { globalVars } from '../basicUIPlugin.css'
import { useLazy, useNullableActivity, useStyleEffect } from '../hooks'
import { compactMap } from '../utils'
import * as css from './Modal.css'

export type ModalProps = Partial<Pick<GlobalVars, 'backgroundColor' | 'dimBackgroundColor'>> &
  Partial<GlobalVars['modal']> & {
    onOutsideClick?: React.MouseEventHandler
    children: React.ReactNode
  }
const Modal: React.FC<ModalProps> = ({
  backgroundColor,
  dimBackgroundColor,
  borderRadius = '1rem',
  onOutsideClick,
  children
}) => {
  const activity = useNullableActivity()
  const { pop } = useActions()

  const containerRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)

  useStyleEffect({
    styleName: 'hide',
    refs: [containerRef]
  })
  useStyleEffect({
    styleName: 'offset',
    refs: [paperRef]
  })
  useStyleEffect({
    styleName: 'swipe-back',
    refs: [paperRef]
  })

  const popLock = useRef(false)

  const onDimClick: React.MouseEventHandler = (e) => {
    ;(onOutsideClick as any)?.(e)

    if (e.defaultPrevented) {
      return
    }

    if (popLock.current) {
      return
    }
    popLock.current = true

    pop()
  }
  const onPaperClick: React.MouseEventHandler = (e) => {
    e.stopPropagation()
  }

  const zIndexBase = (activity?.zIndex ?? 0) * 5 + 3
  const zIndexPaper = (activity?.zIndex ?? 0) * 5 + 4
  const transitionState = activity?.transitionState ?? 'enter-done'

  return (
    <div
      className={css.container({
        transitionState: useLazy(transitionState)
      })}
      ref={containerRef}
      style={assignInlineVars(
        compactMap({
          [globalVars.bottomSheet.borderRadius]: borderRadius,
          [globalVars.backgroundColor]: backgroundColor,
          [globalVars.dimBackgroundColor]: dimBackgroundColor,
          [css.vars.zIndexes.dim]: `${zIndexBase}`,
          [css.vars.zIndexes.paper]: `${zIndexPaper}`,
          [css.vars.transitionDuration]:
            transitionState === 'enter-active' || transitionState === 'exit-active'
              ? globalVars.computedTransitionDuration
              : '0ms'
        })
      )}
      data-stackflow-component-name="Modal"
      data-stackflow-activity-id={activity?.id}
      data-stackflow-activity-is-active={activity?.isActive}
    >
      <div className={css.dim} ref={paperRef} onClick={onDimClick}>
        <div className={css.paper} onClick={onPaperClick}>
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.displayName = 'Modal'

export default Modal
