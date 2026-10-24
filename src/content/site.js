// Site-wide content. Anything marked PLACEHOLDER is waiting on Kirti.

export const site = {
  name: 'Field of Soma',
  person: 'Kirti Verma',
  role: 'Movement and Somatic Educator',
  email: 'info@fieldofsoma.com',
  whatsapp: '+91 98992 90074',
  instagram: 'https://www.instagram.com/kah_chi_chi/',
}

// The ways to reach Kirti, shown with monochrome icons in the menu, footer and contact page.
export const contactLinks = [
  { id: 'email', label: site.email, href: `mailto:${site.email}` },
  {
    id: 'whatsapp',
    label: site.whatsapp,
    href: `https://wa.me/${site.whatsapp.replace(/\D/g, '')}`,
    external: true,
  },
  { id: 'instagram', label: 'Instagram', href: site.instagram, external: true },
]

export const nav = [
  { to: '/about', label: 'About' },
  { to: '/somatics', label: 'Somatics' },
  { to: '/practices', label: 'Practices' },
  { to: '/classes', label: 'Classes' },
  { to: '/articles', label: 'Writing' },
  { to: '/contact', label: 'Contact' },
]

// One label for the booking action, used everywhere it appears.
export const booking = { to: '/calendar', label: 'Book a Consultation' }

export const footerGroups = [
  {
    title: 'Practise',
    links: [
      { to: '/somatics', label: 'Discover Somatics' },
      { to: '/practices', label: 'The Practices' },
      { to: '/classes', label: 'Recorded Classes' },
      { to: '/calendar', label: 'Calendar and Booking' },
    ],
  },
  {
    title: 'Read',
    links: [
      { to: '/about', label: 'About Kirti' },
      { to: '/articles', label: 'Writing' },
      { to: '/contact', label: 'Contact' },
    ],
  },
]
