import { images } from './images'

// About page. Everything marked placeholder is draft wording until Kirti supplies her own.

export const about = {
  intro: {
    label: 'About',
    headline: [{ text: 'Kirti Verma' }],
    lede: 'Movement and Somatic Educator. Her teaching brings together Clinical Somatics, Tai Chi and creative movement drawn from dance.',
    image: images.leafShadow, // PLACEHOLDER: Kirti's portrait
    caption: 'Stand-in photograph. Kirti’s portrait goes here.',
  },

  story: {
    placeholder: true,
    heading: 'A practice that began with listening',
    paragraphs: [
      'Kirti came to body-based practice the way many of her students do: through a body that was asking to be heard. What began as a search for relief became a long study of how people sense, hold and move.',
      'She trained in Clinical Somatics to understand how the nervous system learns tension and how it can unlearn it. Tai Chi gave that understanding a form to stand in: rooted, slow and exact. Dance kept it playful.',
      'Today she teaches the three side by side. Some students arrive in pain and some arrive curious. Most find that the same quality of attention serves both.',
    ],
    note: 'Draft wording. Kirti’s own account of her path will replace it.',
    image: images.arches,
  },

  lineage: {
    placeholder: true,
    heading: 'Training and lineage',
    note: 'Schools, teachers and dates to be added by Kirti.',
    rows: [
      {
        field: 'Clinical Somatics',
        title: 'Certification in Clinical Somatic Education',
        detail: 'School, teachers and year',
      },
      {
        field: 'Somatics',
        title: 'Embodied and somatic movement studies',
        detail: 'Courses and mentors',
      },
      {
        field: 'Tai Chi',
        title: 'Form, style and lineage',
        detail: 'Teacher and years of study',
      },
      {
        field: 'Dance',
        title: 'Creative movement and dance training',
        detail: 'Schools and collaborators',
      },
      {
        field: 'Research',
        title: 'Ongoing study and research interests',
        detail: 'Topics and publications',
      },
    ],
  },

  philosophy: {
    heading: 'How she teaches',
    intro: 'Without dogma, with care for what a body has been through, and always in collaboration.',
    items: [
      {
        title: 'Nothing is forced',
        body: 'Somatic change comes from attention, not effort. Movements stay small and slow enough for the nervous system to notice what it is doing.',
      },
      {
        title: 'Your pace sets the pace',
        body: 'The teaching is trauma-informed. You choose how far to go, when to pause and when to stop, and nothing needs explaining.',
      },
      {
        title: 'You are the authority',
        body: 'Kirti offers guidance, not correction. The aim is for you to leave able to practise without her.',
      },
    ],
  },

  experience: {
    placeholder: true,
    heading: 'In the room',
    body: 'Kirti teaches private clients and small groups, in person and online: people living with chronic pain, dancers and performers, and many who have never thought of themselves as physical.',
    note: 'Sample wording, to be replaced with students’ own words.',
    quotes: [
      {
        quote:
          'She never told me what I should feel. She kept asking what I noticed, until I could answer.',
        name: 'Student name',
        context: 'Private sessions',
      },
      {
        quote:
          'My shoulders came down from my ears in the second class, and they have mostly stayed there.',
        name: 'Student name',
        context: 'Weekly group',
      },
    ],
  },

  closing: {
    heading: 'Meet in practice',
    body: 'The simplest way to know whether this work suits you is to try one session.',
    secondary: { to: '/practices', label: 'Read about the practices' },
  },
}
