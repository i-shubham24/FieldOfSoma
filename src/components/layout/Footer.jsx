import { Link } from 'react-router-dom'
import { footerGroups, site } from '../../content/site'
import Wordmark from './Wordmark'

const linkClass =
  'link-grow pb-0.5 text-[0.9375rem] whitespace-nowrap text-soma-ink/80 transition-colors duration-500 hover:text-soma-ink'

// Column widths on wide screens: brand 1 to 3, a gap, then the three link groups.
const GROUP_SPANS = ['lg:col-span-3 lg:col-start-5', 'lg:col-span-2']

const titleClass = 'font-sans text-label font-medium uppercase text-soma-clay-deep'

export default function Footer() {
  return (
    <footer className="bg-soma-linen">
      <div className="shell pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-12">
          <div className="sm:col-span-3">
            <Link to="/" aria-label={`${site.name}, home`}>
              <Wordmark className="text-[1.75rem] leading-none tracking-[-0.01em]" />
            </Link>
            <p className="mt-5 max-w-[26ch] text-[0.9375rem] leading-[1.7] text-soma-ink/80">
              Movement and somatic education with {site.person}.
            </p>
          </div>

          {footerGroups.map((group, i) => (
            <nav key={group.title} aria-label={group.title} className={GROUP_SPANS[i]}>
              <h2 className={titleClass}>{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <h2 className={titleClass}>Connect</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer" className={linkClass}>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-2 border-t border-soma-ink/15 pt-6 text-[0.8125rem] text-soma-clay-deep sm:flex-row sm:justify-between md:mt-24">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>
            {site.person}, {site.role}
          </p>
        </div>
      </div>
    </footer>
  )
}
