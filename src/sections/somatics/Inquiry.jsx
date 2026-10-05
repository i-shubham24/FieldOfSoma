import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import Reveal from '../../components/motion/Reveal'
import TextLink from '../../components/ui/TextLink'
import { booking } from '../../content/site'
import { somatics } from '../../content/somatics'
import { EASE } from '../../lib/motion'

// An interactive anatomical posture silhouette with somatic meridian focal points.
function BodySilhouette({ areas, chosen, onToggle }) {
  const reduce = useReducedMotion()

  return (
    <div className="relative mx-auto flex h-[440px] w-full max-w-[220px] items-center justify-center">
      <svg
        viewBox="0 0 200 420"
        fill="none"
        aria-hidden="true"
        className="h-full w-full text-soma-ink"
      >
        {/* Subtle postural vertical axis */}
        <line
          x1="100"
          y1="24"
          x2="100"
          y2="390"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeOpacity="0.2"
        />

        {/* Head and cranium outline */}
        <circle
          cx="100"
          cy="48"
          r="22"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />

        {/* Neck and cervical curve */}
        <path
          d="M93 70 Q100 78 107 70"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />

        {/* Clavicle and shoulder span */}
        <path
          d="M56 94 Q100 86 144 94"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />

        {/* Ribcage / Thoracic envelope */}
        <path
          d="M72 110 C68 135 72 155 86 168 C92 173 108 173 114 168 C128 155 132 135 128 110"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        {/* Spinal lumbar line */}
        <line
          x1="100"
          y1="168"
          x2="100"
          y2="210"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeOpacity="0.4"
        />

        {/* Pelvic basin */}
        <path
          d="M68 214 Q100 228 132 214"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />

        {/* Legs and grounding down to feet */}
        <path
          d="M84 228 L80 340 L72 384 M116 228 L120 340 L128 384"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        {/* Interactive focal nodes */}
        {areas.map((area) => {
          const on = chosen.includes(area.id)
          const { x, y } = area.coords

          return (
            <g
              key={area.id}
              role="button"
              tabIndex={0}
              aria-label={`Toggle ${area.label || area.name || area.id} tension inquiry`}
              aria-pressed={on}
              className="cursor-pointer outline-none focus:outline-none"
              onClick={() => onToggle(area.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onToggle(area.id)
                }
              }}
            >
              {/* Outer pulse when active */}
              {on ? (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="16"
                  fill="none"
                  stroke="#465942"
                  strokeWidth="1"
                  initial={reduce ? false : { scale: 0.8, opacity: 0.9 }}
                  animate={reduce ? undefined : { scale: 1.45, opacity: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                />
              ) : null}

              {/* Focus node border */}
              <circle
                cx={x}
                cy={y}
                r="6"
                className="transition-colors duration-500"
                fill={on ? '#465942' : '#FAF6F0'}
                stroke={on ? '#465942' : '#8E7B6C'}
                strokeWidth={on ? '2' : '1.2'}
              />

              {/* Number indicator */}
              <text
                x={x > 100 ? x + 12 : x - 12}
                y={y + 3.5}
                textAnchor={x > 100 ? 'start' : 'end'}
                className="font-sans text-[9px] font-medium tracking-wider select-none"
                fill={on ? '#465942' : '#8E7B6C'}
              >
                {area.number}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Upgraded Self-Inquiry Tool with interactive Sensory Body Map.
export default function Inquiry() {
  const { heading, intro, empty, closing, areas } = somatics.inquiry
  const [chosen, setChosen] = useState(['jaw', 'shoulders'])
  const reduce = useReducedMotion()

  const toggle = (id) =>
    setChosen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  // Notes appear in the order the areas are listed
  const notes = areas.filter((area) => chosen.includes(area.id))

  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
              Interactive Self-Inquiry
            </Reveal>
            <Reveal as="h2" delay={0.06} className="mt-4 text-heading">
              {heading}
            </Reveal>
            <Reveal
              as="p"
              delay={0.12}
              className="mt-6 max-w-[48ch] text-lede font-light text-soma-ink/80"
            >
              {intro}
            </Reveal>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-8">
            {/* Column 1: Holding area checklist */}
            <div className="lg:col-span-4">
              <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
                Holding Areas
              </Reveal>

              <ul className="mt-6 space-y-1.5 border-t border-soma-sand pt-4">
                {areas.map((area) => {
                  const on = chosen.includes(area.id)
                  return (
                    <li key={area.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(area.id)}
                        className="group flex w-full items-center justify-between py-3 text-left transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            aria-hidden="true"
                            className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-500 ease-soma ${
                              on
                                ? 'border-soma-moss bg-soma-moss text-soma-paper'
                                : 'border-soma-ink/40 text-transparent group-hover:border-soma-ink'
                            }`}
                          >
                            <CheckIcon size={11} weight="bold" />
                          </span>
                          <span
                            className={`font-display text-[1.375rem] leading-[1.2] transition-colors duration-500 ease-soma ${
                              on ? 'text-soma-moss italic' : 'text-soma-ink'
                            }`}
                          >
                            {area.name}
                          </span>
                        </div>
                        <span className="font-sans text-[0.75rem] text-soma-clay-deep tabular-nums">
                          {area.number}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-8 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setChosen(areas.map((a) => a.id))}
                  className="link-rest pb-0.5 text-[0.8125rem] text-soma-clay-deep hover:text-soma-ink"
                >
                  Select all
                </button>
                <span className="text-soma-sand">/</span>
                <button
                  type="button"
                  onClick={() => setChosen([])}
                  className="link-rest pb-0.5 text-[0.8125rem] text-soma-clay-deep hover:text-soma-ink"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Column 2: Sensory Body Silhouette Map */}
            <div className="hidden border-soma-sand px-4 md:block lg:col-span-3 lg:border-x">
              <Reveal as="div" delay={0.15} className="sticky top-28 text-center">
                <p className="text-label font-medium text-soma-clay-deep uppercase">
                  Sensory Map
                </p>
                <div className="mt-4">
                  <BodySilhouette areas={areas} chosen={chosen} onToggle={toggle} />
                </div>
                <p className="mt-4 text-[0.75rem] text-soma-clay-deep">
                  Click points on the meridian axis to inspect patterns.
                </p>
              </Reveal>
            </div>

            {/* Column 3: Somatic Reflex Diagnosis & 30-Second Micro-Practice */}
            <div className="lg:col-span-5">
              <div
                aria-live="polite"
                className="bg-soma-linen px-7 py-9 md:px-10 md:py-12 lg:sticky lg:top-28"
              >
                {notes.length === 0 ? (
                  <p className="font-display text-[1.375rem] leading-[1.4] text-soma-clay-deep italic">
                    {empty}
                  </p>
                ) : (
                  <>
                    <p className="text-label font-medium text-soma-moss uppercase">
                      Identified Patterns ({notes.length})
                    </p>

                    <ul className="mt-6 space-y-9">
                      <AnimatePresence initial={false}>
                        {notes.map((area) => (
                          <motion.li
                            key={area.id}
                            layout={!reduce}
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0 }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="border-b border-soma-ink/10 pb-7 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-baseline justify-between gap-4">
                              <h3 className="font-display text-[1.5rem] leading-[1.2]">
                                {area.name}
                              </h3>
                              <span className="font-sans text-[0.75rem] text-soma-clay-deep uppercase">
                                {area.reflex}
                              </span>
                            </div>

                            <p className="mt-2 text-[0.9375rem] leading-[1.7] text-soma-ink/80">
                              {area.body}
                            </p>

                            {/* 30-Second Guided Micro-Practice */}
                            <div className="mt-4 border border-soma-sand/80 bg-soma-paper p-4">
                              <p className="font-sans text-[0.6875rem] font-medium tracking-[0.14em] text-soma-moss uppercase">
                                30-Second Somatic Check-In
                              </p>
                              <p className="mt-1.5 text-[0.875rem] leading-[1.65] text-soma-ink/85 italic">
                                “{area.microPractice}”
                              </p>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>

                    <p className="mt-9 border-t border-soma-ink/15 pt-6 text-[0.875rem] leading-[1.7] text-soma-ink/80">
                      {closing}
                    </p>

                    <TextLink to={booking.to} className="mt-5">
                      {booking.label}
                    </TextLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
