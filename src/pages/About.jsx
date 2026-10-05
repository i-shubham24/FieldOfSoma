import ClosingCall from '../components/layout/ClosingCall'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import DraftNote from '../components/ui/DraftNote'
import { about } from '../content/about'
import { PAGE_TOP } from '../lib/layout'
import useTitle from '../lib/useTitle'

function Intro() {
  const { label, headline, lede, image, caption } = about.intro

  return (
    <section className={PAGE_TOP}>
      <div className="shell">
        <div className="mx-auto grid max-w-6xl items-end gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:pb-10">
            <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
              {label}
            </Reveal>
            <RevealLines as="h1" lines={headline} delay={0.1} className="mt-7 text-display" />
            <Reveal
              as="p"
              delay={0.35}
              className="mt-8 max-w-[34ch] font-display text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.35]"
            >
              {lede}
            </Reveal>
          </div>
          <Frame
            image={image}
            caption={caption}
            ratio="aspect-[4/5]"
            sizes="(min-width: 1024px) 34rem, 100vw"
            priority
            unveil
            delay={0.3}
            className="lg:col-span-5 lg:col-start-8"
          />
        </div>
      </div>
    </section>
  )
}

function Story() {
  const { heading, paragraphs, note, image } = about.story

  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-12 lg:gap-8">
          <Frame
            image={image}
            ratio="aspect-[3/4]"
            sizes="(min-width: 1024px) 22rem, 60vw"
            drift
            className="max-w-[18rem] lg:col-span-3 lg:mt-3 lg:max-w-none"
          />
          <div className="lg:col-span-7 lg:col-start-5">
            <Reveal as="h2" className="max-w-[16ch] text-heading">
              {heading}
            </Reveal>
            <div className="mt-10 max-w-[58ch] space-y-6 text-lede font-light text-soma-ink/85">
              {paragraphs.map((paragraph, i) => (
                <Reveal as="p" key={paragraph} delay={i * 0.06}>
                  {paragraph}
                </Reveal>
              ))}
            </div>
            <DraftNote className="mt-8">{note}</DraftNote>
          </div>
        </div>
      </div>
    </section>
  )
}

function Lineage() {
  const { heading, rows, note } = about.lineage

  return (
    <section className="pb-28 md:pb-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <Reveal as="h2" className="text-heading">
            {heading}
          </Reveal>
          <ul className="mt-12 border-t border-soma-sand">
            {rows.map((row, i) => (
              <Reveal
                as="li"
                key={row.title}
                delay={i * 0.05}
                className="grid gap-2 border-b border-soma-sand py-7 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <p className="font-display text-[1.25rem] leading-[1.3] text-soma-moss italic md:col-span-3">
                  {row.field}
                </p>
                <p className="font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.25] font-medium md:col-span-6">
                  {row.title}
                </p>
                <p className="text-[0.9375rem] text-soma-clay-deep md:col-span-3 md:text-right">
                  {row.detail}
                </p>
              </Reveal>
            ))}
          </ul>
          <DraftNote className="mt-6">{note}</DraftNote>
        </div>
      </div>
    </section>
  )
}

// Three principles that step down the page, so they read in order and not as a row of cards.
const STEPS = ['', 'md:mt-20', 'md:mt-40']

function Philosophy() {
  const { heading, intro, items } = about.philosophy

  return (
    <section className="bg-soma-linen py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <Reveal as="h2" className="text-heading">
            {heading}
          </Reveal>
          <Reveal
            as="p"
            delay={0.08}
            className="mt-6 max-w-[40ch] text-lede font-light text-soma-ink/80"
          >
            {intro}
          </Reveal>
          <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-3 md:gap-10">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} className={STEPS[i]}>
                <h3 className="text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.15]">{item.title}</h3>
                <p className="mt-5 max-w-[34ch] text-lede font-light text-soma-ink/80">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  const { heading, body, quotes, note } = about.experience
  const [first, second] = quotes

  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <Reveal as="h2" className="text-heading">
              {heading}
            </Reveal>
            <Reveal as="p" delay={0.08} className="mt-6 text-lede font-light text-soma-ink/80">
              {body}
            </Reveal>
          </div>

          <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-8">
            <Reveal as="figure" className="lg:col-span-7">
              <blockquote className="font-display text-[clamp(1.75rem,3vw,2.625rem)] leading-[1.25] italic">
                “{first.quote}”
              </blockquote>
              <figcaption className="mt-7 text-[0.875rem] text-soma-clay-deep">
                {first.name} / {first.context}
              </figcaption>
            </Reveal>
            <Reveal as="figure" delay={0.12} className="lg:col-span-4 lg:col-start-9 lg:mt-36">
              <blockquote className="font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.35] italic">
                “{second.quote}”
              </blockquote>
              <figcaption className="mt-6 text-[0.875rem] text-soma-clay-deep">
                {second.name} / {second.context}
              </figcaption>
            </Reveal>
          </div>
          <DraftNote className="mt-12">{note}</DraftNote>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  useTitle('About Kirti Verma')

  return (
    <>
      <Intro />
      <Story />
      <Lineage />
      <Philosophy />
      <Experience />
      <ClosingCall {...about.closing} />
    </>
  )
}
