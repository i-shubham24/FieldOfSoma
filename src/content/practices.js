import { images } from './images'

// The Practices page: three offerings, each with its intention, the shape of a
// 60-minute session, and who it serves. Session timings are a guide for Kirti to adjust.

export const practices = {
  intro: {
    label: 'The Practices',
    headline: [{ text: 'Three ways' }, { text: 'into the same body.', italic: true }],
    lede: 'Clinical Somatics, Tai Chi and Creative Movement are taught as separate practices. Choose one, or let them inform each other.',
  },

  items: [
    {
      id: 'somatics',
      name: 'Clinical Somatics',
      verbs: 'Heal, sense',
      image: images.floorLight,
      intention:
        'To give you back the control of muscles that have been working without your consent. Sessions are quiet, precise and unhurried, and you leave knowing a few movements well enough to repeat them at home.',
      session: [
        {
          time: '0 to 10',
          title: 'Arriving',
          body: 'You lie down and take stock: where the body meets the floor, where it does not, what feels held.',
        },
        {
          time: '10 to 40',
          title: 'Guided pandiculation',
          body: 'Kirti talks you through slow contractions and slower releases for the back, waist, neck, hips or shoulders.',
        },
        {
          time: '40 to 52',
          title: 'Joining up',
          body: 'The separate movements are linked into larger, easy patterns such as rolling and reaching.',
        },
        {
          time: '52 to 60',
          title: 'Standing again',
          body: 'You walk, notice what has changed, and take away two or three movements to practise.',
        },
      ],
      serves: [
        'Chronic back, neck, hip or shoulder tension',
        'Stiffness after injury or long hours at a desk',
        'Stress that shows up as tightness, poor sleep or shallow breath',
        'Athletes, dancers and musicians refining control',
      ],
      format: 'Private sessions and small groups, in person and online',
      cta: 'Book a Somatics session',
    },
    {
      id: 'tai-chi',
      name: 'Tai Chi',
      verbs: 'Ground, flow',
      image: images.taiChiForm,
      intention:
        'To find strength that does not depend on tension. Tai Chi trains you to stand, shift weight and turn from the centre, so that movement is carried by the legs and the breath, not by effort in the shoulders.',
      session: [
        {
          time: '0 to 10',
          title: 'Standing',
          body: 'Quiet standing to settle the breath and let the weight drop into the feet.',
        },
        {
          time: '10 to 25',
          title: 'Loosening',
          body: 'Gentle joint circles and spinal waves that open the body from the ground up.',
        },
        {
          time: '25 to 50',
          title: 'The form',
          body: 'A short sequence is learned posture by posture, with attention to rooting, the dantian and continuous, circular motion.',
        },
        {
          time: '50 to 60',
          title: 'Closing',
          body: 'The sequence is repeated in silence, and the class ends in stillness.',
        },
      ],
      serves: [
        'Anyone wanting better balance and steadier legs',
        'People who find seated meditation difficult',
        'Those rebuilding energy after illness or burnout',
        'Movers who want strength without strain',
      ],
      format: 'Weekly group classes, in person and online',
      cta: 'Join a Tai Chi class',
    },
    {
      id: 'creative-movement',
      name: 'Creative Movement',
      verbs: 'Express, play',
      image: images.danceReach,
      intention:
        'To let the body move before the mind decides how it should look. There is no choreography, no mirror and no audience. Simple prompts open the door, and what follows is yours.',
      session: [
        {
          time: '0 to 10',
          title: 'Landing',
          body: 'Lying or sitting, you follow the breath and let small movements begin.',
        },
        {
          time: '10 to 30',
          title: 'Prompts',
          body: 'Kirti offers images and tasks: move from the spine, trace the space behind you, follow one hand.',
        },
        {
          time: '30 to 50',
          title: 'Open movement',
          body: 'Music or silence, and time to follow sensation, rhythm and impulse wherever they lead.',
        },
        {
          time: '50 to 60',
          title: 'Stillness and words',
          body: 'Rest, then a few words spoken or written, if you wish.',
        },
      ],
      serves: [
        'People who feel shut down or self-conscious in their bodies',
        'Anyone who misses dancing and dislikes being watched',
        'Artists and performers looking for new material',
        'Those moving through change, grief or stress',
      ],
      format: 'Workshops and small groups, in person',
      cta: 'Ask about the next workshop',
    },
  ],

  closing: {
    heading: 'Not sure where to begin?',
    body: 'A short consultation is the easiest start. Tell Kirti what your body is asking for and she will suggest a way in.',
    secondary: { to: '/somatics', label: 'Read why Somatics works' },
  },
}
