import { images } from './images.js'

// The Practices page: Somatic Movement Therapy, Tai Chi, and Creative Movement
// and Improvisation, each with Kirti's own summary, about text, who it serves
// and possible results, from her "Website notes" doc.

export const practices = {
  intro: {
    label: 'The Practices',
    headline: [{ text: 'Find your way back' }, { text: 'into the body', italic: true }],
    lede: 'Somatic Movement Therapy and Tai Chi are two distinct practices. Creative Movement and Improvisation, drawn from dance, adds a third, freer way in.',
  },

  items: [
    {
      id: 'somatics',
      name: 'Somatic Movement Therapy',
      verbs: 'Release, sense',
      image: images.kirtiSomaticFacilitation,
      intention:
        'Slow, gentle movement that retrain the muscles braced from years of tightness. Nothing is forced or stretched. You learn to release the excess tension, to bring back the body into a state of equilibrium.',
      about: [
        'Derived from different approaches like Feldenkrais method, Body-mind centering, Abhyas Somatics, Somatic Intelligence, we work with sensitising into the body creating safety and grounding in the bones.',
        'As the body grounds and become present, we progress into exploration through guided prompts.',
        'Listening and Presence is developed while the body starts to realign itself.',
      ],
      serves: [
        'Chronic back, neck, hip or shoulder tension',
        'Stress that shows up as tightness, poor sleep or shallow breath',
        'People looking for better stability in body and clarity in mind',
        'People looking to develop a better relationship with their body',
      ],
      results: [
        'Spinal decompression',
        'Better gait',
        'From urgency to calm state of mind',
      ],
      format: 'Private sessions and small groups, in person and online',
      cta: 'Book a Somatics session',
      audioCue: {
        duration: 45,
        transcript:
          'Lie on your back, knees bent, feet flat on the floor. Inhale gently and press your lower back down into the floor just twenty per cent. Feel the abdominal muscles engage. Now take eight long seconds to slowly release the press. Notice the exact moment when the muscles stop working and rest begins.',
      },
    },
    {
      id: 'tai-chi',
      name: 'Tai Chi',
      verbs: 'Ground, flow',
      image: images.kirtiTaiChiWhiteStance,
      intention:
        'A gentle internal martial art practiced as a moving meditation. Based on the philosophy of Taoism and Traditional Chinese Medicine, strengthen your body from inside out: an internal training to develop structure, balance and sensitivity to your qi, the vital force.',
      about: [
        'The body is gently loaded through own body weight to work with gravity, alignment and sustained posture. A way to learn that strength can be developed with our own body weight when the body is organised in an aligned manner. As we learn to carry our weight, our balance improves and central axis align with our whole being physically and energetically.',
        'A set of movements designed in a manner to flow our vital energy in the whole body removing tension patterns and blockages.',
        'Sustainable Strength and focus is developed while you move in a graceful manner.',
      ],
      serves: [
        'People looking to improve their posture',
        'How to preserve and cultivate your energy',
        'Gaining confidence through your body and stance',
        'Better gait and stability',
      ],
      results: [
        'Improved Balance',
        'Strengthen joints and bones',
        'Clarity in mind',
        'Better coordination skills',
        'Enhanced energy everyday with regular practice',
      ],
      format: 'Weekly group classes, in person and online',
      cta: 'Join a Tai Chi class',
      audioCue: {
        duration: 45,
        transcript:
          'Stand with your feet shoulder-width apart. Let your knees soften without bending forward. Allow your weight to settle down into the triangles of your feet. Feel your spine hang from above like a silk thread. With each exhalation, drop your shoulders another millimetre down into gravity.',
      },
    },
    {
      id: 'creative-movement',
      name: 'Creative Movement',
      verbs: 'Express, play',
      image: images.kirtiFieldDance,
      intention:
        'Open movement inquiry drawn from Contemporary dance and improvisation. There is no choreography, no performance. You follow sensation, impulses, rhythm and curiosity with some movement prompts. For feeling alive, expressive and unguarded in your own skin.',
      about: [
        'When you explore moving in different ways, it expands the possibilities of your everyday life and be surprised how many choices are available.',
      ],
      serves: [
        'People who are self-conscious in their bodies',
        'Anyone who missed dancing and disliked being watched',
        'Artists and performers looking for new material',
        'People who want to break out of their mundane patterns',
      ],
      format: 'Workshops and small groups, in person',
      cta: 'Ask about the next workshop',
      audioCue: {
        duration: 45,
        transcript:
          'Close your eyes. Find your breath. Notice the first tiny movement that wants to happen without planning: a finger curling, the ribs shifting or the neck turning. Do not judge how it looks. Simply follow the sensation of the movement as it travels into the next shape.',
      },
    },
  ],

  closing: {
    heading: 'Not sure where to begin?',
    body: 'A short consultation is the easiest start. Tell Kirti what your body is asking for and she will suggest a way in.',
    secondary: { to: '/somatics', label: 'Read why Somatics works' },
  },
}
