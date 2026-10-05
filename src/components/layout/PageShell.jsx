import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import SmoothScroll from './SmoothScroll'

// Each new page opens at the top always, or at the anchor section if hashed.
function useScrollRestore() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const target = document.getElementById(id)
      if (target) {
        if (window.__lenis) {
          window.__lenis.scrollTo(target, { immediate: false, offset: -80 })
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        return
      }
    }
    // Always load every page from the absolute top immediately
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, hash])
}

export default function PageShell() {
  useScrollRestore()

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
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
