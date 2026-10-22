import { images } from './images'

// The Practices page: two distinct practices, each with Kirti's own summary, about text,
// who it serves and (for Somatics) possible results, from her "Website notes" doc.
// The 60-minute session outlines are not hers yet: a guide for Kirti to adjust.
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
      image: images.kirtiSomaticTeaching,
      intention:
        'Slow, gentle movement that retrains the muscles braced from years of tightness. Nothing is forced or stretched. You learn to release the excess tension and bring the body back into a state of equilibrium.',
      about: [
        'Drawing on approaches such as the Feldenkrais Method, Body-Mind Centering, Abhyas Somatics and Somatic Intelligence, we work with sensitising into the body, creating safety and grounding in the bones.',
        'As the body grounds and becomes present, we progress into exploration through guided prompts.',
        'Listening and presence develop while the body starts to realign itself.',
      ],
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
      image: images.kirtiDanceMotionBlur,
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
