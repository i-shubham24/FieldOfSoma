import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import AmbientSound from '../shared/AmbientSound'
import Footer from './Footer'
import Header from './Header'
import SmoothScroll from './SmoothScroll'
import { EASE } from '../../lib/motion'

// Ensures each page loads from the top, unless directed to an intentional section anchor.
function useScrollRestore() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const isAnchor = hash && hash !== '#main' && hash.length > 1
    const targetId = isAnchor ? hash.slice(1) : null

    if (targetId) {
      const scrollAttempt = () => {
        const target = document.getElementById(targetId)
        if (target) {
          if (window.__lenis) {
            window.__lenis.scrollTo(target, { immediate: false, offset: -80 })
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          return true
        }
        return false
      }

      if (!scrollAttempt()) {
        const timer1 = setTimeout(scrollAttempt, 60)
        const timer2 = setTimeout(scrollAttempt, 180)
        return () => {
          clearTimeout(timer1)
          clearTimeout(timer2)
        }
      }
      return undefined
    }

    // Load page from the absolute top immediately if not directed intentionally to a section
    const resetToTop = () => {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true })
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    resetToTop()

    // Counteract any layout shift from lazy route chunk mounting
    const t1 = setTimeout(resetToTop, 50)
    const t2 = setTimeout(resetToTop, 160)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname, hash])
}

export default function PageShell() {
  useScrollRestore()
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  return (
    <SmoothScroll>
      <a
        href="#main"
        className="sr-only rounded-[2px] bg-soma-ink px-5 py-3 text-[0.875rem] text-soma-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70]"
      >
        Skip to content
      </a>
      <Header />
      <div id="page">
        <main id="main" className="min-h-[85dvh]">
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>

      {/* Persistent ambient sound player and bottom right switch */}
      <AmbientSound />
    </SmoothScroll>
  )
}
