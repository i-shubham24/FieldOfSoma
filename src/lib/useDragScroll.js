import { useEffect, useRef } from 'react'

export function useDragScroll(externalRef, options = {}) {
  const internalRef = useRef(null)

  const isRefPassed =
    externalRef &&
    typeof externalRef === 'object' &&
    'current' in externalRef

  const ref = isRefPassed ? externalRef : internalRef
  const opts = isRefPassed
    ? options
    : externalRef && typeof externalRef === 'object'
    ? externalRef
    : {}

  const { enabled = true, direction = 'vertical' } = opts

  useEffect(() => {
    const el = ref?.current
    if (!el || !enabled) return

    let isDown = false
    let startY = 0
    let startX = 0
    let scrollTop = 0
    let scrollLeft = 0
    let hasDragged = false

    const onMouseDown = (e) => {
      if (e.button !== 0) return
      // Don't drag if clicking text inputs, textareas, selects, or actual links/buttons
      if (
        e.target.closest(
          'input:not([type="radio"]):not([type="checkbox"]), textarea, select, button, a, [contenteditable="true"]'
        )
      ) {
        return
      }
      isDown = true
      hasDragged = false
      startY = e.clientY
      startX = e.clientX
      scrollTop = el.scrollTop
      scrollLeft = el.scrollLeft
    }

    const onMouseMove = (e) => {
      if (!isDown) return

      const deltaY = (e.clientY - startY) * 1.2
      const deltaX = (e.clientX - startX) * 1.2

      if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) {
        hasDragged = true
        el.style.cursor = 'grabbing'
        el.style.userSelect = 'none'
      }

      if (hasDragged) {
        e.preventDefault()
        if (direction === 'vertical' || direction === 'both') {
          el.scrollTop = scrollTop - deltaY
        }
        if (direction === 'horizontal' || direction === 'both') {
          el.scrollLeft = scrollLeft - deltaX
        }
      }
    }

    const onMouseUp = () => {
      if (!isDown) return
      isDown = false
      el.style.cursor = ''
      el.style.userSelect = ''
    }

    const onMouseLeave = () => {
      if (!isDown) return
      isDown = false
      el.style.cursor = ''
      el.style.userSelect = ''
    }

    const onClickCapture = (e) => {
      if (hasDragged) {
        e.preventDefault()
        e.stopPropagation()
        hasDragged = false
      }
    }

    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove, { passive: false })
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('click', onClickCapture, true)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('click', onClickCapture, true)
      el.style.cursor = ''
      el.style.userSelect = ''
    }
  }, [ref, enabled, direction])

  return ref
}
