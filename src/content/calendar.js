import { images } from './images'

// Calendar and Booking. The weekly schedule is a PLACEHOLDER for Kirti to replace.
// The request block is where a Cal.com or Calendly embed will sit.

export const calendar = {
  intro: {
    label: 'Calendar and Booking',
    headline: [{ text: 'Find a time' }, { text: 'to practise.', italic: true }],
    lede: 'Two ways to work with Kirti: privately, for attention to your own patterns, or in a small weekly group.',
  },

  paths: [
    {
      id: 'private',
      title: 'Private sessions',
      meta: ['60 to 75 minutes', 'One to one', 'In person or online'],
      body: 'An unhurried session built around your body: a look at how you stand and move, guided pandiculation for the patterns that show up, and a short practice to take home.',
      includes: [
        'Movement and posture assessment',
        'Guided, hands-off somatic work',
        'A personal home practice of 10 to 15 minutes',
      ],
      cta: 'Request a private session',
    },
    {
      id: 'group',
      title: 'Weekly group classes',
      meta: ['60 minutes', 'Small groups', 'Live online and in person'],
      body: 'Regular classes in Tai Chi and somatic movement. Small enough for individual attention, steady enough to build a practice that lasts.',
      includes: [
        'Tai Chi form, taught progressively',
        'Somatic movement for the whole body',
        'Drop in, or join for a full term',
      ],
      cta: 'Ask to join a class',
    },
  ],

  schedule: {
    placeholder: true,
    heading: 'The week',
    note: 'Days and times are placeholders.',
    rows: [
      { day: 'Monday', time: '7:00 am', title: 'Somatic Movement', format: 'Online' },
      { day: 'Wednesday', time: '6:30 pm', title: 'Tai Chi', format: 'In person' },
      { day: 'Friday', time: '7:00 am', title: 'Tai Chi', format: 'Online' },
      { day: 'Saturday', time: '10:00 am', title: 'Creative Movement', format: 'In person, monthly' },
    ],
  },

  request: {
    heading: 'Choose a time',
    body: 'The live booking calendar will sit here once it is connected. Until then, write with two or three times that suit you, and Kirti will confirm one.',
    cta: 'Write to book',
    subject: 'Booking request',
    image: images.studio,
  },
}
