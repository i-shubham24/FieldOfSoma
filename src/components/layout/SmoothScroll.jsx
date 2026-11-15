import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.0,
      syncTouch: false,
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

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return children
}
