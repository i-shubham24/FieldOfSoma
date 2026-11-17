// How the Somatic Pause looks in each stage.
// `tint` is the page colour behind the orb, so each step feels a little different.
// `colours` are the three that swirl inside the orb. `from` and `to` are the orb's size
// at the start and end of the stage: it grows on the inhale, shrinks on the exhale,
// draws in when tensed and slowly spreads on the release. `wobble` is how loose its edge
// is, `tremor` a fine shiver while tensed, and `speed` how fast it drifts.

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

const mood = ({ colours, ...rest }) => ({ ...rest, colours: colours.map(rgb) })

export const MOODS = {
  arrive: mood({
    tint: '#F7F3EC',
    from: 0.82,
    to: 0.8,
    wobble: 0.06,
    tremor: 0,
    speed: 0.55,
    colours: ['#8FA587', '#D4B98C', '#A7B5A0'],
  }),
  inhale: mood({
    tint: '#EDF2E8',
    from: 0.8,
    to: 1,
    wobble: 0.07,
    tremor: 0,
    speed: 0.8,
    colours: ['#8FA587', '#6F8A69', '#B9C7B1'],
  }),
  exhale: mood({
    tint: '#E9EFED',
    from: 1,
    to: 0.8,
    wobble: 0.06,
    tremor: 0,
    speed: 0.65,
    colours: ['#A7B5A0', '#8FA79F', '#C8D2C2'],
  }),
  tense: mood({
    tint: '#F6E9DE',
    from: 0.8,
    to: 0.72,
    wobble: 0.03,
    tremor: 0.014,
    speed: 1.5,
    colours: ['#C0643F', '#D4B98C', '#B07A5E'],
  }),
  release: mood({
    tint: '#F5EEE2',
    from: 0.72,
    to: 0.96,
    wobble: 0.1,
    tremor: 0,
    speed: 0.45,
    colours: ['#D4B98C', '#C98F6E', '#A7B5A0'],
  }),
  rest: mood({
    tint: '#EDE9E3',
    from: 0.96,
    to: 0.9,
    wobble: 0.04,
    tremor: 0,
    speed: 0.28,
    colours: ['#8E7B6C', '#A7B5A0', '#C2B6A6'],
  }),
  sense: mood({
    tint: '#F6F0E1',
    from: 0.9,
    to: 0.8,
    wobble: 0.075,
    tremor: 0,
    speed: 0.6,
    colours: ['#D9BE8A', '#8FA587', '#E8D6B0'],
  }),
}

export const rgba = (colour, alpha) =>
  `rgba(${Math.round(colour[0])},${Math.round(colour[1])},${Math.round(colour[2])},${alpha})`
