import { images } from './images'

// Writing and newsletter. These short pieces are PLACEHOLDERS written for the site so the
// page has a shape. They are marked as drafts until Kirti replaces them with her own
// writing. Each piece has its own page at /articles/<id>.

export const articles = {
  intro: {
    label: 'Writing',
    headline: [{ text: 'Notes on sensing,' }, { text: 'moving and resting.', italic: true }],
    lede: 'Short pieces about the practices, and about paying attention to the body.',
  },

  placeholder: true,
  note: 'Draft: these pieces are samples for the layout. Kirti will replace them with her own writing.',

  featured: {
    id: 'why-stretching-does-not-undo-a-habit',
    topic: 'Somatics',
    title: 'Why stretching does not undo a habit',
    excerpt:
      'A tight muscle is often not a short one. It has learned to stay switched on, and pulling on it rarely teaches it to let go.',
    image: images.himalayanCedarForest,
    paragraphs: [
      'When a muscle feels tight, most of us want to stretch it. We lean, pull and hold. Sometimes it helps for an hour, and then the tightness comes back.',
      'That is because the tightness is often a habit, not a length. Over months and years, the brain learns to keep certain muscles a little bit on. We stop feeling it, so we cannot simply decide to relax.',
      'In Somatics we work with the habit itself. You gently tighten the muscle a little more, notice what that feels like, and then let it go very slowly. Done with attention, this helps the brain feel the muscle again, and it can begin to rest.',
    ],
  },

  list: [
    {
      id: 'the-yawn-you-do-on-purpose',
      topic: 'Somatics',
      title: 'The yawn you do on purpose',
      excerpt: 'Watch a cat wake up. It does not stretch. It tightens, then slowly lets go.',
      image: images.kirtiPortrait,
      paragraphs: [
        'Watch a cat wake up. It arches its back, spreads its paws, holds for a moment, and then slowly softens back down. This is called pandiculation, and we do it too when we yawn.',
        'You can try a small version now. Gently draw your shoulder blades together. Notice the effort. Then let them go as slowly as you can, over a count of ten. Notice how your shoulders feel afterwards.',
      ],
    },
    {
      id: 'standing-like-a-tree',
      topic: 'Tai Chi',
      title: 'Standing like a tree',
      excerpt: 'Standing practice looks still from the outside. Inside, a lot is happening.',
      image: images.kirtiTaiChiHorseStance,
      paragraphs: [
        'In Tai Chi, standing practice looks completely still. But inside, the body is always making small adjustments to stay balanced.',
        'Standing like a tree does not mean going stiff. The feet settle into the ground, the knees stay soft, and the upper body can relax because the legs are doing the carrying. Many people find their shoulders drop on their own.',
      ],
    },
    {
      id: 'moving-with-nobody-watching',
      topic: 'Creative Movement',
      title: 'Moving with nobody watching',
      excerpt: 'Without steps to follow or anyone looking, the body often finds its own way to move.',
      image: images.kirtiStageLunge,
      paragraphs: [
        'Many of us stop moving freely once we start to worry about how we look. We learn to sit still and stand straight, and we forget what it was like to move for fun.',
        'Creative movement is a chance to forget the mirror for a few minutes. There are no steps to learn and nobody to impress. You follow what feels good, and see where it goes.',
      ],
    },
    {
      id: 'what-stress-leaves-behind',
      topic: 'Somatics',
      title: 'What stress leaves behind',
      excerpt: 'A sudden fright makes us curl in. Long stress can leave us a little curled for good.',
      image: images.kirtiContemplationLeaves,
      paragraphs: [
        'A sudden loud noise makes the shoulders rise, the head pull forward and the breath catch. It is a natural way of protecting ourselves.',
        'When stress goes on for a long time, that response may never fully switch off. We walk around slightly curled and wonder why the upper back aches. Gentle somatic work helps the body notice this, and slowly let it go.',
      ],
    },
    {
      id: 'on-doing-less',
      topic: 'Practice',
      title: 'On doing less',
      excerpt: 'When you use less effort, you can feel more.',
      image: images.kirtiFieldMeadowFlow,
      paragraphs: [
        'We are used to doing more: more repetitions, longer holds, more effort. In somatic practice, it often works the other way round.',
        'When you move with less effort, you can feel more. Small changes become noticeable. That is often where real change begins.',
      ],
    },
  ],

  letters: {
    heading: 'Field Notes',
    body: 'A short letter from Kirti now and then: something to try in your body, and news of classes before anyone else.',
    image: images.kirtiFieldPresence,
  },
}

export const allArticles = [articles.featured, ...articles.list]

// Rough reading time at about 200 words a minute, never less than one minute.
export const readingTime = (article) => {
  const words = article.paragraphs.join(' ').split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}
