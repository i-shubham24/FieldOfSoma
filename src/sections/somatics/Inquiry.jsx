import { useEffect, useRef, useState } from 'react'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import Reveal from '../../components/motion/Reveal'
import TextLink from '../../components/ui/TextLink'
import { booking } from '../../content/site'
import { somatics } from '../../content/somatics'

// An interactive anatomical posture silhouette with somatic meridian focal points.
// Uses stationary, stable hit-targets so nodes never jitter under cursor.
function BodySilhouette({ areas, chosen, onToggle }) {
  return (
    <div className="relative mx-auto flex h-[310px] sm:h-[330px] lg:h-[340px] w-full max-w-[170px] items-center justify-center select-none">
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

        {/* Interactive focal nodes: stable, zero-jitter hover target */}
        {areas.map((area) => {
          const on = chosen.includes(area.id)
          const { x, y } = area.coords

          return (
            <g
              key={area.id}
              onClick={() => onToggle(area.id)}
              className="group cursor-pointer"
            >
              {/* Generous invisible hit-target circle so cursor never drops off */}
              <circle
                cx={x}
                cy={y}
                r="18"
                fill="transparent"
                className="cursor-pointer"
              />

              {/* Calm, static outer halo ring when active */}
              {on ? (
                <circle
                  cx={x}
                  cy={y}
                  r="13"
                  fill="none"
                  stroke="currentColor"
                  className="stroke-soma-moss"
                  strokeWidth="1.2"
                />
              ) : null}

              {/* Stable node circle */}
              <circle
                cx={x}
                cy={y}
                r="6"
                className={`transition-colors duration-300 ${
                  on
                    ? 'fill-soma-moss'
                    : 'fill-soma-paper stroke-soma-ink/35 stroke-[1.2] group-hover:stroke-soma-ink group-hover:fill-soma-sand/30'
                }`}
              />

              {/* Inner dot */}
              <circle
                cx={x}
                cy={y}
                r="2"
                className={`transition-colors duration-300 ${
                  on ? 'fill-soma-paper' : 'fill-soma-ink/50'
                }`}
              />

              {/* Numerical label */}
              <text
                x={x + 14}
                y={y + 3.5}
                className={`font-sans text-[10px] font-medium tracking-wider transition-colors duration-300 select-none ${
                  on ? 'fill-soma-moss font-semibold' : 'fill-soma-clay-deep'
                }`}
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

// Self-Inquiry Tool with scroll-based sticky fixing:
// As user chooses options from 1 to 6 and scrolls the page:
// 1. The section fixes cleanly at top: 0, taking over the screen without cutting off content.
// 2. Main page scroll smoothly translates the notes upward.
// 3. Earlier options hide inside underneath the fixed top header of the card.
// 4. The screen stays sticky fixed until the scroll content ends, then natural page scroll resumes.
export default function Inquiry() {
  const { heading, intro, empty, closing, areas } = somatics.inquiry
  const [chosen, setChosen] = useState(['jaw', 'shoulders', 'breath', 'back'])

  const sectionRef = useRef(null)
  const cardBodyRef = useRef(null)
  const listRef = useRef(null)
  const [maxOverflow, setMaxOverflow] = useState(0)
  // The pinned, scroll-driven card only runs from tablet width up. On phones the stage
  // is taller than the screen, so the notes simply flow and scroll with the page.
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const onChange = () => setWide(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Smoothly dock section flush to top: 0 if user interacts while it is partially scrolled
  const snapToTopIfNeeded = () => {
    if (!wide || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    if (Math.abs(rect.top) > 12) {
      if (window.__lenis) {
        window.__lenis.scrollTo(sectionRef.current, { offset: 0, duration: 0.6 })
      } else {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleToggle = (id) => {
    setChosen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
    snapToTopIfNeeded()
  }

  const handleSetAll = (items) => {
    setChosen(items)
    snapToTopIfNeeded()
  }

  // Notes appear in the order the areas are listed
  const notes = areas.filter((area) => chosen.includes(area.id))

  // Measure content overflow vs card window height
  useEffect(() => {
    const measure = () => {
      if (!wide) {
        setMaxOverflow(0)
        return
      }
      if (listRef.current && cardBodyRef.current) {
        const listH = listRef.current.scrollHeight
        const windowH = cardBodyRef.current.clientHeight
        const diff = Math.max(0, listH - windowH)
        setMaxOverflow(diff)
      }
    }

    measure()
    const timer = setTimeout(measure, 60)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [chosen, notes.length, wide])

  // Scroll tracking: calculate scroll progress when section is sticky at top: 0
  useEffect(() => {
    if (maxOverflow <= 0) {
      if (listRef.current) {
        listRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
      return undefined
    }

    const scrollDistance = Math.round(maxOverflow * 1.5)
    let rafId = null

    const updateScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        if (!sectionRef.current || !listRef.current) return
        const rect = sectionRef.current.getBoundingClientRect()
        const scrolledPast = -rect.top

        let targetY = 0
        if (scrolledPast <= 0) {
          targetY = 0
        } else if (scrolledPast >= scrollDistance) {
          targetY = -maxOverflow
        } else {
          const progress = scrolledPast / scrollDistance
          targetY = -progress * maxOverflow
        }
        listRef.current.style.transform = `translate3d(0, ${Math.round(targetY * 10) / 10}px, 0)`
      })
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    const lenis = window.__lenis
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', updateScroll)
    }

    updateScroll()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateScroll)
      if (lenis && typeof lenis.off === 'function') {
        lenis.off('scroll', updateScroll)
      }
    }
  }, [maxOverflow])

  const hasRunway = maxOverflow > 0
  const runwayStyle = hasRunway
    ? { minHeight: `calc(100vh + ${Math.round(maxOverflow * 1.5)}px)` }
    : undefined

  return (
    <section
      id="inquiry"
      ref={sectionRef}
      style={runwayStyle}
      className="relative"
    >
      {/* Sticky stage: locks flush at top: 0 until scroll content ends, fully readable on any screen */}
      <div className="z-20 flex flex-col justify-center bg-soma-paper py-20 md:sticky md:top-0 md:h-[100dvh] md:max-h-[100dvh] md:overflow-hidden md:pt-20 md:pb-6 lg:pt-22">
        <div className="shell">
          <div className="mx-auto max-w-6xl">
            {/* 12-Column Responsive Grid: Left side has Header + 2 columns, Right side has tall card extended 25% from top and 10% from bottom */}
            <div className="grid gap-6 md:grid-cols-12 md:items-start md:gap-6 lg:gap-8">
              {/* Left Side (Cols 1-7): Header + Holding Areas + Sensory Map */}
              <div className="md:col-span-7 flex flex-col justify-between">
                {/* Header: compact, elegant, readable */}
                <div className="max-w-xl">
                  <Reveal as="p" className="text-[0.75rem] font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
                    Interactive Self-Inquiry
                  </Reveal>
                  <Reveal as="h2" delay={0.06} className="mt-1 text-2xl sm:text-3xl font-display font-medium text-soma-ink leading-tight">
                    {heading}
                  </Reveal>
                  <Reveal
                    as="p"
                    delay={0.12}
                    className="mt-1.5 text-xs sm:text-sm text-soma-ink/80 max-w-[48ch] leading-relaxed"
                  >
                    {intro}
                  </Reveal>
                </div>

                {/* Subgrid: Holding Areas (4 cols of 7) + Sensory Map (3 cols of 7) */}
                <div className="mt-5 grid gap-4 sm:grid-cols-7 sm:gap-5 items-start">
                  {/* Column 1: Holding area checklist */}
                  <div className="sm:col-span-4">
                    <Reveal as="p" className="text-[0.75rem] font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
                      Holding Areas
                    </Reveal>

                    <ul className="mt-2 space-y-0.5 border-t border-soma-sand pt-1.5">
                      {areas.map((area) => {
                        const on = chosen.includes(area.id)
                        return (
                          <li key={area.id}>
                            <button
                              type="button"
                              aria-pressed={on}
                              onClick={() => handleToggle(area.id)}
                              className="group flex w-full items-center justify-between py-1.5 text-left transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
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
                                  className={`font-display text-[1.1875rem] sm:text-[1.25rem] leading-[1.2] transition-colors duration-500 ease-soma ${
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

                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => handleSetAll(areas.map((a) => a.id))}
                        className="tap-area link-rest pb-0.5 text-[0.75rem] text-soma-clay-deep hover:text-soma-ink cursor-pointer"
                      >
                        Select all
                      </button>
                      <span className="text-soma-sand">/</span>
                      <button
                        type="button"
                        onClick={() => handleSetAll([])}
                        className="tap-area link-rest pb-0.5 text-[0.75rem] text-soma-clay-deep hover:text-soma-ink cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>

                  {/* Column 2: Sensory Body Silhouette Map */}
                  <div className="hidden border-soma-sand/70 px-2 sm:block sm:col-span-3 sm:border-l sm:pl-3">
                    <div className="text-center">
                      <p className="text-[0.75rem] font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
                        Sensory Map
                      </p>
                      <div className="mt-1 flex items-center justify-center">
                        <BodySilhouette areas={areas} chosen={chosen} onToggle={handleToggle} />
                      </div>
                      <p className="mt-1 text-[0.75rem] text-soma-clay-deep">
                        Tap a point to read about it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: The Scrollable Box in right - extended 25% from top and 10% from bottom */}
              <div className="md:col-span-5">
                <div
                  aria-live="polite"
                  className="flex min-h-[16rem] flex-col border border-soma-sand/70 bg-soma-linen p-5 shadow-2xs sm:p-6 md:h-[480px] lg:h-[505px]"
                >
                  {notes.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center p-6">
                      <p className="font-display text-[1.25rem] leading-[1.4] text-soma-clay-deep italic">
                        {empty}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Fixed Card Header */}
                      <div className="shrink-0 border-b border-soma-sand/80 bg-soma-linen pb-3 z-10 flex items-center justify-between">
                        <p className="text-[0.75rem] font-medium tracking-[0.14em] text-soma-moss uppercase">
                          Identified Patterns ({notes.length})
                        </p>
                        <span className="text-[0.75rem] text-soma-clay-deep tabular-nums">
                          {notes.length} of {areas.length} selected
                        </span>
                      </div>

                      {/* Clipping Window: items slide up driven by main page scroll */}
                      <div
                        ref={cardBodyRef}
                        className="relative flex-1 md:overflow-hidden"
                      >
                        <div
                          ref={listRef}
                          className="space-y-5 pt-3 pb-6 will-change-transform transform-gpu"
                        >
                          {notes.map((area) => (
                            <div
                              key={area.id}
                              className="border-b border-soma-ink/10 pb-4 last:border-b-0 last:pb-0"
                            >
                              <div className="flex items-baseline justify-between gap-3">
                                <h3 className="font-display text-[1.3125rem] leading-[1.2]">
                                  {area.name}
                                </h3>
                                <span className="font-sans text-[0.75rem] text-soma-clay-deep uppercase tracking-wider">
                                  {area.reflex}
                                </span>
                              </div>

                              <p className="mt-1.5 text-[0.875rem] leading-[1.6] text-soma-ink/80">
                                {area.body}
                              </p>

                              {/* 30-Second Guided Micro-Practice */}
                              <div className="mt-3 border border-soma-sand/80 bg-soma-paper p-3 shadow-2xs">
                                <p className="font-sans text-[0.75rem] font-medium tracking-[0.14em] text-soma-moss uppercase">
                                  30-Second Somatic Check-In
                                </p>
                                <p className="mt-1 text-[0.78125rem] leading-[1.55] text-soma-ink/85 italic">
                                  “{area.microPractice}”
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fixed Card Footer */}
                      <div className="shrink-0 border-t border-soma-sand/80 bg-soma-linen pt-3 mt-1 z-10">
                        <p className="text-[0.71875rem] leading-[1.5] text-soma-ink/80">
                          {closing}
                        </p>
                        <TextLink to={booking.to} className="mt-1.5 text-xs">
                          {booking.label}
                        </TextLink>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
