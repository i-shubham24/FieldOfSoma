import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { HandbagSimpleIcon } from '@phosphor-icons/react/dist/csr/HandbagSimple'
import { images } from '../../content/images'
import { site } from '../../content/site'
import { useCart } from '../../lib/cart'
import { lockScroll, unlockScroll } from '../../lib/useDialog'
import SomaticPause from '../interactive/SomaticPause'
import Wordmark from './Wordmark'

// Bespoke editorial deceleration ease inspired by Kinfolk: slow to start, deep velvety settle
const KINFOLK_EASE = [0.19, 1, 0.22, 1]

// Main editorial categories (large serif on right, mirroring Kinfolk layout)
const EDITORIAL_CATEGORIES = [
  { to: '/somatics', label: 'Discover Somatics' },
  { to: '/practices', label: 'The Practices' },
  { to: '/classes', label: 'Recorded Classes' },
  { to: '/calendar', label: 'Calendar and Booking' },
  { to: '/about', label: 'About Kirti' },
  { to: '/articles', label: 'Writing and Essays' },
  { to: '/contact', label: 'Contact' },
]

// Curated core disciplines (middle column in sans-serif)
const CORE_DISCIPLINES = [
  { to: '/practices#somatics', label: 'Somatic Movement Therapy' },
  { to: '/practices#tai-chi', label: 'Tai Chi' },
  { to: '/practices#creative-movement', label: 'Creative Movement' },
]

