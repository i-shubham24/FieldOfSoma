import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
import { InstagramLogoIcon } from '@phosphor-icons/react/dist/csr/InstagramLogo'
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { contactLinks } from '../../content/site'

const ICONS = {
  email: EnvelopeSimpleIcon,
  whatsapp: WhatsappLogoIcon,
  instagram: InstagramLogoIcon,
}

const NAMES = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
}

// Email, WhatsApp and Instagram as filled icons in the theme's moss green. The visible
// text is left out on purpose; each link still has a name for screen readers.
// `boxed` sets each icon in a hairline square that fills with moss on hover (the footer);
// without it the icons stand alone, in a column or (with `row`) side by side (the menu).
export default function ContactLinks({ className = '', size = 26, boxed = false, row = false, onNavigate }) {
  const list = boxed
    ? 'flex gap-3 sm:flex-col'
    : row
      ? 'flex items-center gap-2'
      : 'flex flex-col items-start gap-1'
  const link = boxed
    ? 'h-14 w-14 border border-soma-ink/15 bg-soma-paper/50 text-soma-moss hover:border-soma-moss hover:bg-soma-moss hover:text-soma-paper'
    : 'h-11 w-11 text-soma-moss hover:text-soma-ink'

  return (
    <ul className={`${list} ${className}`}>
      {contactLinks.map((item) => {
        const Icon = ICONS[item.id]
        return (
          <li key={item.id}>
            <a
              href={item.href}
              onClick={onNavigate}
              aria-label={`${NAMES[item.id]}: ${item.label}`}
              title={item.label}
              {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className={`flex items-center justify-center rounded-[2px] transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-soma-moss ${link}`}
            >
              <Icon size={size} weight="fill" aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
