import ClosingCall from '../components/layout/ClosingCall'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Accordion from '../components/ui/Accordion'
import { somatics } from '../content/somatics'
import { PAGE_TOP } from '../lib/layout'
import useTitle from '../lib/useTitle'
import Inquiry from '../sections/somatics/Inquiry'

function Intro() {
  const { label, headline, lede, image } = somatics.intro

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
          className="mx-auto mt-8 max-w-[52ch] text-lede font-light text-soma-ink/80"
        >
          {lede}
        </Reveal>
      </div>
      <div className="shell mt-16 md:mt-20">
        <Frame
          image={image}
          ratio="aspect-[4/5]"
          sizes="(min-width: 640px) 26rem, 100vw"
          priority
          drift
          unveil
          delay={0.4}
          className="mx-auto max-w-[26rem]"
        />
      </div>
    </section>
  )
}

function Problem() {
  const { heading, paragraphs, patternsHeading, patterns } = somatics.problem
  const [opening, ...rest] = paragraphs

  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Reveal as="h2" className="text-heading lg:sticky lg:top-28">
              {heading}
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal
              as="p"
              className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.35]"
            >
              {opening}
            </Reveal>
            <div className="mt-8 max-w-[58ch] space-y-6 text-lede font-light text-soma-ink/85">
              {rest.map((paragraph) => (
                <Reveal as="p" key={paragraph}>
                  {paragraph}
                </Reveal>
              ))}
            </div>

            <Reveal as="h3" className="mt-20 text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.15]">
              {patternsHeading}
            </Reveal>
            <ul className="mt-8 border-t border-soma-sand">
              {patterns.map((pattern, i) => (
                <Reveal
                  as="li"
                  key={pattern.name}
                  delay={i * 0.06}
                  className="grid gap-2 border-b border-soma-sand py-7 sm:grid-cols-12 sm:gap-8"
                >
                  <p className="font-display text-[1.5rem] leading-[1.25] font-medium sm:col-span-5">
                    {pattern.name}
                  </p>
                  <div className="sm:col-span-7">
                    <p className="font-display text-[1.1875rem] leading-[1.35] text-soma-moss italic">
                      {pattern.cause}
                    </p>
                    <p className="mt-2 text-[0.9375rem] leading-[1.75] text-soma-ink/80">
                      {pattern.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Difference() {
  const { heading, columns, rows, note } = somatics.difference

  return (
    <section className="bg-soma-linen py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-5xl">
          <Reveal as="h2" className="text-center text-heading">
            {heading}
          </Reveal>

          <div className="mt-16 hidden grid-cols-2 gap-16 md:grid">
            {columns.map((column) => (
              <p key={column} className="text-label font-medium text-soma-clay-deep uppercase">
                {column}
              </p>
            ))}
          </div>

          <div className="mt-10 border-t border-soma-ink/15 md:mt-5">
            {rows.map((row, i) => (
              <Reveal
                key={row.somatic.name}
                delay={i * 0.06}
                className="grid gap-8 border-b border-soma-ink/15 py-10 md:grid-cols-2 md:gap-16"
              >
                <div>
                  <p className="text-label font-medium text-soma-clay-deep uppercase md:hidden">
                    {columns[0]}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.2] text-soma-ink/60 md:mt-0">
                    {row.familiar.name}
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-[1.75] text-soma-ink/65">
                    {row.familiar.body}
                  </p>
                </div>
                <div>
                  <p className="text-label font-medium text-soma-clay-deep uppercase md:hidden">
                    {columns[1]}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.2] text-soma-moss italic md:mt-0">
                    {row.somatic.name}
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-[1.75] text-soma-ink/85">
                    {row.somatic.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 max-w-[62ch] text-[0.8125rem] leading-[1.7] text-soma-clay-deep">
            {note}
          </p>
        </div>
      </div>
    </section>
  )
}

function Grounding() {
  const { heading, image, items } = somatics.grounding

  return (
    <section className="on-moss bg-soma-moss py-28 text-soma-paper md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-12 lg:gap-8">
          <Frame
            image={image}
            ratio="aspect-[3/4]"
            sizes="(min-width: 1024px) 26rem, 80vw"
            drift
            className="mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-2 lg:max-w-none"
          />
          <div className="lg:col-span-5 lg:col-start-7">
            <Reveal as="h2" className="text-heading">
              {heading}
            </Reveal>
            <div className="mt-12 space-y-12">
              {items.map((item, i) => (
                <Reveal key={item.title} delay={0.08 + i * 0.08}>
                  <h3 className="text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.2] italic">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[48ch] text-lede font-light text-soma-paper/85">
                    {item.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Doubts() {
  const { heading, items } = somatics.faq

  return (
    <section className="pb-28 md:pb-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-12 border-t border-soma-sand pt-24 md:pt-32 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Reveal as="h2" className="max-w-[12ch] text-heading">
              {heading}
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
            <Accordion items={items} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Somatics() {
  useTitle('Discover Somatics')

  return (
    <>
      <Intro />
      <Problem />
      <Difference />
      <Grounding />
      <Inquiry />
      <Doubts />
      <ClosingCall {...somatics.closing} />
    </>
  )
}
