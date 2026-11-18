import { images } from './images.js'

// About page. Updated with Kirti's verified story, training lineage, and teaching philosophy.

export const about = {
  intro: {
    label: 'About',
    headline: [{ text: 'Kirti Verma' }],
    lede: 'Movement and Somatic practitioner and Educator. Her teaching brings together Somatic movement therapy, Tai Chi and Improvisation. She has been working on creating a pedagogy to work with body through Inquiry and Ease.',
    image: images.kirtiPortrait,
    caption: 'Kirti Verma, movement and somatic educator',
  },

  story: {
    heading: 'A practice of inquiry and ease',
    paragraphs: [
      "Kirti is drawn to change the narrative of how we look at our bodies and live with it. Working with health is not about finding symptoms and healing it. It starts with being kind and available to our body's needs. Creating a habit of listening and becoming present is an essential to change our relationship with the body.",
      'Trained in Contemporary Dance and various other forms of dance, she found solace in Improvisation when her journey to Exploration started. From that space, her path to Inquiry began supported by Somatic practices and Tai Chi.',
      'Her work is informed by Somatic Movement Therapy: drawing from approaches like Feldenkrais method, Body-mind centering, Abhyas Somatics and Somatic Intelligence to create safety, presence and grounding in the body. Tai Chi brings an internal martial art discipline rooted in Taoism and Traditional Chinese Medicine training structure, balance and sensitivity to vital energy. Creative movement and Improvisation invites spontaneity in our expression and playful explorations.',
      'Today she teaches these distinct practices in Online as well as in-person format. Her intention is to create spaces for people to discover a new relationship with themselves through body and movement.',
    ],
    image: images.kirtiStudioReflectiveFlow,
  },

  lineage: {
    heading: 'Training and lineage',
    rows: [
      {
        field: 'Somatic Movement Therapy',
        title: 'Sensory-motor retraining and grounding',
        detail: 'Drawing from Feldenkrais method, Body-mind centering, Abhyas Somatics and Somatic Intelligence to create safety, presence and grounding in the body',
      },
      {
        field: 'Tai Chi',
        title: 'Internal martial art and moving meditation',
        detail: 'Rooted in Taoism and Traditional Chinese Medicine training structure, balance and sensitivity to vital energy',
      },
      {
        field: 'Creative Movement',
        title: 'Spontaneity in expression and playful exploration',
        detail: 'Contemporary dance, improvisation, and somatic inquiry bypassing performance and aesthetic judgment',
      },
      {
        field: 'Pedagogy & Facilitation',
        title: 'Inquiry and Ease',
        detail: 'Creating spaces for people to discover a new relationship with themselves through body and movement, online and in person',
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
        body: 'You choose how far to go, when to pause and when to stop. Nothing needs explaining.',
      },
      {
        title: 'You are the authority',
        body: 'Kirti offers guidance, not correction. The aim is for you to leave able to practise without her.',
      },
    ],
  },

  experience: {
    note: 'Sample reviews, to be replaced with words from Kirti’s students.',
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
        context: 'Weekly Tai Chi and Creative Movement group',
      },
    ],
  },

  closing: {
    heading: 'Meet in practice',
    body: 'The simplest way to know whether this work suits you is to try one session.',
    secondary: { to: '/practices', label: 'Read about the practices' },
  },
}
