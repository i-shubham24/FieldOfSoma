import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

// Each new page opens at the top, or at the section named in the address.
function useScrollRestore() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
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
