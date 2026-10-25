import { useEffect, useRef } from 'react'

// Scroll locks are counted, so a modal that opens over another (or over the menu)
// never unlocks the page while something is still open.
let locks = 0

export function lockScroll() {
  locks += 1
  if (locks > 1) return
  window.__lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  document.documentElement.style.overflow = ''
  window.__lenis?.start()
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Modal behaviour for a component mounted only while open: locks scroll, moves focus
// inside, keeps Tab within the dialog, closes on Escape and returns focus on close.
export default function useDialog(ref, onClose) {
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    lockScroll()
    const previous = document.activeElement
    const node = ref.current
    const first = node?.querySelector(FOCUSABLE)
    ;(first ?? node)?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        closeRef.current?.()
        return
      }
      if (event.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      // Focus can also sit on the dialog box itself (after a click on empty space): wrap from there too
      const inside = items.includes(document.activeElement)
      if (event.shiftKey && (document.activeElement === firstItem || !inside)) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && (document.activeElement === lastItem || !inside)) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      unlockScroll()
      previous?.focus?.({ preventScroll: true })
    }
  }, [ref])
}
