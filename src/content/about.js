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
      'Her work is informed by Somatic Movement Therapy: drawing from approaches like the Feldenkrais method, Body-Mind Centering, Abhyas Somatics, and Somatic Intelligence to create safety, presence, and grounding in the bones. Tai Chi brings an internal martial art discipline rooted in Taoism and Traditional Chinese Medicine, training structure, balance, and sensitivity to vital energy. Creative movement invites spontaneous expression and playful exploration.',
      'Today she teaches these distinct practices side by side. Some students arrive with chronic pain, and some arrive seeking stillness. Most discover that the same patient quality of attention serves both.',
    ],
    image: images.arches,
  },

  lineage: {
    placeholder: false,
    heading: 'Training and lineage',
    rows: [
      {
        field: 'Somatic Movement Therapy',
        title: 'Sensory-motor retraining and somatic inquiry',
        detail: 'Informed by Feldenkrais method, Body-Mind Centering, Abhyas Somatics, and Somatic Intelligence',
      },
      {
        field: 'Bone Grounding & Alignment',
        title: 'Neuromuscular presence and structural balance',
        detail: 'Gentle spinal decompression, safety in the bones, and somatic guided prompts',
      },
      {
        field: 'Tai Chi',
        title: 'Traditional internal form and moving meditation',
        detail: 'Rooted in Taoism and Traditional Chinese Medicine, weight transitions, and qi cultivation',
      },
      {
        field: 'Creative Movement',
        title: 'Creative movement derived from dance',
        detail: 'Unchoreographed somatic exploration, rhythm, and expressive release',
      },
      {
        field: 'Integrative Practice',
        title: 'Nervous system regulation and movement education',
        detail: 'Somatic education for chronic tension, posture realignment, and embodied ease',
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
