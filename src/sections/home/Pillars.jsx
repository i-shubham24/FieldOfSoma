import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import Frame from '../../components/media/Frame'
import Reveal from '../../components/motion/Reveal'
import TextLink from '../../components/ui/TextLink'
import { pillars } from '../../content/home'
import { EASE } from '../../lib/motion'

function Stanza({ item, index, active, onCentre }) {
  const ref = useRef(null)
  // True while this stanza crosses the middle band of the viewport.
  const centred = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (centred) onCentre(index)
  }, [centred, index, onCentre])

  return (
    <article
      ref={ref}
      // Phone: image above text. Tablet: image beside text. Wide: text only, beside the fixed frame.
      className={`py-12 first:pt-0 last:pb-0 md:grid md:grid-cols-12 md:items-center md:gap-x-8 md:py-16 lg:flex lg:min-h-[78vh] lg:flex-col lg:items-stretch lg:justify-center lg:py-0 lg:transition-opacity lg:duration-1000 lg:ease-soma lg:focus-within:opacity-100 ${
        active ? '' : 'lg:opacity-40'
      }`}
    >
      <Frame
        image={item.image}
        sizes="(min-width: 768px) 40vw, 100vw"
        ratio="aspect-[4/5]"
        className="mb-10 md:col-span-5 md:mb-0 lg:hidden"
      />
      <div className="md:col-span-6 md:col-start-7">
        <p className="font-display text-[1.5rem] leading-[1.2] text-soma-moss italic">
          {item.verbs}
        </p>
        <h3 className="mt-3 text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1.05] tracking-[-0.01em]">
          {item.name}
        </h3>
        <p className="mt-7 max-w-[46ch] text-lede font-light text-soma-ink/80">{item.body}</p>
        <p className="mt-5 max-w-[46ch] text-[0.9375rem] text-soma-clay-deep">{item.audience}</p>
        <TextLink to={item.link.to} className="mt-9">
          {item.link.label}
        </TextLink>
      </div>
    </article>
  )
}

// The three practices. On wide screens one frame holds still while the text
// moves past it, and the photograph changes with the practice being read.
export default function Pillars() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="h2" className="text-heading">
            {pillars.heading}
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mx-auto mt-6 max-w-[44ch] text-lede font-light text-soma-ink/80"
          >
            {pillars.intro}
          </Reveal>
        </div>

        <div className="mx-auto mt-20 grid max-w-6xl lg:mt-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="hidden lg:col-span-5 lg:block">
            <figure className="sticky top-[max(6.5rem,calc(50dvh-20rem))]">
              <div className="relative aspect-[4/5] overflow-hidden">
                {pillars.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: i === active ? 1 : 0 }}
                    transition={{ duration: 1.4, ease: EASE }}
                  >
                    <img
                      src={item.image.src}
                      srcSet={item.image.srcSet}
                      sizes="(min-width: 1024px) 34vw, 100vw"
                      alt={i === active ? item.image.alt : ''}
                      loading="lazy"
                      className="photo absolute inset-0 h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </figure>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {pillars.items.map((item, i) => (
              <Stanza
                key={item.id}
                item={item}
                index={i}
                active={i === active}
                onCentre={setActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
