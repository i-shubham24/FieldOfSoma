import { images } from './images'
import { site } from './site'

// Contact page. Studio location and time zone are PLACEHOLDERS for Kirti to supply.

export const contact = {
  intro: {
    label: 'Contact',
    headline: [{ text: 'Begin with' }, { text: 'a few words.', italic: true }],
    lede: 'Questions about a practice, a session or a class are all welcome. Kirti reads and answers every message herself.',
    image: images.curtain,
  },

  details: [
    { term: 'Email', value: site.email, href: `mailto:${site.email}` },
    { term: 'Studio', value: 'Location to be added' }, // PLACEHOLDER
    { term: 'Time zone', value: 'To be added' }, // PLACEHOLDER
    { term: 'Instagram', value: 'Follow the practice', href: site.instagram, external: true },
  ],

  form: {
    name: { label: 'Full name', error: 'Please tell Kirti your name.' },
    email: { label: 'Email', error: 'Please enter a valid email address.' },
    practice: {
      label: 'Practice of interest',
      options: ['Clinical Somatics', 'Tai Chi', 'Creative Movement', 'Not sure yet'],
    },
    message: {
      label: 'Message',
      hint: 'What is your body asking for? A few lines is plenty.',
      error: 'Please write a short message.',
    },
    submit: 'Send message',
    sending: 'Sending',
    success: {
      heading: 'Thank you.',
      body: 'Your message is on its way. Kirti will write back soon.',
    },
  },
}
