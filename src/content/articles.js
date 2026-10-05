import { images } from './images'

// Writing and newsletter. Essay titles and excerpts are PLACEHOLDERS: they show the
// shape of the page until Kirti's own writing is added. Article pages come with it.

export const articles = {
  intro: {
    label: 'Writing',
    headline: [{ text: 'Essays on sensing,' }, { text: 'moving and resting.', italic: true }],
    lede: 'Longer pieces on somatic philosophy, the biology of movement and the practice of paying attention.',
  },

  placeholder: false,

  featured: {
    id: 'why-stretching-does-not-undo-a-habit',
    topic: 'Somatics',
    title: 'Why stretching does not undo a habit',
    excerpt:
      'A tight muscle is not a short muscle. It is a muscle receiving an instruction. Until the instruction changes, pulling on it only invites the body to pull back.',
    length: '7 minute read',
    image: images.forest,
    paragraphs: [
      'When a muscle feels permanently short, our common impulse is to pull on it. We fold forward, anchor a heel, and demand that the tissue yield to tension. But a tight muscle is not a short muscle: it is a muscle receiving a continuous, subconscious message from the nervous system to remain engaged.',
      'Thomas Hanna called this Sensory Motor Amnesia: the brain gradually forgetting how to let go. In involuntary contraction, the stretch reflex is activated whenever we pull too hard. The body perceives forced lengthening as a threat, tightening further to protect the joint.',
      'The somatic antidote is pandiculation. By consciously contracting into the tension just slightly more, sensing where the brain has maintained grip, and then releasing with decelerated control, the motor cortex recalibrates. The muscle lengthens on its own, without force.',
    ],
  },

  list: [
    {
      id: 'the-yawn-you-do-on-purpose',
      topic: 'Somatics',
      title: 'The yawn you do on purpose',
      length: '5 min',
      paragraphs: [
        'Watch a cat wake from sleep. It arches its spine, extends its claws, and lengthens through the paws with a luxurious sigh before resting back onto the floor. It does not stretch: it pandiculates.',
        'Pandiculation is nature’s reset button for the neuromuscular system. When we consciously contract a tight muscle and then release it at half speed, we restore biological ease. You can do this at your desk: contract the shoulder blades gently, feel the grip, and let them melt downward over ten slow counts.',
      ],
    },
    {
      id: 'standing-like-a-tree',
      topic: 'Tai Chi',
      title: 'Standing like a tree',
      length: '4 min',
      paragraphs: [
        'In Tai Chi, Zhan Zhuang (standing meditation) looks completely motionless to an observer. Yet internally, it is an active dance of continuous calibration.',
        'To stand like a tree is not to freeze into wood. It is to let the roots settle deep into the soles while the branches sway gently in the breeze. When the legs carry the weight and the hips unlock, the shoulders finally surrender the unnecessary duty of holding up the world.',
      ],
    },
    {
      id: 'dancing-with-nobody-watching',
      topic: 'Creative Movement',
      title: 'Dancing with nobody watching',
      length: '6 min',
      paragraphs: [
        'Most adults stop moving freely the moment they learn how their movement looks to others. We internalize posture, propriety, and the performance of correctness.',
        'Creative movement is an invitation to forget the mirror. When there is no choreography and no audience, the body remembers how to move from curiosity rather than obedience. Five minutes of unplanned, honest motion can loosen emotional armoring that months of discipline failed to reach.',
      ],
    },
    {
      id: 'what-the-startle-reflex-leaves-behind',
      topic: 'Somatics',
      title: 'What the startle reflex leaves behind',
      length: '8 min',
      paragraphs: [
        'A sudden noise makes the shoulders rise, the head pull forward, the abdomen tighten, and the breath catch. This is the primal Red Light reflex: the body curling in protection.',
        'When chronic stress becomes the background hum of daily life, the startle reflex never fully turns off. We walk around partially curled, wondering why the upper back aches and the chest feels narrow. Somatic inquiry allows us to show the nervous system that the emergency has passed.',
      ],
    },
    {
      id: 'on-doing-less',
      topic: 'Practice',
      title: 'On doing less',
      length: '3 min',
      paragraphs: [
        'Our modern instinct is to add: more repetitions, heavier loads, longer holds. In somatics, progress is measured by what you can cease doing.',
        'When you decrease effort from one hundred percent to twenty percent, sensitivity increases tenfold. The quieter the nervous system becomes, the more subtle the corrections it can perceive. Real transformation begins the moment you stop trying so hard.',
      ],
    },
  ],

  letters: {
    heading: 'Letters, twice a month',
    body: 'Field Notes is a short letter from Kirti: one idea to try in your body, one thing she has been reading, and news of classes before it goes anywhere else.',
    image: images.notebook,
  },
}
