import { images } from './images'

// Home page copy. Headline, subtext and manifesto are from the design handover.
// Anything marked PLACEHOLDER is sample wording until Kirti supplies her own.

export const hero = {
  label: 'Movement and Somatic Education',
  headline: [{ text: 'Find your way back' }, { text: 'into your body.', italic: true }],
  subtext:
    'Through Somatic healing, Tai Chi, and Creative Movement, rediscover the quiet intelligence your body already holds.',
  primary: { to: '/practices', label: 'Explore the Practices' },
  image: images.floorLight,
}

export const manifesto = {
  text: 'Your body is not a problem to fix. It is a living field of intelligence, capable of its own restoration, its own expression, its own quiet wisdom.',
}

export const pillars = {
  heading: 'Three practices, one field',
  intro:
    'Each can be learned on its own. Together they cover how a body heals, steadies and expresses itself.',
  items: [
    {
      id: 'somatics',
      name: 'Clinical Somatics',
      verbs: 'Heal, sense',
      body: 'Slow, attentive movements that retrain the brain’s control of muscles held tight for years. Nothing is forced or stretched. You learn to release the tension yourself, and to keep it released.',
      audience: 'For chronic pain, stiffness, and bodies worn down by stress.',
      link: { to: '/practices#somatics', label: 'About Clinical Somatics' },
      tone: 'clay',
      image: images.floorLight, // PLACEHOLDER: stock photograph
    },
    {
      id: 'tai-chi',
      name: 'Tai Chi',
      verbs: 'Ground, flow',
      body: 'A gentle internal martial art, practised as moving meditation. Weight settles into the legs, the spine lengthens, and the breath follows a slow, circular form. Balance arrives without bracing.',
      audience: 'For steadiness, quiet strength and focus.',
      link: { to: '/practices#tai-chi', label: 'About Tai Chi' },
      tone: 'moss',
      image: images.taiChiTrees, // PLACEHOLDER: stock photograph
    },
    {
      id: 'creative-movement',
      name: 'Creative Movement',
      verbs: 'Express, play',
      body: 'Open movement inquiry drawn from dance. There is no choreography and nothing to perform. You follow sensation, rhythm and curiosity, and let the body say what it has been holding.',
      audience: 'For feeling alive, expressive and unguarded in your own skin.',
      link: { to: '/practices#creative-movement', label: 'About Creative Movement' },
      tone: 'sand',
      image: images.danceTurn, // PLACEHOLDER: stock photograph
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
  placeholder: true, // PLACEHOLDER: replace with students’ own words, then set to false
  placeholderNote: 'Sample wording, to be replaced with students’ own words.',
  items: [
    {
      quote:
        'For the first time in years I could feel my lower back let go, and I was the one doing it.',
      name: 'Student name',
      context: 'Clinical Somatics, private sessions',
    },
    {
      quote:
        'I came for balance. What stayed with me was how quiet my mind became once my feet found the floor.',
      name: 'Student name',
      context: 'Tai Chi, weekly class',
    },
    {
      quote:
        'Nobody was watching and nothing had to look good. I had forgotten that moving could feel like that.',
      name: 'Student name',
      context: 'Creative Movement, workshop',
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
