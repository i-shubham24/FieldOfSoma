import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Reveal from '../../components/motion/Reveal'
import TextLink from '../../components/ui/TextLink'
import { EASE } from '../../lib/motion'

// The intersections of Kirti's three disciplines: directly solving her brief
// to "throw light on how Somatics, Tai Chi and Creative Dance interconnect".
const LENSES = [
  {
    id: 'center',
    tag: 'The Confluence',
    title: 'Field of Soma',
    summary:
      'Where healing meets rooting meets play. A single evolving practice where your body can heal, ground and express itself all at once.',
    insight:
      'Most teachers specialize in one. Kirti teaches the three side by side because a body that is only quiet may lack expression, and a body that only dances may carry unaddressed pain.',
    action: { to: '/practices', label: 'Explore the three practices' },
  },
  {
    id: 'somatics-taichi',
    tag: 'Somatics + Tai Chi',
    title: 'Unlearning Meets Root',
    summary:
      'Somatics dissolves the chronic holding in the spine and shoulders, allowing Tai Chi’s downward root and circular power to flow without internal resistance.',
    insight:
      'You cannot settle weight into your feet if the lower back is locked in an action reflex. Releasing the pattern first makes grounding effortless.',
    action: { to: '/practices#tai-chi', label: 'About Tai Chi' },
  },
  {
    id: 'taichi-creative',
    tag: 'Tai Chi + Dance',
    title: 'Rooted Aliveness',
    summary:
      'Tai Chi trains internal balance, spinal fluidity and deep centering. Creative dance takes that quiet foundation and sets it free into spontaneous rhythm.',
    insight:
      'When your balance is steady from the dantian, you no longer brace when moving into the unknown. Dance becomes fearless and unforced.',
    action: { to: '/practices#creative-movement', label: 'About Creative Movement' },
  },
  {
    id: 'somatics-creative',
    tag: 'Somatics + Dance',
    title: 'Healing into Expression',
    summary:
      'As muscles recover from sensory-motor amnesia, the body rediscovers its natural range of sensation, curiosity and joyful movement.',
    insight:
      'Pain often shuts down our willingness to move playfully. As ease returns, the body naturally wants to express itself again.',
    action: { to: '/practices#somatics', label: 'About Clinical Somatics' },
  },
]

