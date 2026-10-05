import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Reveal from '../../components/motion/Reveal'
import { voices } from '../../content/home'
import { EASE } from '../../lib/motion'

const controlClass = 'link-grow py-3 font-medium'

// Student words, one at a time, turned by hand. Nothing moves unless the reader asks.
export default function Voices() {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const count = voices.items.length
  const item = voices.items[index]

  const step = (direction) => setIndex((value) => (value + direction + count) % count)

  return (
    <section aria-labelledby="voices-heading" className="py-28 md:py-40">
      <Reveal className="shell text-center">
        <h2 id="voices-heading" className="sr-only">
          {voices.heading}
        </h2>

        <div
          aria-live="polite"
          className="mx-auto flex min-h-[17rem] max-w-3xl items-center justify-center sm:min-h-[14rem]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={index}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <blockquote className="font-display text-[clamp(1.625rem,2.8vw,2.375rem)] leading-[1.3] italic">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-8 text-[0.875rem] text-soma-clay-deep">
                {item.name} / {item.context}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-8 text-[0.8125rem]">
          <button
            type="button"
            className={controlClass}
            aria-label="Previous student quote"
            onClick={() => step(-1)}
          >
            Previous
          </button>
          <span aria-hidden="true" className="text-soma-clay-deep tabular-nums">
            {index + 1} of {count}
          </span>
          <button
            type="button"
            className={controlClass}
            aria-label="Next student quote"
            onClick={() => step(1)}
          >
            Next
          </button>
        </div>

        {voices.placeholder ? (
          <p className="mt-8 text-[0.75rem] text-soma-clay-deep">{voices.placeholderNote}</p>
        ) : null}
      </Reveal>
    </section>
  )
}
