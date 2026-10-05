import { motion, useReducedMotion } from 'motion/react'
import Frame from '../../components/media/Frame'
import RevealLines from '../../components/motion/RevealLines'
import Button from '../../components/ui/Button'
import { hero } from '../../content/home'
import { booking } from '../../content/site'
import { EASE } from '../../lib/motion'

export default function Masthead() {
  const reduce = useReducedMotion()

  // Label, subtext and actions arrive after the headline, in reading order.
  const settle = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay, ease: EASE },
  })

  return (
    <section className="pt-[calc(4.5rem+3.5rem)] md:pt-[calc(4.5rem+4.5rem)]">
      <div className="shell text-center">
        <motion.p
          {...settle(0.1)}
          className="text-label font-medium text-soma-clay-deep uppercase"
        >
          {hero.label}
        </motion.p>

        <RevealLines
          as="h1"
          lines={hero.headline}
          delay={0.2}
          className="mt-7 text-display"
        />

        <motion.p
          {...settle(0.8)}
          className="mx-auto mt-8 max-w-[46ch] text-lede font-light text-soma-ink/80"
        >
          {hero.subtext}
        </motion.p>

        <motion.div
          {...settle(0.95)}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button to={hero.primary.to} arrow>
            {hero.primary.label}
          </Button>
          <Button to={booking.to} variant="outline">
            {booking.label}
          </Button>
        </motion.div>
      </div>

      <div className="shell mt-16 md:mt-20">
        <Frame
          image={hero.image}
          sizes="(min-width: 1024px) 56rem, 100vw"
          priority
          ratio="aspect-[4/5] sm:aspect-[3/2]"
          drift
          unveil
          delay={0.6}
          className="mx-auto max-w-4xl"
        />
      </div>
    </section>
  )
}
