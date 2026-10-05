import { images } from './images'

// Writing and newsletter. Essay titles and excerpts are PLACEHOLDERS: they show the
// shape of the page until Kirti's own writing is added. Article pages come with it.

export const articles = {
  intro: {
    label: 'Writing',
    headline: [{ text: 'Essays on sensing,' }, { text: 'moving and resting.', italic: true }],
    lede: 'Longer pieces on somatic philosophy, the biology of movement and the practice of paying attention.',
  },

  placeholder: true,
  note: 'Essay titles and excerpts are placeholders. Articles open once Kirti’s writing is added.',

  featured: {
    topic: 'Somatics',
    title: 'Why stretching does not undo a habit',
    excerpt:
      'A tight muscle is not a short muscle. It is a muscle receiving an instruction. Until the instruction changes, pulling on it only invites the body to pull back.',
    length: '7 minute read',
    image: images.forest,
  },

  list: [
    { topic: 'Somatics', title: 'The yawn you do on purpose', length: '5 min' },
    { topic: 'Tai Chi', title: 'Standing like a tree', length: '4 min' },
    { topic: 'Creative Movement', title: 'Dancing with nobody watching', length: '6 min' },
    { topic: 'Somatics', title: 'What the startle reflex leaves behind', length: '8 min' },
    { topic: 'Practice', title: 'On doing less', length: '3 min' },
  ],

  letters: {
    heading: 'Letters, twice a month',
    body: 'Field Notes is a short letter from Kirti: one idea to try in your body, one thing she has been reading, and news of classes before it goes anywhere else.',
    image: images.notebook,
  },
}
