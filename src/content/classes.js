import { images } from './images'

// Recorded Classes. Titles, lengths and prices are PLACEHOLDERS for Kirti to replace.
// Phase 1: each class links to a Razorpay or Stripe checkout. Phase 2: a video library.

export const classes = {
  intro: {
    label: 'Recorded Classes',
    headline: [{ text: 'Practise at home,' }, { text: 'in your own time.', italic: true }],
    lede: 'Guided classes you can return to as often as you like. Each one is complete in itself: a mat, a quiet floor and the length of the recording are all you need.',
  },

  filters: [
    { id: 'all', label: 'All classes' },
    { id: 'somatics', label: 'Somatics' },
    { id: 'tai-chi', label: 'Tai Chi' },
    { id: 'creative-movement', label: 'Creative Movement' },
  ],

  placeholder: true,
  note: 'Class titles, lengths and prices are placeholders.',
  checkoutNote: 'Checkout will open here once payments are connected.',

  items: [
    {
      id: 'neck-shoulder-freedom',
      practice: 'somatics',
      practiceName: 'Somatics',
      title: 'Neck and Shoulder Freedom',
      focus: 'Slow releases for the muscles that lift and round the shoulders.',
      duration: '45 min',
      level: 'All levels',
      price: '₹600',
      image: images.reach,
    },
    {
      id: 'lower-back-release',
      practice: 'somatics',
      practiceName: 'Somatics',
      title: 'Releasing the Lower Back',
      focus: 'Pandiculation for the long muscles of the spine and the waist.',
      duration: '40 min',
      level: 'All levels',
      price: '₹600',
      image: images.floorLight,
    },
    {
      id: 'standing-like-a-tree',
      practice: 'tai-chi',
      practiceName: 'Tai Chi',
      title: 'Standing Like a Tree',
      focus: 'A standing practice for rooting, balance and a settled breath.',
      duration: '25 min',
      level: 'Beginners',
      price: '₹400',
      image: images.taiChiTrees,
    },
    {
      id: 'spine-stories',
      practice: 'creative-movement',
      practiceName: 'Creative Movement',
      title: 'Spine Stories',
      focus: 'Guided improvisation that begins and ends with the spine.',
      duration: '35 min',
      level: 'All levels',
      price: '₹500',
      image: images.danceReach,
    },
    {
      id: 'the-easy-breath',
      practice: 'somatics',
      practiceName: 'Somatics',
      title: 'The Easy Breath',
      focus: 'Softening the belly and ribs so the breath can deepen without effort.',
      duration: '30 min',
      level: 'All levels',
      price: '₹500',
      image: images.sideBend,
    },
    {
      id: 'grounding-flow',
      practice: 'tai-chi',
      practiceName: 'Tai Chi',
      title: 'Grounding Flow: A First Form',
      focus: 'Eight linked postures, taught slowly, to carry into daily practice.',
      duration: '50 min',
      level: 'Beginners',
      price: '₹700',
      image: images.taiChiWall,
    },
  ],

  courses: {
    heading: 'Short courses are on the way',
    body: 'Sequenced courses of four to six classes are being recorded. Field Notes subscribers will hear first.',
    secondary: { to: '/articles#field-notes', label: 'Subscribe to Field Notes' },
  },
}
