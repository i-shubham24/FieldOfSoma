import { images } from './images'
import { site } from './site'

// Contact page. Location and time zone are PLACEHOLDERS until Kirti confirms where she teaches.

export const contact = {
  intro: {
    label: 'Contact',
    headline: [{ text: 'Begin with' }, { text: 'a few words.', italic: true }],
    lede: 'Questions about a practice, a session or a class are all welcome.',
    image: images.kirtiFieldSoma,
  },

  details: [
    { term: 'Email', value: site.email, href: `mailto:${site.email}` },
    { term: 'Sessions', value: 'Online, and in person by arrangement' },
    { term: 'Time zone', value: 'IST (UTC +5:30)' },
    { term: 'Instagram', value: 'Follow the practice', href: site.instagram, external: true },
  ],

  form: {
    name: { label: 'Full name', error: 'Please tell Kirti your name.' },
    email: { label: 'Email', error: 'Please enter a valid email address.' },
    practice: {
      label: 'Practice of interest',
      options: ['Somatic Movement Therapy', 'Tai Chi', 'Creative Movement', 'Recorded classes', 'Not sure yet'],
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
