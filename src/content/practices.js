import { images } from './images'

// The Practices page: two distinct practices, each with Kirti's own summary, about text,
// who it serves and (for Somatics) possible results, from her "Website notes" doc.
// Creative Movement is shown as a third practice for now; its text is not Kirti's yet
// and will be replaced when she shares her writing.

export const practices = {
  intro: {
    label: 'The Practices',
    headline: [{ text: 'Find your way back' }, { text: 'into the body.', italic: true }],
    lede: 'Somatic Movement Therapy and Tai Chi are two distinct practices. Creative movement, drawn from dance, adds a third, freer way in.',
  },

  items: [
    {
      id: 'somatics',
      name: 'Somatic Movement Therapy',
      verbs: 'Release, sense',
      image: images.kirtiPortrait,
      intention:
        'Slow, gentle movement that retrains the muscles braced from years of tightness. Nothing is forced or stretched. You learn to release the excess tension and bring the body back into a state of equilibrium.',
      about: [
        'Drawing on approaches such as the Feldenkrais Method, Body-Mind Centering, Abhyas Somatics and Somatic Intelligence, we work with sensitising into the body, creating safety and grounding in the bones.',
        'As the body grounds and becomes present, we progress into exploration through guided prompts.',
        'Listening and presence develop while the body starts to realign itself.',
      ],
      serves: [
        'Chronic back, neck, hip or shoulder tension',
        'Stress that shows up as tightness, poor sleep or shallow breath',
        'People looking for better stability in body and clarity in mind',
        'People looking to develop a better relationship with their body',
      ],
      results: ['Spinal decompression', 'Better gait', 'From urgency to a calm state of mind'],
      format: 'Private sessions and small groups, in person and online',
      cta: 'Book a Somatics session',
      audioCue: {
        duration: 45,
        transcript:
          'Lie on your back, knees bent, feet flat on the floor. Inhale gently and press your lower back down into the floor just twenty percent. Feel the abdominal muscles engage. Now take eight long seconds to slowly release the press. Notice the exact moment when the muscles stop working and rest begins.',
      },
    },
    {
      id: 'tai-chi',
      name: 'Tai Chi',
      verbs: 'Ground, flow',
      image: images.kirtiTaiChiLake,
      intention:
        'A gentle internal martial art practised as a moving meditation. Based on the philosophy of Taoism and Traditional Chinese Medicine, it strengthens your body from the inside out: an internal training to develop structure, balance and sensitivity to your qi, the vital force.',
      about: [
        'The body is gently loaded through its own weight to work with gravity, alignment and sustained posture. It is a way to learn that strength can be developed with our own body weight when the body is organised in an aligned manner. As we learn to carry our weight, our balance improves and our central axis aligns with our whole being, physically and energetically.',
        'A set of movements is designed to let vital energy flow through the whole body, removing tension patterns and blockages.',
        'Sustainable strength and focus develop while you move in a graceful manner.',
      ],
      serves: [
        'People looking to improve their posture',
        'Learning how to preserve and cultivate your energy',
        'Gaining confidence through your body and stance',
        'Better gait and stability',
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
      image: images.kirtiFieldSoma,
      intention:
        'To let the body move before the mind decides how it should look. There is no choreography, no mirror and no audience. Simple prompts open the door, and what follows is yours.',
      serves: [
        'People who feel shut down or self-conscious in their bodies',
        'Anyone who misses dancing and dislikes being watched',
        'Artists and performers looking for new material',
        'Those moving through change, grief or stress',
      ],
      format: 'Workshops and small groups, in person',
      cta: 'Ask about the next workshop',
      audioCue: {
        duration: 45,
        transcript:
          'Close your eyes. Find your breath. Notice the first tiny movement that wants to happen without planning: a finger curling, the ribs shifting, or the neck turning. Do not judge how it looks. Simply follow the sensation of the movement as it travels into the next shape.',
      },
    },
  ],

  closing: {
    heading: 'Not sure where to begin?',
    body: 'A short consultation is the easiest start. Tell Kirti what your body is asking for and she will suggest a way in.',
    secondary: { to: '/somatics', label: 'Read why Somatics works' },
  },
}