export default function Convergence() {
  const [activeId, setActiveId] = useState('center')
  const reduce = useReducedMotion()
  const activeLens = LENSES.find((l) => l.id === activeId) || LENSES[0]

  return (
    <section className="bg-soma-linen py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
              The Convergence
            </Reveal>
            <Reveal as="h2" delay={0.06} className="mt-4 text-heading">
              How three practices become one field
            </Reveal>
            <Reveal
              as="p"
              delay={0.12}
              className="mt-6 max-w-[48ch] text-lede font-light text-soma-ink/80"
            >
              These are not three separate exercises done in sequence. They are three angles on the
              same living nervous system.
            </Reveal>
          </div>

          <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
            {/* Left: Interactive Tripartite Radial Diagram */}
            <div className="flex flex-col items-center justify-center lg:col-span-5">
              <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
                {/* Connecting hairline triangle */}
                <svg
                  viewBox="0 0 300 300"
                  fill="none"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                >
                  <polygon
                    points="150,42 254,222 46,222"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="text-soma-sand"
                  />
                  <circle
                    cx="150"
                    cy="162"
                    r="68"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-soma-sand/70"
                  />
                </svg>

                {/* Central hub button: Field of Soma */}
                <button
                  type="button"
                  onClick={() => setActiveId('center')}
                  className={`relative z-20 flex h-20 w-20 flex-col items-center justify-center rounded-[2px] border text-center transition-all duration-500 ease-soma ${
                    activeId === 'center'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper shadow-sm'
                      : 'border-soma-sand bg-soma-paper text-soma-ink hover:border-soma-ink'
                  }`}
                  aria-pressed={activeId === 'center'}
                >
                  <span className="font-display text-[0.875rem] font-medium leading-none">
                    Field of
                  </span>
                  <span className="font-display text-[1rem] italic leading-none">
                    Soma
                  </span>
                </button>

                {/* Apex 1: Somatics (Top) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center">
                  <span className="block font-sans text-[0.6875rem] font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
                    Heal / Sense
                  </span>
                  <span className="mt-1 block font-display text-[1.125rem] text-soma-ink">
                    Somatics
                  </span>
                </div>

                {/* Apex 2: Tai Chi (Bottom Right) */}
                <div className="absolute right-0 bottom-0 text-right">
                  <span className="block font-sans text-[0.6875rem] font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
                    Ground / Flow
                  </span>
                  <span className="mt-1 block font-display text-[1.125rem] text-soma-ink">
                    Tai Chi
                  </span>
                </div>

                {/* Apex 3: Creative Movement (Bottom Left) */}
                <div className="absolute bottom-0 left-0 text-left">
                  <span className="block font-sans text-[0.6875rem] font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
                    Express / Play
                  </span>
                  <span className="mt-1 block font-display text-[1.125rem] text-soma-ink">
                    Dance
                  </span>
                </div>

                {/* Intersection Button: Somatics + Tai Chi */}
                <button
                  type="button"
                  onClick={() => setActiveId('somatics-taichi')}
                  aria-label="Somatics and Tai Chi intersection"
                  className={`absolute top-[40%] right-[10%] z-10 h-7 w-7 rounded-[2px] border text-[0.6875rem] font-medium transition-all duration-500 ease-soma ${
                    activeId === 'somatics-taichi'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper'
                      : 'border-soma-sand bg-soma-paper text-soma-clay-deep hover:border-soma-ink hover:text-soma-ink'
                  }`}
                >
                  +
                </button>

                {/* Intersection Button: Tai Chi + Dance */}
                <button
                  type="button"
                  onClick={() => setActiveId('taichi-creative')}
                  aria-label="Tai Chi and Dance intersection"
                  className={`absolute bottom-[10%] left-1/2 z-10 h-7 w-7 -translate-x-1/2 rounded-[2px] border text-[0.6875rem] font-medium transition-all duration-500 ease-soma ${
                    activeId === 'taichi-creative'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper'
                      : 'border-soma-sand bg-soma-paper text-soma-clay-deep hover:border-soma-ink hover:text-soma-ink'
                  }`}
                >
                  +
                </button>

                {/* Intersection Button: Somatics + Dance */}
                <button
                  type="button"
                  onClick={() => setActiveId('somatics-creative')}
                  aria-label="Somatics and Dance intersection"
                  className={`absolute top-[40%] left-[10%] z-10 h-7 w-7 rounded-[2px] border text-[0.6875rem] font-medium transition-all duration-500 ease-soma ${
                    activeId === 'somatics-creative'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper'
                      : 'border-soma-sand bg-soma-paper text-soma-clay-deep hover:border-soma-ink hover:text-soma-ink'
                  }`}
                >
                  +
                </button>
              </div>

              <p className="mt-8 text-center text-[0.75rem] text-soma-clay-deep">
                Select any point or intersection to explore the synergy.
              </p>
            </div>

            {/* Right: Dynamic Convergence Story & Insight Card */}
            <div className="lg:col-span-6 lg:col-start-7">
              <div
                aria-live="polite"
                className="border border-soma-sand bg-soma-paper p-8 sm:p-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-soma-sand/80 pb-5">
                  <span className="font-sans text-label font-medium tracking-[0.16em] text-soma-moss uppercase">
                    {activeLens.tag}
                  </span>
                  <div className="flex gap-2 text-[0.8125rem]">
                    {LENSES.map((lens) => (
                      <button
                        key={lens.id}
                        type="button"
                        onClick={() => setActiveId(lens.id)}
                        className={`h-2 w-2 rounded-none transition-colors duration-500 ${
                          activeId === lens.id ? 'bg-soma-moss' : 'bg-soma-sand'
                        }`}
                        title={lens.tag}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLens.id}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mt-6"
                  >
                    <h3 className="font-display text-[2rem] leading-[1.15] text-soma-ink">
                      {activeLens.title}
                    </h3>

                    <p className="mt-5 text-lede font-light leading-relaxed text-soma-ink/85">
                      {activeLens.summary}
                    </p>

                    <div className="mt-6 border-t border-soma-sand/60 pt-5">
                      <p className="font-sans text-[0.6875rem] font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
                        Somatic Perspective
                      </p>
                      <p className="mt-2 text-[0.9375rem] leading-[1.75] text-soma-ink/80 italic">
                        “{activeLens.insight}”
                      </p>
                    </div>

                    <div className="mt-8 pt-2">
                      <TextLink to={activeLens.action.to}>
                        {activeLens.action.label}
                      </TextLink>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
