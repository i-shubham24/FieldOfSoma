import { images } from './images.js'

// Home page copy. The headline, subtext and practice summaries are Kirti's own words
// (her "Website notes" doc). She asked for a minimal first page, so keep descriptions short.

export const hero = {
  label: 'Movement and Somatic Education',
  headline: [
    { text: 'Our bodies are inherently' },
    { text: 'an intelligent ecosystem', italic: true },
  ],
  subtext:
    'It knows. It guides. It heals. We must listen and tend to it.',
  primary: { to: '/practices', label: 'Explore the practices' },
  image: images.kirtiForestHero,
}

// The first sentence is Kirti's own ("Find your way back into the body").
export const manifesto = {
  text: 'Find your way back into the body. A living field of intelligence, capable of its own restoration, its own expression and its own quiet wisdom.',
}

export const pillars = {
  heading: 'Three practices, one field',
  intro:
    'Each can be learned on its own. Together they cover how a body heals, steadies and expresses itself.',
  items: [
    {
      id: 'somatics',
      name: 'Somatic Movement Therapy',
      verbs: 'Release, sense',
      body: 'Slow, gentle movement that retrain the muscles braced from years of tightness. Nothing is forced or stretched. You learn to release the excess tension, to bring back the body into a state of equilibrium.',
      audience: 'For chronic back, neck, hip or shoulder tension. For stability in body and clarity in mind.',
      link: { to: '/practices#somatics', label: 'About Somatic Movement Therapy' },
      image: images.kirtiSomaticTeaching,
    },
    {
      id: 'tai-chi',
      name: 'Tai Chi',
      verbs: 'Ground, flow',
      body: 'A gentle internal martial art practiced as a moving meditation. Based on the philosophy of Taoism and Traditional Chinese Medicine, strengthen your body from inside out. An internal training to develop structure, balance and sensitivity to your qi, the vital force.',
      audience: 'For improving posture, preserving energy, gaining confidence through your body and stance, and better stability.',
      link: { to: '/practices#tai-chi', label: 'About Tai Chi' },
      image: images.kirtiTaiChiCloudHands,
    },
    {
      id: 'creative-movement',
      name: 'Creative Movement and Improvisation',
      verbs: 'Express, play',
      body: 'Open movement inquiry drawn from contemporary dance and improvisation. There is no choreography, no performance. You follow sensation, impulses, rhythm and curiosity with movement prompts.',
      audience: 'For feeling alive, expressive and unguarded in your own skin.',
      link: { to: '/practices#creative-movement', label: 'About Creative Movement' },
      image: images.kirtiDanceMotionBlur,
    },
  ],
}

export const windowSection = {
  label: 'Why Somatics',
  heading: 'Tension you can no longer feel is tension you cannot release',
  body: [
    'Years of stress, sitting, injury and guarding teach muscles to stay switched on. In time the brain stops registering them at all. Thomas Hanna named this sensory-motor amnesia.',
    'Somatics works where the habit lives, in the nervous system. Through pandiculation, a slow contraction followed by a slower release, the brain regains its sense of the muscle and lets it rest.',
  ],
  link: { to: '/somatics', label: 'Discover Somatics' },
  cycle: {
    centre: 'Pandiculation',
    phases: ['Contract', 'Release', 'Rest', 'Sense'],
    caption:
      'The yawn-like tightening and letting go that animals make on waking. In Somatics it is done slowly, and on purpose.',
  },
}

export const voices = {
  heading: 'Student words',
  // Demo reviews: replace with real words from Kirti's students (with their permission).
  placeholder: true,
  placeholderNote: 'Sample reviews, to be replaced with words from Kirti’s students.',
  items: [
    {
      quote:
        'For the first time in years I could feel my lower back let go, and I was the one doing it.',
      name: 'Priya M.',
      context: 'Somatic Movement Therapy, private sessions',
    },
    {
      quote:
        'I came for balance. What stayed with me was how quiet my mind became once my feet found the floor.',
      name: 'Rahul K.',
      context: 'Tai Chi, weekly class',
    },
    {
      quote:
        'Nobody was watching and nothing had to look good. I had forgotten that moving could feel like that.',
      name: 'Ananya S.',
      context: 'Creative Movement, workshop',
    },
    {
      quote:
        'After months of desk-bound tension, Kirti helped me sense the holding patterns I had normalised.',
      name: 'David L.',
      context: 'Somatic Movement Therapy, one-to-one',
    },
  ],
}

export const invitation = {
  heading: 'Practise with Kirti',
  body: 'Private sessions and small groups. Begin wherever your body is today.',
  schedule: { to: '/calendar', label: 'See the weekly schedule' },
  newsletter: {
    title: 'Field Notes',
    body: 'Short reflections on sensing, moving and resting.',
    fieldLabel: 'Email address',
    submit: 'Subscribe',
    microcopy: 'Occasional letters. Unsubscribe at any time.',
    success: 'Thank you. Your first note will arrive soon.',
    error: 'Please enter a valid email address.',
  },
}
