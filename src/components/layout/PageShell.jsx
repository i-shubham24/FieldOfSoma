import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

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
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
    }
    // Always load every page from the absolute top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, hash])
}

export default function PageShell() {
  useScrollRestore()

  return (
    <>
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
    </>
  )
}
