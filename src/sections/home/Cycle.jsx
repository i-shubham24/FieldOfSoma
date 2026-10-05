import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

// Top, right, bottom, left: the order the marker travels.
const POSITIONS = [
  'left-1/2 top-[12.5%]',
  'left-[87.5%] top-1/2',
  'left-1/2 top-[87.5%]',
  'left-[12.5%] top-1/2',
]

// Negative delays put each word a quarter turn behind the one before it.
const DELAYS = ['0s', '-18s', '-12s', '-6s']

// One slow cycle of pandiculation, drawn as a single line. A small marker travels
// the circle and each phase brightens as it passes, so the order is felt, not explained.
export default function Cycle({ centre, phases, caption, onOpenPause }) {
  const reduce = useReducedMotion()

  return (
    <figure className="mx-auto max-w-[26rem]">
      <div className="relative aspect-square">
        <svg
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <g transform="rotate(-90 200 200)">
            <motion.circle
              cx="200"
              cy="200"
              r="150"
              stroke="currentColor"
              strokeOpacity="0.6"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 2.8, ease: EASE }}
            />
          </g>
        </svg>

        <motion.div
          aria-hidden="true"
          // Clipped so the turning square never widens the page.
          className="absolute inset-0 overflow-hidden"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, delay: 1.6, ease: EASE }}
        >
          <div className="cycle-orbit absolute inset-0">
            <span
              className="absolute top-[12.5%] left-1/2 block h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 bg-soma-paper"
              style={{ borderRadius: '50%' }}
            />
          </div>
        </motion.div>

        {phases.map((phase, i) => (
          <span
            key={phase}
            className={`absolute ${POSITIONS[i]} -translate-x-1/2 -translate-y-1/2 bg-soma-moss px-3.5 py-1 text-[0.875rem] tracking-[0.04em]`}
          >
            <span className="cycle-phase block" style={{ animationDelay: DELAYS[i] }}>
              {phase}
            </span>
          </span>
        ))}

        {onOpenPause ? (
          <button
            type="button"
            onClick={onOpenPause}
            className="group absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-opacity"
            title="Click to begin interactive pandiculation guide"
          >
            <span className="font-display text-[1.75rem] italic transition-transform duration-500 ease-soma group-hover:scale-105">
              {centre}
            </span>
            <span className="mt-2 text-[0.75rem] font-medium tracking-[0.12em] text-soma-sand uppercase opacity-75 group-hover:opacity-100">
              Tap to begin
            </span>
          </button>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center font-display text-[1.75rem] italic">
            {centre}
          </p>
        )}
      </div>

      <figcaption className="mx-auto mt-8 max-w-[36ch] text-center text-[0.875rem] leading-[1.7] text-soma-paper/75">
        {caption}
      </figcaption>
    </figure>
  )
}
