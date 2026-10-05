import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      prevent: (node) => {
        if (!node || typeof node.hasAttribute !== 'function') return false
        return Boolean(
          node.hasAttribute('data-lenis-prevent') ||
          node.hasAttribute('data-lenis-prevent-wheel') ||
          node.hasAttribute('data-lenis-prevent-touch') ||
          node.closest?.(
            '[data-lenis-prevent], [data-lenis-prevent-wheel], [role="dialog"], [data-modal], .overflow-y-auto, .overflow-auto'
          )
        )
      },
      allowNestedScroll: true,
    })

    window.__lenis = lenis

    // Prevent Lenis from intercepting or swallowing wheel & touch on nested modals and scroll areas
    const stopLenisCapture = (e) => {
      const isNestedScroll = e.target.closest?.(
        '[data-lenis-prevent], [role="dialog"], [data-modal], .overflow-y-auto, .overflow-auto'
      )
      if (isNestedScroll) {
        e.stopPropagation()
      }
    }
    window.addEventListener('wheel', stopLenisCapture, { capture: true, passive: true })
    window.addEventListener('touchmove', stopLenisCapture, { capture: true, passive: true })

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', stopLenisCapture, { capture: true })
      window.removeEventListener('touchmove', stopLenisCapture, { capture: true })
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  // Universal mouse click-and-drag scrolling for effortless navigation without scrollbars
  useEffect(() => {
    let isDown = false
    let startY = 0
    let scrollStartY = 0
    let hasDragged = false

    const onMouseDown = (e) => {
      if (e.button !== 0) return
      if (
        e.target.closest(
          'input, textarea, button, a, select, option, label, [role="button"], [contenteditable="true"], .no-drag-scroll, .touch-pan-y'
        )
      ) {
        return
      }
      if (e.target.closest('[role="dialog"]')) {
        return
      }
      isDown = true
      hasDragged = false
      startY = e.clientY
      scrollStartY = window.scrollY
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      const deltaY = e.clientY - startY
      if (Math.abs(deltaY) > 5) {
        hasDragged = true
        document.body.style.cursor = 'grabbing'
        document.body.style.userSelect = 'none'
      }
      if (hasDragged) {
        e.preventDefault()
        const targetY = scrollStartY - deltaY
        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, { immediate: true })
        } else {
          window.scrollTo({ top: targetY, behavior: 'instant' })
        }
      }
    }

    const onMouseUp = () => {
      if (!isDown) return
      isDown = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove, { passive: false })
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return children
}
