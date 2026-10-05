import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { booking, nav, site } from '../../content/site'
import { EASE } from '../../lib/motion'
import SomaticPause from '../interactive/SomaticPause'
import Button from '../ui/Button'
import Wordmark from './Wordmark'

export default function Header() {
  const [settled, setSettled] = useState(false)
  const [open, setOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  // The bar is clear over the masthead and takes on paper once the page moves.
  useMotionValueEvent(scrollY, 'change', (value) => setSettled(value > 24))

  useEffect(() => {
    if (!open) return undefined

    const page = document.getElementById('page')
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.body.style.overflow = 'hidden'
    page?.setAttribute('inert', '')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      page?.removeAttribute('inert')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-700 ease-soma ${
          settled && !open
            ? 'border-soma-sand bg-soma-paper/95 backdrop-blur-md'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-8">
          <Link to="/" onClick={close} aria-label={`${site.name}, home`}>
            <Wordmark className="text-[1.625rem] leading-none tracking-[-0.01em]" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="link-grow pb-1 text-[0.8125rem] tracking-[0.02em] text-soma-ink/80 transition-colors duration-500 hover:text-soma-ink aria-[current=page]:text-soma-ink"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-7 lg:flex">
            <button
              type="button"
              onClick={() => setPauseOpen(true)}
              className="link-grow pb-1 text-[0.8125rem] tracking-[0.02em] text-soma-moss transition-colors duration-500 hover:text-soma-moss-light"
            >
              Somatic Pause
            </button>
            <Button to={booking.to} variant="outline" size="sm">
              {booking.label}
            </Button>
          </div>

          <button
            type="button"
            className="link-rest pb-1 text-[0.8125rem] font-medium tracking-[0.02em] lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-soma-paper lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav aria-label="Menu" className="shell flex min-h-dvh flex-col pt-28 pb-10">
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.08 + i * 0.06, ease: EASE }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={close}
                      className="block py-1.5 font-display text-[2.5rem] leading-[1.15] font-medium aria-[current=page]:italic"
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col items-start gap-6 pt-14">
                <button
                  type="button"
                  onClick={() => {
                    close()
                    setPauseOpen(true)
                  }}
                  className="link-grow pb-1 text-left text-[1.125rem] font-medium tracking-[0.02em] text-soma-moss"
                >
                  Take a Somatic Pause
                </button>
                <Button to={booking.to} onClick={close} arrow>
                  {booking.label}
                </Button>
                <a
                  href={`mailto:${site.email}`}
                  className="link-rest pb-1 text-[0.875rem] text-soma-clay-deep"
                >
                  {site.email}
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SomaticPause open={pauseOpen} onClose={() => setPauseOpen(false)} />
    </>
  )
}
