import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import DraftNote from '../components/ui/DraftNote'
import { articles } from '../content/articles'
import { PAGE_TOP } from '../lib/layout'
import useTitle from '../lib/useTitle'
import NewsletterForm from '../sections/home/NewsletterForm'

function Intro() {
  const { label, headline, lede } = articles.intro

  return (
    <section className={PAGE_TOP}>
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
            {label}
          </Reveal>
          <RevealLines as="h1" lines={headline} delay={0.1} className="mt-7 text-display" />
          <Reveal
            as="p"
            delay={0.4}
            className="mt-8 max-w-[46ch] text-lede font-light text-soma-ink/80"
          >
            {lede}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const { topic, title, excerpt, length, image } = articles.featured

  return (
    <section className="pt-20 md:pt-28">
      <div className="shell">
        <article className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <Frame
            image={image}
            ratio="aspect-[3/2]"
            sizes="(min-width: 1024px) 44rem, 100vw"
            priority
            drift
            unveil
            delay={0.3}
            className="lg:col-span-7"
          />
          <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <p className="font-display text-[1.25rem] leading-[1.2] text-soma-moss italic">
              {topic}
            </p>
            <h2 className="mt-3 text-heading">{title}</h2>
            <p className="mt-6 font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.45] text-soma-ink/85">
              {excerpt}
            </p>
            <p className="mt-6 text-[0.875rem] text-soma-clay-deep">{length}</p>
          </Reveal>
        </article>
      </div>
    </section>
  )
}

function Index() {
  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <Reveal as="h2" className="text-heading">
            More essays
          </Reveal>
          <ul className="mt-12 border-t border-soma-sand">
            {articles.list.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 0.05}
                className="grid gap-1.5 border-b border-soma-sand py-7 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <p className="font-display text-[1.125rem] leading-[1.3] text-soma-moss italic md:col-span-3">
                  {item.topic}
                </p>
                <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.2] md:col-span-7">
                  {item.title}
                </h3>
                <p className="text-[0.875rem] text-soma-clay-deep tabular-nums md:col-span-2 md:text-right">
                  {item.length}
                </p>
              </Reveal>
            ))}
          </ul>
          {articles.placeholder ? <DraftNote className="mt-6">{articles.note}</DraftNote> : null}
        </div>
      </div>
    </section>
  )
}

function Letters() {
  const { heading, body, image } = articles.letters

  return (
    <section id="field-notes" className="mt-28 scroll-mt-24 bg-soma-linen py-28 md:mt-40 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Reveal as="h2" className="text-heading">
              {heading}
            </Reveal>
            <Reveal
              as="p"
              delay={0.08}
              className="mt-6 max-w-[44ch] text-lede font-light text-soma-ink/80"
            >
              {body}
            </Reveal>
            <Frame
              image={image}
              ratio="aspect-[3/2]"
              sizes="(min-width: 1024px) 24rem, 80vw"
              drift
              className="mt-12 max-w-sm"
            />
          </div>
          <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
            <NewsletterForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Articles() {
  useTitle('Writing')

  return (
    <>
      <Intro />
      <Featured />
      <Letters />
      <Index />
    </>
  )
}
