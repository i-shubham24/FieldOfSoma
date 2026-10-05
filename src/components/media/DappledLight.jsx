// A stand-in for a photograph: soft light and leaf shadow, built from the site palette.
// It holds the composition until Kirti's own photographs arrive.

const light = (opacity) => `rgba(250, 246, 240, ${opacity})`
const moss = (opacity) => `rgba(70, 89, 66, ${opacity})`
const clay = (opacity) => `rgba(118, 101, 87, ${opacity})`
const ink = (opacity) => `rgba(28, 26, 23, ${opacity})`
const leaf = (opacity) => `rgba(206, 214, 168, ${opacity})`

const TONES = {
  sand: {
    base: 'linear-gradient(150deg, #f1e9dc 0%, #e6dccb 48%, #d6c9b6 100%)',
    shapes: [
      { color: light(0.95), left: '6%', top: '4%', width: '54%', height: '46%', rotate: -24 },
      { color: light(0.8), left: '54%', top: '46%', width: '42%', height: '38%', rotate: 18 },
      { color: moss(0.28), left: '46%', top: '-10%', width: '46%', height: '42%', rotate: 32 },
      { color: moss(0.22), left: '-12%', top: '56%', width: '48%', height: '40%', rotate: -14 },
      { color: clay(0.3), left: '62%', top: '72%', width: '52%', height: '40%', rotate: 8 },
      { color: moss(0.2), left: '30%', top: '32%', width: '16%', height: '24%', rotate: 40 },
    ],
  },
  moss: {
    base: 'linear-gradient(160deg, #50654a 0%, #465942 45%, #33422f 100%)',
    shapes: [
      { color: leaf(0.42), left: '4%', top: '28%', width: '42%', height: '48%', rotate: -20 },
      { color: light(0.26), left: '52%', top: '6%', width: '38%', height: '30%', rotate: 24 },
      { color: leaf(0.32), left: '50%', top: '58%', width: '44%', height: '36%', rotate: 12 },
      { color: ink(0.34), left: '24%', top: '-12%', width: '52%', height: '36%', rotate: 14 },
      { color: ink(0.3), left: '-14%', top: '74%', width: '62%', height: '40%', rotate: -6 },
      { color: ink(0.22), left: '70%', top: '34%', width: '38%', height: '30%', rotate: 30 },
    ],
  },
  clay: {
    base: 'linear-gradient(150deg, #b9a898 0%, #9c8979 50%, #7d6b5d 100%)',
    shapes: [
      { color: light(0.5), left: '40%', top: '4%', width: '52%', height: '46%', rotate: 20 },
      { color: light(0.34), left: '0%', top: '50%', width: '42%', height: '42%', rotate: -18 },
      { color: ink(0.24), left: '-12%', top: '-10%', width: '52%', height: '44%', rotate: -12 },
      { color: ink(0.26), left: '50%', top: '64%', width: '62%', height: '44%', rotate: 10 },
      { color: moss(0.2), left: '28%', top: '30%', width: '22%', height: '30%', rotate: 36 },
    ],
  },
}

export default function DappledLight({ tone = 'sand' }) {
  const { base, shapes } = TONES[tone] ?? TONES.sand

  return (
    <div aria-hidden="true" className="absolute inset-0" style={{ background: base }}>
      {shapes.map(({ color, rotate, ...box }, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...box,
            backgroundColor: color,
            borderRadius: '50%',
            filter: 'blur(clamp(22px, 4vw, 56px))',
            transform: `rotate(${rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
