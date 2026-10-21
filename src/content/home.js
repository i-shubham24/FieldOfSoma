import { images } from './images'

// Home page copy. Headline, subtext and manifesto are from the design handover.
// Anything marked PLACEHOLDER is sample wording until Kirti supplies her own.

export const hero = {
  label: 'Movement and Somatic Education',
  headline: [
    { text: 'Our bodies are inherently' },
    { text: 'an intelligent ecosystem.', italic: true },
  ],
  subtext:
    'It knows. It guides. It heals. We must listen and tend to it.',
  primary: { to: '/practices', label: 'Explore the Practices' },
  image: images.floorLight,
}

export const manifesto = {
  text: 'Find your way back into the body. It is not a problem to fix, but a living field of intelligence, capable of its own restoration, its own expression, and its own quiet wisdom.',
}

export const pillars = {
  heading: 'Three practices, one field',
  intro:
    'Each can be learned on its own. Together they cover how a body heals, steadies and expresses itself.',
  items: [
    {
      id: 'somatics',
      name: 'Somatic Movement Therapy',
      verbs: 'Heal, sense',
      body: 'Slow, gentle movements that retrain muscles braced from years of tightness. Nothing is forced or stretched. You learn to release excess tension and bring the body back into equilibrium.',
      audience: 'For chronic back, neck, hip or shoulder tension. For stability in body and clarity in mind.',
      link: { to: '/practices#somatics', label: 'About Somatic Movement Therapy' },
      tone: 'clay',
      image: images.somaticConstructiveRest,
    },
    {
      id: 'tai-chi',
      name: 'Tai Chi',
      verbs: 'Ground, flow',
      body: 'A gentle internal martial art practiced as moving meditation. Rooted in Taoism and Traditional Chinese Medicine, it strengthens the body from the inside out to develop structure, balance and sensitivity to qi.',
      audience: 'For improving posture, preserving vital energy, and gaining confidence through your body and stance.',
      link: { to: '/practices#tai-chi', label: 'About Tai Chi' },
      tone: 'moss',
      image: images.taiChiStanding,
    },
    {
      id: 'creative-movement',
      name: 'Creative Movement',
      verbs: 'Express, play',
      body: 'Open movement inquiry drawn from dance. There is no choreography and nothing to perform. You follow sensation, rhythm and curiosity, and let the body say what it has been holding.',
      audience: 'For feeling alive, expressive and unguarded in your own skin.',
      link: { to: '/practices#creative-movement', label: 'About Creative Movement' },
      tone: 'sand',
      image: images.danceTurn,
    },
  ],
}

export const windowSection = {
  label: 'Why Somatics',
  heading: 'Tension you can no longer feel is tension you cannot release.',
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
  placeholder: false,
  items: [
    {
      quote:
        'For the first time in years I could feel my lower back let go, and I was the one doing it.',
      name: 'Priya M.',
      context: 'Clinical Somatics, private sessions',
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
        'After months of desk-bound tension, Kirti helped me sense the holding patterns I had normalized.',
      name: 'David L.',
      context: 'Somatics, 1-on-1 series',
    },
  ],
}

export const invitation = {
  heading: 'Practise with Kirti',
  body: 'Private sessions and small weekly groups, in person and online. Begin wherever your body is today.',
  schedule: { to: '/calendar', label: 'See the weekly schedule' },
  newsletter: {
    title: 'Field Notes',
    body: 'Short reflections on sensing, moving and resting.',
    fieldLabel: 'Email address',
    submit: 'Subscribe',
    microcopy: 'Delivered quietly twice a month. Unsubscribe anytime.',
    success: 'Thank you. Your first note will arrive soon.',
    error: 'Please enter a valid email address.',
  },
}
