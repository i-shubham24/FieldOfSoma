// The Somatic Pause, from Kirti's notes (2026-11-17). It opens with a 10 second
// arrival, like the notice and countdown before a film, then six timed steps that repeat.
// `cues` are the subtitles: each line shows from `at` seconds into its step until the next.

export const pause = {
  arrival: {
    seconds: 10,
    cues: [
      { at: 0, text: 'Let’s take a moment to arrive.' },
      { at: 3.5, text: 'We are going into the practice of Somatic Pause.' },
      { at: 7, text: 'Sit or lie down comfortably. Move gently, never into pain.' },
    ],
  },

  steps: [
    {
      id: 'inhale',
      name: 'Inhale',
      seconds: 4,
      cues: [{ at: 0, text: 'Breathe in slowly. Let your ribs and belly widen.' }],
    },
    {
      id: 'exhale',
      name: 'Exhale',
      seconds: 4,
      cues: [{ at: 0, text: 'Breathe out softly. Let your shoulders drop.' }],
    },
    {
      id: 'tense',
      name: 'Tense',
      seconds: 4,
      cues: [{ at: 0, text: 'Gently tighten your shoulders or hands, with only a little effort.' }],
    },
    {
      id: 'release',
      name: 'Release',
      seconds: 8,
      cues: [
        { at: 0, text: 'Now let go, slowly.' },
        { at: 3.5, text: 'Take longer to let go than you took to tighten.' },
      ],
    },
    {
      id: 'rest',
      name: 'Rest',
      seconds: 8,
      cues: [
        { at: 0, text: 'Let your whole body go soft.' },
        { at: 4, text: 'Let the floor or the chair hold your weight.' },
      ],
    },
    {
      id: 'sense',
      name: 'Sense',
      seconds: 10,
      cues: [
        { at: 0, text: 'Notice how that place feels now.' },
        { at: 4, text: 'Warmer? Softer? A little more space?' },
        { at: 7.5, text: 'Nothing to fix. Just notice.' },
      ],
    },
  ],
}
