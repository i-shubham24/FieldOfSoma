import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../content/site'
import { EASE } from '../../lib/motion'
import ContactLinks from '../ui/ContactLinks'
import Wordmark from './Wordmark'

const DISCIPLINES = [
  { to: '/practices#tai-chi', label: 'Tai Chi' },
  { to: '/practices#creative-movement', label: 'Creative Movement' },
  { to: '/calendar', label: 'Private Sessions' },
]

const EXPLORE = [
  { to: '/somatics', label: 'Discover Somatics' },
  { to: '/practices', label: 'The Practices' },
  { to: '/classes', label: 'Recorded Classes' },
  { to: '/calendar', label: 'Calendar and Booking' },
  { to: '/about', label: 'About Kirti' },
  { to: '/articles', label: 'Writing' },
]

export default function Footer() {
  const reduce = useReducedMotion()

  return (
    <footer className="overflow-hidden border-t border-soma-sand/70 bg-[#EAE7E1] text-soma-ink">
      <div className="shell pt-20 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-14">
        {/* Top Section: Editorial statement on left, 3 link columns on right (mirrors ViV MGMT) */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left statement with high-contrast serif and selective italics */}
          <div className="lg:col-span-5">
            <div className="space-y-5">
              <p className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-normal leading-[1.3] text-soma-ink">
                <span className="italic">Field of Soma</span> is movement education.<br />
                Body-based practices for healing and living well.
              </p>
              <p className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-normal leading-[1.3] text-soma-ink">
                Informed by Somatics and Tai Chi,<br />
                with Creative Movement from dance.
              </p>
              <p className="font-sans text-[0.875rem] font-normal leading-[1.6] text-soma-clay-deep max-w-[38ch]">
                Cultivating felt presence and coming back to the body&apos;s innate capacity to heal, steady and express.
              </p>
            </div>
          </div>

          {/* Right columns: Disciplines, Explore, and contact */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-10">
            {/* Column 1: Disciplines */}
            <div>
              <p className="font-sans text-[0.8125rem] font-medium tracking-[0.02em] text-soma-ink/75">
                Disciplines
              </p>
              <ul className="mt-5 space-y-2.5">
                {DISCIPLINES.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="font-sans text-[0.9375rem] text-soma-ink transition-colors duration-300 hover:text-soma-moss"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Explore */}
            <div>
              <p className="font-sans text-[0.8125rem] font-medium tracking-[0.02em] text-soma-ink/75">
                Explore
              </p>
              <ul className="mt-5 space-y-2.5">
                {EXPLORE.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="font-sans text-[0.9375rem] text-soma-ink transition-colors duration-300 hover:text-soma-moss"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: contact icons only, in squares set flush with the right edge.
                The top padding lines the first square up with the first link in the other columns. */}
            <div className="col-span-2 sm:col-span-1 sm:flex sm:justify-end sm:pt-[2.6rem] sm:pr-6 lg:pr-10">
              <ContactLinks boxed size={24} />
            </div>
          </div>
        </div>

        {/* Bottom: the same wordmark as the top bar, settling gently into place */}
        <div className="mt-14 flex flex-col justify-between gap-6 overflow-hidden border-t border-soma-ink/15 pt-8 sm:mt-18 lg:mt-20 lg:flex-row lg:items-end">
          <Link to="/" aria-label={`${site.name}, home`} className="self-start">
            <motion.span
              initial={reduce ? false : { opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease: EASE }}
              className="block"
            >
              <Wordmark className="text-[1.375rem] sm:text-[1.625rem]" />
            </motion.span>
          </Link>

          <div className="max-w-[46ch] space-y-2 text-left lg:text-right">
            <p className="font-sans text-[0.8125rem] leading-[1.6] text-soma-clay-deep">
              Somatic education is not medical treatment. Please keep seeing your doctor or
              therapist for any medical condition.
            </p>
            <p className="font-sans text-[0.8125rem] tracking-[0.04em] text-soma-clay-deep">
              © {new Date().getFullYear()} {site.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
