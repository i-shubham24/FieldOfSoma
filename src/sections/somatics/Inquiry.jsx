import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import Reveal from '../../components/motion/Reveal'
import TextLink from '../../components/ui/TextLink'
import { booking } from '../../content/site'
import { somatics } from '../../content/somatics'
import { EASE } from '../../lib/motion'

// A short self-inquiry: tick where you hold tension, read what each place can mean.
// Nothing leaves the page; the choices live only in this component's state.
export default function Inquiry() {
  const { heading, intro, empty, closing, areas } = somatics.inquiry
  const [chosen, setChosen] = useState([])
  const reduce = useReducedMotion()

  const toggle = (id) =>
    setChosen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  // Notes appear in the order the areas are listed, not the order they were ticked.
  const notes = areas.filter((area) => chosen.includes(area.id))

  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal as="h2" className="text-heading">
              {heading}
            </Reveal>
            <Reveal
              as="p"
              delay={0.08}
              className="mt-6 max-w-[38ch] text-lede font-light text-soma-ink/80"
            >
              {intro}
            </Reveal>

            <Reveal as="ul" delay={0.16} className="mt-10 space-y-1">
              {areas.map((area) => {
                const on = chosen.includes(area.id)
                return (
                  <li key={area.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(area.id)}
                      className="group flex w-full items-center gap-5 py-2.5 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors duration-500 ease-soma ${
                          on
                            ? 'border-soma-moss bg-soma-moss text-soma-paper'
                            : 'border-soma-ink/45 text-transparent group-hover:border-soma-ink'
                        }`}
                      >
                        <CheckIcon size={13} weight="bold" />
                      </span>
                      <span
                        className={`font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.2] transition-colors duration-500 ease-soma ${
                          on ? 'text-soma-moss italic' : 'text-soma-ink'
                        }`}
                      >
                        {area.name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-6 lg:col-start-7">
            <div
              aria-live="polite"
              className="bg-soma-linen px-7 py-10 md:px-12 md:py-14 lg:sticky lg:top-28"
            >
              {notes.length === 0 ? (
                <p className="font-display text-[1.5rem] leading-[1.35] text-soma-clay-deep italic">
                  {empty}
                </p>
              ) : (
                <>
                  <ul className="space-y-8">
                    <AnimatePresence initial={false}>
                      {notes.map((area) => (
                        <motion.li
                          key={area.id}
                          layout={!reduce}
                          initial={reduce ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? undefined : { opacity: 0 }}
                          transition={{ duration: 0.7, ease: EASE }}
                        >
                          <h3 className="text-[1.5rem] leading-[1.2]">{area.name}</h3>
                          <p className="mt-2.5 text-[0.9375rem] leading-[1.75] text-soma-ink/80">
                            {area.body}
                          </p>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <p className="mt-10 border-t border-soma-ink/15 pt-7 text-[0.9375rem] leading-[1.75] text-soma-ink/80">
                    {closing}
                  </p>
                  <TextLink to={booking.to} className="mt-6">
                    {booking.label}
                  </TextLink>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
