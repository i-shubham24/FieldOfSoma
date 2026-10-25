import { images } from './images'

// Discover Somatics: the page that explains and persuades.
// The physiology here follows Thomas Hanna's Clinical Somatics. Kirti should review every claim.

export const somatics = {
  intro: {
    label: 'Discover Somatics',
    headline: [{ text: 'We live from' }, { text: 'the neck up', italic: true }],
    lede: 'Most of us think our way through the day and notice the body only when it hurts. Somatics is the practice of noticing sooner, and of using that attention to undo tension at its source.',
    image: images.kirtiForestHero,
  },

  problem: {
    heading: 'What the body forgets',
    paragraphs: [
      'Muscles tighten for good reasons: a deadline, a long drive, a fall, a hard year. The trouble starts when the reason passes and the tightening does not.',
      'A contraction repeated often enough is handed to the older, automatic parts of the brain. It runs without your say and, after a while, without your knowledge. You cannot relax the muscle because you can no longer feel that you are holding it.',
      'Thomas Hanna, who developed Clinical Somatics, called this sensory-motor amnesia. Often it is not damage or age but a learned habit, and what has been learned can often be unlearned.',
    ],
    patternsHeading: 'Three patterns of holding',
    patterns: [
      {
        name: 'The startle pattern',
        cause: 'A response to worry and threat',
        body: 'The belly tightens, the shoulders round, the head moves forward and the breath turns shallow.',
      },
      {
        name: 'The action pattern',
        cause: 'A response to constant demand',
        body: 'The lower back arches and tightens, the shoulders pull back and the body stays ready to go.',
      },
      {
        name: 'The guarding pattern',
        cause: 'A response to injury or one-sided strain',
        body: 'The waist shortens on one side, and the body tilts or twists around the place it is protecting.',
      },
    ],
  },

  difference: {
    heading: 'How Somatics is different',
    columns: ['The familiar way', 'The somatic way'],
    rows: [
      {
        familiar: {
          name: 'Stretching',
          body: 'Pulls on a muscle the brain is still contracting. The stretch reflex answers by tightening it again.',
        },
        somatic: {
          name: 'Pandiculation',
          body: 'You contract the tight muscle on purpose, then release it slowly. The brain feels the whole range and resets the resting length.',
        },
      },
      {
        familiar: {
          name: 'Being worked on',
          body: 'Massage and adjustment act from outside. They can ease a muscle, but the instruction to hold it still comes from your own nervous system.',
        },
        somatic: {
          name: 'Learning it yourself',
          body: 'You make the movement and you feel the release. The skill stays with you and can be used any day, without an appointment.',
        },
      },
      {
        familiar: {
          name: 'Quietening the signal',
          body: 'Rest, supports and pain relief turn down a symptom. The pattern that produces it stays in place.',
        },
        somatic: {
          name: 'Changing the pattern',
          body: 'The work addresses the habit of contraction itself, which is why its effects build with practice.',
        },
      },
    ],
    note: 'Somatic education is not medical treatment. If you have an injury or a diagnosis, keep your doctor informed.',
  },

  grounding: {
    heading: 'What changes underneath',
    image: images.kirtiForestGrounding,
    items: [
      {
        title: 'The nervous system settles',
        body: 'Slow, attentive movement and easy breathing help the body shift into its rest-and-digest state. Heart rate, breath and muscle tone often settle together.',
      },
      {
        title: 'The brain’s map sharpens',
        body: 'The brain keeps a map of the body. Parts you stop feeling grow vague on that map. Moving with attention brings them back into focus, and easier control follows.',
      },
    ],
  },

  inquiry: {
    heading: 'Where do you hold?',
    intro: 'Choose the places that sound familiar. There are no wrong answers, and nothing is stored.',
    empty: 'Choose one or more to read what each can mean.',
    closing: 'These are patterns, not diagnoses. A first session looks at how they show up in you.',
    areas: [
      {
        id: 'jaw',
        number: '01',
        name: 'Jaw',
        reflex: 'Startle pattern',
        coords: { x: 100, y: 52 },
        body: 'Clenching and grinding often travel with the startle pattern. The jaw is one of the first places to tighten under worry and one of the last we notice.',
        microPractice: 'Allow a finger-width of space between top and bottom molars. Let the tongue rest softly on the floor of the mouth.',
      },
      {
        id: 'shoulders',
        number: '02',
        name: 'Neck and shoulders',
        reflex: 'Holding pattern',
        coords: { x: 100, y: 88 },
        body: 'Shoulders that sit high or roll forward are being held there by muscles that never switch off. Somatic work begins by feeling them lift on purpose.',
        microPractice: 'Lift both shoulders up towards the ears by 10%. Feel the effort. Now take eight slow seconds to let them sink all the way down.',
      },
      {
        id: 'breath',
        number: '03',
        name: 'Breath and ribs',
        reflex: 'Held breath',
        coords: { x: 100, y: 132 },
        body: 'A shallow, high breath means the belly and ribs are being held. As the front of the body softens, the breath deepens by itself.',
        microPractice: 'Place one warm hand over the lower ribs. Without forcing a deep inhale, simply wait for the next exhale to finish completely on its own.',
      },
      {
        id: 'back',
        number: '04',
        name: 'Lower back',
        reflex: 'Action pattern',
        coords: { x: 100, y: 172 },
        body: 'A tight, arched lower back is the mark of the action pattern. The muscles along the spine work all day, including when you lie down.',
        microPractice: 'While seated or standing, deliberately arch your lower spine slightly. Now slowly surrender the arch until your pelvis rests level.',
      },
      {
        id: 'hips',
        number: '05',
        name: 'Hips and pelvis',
        reflex: 'Guarding pattern',
        coords: { x: 100, y: 216 },
        body: 'Hips that feel stuck are often gripped by the waist and deep hip muscles on one side. Guarding after an old injury is a common cause.',
        microPractice: 'Notice which hip is carrying more of your weight right now. Shift a little towards the lighter side, and notice what your spine does.',
      },
      {
        id: 'tiredness',
        number: '06',
        name: 'Tiredness',
        reflex: 'Constant holding',
        coords: { x: 100, y: 280 },
        body: 'Holding muscles tight all day uses energy. Some people find they feel less tired as long-held tension lets go.',
        microPractice: 'Rest your head on a cushion or a high chair back for three breaths. Let it be heavy, and notice your neck let go a little.',
      },
    ],
  },

  faq: {
    heading: 'Doubts, answered plainly',
    items: [
      {
        question: 'How is Somatics different from yoga or stretching?',
        answer:
          'Stretching pulls on a muscle the brain is still holding, and the muscle often grips back. Somatics works the other way: you gently tighten the muscle on purpose, then let it go very slowly, so the brain can feel it and learn to let it rest.',
      },
      {
        question: 'What is sensory-motor amnesia, and can it change?',
        answer:
          'It is what happens when stress, long hours of sitting or an old injury teach muscles to stay tight until we stop feeling them. Often it is a habit rather than damage, and habits can change with gentle, attentive practice.',
      },
      {
        question: 'Is it strenuous?',
        answer:
          'No. The movements are small, slow and mostly done lying down. If something strains, you are asked to do less.',
      },
      {
        question: 'Can I do it if I have chronic pain?',
        answer:
          'Often, yes. Each session is adapted to what your body can do on the day. Somatics sits alongside medical care and does not replace it, so if you are unsure, check with your doctor first.',
      },
      {
        question: 'How often should I practise?',
        answer:
          'A few minutes once or twice a day is a good start. Doing a little often matters more than doing a lot.',
      },
      {
        question: 'Can sessions happen online?',
        answer:
          'Yes. Somatic education is taught mainly through spoken guidance, so it works well over video. You need a quiet floor space and a mat or blanket.',
      },
      {
        question: 'Do I need to be flexible or fit?',
        answer:
          'No. The work is about sensing and control, not range. People of any age and ability can practise.',
      },
      {
        question: 'How soon will I notice a change?',
        answer:
          'Some people feel a difference in the first session, often as ease or warmth where they were tight. Lasting change comes from short, regular practice at home.',
      },
    ],
  },

  closing: {
    heading: 'Feel it for yourself',
    body: 'Reading about Somatics only goes so far. One session will tell you more than this page can.',
  },
}
