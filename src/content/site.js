// Site-wide content. Anything marked PLACEHOLDER is waiting on Kirti.

export const site = {
  name: 'Field of Soma',
  person: 'Kirti Verma',
  role: 'Movement and Somatic Educator',
  email: 'hello@fieldofsoma.com', // PLACEHOLDER: confirm the real address
  instagram: 'https://www.instagram.com/', // PLACEHOLDER: real profile link
}

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
