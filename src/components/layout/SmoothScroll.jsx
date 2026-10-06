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

  return children
}
