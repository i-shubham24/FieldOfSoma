import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ClosingCall from '../components/layout/ClosingCall'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Button from '../components/ui/Button'
import DraftNote from '../components/ui/DraftNote'
import { classes } from '../content/classes'
import { PAGE_TOP } from '../lib/layout'
import { EASE } from '../lib/motion'
import useTitle from '../lib/useTitle'

function Intro() {
  const { label, headline, lede } = classes.intro

  return (
    <section className={PAGE_TOP}>
      <div className="shell text-center">
        <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
          {label}
        </Reveal>
        <RevealLines as="h1" lines={headline} delay={0.1} className="mt-7 text-display" />
        <Reveal
          as="p"
          delay={0.4}
          className="mx-auto mt-8 max-w-[50ch] text-lede font-light text-soma-ink/80"
        >
          {lede}
        </Reveal>
      </div>
    </section>
  )
}

function ClassItem({ item }) {
  const [asked, setAsked] = useState(false)

  return (
    <article>
      <Frame
        image={item.image}
        ratio="aspect-[4/3]"
        sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
      />
      <div className="mt-6 flex items-baseline justify-between gap-6">
        <p className="font-display text-[1.125rem] leading-[1.2] text-soma-moss italic">
          {item.practiceName}
        </p>
        <p className="text-[0.8125rem] text-soma-clay-deep tabular-nums">
          {item.duration} / {item.level}
        </p>
      </div>
      <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.2]">{item.title}</h3>
      <p className="mt-3 text-[0.9375rem] leading-[1.7] text-soma-ink/80">{item.focus}</p>
      <div className="mt-6 flex items-center justify-between gap-6">
        <p className="text-[1.0625rem] leading-none font-medium tabular-nums">
          {item.price}
        </p>
        <Button
          variant="outline"
          size="sm"
          aria-describedby={asked ? `${item.id}-status` : undefined}
          onClick={() => setAsked(true)}
        >
          Buy class
        </Button>
      </div>
      {asked ? (
        <p id={`${item.id}-status`} role="status" className="mt-4 text-[0.8125rem] text-soma-clay-deep">
          {classes.checkoutNote}
        </p>
      ) : null}
    </article>
  )
}

function Library() {
  const [filter, setFilter] = useState('all')
  const reduce = useReducedMotion()
  const visible = classes.items.filter((item) => filter === 'all' || item.practice === filter)

  return (
    <section className="pt-24 pb-28 md:pt-32 md:pb-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <div
            role="group"
            aria-label="Filter classes by practice"
            className="flex flex-wrap justify-center gap-x-9 gap-y-3 border-y border-soma-sand py-5"
          >
            {classes.filters.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
                className={`link-grow pb-1 text-[0.875rem] tracking-[0.02em] transition-colors duration-500 ${
                  filter === option.id
                    ? 'font-medium text-soma-ink [background-size:100%_1px] [background-position:0_100%]'
                    : 'text-soma-ink/65 hover:text-soma-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ul className="mt-16 grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((item) => (
                <motion.li
                  key={item.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <ClassItem item={item} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {classes.placeholder ? <DraftNote className="mt-16">{classes.note}</DraftNote> : null}
        </div>
      </div>
    </section>
  )
}

export default function Classes() {
  useTitle('Recorded Classes')

  return (
    <>
      <Intro />
      <Library />
      <ClosingCall {...classes.courses} booking={false} />
    </>
  )
}
