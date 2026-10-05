import { Link } from 'react-router-dom'
import { site } from '../../content/site'

const DISCIPLINES = [
  { to: '/practices#somatics', label: 'Clinical Somatics' },
  { to: '/practices#tai-chi', label: 'Tai Chi Form' },
  { to: '/practices#creative-movement', label: 'Creative Movement' },
  { to: '/practices', label: 'Spoken Audio Guidance' },
  { to: '/somatics', label: 'Sensory Body Map' },
  { to: '/calendar', label: 'Private Consultations' },
]

const EXPLORE = [
  { to: '/somatics', label: 'Discover Somatics' },
  { to: '/practices', label: 'The Practices' },
  { to: '/classes', label: 'Recorded Classes' },
  { to: '/calendar', label: 'Calendar and Booking' },
  { to: '/about', label: 'About Kirti' },
  { to: '/articles', label: 'Writing and Essays' },
]

export default function Footer() {
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
                Body-based practices for living healing.
              </p>
              <p className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-normal leading-[1.3] text-soma-ink">
                Informed by Somatics, Tai Chi,<br />
                and Creative Movement from dance.
              </p>
              <p className="font-sans text-[0.875rem] font-normal leading-[1.6] text-soma-clay-deep max-w-[38ch]">
                Cultivating felt presence and coming back to the body&apos;s innate capacity to heal, steady, and express.
              </p>
            </div>
          </div>

          {/* Right Columns (Disciplines, Explore, Connect) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-10">
            {/* Column 1: Disciplines */}
            <div>
              <p className="font-sans text-[0.8125rem] font-medium tracking-[0.02em] text-soma-ink/50">
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
              <p className="font-sans text-[0.8125rem] font-medium tracking-[0.02em] text-soma-ink/50">
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

            {/* Column 3: Connect */}
            <div className="col-span-2 sm:col-span-1">
              <p className="font-sans text-[0.8125rem] font-medium tracking-[0.02em] text-soma-ink/50">
                Connect
              </p>
              <ul className="mt-5 space-y-2.5 font-sans text-[0.9375rem]">
                <li>
                  <Link
                    to="/contact"
                    className="text-soma-ink transition-colors duration-300 hover:text-soma-moss"
                  >
                    Contact Studio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-soma-ink transition-colors duration-300 hover:text-soma-moss"
                  >
                    Member Login
                  </Link>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-soma-ink transition-colors duration-300 hover:text-soma-moss"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-soma-ink transition-colors duration-300 hover:text-soma-moss"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Field of Soma lettering across bottom-left + copyright baseline on right */}
        <div className="mt-14 flex flex-col justify-between gap-6 border-t border-soma-ink/15 pt-8 sm:mt-18 lg:mt-20 lg:flex-row lg:items-end">
          <div className="select-none">
            <span className="block font-display text-[clamp(3.75rem,11vw,9.5rem)] font-semibold tracking-tight leading-none text-soma-ink uppercase">
              SOMA
            </span>
          </div>

          <div className="pb-1 text-left sm:text-right lg:pb-2">
            <p className="font-sans text-[0.8125rem] tracking-[0.04em] text-soma-clay-deep">
              © {new Date().getFullYear()} Field of Soma, All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
