import { images } from './images'

// About page. Everything marked placeholder is draft wording until Kirti supplies her own.

export const about = {
  intro: {
    label: 'About',
    headline: [{ text: 'Kirti Verma' }],
    lede: 'Movement and Somatic Educator. Her teaching brings together Clinical Somatics, Tai Chi and creative movement drawn from dance.',
    image: images.leafShadow,
    caption: 'Quiet observation and natural light in the studio.',
  },

  story: {
    placeholder: false,
    heading: 'A practice that began with listening',
    paragraphs: [
      'Kirti came to body-based practice the way many of her students do: through a body that was asking to be heard. What began as a personal search for relief became a long study of how people sense, hold and move.',
      'Her work is informed by Somatics, including Clinical Somatics, Embodied Somatics, and Somatic movement, practices centered on awakening the body’s innate capacity for self-healing. Tai Chi brings a grounded internal martial art discipline: rooted, circular and deeply calming. Elements of creative movement derived from dance introduce playfulness and spontaneous expression.',
      'Today she teaches these distinct practices side by side. Some students arrive with chronic pain, and some arrive seeking stillness. Most discover that the same patient quality of attention serves both.',
    ],
    image: images.arches,
  },

  lineage: {
    placeholder: false,
    heading: 'Training and lineage',
    rows: [
      {
        field: 'Clinical Somatics',
        title: 'Certification in Clinical Somatic Education',
        detail: 'Neuromuscular repatterning, Hanna somatic movement, pandiculation',
      },
      {
        field: 'Embodied Somatics',
        title: 'Embodied somatic movement and nervous system regulation',
        detail: 'Body-based healing practices and trauma-informed movement pedagogy',
      },
      {
        field: 'Tai Chi',
        title: 'Traditional internal form and moving meditation',
        detail: 'Rooted stance, weight transitions, circular flow and breath',
      },
      {
        field: 'Creative Movement',
        title: 'Creative movement elements derived from dance',
        detail: 'Improvisational somatic exploration and expressive release',
      },
      {
        field: 'Movement Inquiry',
        title: 'Ongoing study and research interests',
        detail: 'Somatic education for chronic pain and habituated holding patterns',
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
    placeholder: false,
    heading: 'In the room',
    body: 'Kirti teaches private clients and small groups, in person and online: people living with chronic pain, dancers and performers, and many who have never thought of themselves as physical.',
    quotes: [
      {
        quote:
          'She never told me what I should feel. She kept asking what I noticed, until I could answer.',
        name: 'Kavita R.',
        context: 'Private somatic sessions',
      },
      {
        quote:
          'My shoulders came down from my ears in the second class, and they have mostly stayed there.',
        name: 'Marcus T.',
        context: 'Weekly Tai Chi and Movement group',
      },
    ],
  },

  closing: {
    heading: 'Meet in practice',
    body: 'The simplest way to know whether this work suits you is to try one session.',
    secondary: { to: '/practices', label: 'Read about the practices' },
  },
}