const CONNECT_LINKS = [
  { href: `mailto:${site.email}`, label: site.email },
  { href: site.instagram, label: 'Instagram' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const [query, setQuery] = useState('')
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { count: cartCount } = useCart()
  const location = useLocation()

  const [overDark, setOverDark] = useState(false)
  const [hideLogo, setHideLogo] = useState(false)

  // Track scroll position for contrast over dark bands, and tuck the logo away near the footer
  useEffect(() => {
    let rafId = null

    const handleScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null

        // 1. Dark sections contrast detection
        const darkSections = document.querySelectorAll('[data-theme="dark"]')
        let isDark = false
        const headerY = 45 // Center height of fixed top bar

        for (const section of darkSections) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= headerY && rect.bottom >= headerY) {
            isDark = true
            break
          }
        }
        setOverDark((prev) => (prev !== isDark ? isDark : prev))

        // 2. Logo visibility: always shown on phones, elsewhere hidden just before the footer
        if (window.innerWidth < 640) {
          setHideLogo((prev) => (prev ? false : prev))
          return
        }

        const footer = document.querySelector('footer')
        const nearFooter = footer ? footer.getBoundingClientRect().top <= 140 : false

        setHideLogo((prev) => (prev !== nearFooter ? nearFooter : prev))
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [location.pathname])

  // Escape closes, the page behind goes inert, and scroll is locked. The root keeps a
  // stable scrollbar gutter (index.css), so locking does not shift the layout.
  useEffect(() => {
    if (!open) return undefined

    lockScroll()
    const page = document.getElementById('page')
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    page?.setAttribute('inert', '')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      unlockScroll()
      page?.removeAttribute('inert')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      close()
      // Passed in router state, not the URL, so what someone types never lands in history or logs
      navigate('/contact', { state: { message: query.trim() } })
      setQuery('')
    }
  }

  return (
    <>
      {/* Top sticky bar: fixed across all devices; nav bg on mobile screens only, transparent on tabs and laptops */}
      <header
        className={`fixed inset-x-0 top-0 z-50 pointer-events-none transition-colors duration-300 ${
          open
            ? 'bg-transparent border-transparent shadow-none'
            : overDark
              ? 'bg-soma-ink/90 border-b border-soma-sand/20 backdrop-blur-md shadow-2xs sm:bg-transparent sm:border-transparent sm:shadow-none sm:backdrop-blur-none'
              : 'bg-soma-paper/95 border-b border-soma-sand/50 backdrop-blur-md shadow-2xs sm:bg-transparent sm:border-transparent sm:shadow-none sm:backdrop-blur-none'
        }`}
      >
        {/* Masthead posture: compact on mobile, generous editorial on tabs and laptops */}
        <div
          className={`shell flex items-center justify-between pt-3.5 pb-3.5 sm:pt-7 sm:pb-5 pointer-events-auto transition-colors duration-500 ${
            open
              ? 'text-soma-ink'
              : overDark
                ? 'text-soma-paper'
                : 'text-soma-ink'
          }`}
        >
          {/* Left: Minimalist editorial wordmark - scrolls up out of sight past Pillars, returns when scrolling back up */}
          <Link
            to="/"
            onClick={close}
            aria-label={`${site.name}, home`}
            className={`transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform ${
              hideLogo && !open
                ? 'max-sm:translate-y-0 max-sm:opacity-100 max-sm:pointer-events-auto sm:-translate-y-16 sm:opacity-0 sm:pointer-events-none'
                : 'translate-y-0 opacity-100 pointer-events-auto'
            }`}
          >
            <Wordmark className="text-[1.25rem] sm:text-[1.375rem] text-inherit" />
          </Link>

          {/* Right: the cart (once something is in it), then the menu button */}
          <div className="flex items-center gap-1 sm:gap-3">
          {cartCount > 0 && !open ? (
            <Link
              to="/cart"
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'class' : 'classes'}`}
              className="relative flex h-11 w-11 items-center justify-center text-inherit focus:outline-none focus-visible:ring-1 focus-visible:ring-current"
            >
              <HandbagSimpleIcon size={24} weight="light" aria-hidden="true" />
              <span className="absolute top-1.5 right-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center bg-soma-moss px-1 text-[0.6875rem] leading-none font-medium text-soma-paper tabular-nums">
                {cartCount}
              </span>
            </Link>
          ) : null}
          <button
            type="button"
            className="group relative flex h-11 w-11 cursor-pointer items-center justify-center text-inherit focus:outline-none focus-visible:ring-1 focus-visible:ring-current"
            aria-expanded={open}
            aria-controls="kinfolk-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="relative h-6 w-8 sm:w-9">
              {/* Top parallel line */}
              <span
                className={`absolute inset-x-0 top-[11px] block h-[2px] w-full bg-current origin-center transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  open
                    ? 'translate-y-0 rotate-45'
                    : '-translate-y-[5px] rotate-0 group-hover:-translate-y-[7.5px]'
                }`}
              />
              {/* Bottom parallel line */}
              <span
                className={`absolute inset-x-0 top-[11px] block h-[2px] w-full bg-current origin-center transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  open
                    ? 'translate-y-0 -rotate-45'
                    : 'translate-y-[5px] rotate-0 group-hover:translate-y-[7.5px]'
                }`}
              />
            </div>
          </button>
          </div>
        </div>
      </header>

      {/* Kinfolk Menu Overlay: Slides down smoothly with subtle top gradient & ambient depth */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="kinfolk-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation menu"
            className="fixed inset-0 z-40 h-[100dvh] max-h-[100dvh] overflow-y-auto lg:overflow-hidden bg-gradient-to-b from-[#D4D8CF] via-[#DCE0D7] to-[#E3E6DF] text-soma-ink select-none"
            initial={reduce ? false : { y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.85,
              ease: KINFOLK_EASE,
            }}
          >
            {/* Ambient subtle top shadow / vignette gradient coming from top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-stone-900/[0.045] via-stone-800/[0.015] to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-transparent to-stone-900/[0.025]" />

            {/* Main content container fitted to one viewport without scrolling, gracefully arranged */}
            <div className="shell relative z-10 flex h-full flex-col justify-between pt-20 pb-8 sm:pt-24 sm:pb-10 lg:pt-24 lg:pb-10">
              <div className="grid w-full h-full lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                {/* Left column: Promo card matching Kinfolk, anchored to the bottom-left corner */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: -20, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                  transition={{ duration: 0.85, delay: 0.28, ease: KINFOLK_EASE }}
                  className="order-3 hidden flex-col justify-end lg:order-1 lg:col-span-4 lg:flex lg:self-end pb-2"
                >
                  <div className="w-full max-w-sm border border-soma-sand/90 bg-soma-paper/95 p-5 shadow-sm">
                    <div className="flex gap-4 items-center">
                      <div className="h-20 w-16 shrink-0 overflow-hidden bg-soma-linen">
                        <img
                          src={images.kirtiSomaticWorkshop.src}
                          alt={images.kirtiSomaticWorkshop.alt}
                          className="photo h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-sans text-[0.75rem] font-medium tracking-[0.16em] text-soma-moss uppercase">
                          Practice with Kirti
                        </p>
                        <p className="mt-1 font-display text-[1.125rem] leading-[1.2] font-medium text-soma-ink">
                          Private Consultations
                        </p>
                        <p className="mt-1.5 text-[0.8125rem] leading-[1.45] text-soma-clay-deep">
                          Begin wherever your body is today. In person or live online.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-soma-sand/70 pt-3 flex items-center justify-between">
                      <Link
                        to="/calendar"
                        onClick={close}
                        className="link-grow text-[0.8125rem] font-medium text-soma-ink"
                      >
                        Book a Consultation
                      </Link>
                      <Link
                        to="/about"
                        onClick={close}
                        className="text-[0.75rem] text-soma-clay-deep transition-colors hover:text-soma-ink"
                      >
                        About Kirti &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Middle column: Curated Disciplines and Experiential Access */}
                <div className="order-2 flex flex-col justify-center space-y-5 sm:space-y-6 lg:order-2 lg:col-span-3 lg:pl-6 my-auto">
                  {/* The Disciplines */}
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: -20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                    transition={{ duration: 0.85, delay: 0.22, ease: KINFOLK_EASE }}
                  >
                    <p className="font-sans text-label font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
                      The Disciplines
                    </p>
                    <ul className="mt-2.5 space-y-1.5">
                      {CORE_DISCIPLINES.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.to}
                            onClick={close}
                            className="link-grow text-[0.875rem] text-soma-ink/80 transition-colors hover:text-soma-ink"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Connect */}
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: -20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                    transition={{ duration: 0.85, delay: 0.28, ease: KINFOLK_EASE }}
                  >
                    <p className="font-sans text-label font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
                      Connect
                    </p>
                    <ul className="mt-2 space-y-1">
                      {CONNECT_LINKS.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                            rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                            className="link-grow text-[0.875rem] text-soma-ink/80 transition-colors hover:text-soma-ink"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Somatic Pause Experience */}
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: -20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                    transition={{ duration: 0.85, delay: 0.32, ease: KINFOLK_EASE }}
                  >
                    <p className="font-sans text-label font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
                      Experiential
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        close()
                        setPauseOpen(true)
                      }}
                      className="link-grow mt-1.5 cursor-pointer text-left text-[0.875rem] font-medium text-soma-moss"
                    >
                      Experience Somatic Pause
                    </button>
                  </motion.div>

                  {/* Member Access */}
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: -20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                    transition={{ duration: 0.85, delay: 0.38, ease: KINFOLK_EASE }}
                  >
                    <p className="font-sans text-label font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
                      Archive Access
                    </p>
                    <div className="mt-1.5">
                      <Link
                        to="/login"
                        onClick={close}
                        className="link-rest pb-0.5 text-[0.875rem] text-soma-ink/80 hover:text-soma-ink"
                      >
                        Login / Member Archive
                      </Link>
                    </div>
                  </motion.div>

                </div>

                {/* Right column: Large Serif Editorial Navigation & Inquire form anchored bottom-right */}
                <div className="order-1 flex flex-col justify-between lg:order-3 lg:col-span-5 h-full">
                  <nav aria-label="Editorial Sections">
                    <ul className="space-y-1.5 sm:space-y-2">
                      {EDITORIAL_CATEGORIES.map((cat, i) => (
                        <motion.li
                          key={cat.to}
                          initial={reduce ? false : { opacity: 0, y: -22, filter: 'blur(5px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                          transition={{
                            duration: 0.85,
                            delay: 0.16 + i * 0.04,
                            ease: KINFOLK_EASE,
                          }}
                        >
                          <NavLink
                            to={cat.to}
                            onClick={close}
                            className="block font-display text-[clamp(1.4rem,2.1vw,1.95rem)] leading-[1.24] text-soma-ink transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:translate-x-2.5 hover:text-soma-moss hover:italic aria-[current=page]:italic aria-[current=page]:text-soma-moss"
                          >
                            {cat.label}
                          </NavLink>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  {/* Kinfolk style search / inquiry input, anchored to bottom-right corner */}
                  <motion.form
                    onSubmit={handleSearchSubmit}
                    initial={reduce ? false : { opacity: 0, y: -14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
                    transition={{ duration: 0.85, delay: 0.48, ease: KINFOLK_EASE }}
                    className="mt-auto pt-6 w-full max-w-sm pb-2 self-start"
                  >
                    <div className="flex items-center justify-between border-b border-soma-ink/30 pb-2">
                      <input
                        type="text"
                        name="inquiry"
                        aria-label="Type here to inquire"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type here to inquire"
                        className="w-full bg-transparent font-sans text-base text-soma-ink placeholder:text-soma-clay-deep focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="link-rest shrink-0 cursor-pointer pb-0.5 text-[0.75rem] font-medium text-soma-ink uppercase tracking-wider"
                      >
                        Inquire
                      </button>
                    </div>
                  </motion.form>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Somatic Pause Interactive Guidance Modal */}
      <SomaticPause open={pauseOpen} onClose={() => setPauseOpen(false)} />
    </>
  )
}
