import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

// Soft colour blobs that drift and change shape inside the orb, in the site's palette.
// Each one turns on its own track, at its own speed, so the swirl never repeats exactly.
const BLOBS = [
  { color: '#8FA587', size: '78%', offset: '-20%', spin: '13s', reverse: false, morph: '9s' },
  { color: '#465942', size: '58%', offset: '22%', spin: '17s', reverse: true, morph: '11s' },
  { color: '#D4B98C', size: '70%', offset: '-14%', spin: '21s', reverse: true, morph: '8s' },
  { color: '#8E7B6C', size: '46%', offset: '26%', spin: '11s', reverse: false, morph: '12s' },
  { color: '#C0643F', size: '38%', offset: '-26%', spin: '15s', reverse: false, morph: '10s' },
]

// How the orb answers each phase of the guide: size, colour strength and glow.
const MOODS = [
  { scale: 1.12, colour: 1, glow: 0.6 }, // Contract
  { scale: 0.94, colour: 0.88, glow: 0.42 }, // Release
  { scale: 0.88, colour: 0.72, glow: 0.3 }, // Rest
  { scale: 1.0, colour: 0.94, glow: 0.5 }, // Sense
]

// A breathing, Siri-like orb for the Somatic Pause. `phaseIndex` and `seconds` come from
// the guide; `active` is false while paused, which freezes the swirl.
export default function BreathOrb({ phaseIndex, seconds, active, children }) {
  const reduce = useReducedMotion()
  const mood = MOODS[phaseIndex] ?? MOODS[3]
  const ease = { duration: seconds, ease: EASE }

  return (
    <div className="relative flex size-[min(19rem,80vw)] items-center justify-center sm:size-88">
      {/* Halo */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-[50%] bg-[radial-gradient(circle,rgba(96,119,91,0.45)_0%,rgba(167,181,160,0.25)_45%,transparent_70%)] blur-2xl"
        animate={reduce ? undefined : { scale: active ? mood.scale * 1.1 : 1, opacity: active ? mood.glow + 0.35 : 0.4 }}
        transition={ease}
      />

      {/* Orb */}
      <motion.div
        className="relative flex size-[min(15rem,64vw)] items-center justify-center overflow-hidden rounded-[50%] bg-[radial-gradient(circle_at_50%_45%,#FAF6F0_0%,#F0EAE1_60%,#E5DCCD_100%)] shadow-[0_30px_80px_-30px_rgba(70,89,66,0.55)] sm:size-68"
        animate={reduce ? undefined : { scale: active ? mood.scale : 1 }}
        transition={ease}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{ opacity: active ? mood.colour : 0.7 }}
          transition={ease}
        >
          {BLOBS.map((blob) => (
            <div
              key={blob.color}
              className="absolute inset-0 animate-[soma-orb-spin_var(--spin)_linear_infinite] motion-reduce:animate-none"
              style={{
                '--spin': blob.spin,
                animationDirection: blob.reverse ? 'reverse' : 'normal',
                animationPlayState: active ? 'running' : 'paused',
              }}
            >
              <div
                className="absolute top-1/2 left-1/2 animate-[soma-orb-morph_var(--morph)_ease-in-out_infinite] opacity-85 blur-xl motion-reduce:animate-none"
                style={{
                  '--morph': blob.morph,
                  width: blob.size,
                  height: blob.size,
                  backgroundColor: blob.color,
                  translate: `calc(-50% + ${blob.offset}) -50%`,
                  animationPlayState: active ? 'running' : 'paused',
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* A clear centre so the words stay easy to read */}
        <div
          aria-hidden="true"
          className="absolute inset-[24%] rounded-[50%] bg-[radial-gradient(circle,rgba(250,246,240,0.9)_0%,rgba(250,246,240,0.6)_50%,transparent_78%)] blur-lg"
        />
        {/* Glassy highlight and rim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[50%] bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_38%)]"
        />
        <div aria-hidden="true" className="absolute inset-0 rounded-[50%] ring-1 ring-white/50 ring-inset" />

        <div className="relative z-10 px-6 text-center">{children}</div>
      </motion.div>
    </div>
  )
}
