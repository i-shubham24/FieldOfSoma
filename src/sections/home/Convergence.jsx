import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Reveal from '../../components/motion/Reveal'
import TextLink from '../../components/ui/TextLink'
import { EASE } from '../../lib/motion'

// The intersections and pillars of Kirti's three disciplines: directly solving her brief
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
    id: 'somatics',
    tag: 'Clinical Somatics',
    title: 'Heal and Sense',
    summary:
      'Gentle neuromuscular repatterning that releases chronic muscle holding from within the nervous system. Restoring your body’s natural ease.',
    insight:
      'When you sense a muscle from within, your brain can finally instruct it to let go. Lasting relief begins with internal awareness.',
    action: { to: '/practices#somatics', label: 'About Clinical Somatics' },
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
    id: 'taichi',
    tag: 'Tai Chi Form',
    title: 'Ground and Flow',
    summary:
      'An ancient martial art practiced as moving meditation. Developing effortless alignment, deep rooting, and fluid circular strength.',
    insight:
      'True power does not come from tension. It arises when the body roots into the earth and moves as one connected whole.',
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
    id: 'dance',
    tag: 'Creative Movement',
    title: 'Express and Play',
    summary:
      'Open movement inquiry drawn from contemporary dance. No choreography, no performance. Simply the joy and freedom of a body in motion.',
    insight:
      'Movement is our first language. When we suspend judgment, the body expresses feelings and vitality that words cannot reach.',
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

  const currentIndex = LENSES.findIndex((l) => l.id === activeId)
  const activeLens = LENSES[currentIndex >= 0 ? currentIndex : 0]

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + LENSES.length) % LENSES.length
    setActiveId(LENSES[nextIdx].id)
  }

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % LENSES.length
    setActiveId(LENSES[nextIdx].id)
  }

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
                  className={`relative z-20 flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-[2px] border text-center transition-all duration-500 ease-soma ${
                    activeId === 'center'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper shadow-sm ring-2 ring-soma-moss/30'
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

                {/* Apex 1: Somatics (Top) - Interactive Button */}
                <button
                  type="button"
                  onClick={() => setActiveId('somatics')}
                  className={`group absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer p-1 text-center transition-all duration-300 ${
                    activeId === 'somatics' ? 'scale-105' : 'hover:opacity-80'
                  }`}
                >
                  <span
                    className={`block font-sans text-[0.6875rem] font-medium tracking-[0.14em] uppercase transition-colors ${
                      activeId === 'somatics' ? 'text-soma-moss font-semibold' : 'text-soma-clay-deep'
                    }`}
                  >
                    Heal / Sense
                  </span>
                  <span
                    className={`mt-1 block font-display text-[1.125rem] transition-colors ${
                      activeId === 'somatics' ? 'text-soma-moss font-semibold underline underline-offset-4' : 'text-soma-ink'
                    }`}
                  >
                    Somatics
                  </span>
                </button>

                {/* Apex 2: Tai Chi (Bottom Right) - Interactive Button */}
                <button
                  type="button"
                  onClick={() => setActiveId('taichi')}
                  className={`group absolute right-0 bottom-0 cursor-pointer p-1 text-right transition-all duration-300 ${
                    activeId === 'taichi' ? 'scale-105' : 'hover:opacity-80'
                  }`}
                >
                  <span
                    className={`block font-sans text-[0.6875rem] font-medium tracking-[0.14em] uppercase transition-colors ${
                      activeId === 'taichi' ? 'text-soma-moss font-semibold' : 'text-soma-clay-deep'
                    }`}
                  >
                    Ground / Flow
                  </span>
                  <span
                    className={`mt-1 block font-display text-[1.125rem] transition-colors ${
                      activeId === 'taichi' ? 'text-soma-moss font-semibold underline underline-offset-4' : 'text-soma-ink'
                    }`}
                  >
                    Tai Chi
                  </span>
                </button>

                {/* Apex 3: Creative Movement (Bottom Left) - Interactive Button */}
                <button
                  type="button"
                  onClick={() => setActiveId('dance')}
                  className={`group absolute bottom-0 left-0 cursor-pointer p-1 text-left transition-all duration-300 ${
                    activeId === 'dance' ? 'scale-105' : 'hover:opacity-80'
                  }`}
                >
                  <span
                    className={`block font-sans text-[0.6875rem] font-medium tracking-[0.14em] uppercase transition-colors ${
                      activeId === 'dance' ? 'text-soma-moss font-semibold' : 'text-soma-clay-deep'
                    }`}
                  >
                    Express / Play
                  </span>
                  <span
                    className={`mt-1 block font-display text-[1.125rem] transition-colors ${
                      activeId === 'dance' ? 'text-soma-moss font-semibold underline underline-offset-4' : 'text-soma-ink'
                    }`}
                  >
                    Dance
                  </span>
                </button>

                {/* Intersection Button: Somatics + Tai Chi (Directional Right Arrow) */}
                <button
                  type="button"
                  onClick={() => setActiveId('somatics-taichi')}
                  aria-label="Somatics and Tai Chi synergy"
                  className={`absolute top-[40%] right-[10%] z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[2px] border transition-all duration-500 ease-soma ${
                    activeId === 'somatics-taichi'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper shadow-sm'
                      : 'border-soma-sand bg-soma-paper text-soma-clay-deep hover:border-soma-ink hover:text-soma-ink'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Intersection Button: Tai Chi + Dance (Bidirectional Arrow) */}
                <button
                  type="button"
                  onClick={() => setActiveId('taichi-creative')}
                  aria-label="Tai Chi and Dance synergy"
                  className={`absolute bottom-[10%] left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 cursor-pointer items-center justify-center rounded-[2px] border transition-all duration-500 ease-soma ${
                    activeId === 'taichi-creative'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper shadow-sm'
                      : 'border-soma-sand bg-soma-paper text-soma-clay-deep hover:border-soma-ink hover:text-soma-ink'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Intersection Button: Somatics + Dance (Directional Left Arrow) */}
                <button
                  type="button"
                  onClick={() => setActiveId('somatics-creative')}
                  aria-label="Somatics and Dance synergy"
                  className={`absolute top-[40%] left-[10%] z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[2px] border transition-all duration-500 ease-soma ${
                    activeId === 'somatics-creative'
                      ? 'border-soma-moss bg-soma-moss text-soma-paper shadow-sm'
                      : 'border-soma-sand bg-soma-paper text-soma-clay-deep hover:border-soma-ink hover:text-soma-ink'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Direct Left / Right Arrow Controller Bar Below Diagram */}
              <div className="mt-8 flex items-center justify-center gap-5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[2px] border border-soma-sand bg-soma-paper text-soma-ink transition-colors hover:border-soma-moss hover:text-soma-moss"
                  aria-label="Previous synergy perspective"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="font-sans text-[0.75rem] font-medium tracking-[0.14em] text-soma-clay-deep uppercase tabular-nums">
                  {currentIndex + 1} of {LENSES.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[2px] border border-soma-sand bg-soma-paper text-soma-ink transition-colors hover:border-soma-moss hover:text-soma-moss"
                  aria-label="Next synergy perspective"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Dynamic Convergence Story and Insight Card */}
            <div className="lg:col-span-6 lg:col-start-7">
              <div
                aria-live="polite"
                className="border border-soma-sand bg-soma-paper p-8 sm:p-10 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-soma-sand/80 pb-5">
                  <span className="font-sans text-label font-medium tracking-[0.16em] text-soma-moss uppercase">
                    {activeLens.tag}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 text-[0.8125rem]">
                      {LENSES.map((lens) => (
                        <button
                          key={lens.id}
                          type="button"
                          onClick={() => setActiveId(lens.id)}
                          className={`h-2 w-2 cursor-pointer rounded-none transition-colors duration-500 ${
                            activeId === lens.id ? 'bg-soma-moss' : 'bg-soma-sand'
                          }`}
                          title={lens.tag}
                        />
                      ))}
                    </div>
                    {/* Left & Right Arrow controls on card */}
                    <div className="flex items-center gap-1 border-l border-soma-sand/80 pl-3">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous perspective"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[2px] text-soma-ink/75 transition-colors hover:bg-soma-sand/40 hover:text-soma-moss"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next perspective"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[2px] text-soma-ink/75 transition-colors hover:bg-soma-sand/40 hover:text-soma-moss"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
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
