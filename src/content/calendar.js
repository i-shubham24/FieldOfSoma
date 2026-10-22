import { images } from './images'

// Calendar and Booking. The weekly schedule is a PLACEHOLDER for Kirti to replace.
//
// Live booking: set VITE_BOOKING_URL in Vercel to Kirti's Cal.com or Calendly link
// (for example https://cal.com/kirti-verma). The "Choose a time" section then shows
// her real calendar. Without it, visitors send a request and Kirti replies.

export const calendar = {
  intro: {
    label: 'Calendar and Booking',
    headline: [{ text: 'Find a time' }, { text: 'to practise.', italic: true }],
    lede: 'You can work with Kirti one to one, or join a small weekly group.',
  },

  paths: [
    {
      id: 'private',
      title: 'Private sessions',
      meta: ['One to one', 'In person or online'],
      body: 'A session shaped around you. Kirti looks at how you stand and move, guides you through gentle work for what she sees, and gives you a little practice to take home.',
      includes: [
        'A look at how you stand and move',
        'Gentle, guided somatic work',
        'A short practice to do at home',
      ],
      cta: 'Request a private session',
    },
    {
      id: 'group',
      title: 'Weekly group classes',
      meta: ['Small groups', 'In person and online'],
      body: 'Regular classes in Somatic Movement Therapy and Tai Chi, and a monthly Creative Movement session. Small enough that Kirti can see everyone, regular enough to build a habit.',
      includes: [
        'Tai Chi, taught step by step',
        'Somatic movement for the whole body',
      ],
      cta: 'Ask to join a class',
    },
  ],

  schedule: {
    placeholder: true,
    heading: 'The week',
    note: 'Draft: days and times are examples until Kirti confirms her schedule.',
    rows: [
      { id: 'mon-somatics', day: 'Monday', time: '7:00 am', title: 'Somatic Movement Therapy', format: 'Online' },
      { id: 'wed-tai-chi', day: 'Wednesday', time: '6:30 pm', title: 'Tai Chi', format: 'In person' },
      { id: 'fri-tai-chi', day: 'Friday', time: '7:00 am', title: 'Tai Chi', format: 'Online' },
      { id: 'sat-creative', day: 'Saturday', time: '10:00 am', title: 'Creative Movement', format: 'In person, monthly' },
    ],
  },

  request: {
    heading: 'Choose a time',
    body: 'Not sure what to ask for? Pick what fits below and send it to Kirti. She will reply to find a time that works.',
    bookingBody: 'Pick a time that suits you. You will get a confirmation by email.',
    image: images.taiChiGroupClass,
  },

  form: {
    private: {
      label: 'One to one',
      heading: 'Request a private session',
      focusOptions: ['Somatic Movement Therapy', 'Tai Chi', 'Creative Movement', 'Not sure yet'],
      formatOptions: ['In person', 'Online'],
      submit: 'Send request',
    },
    group: {
      label: 'Weekly class',
      heading: 'Ask to join a class',
      submit: 'Send request',
    },
    timeOptions: ['Weekday morning', 'Weekday evening', 'Saturday morning'],
    success: {
      heading: 'Thank you.',
      body: 'Your request is with Kirti. She will email you to confirm a time.',
    },
  },
}
