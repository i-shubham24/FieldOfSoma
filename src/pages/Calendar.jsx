import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Button from '../components/ui/Button'
import DraftNote from '../components/ui/DraftNote'
import TextLink from '../components/ui/TextLink'
import ConsultationBuilder from '../components/interactive/ConsultationBuilder'
import { calendar } from '../content/calendar'
import { site } from '../content/site'
import { PAGE_TOP } from '../lib/layout'
import useTitle from '../lib/useTitle'

const mailto = (subject) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`

function Intro() {
  const { label, headline, lede } = calendar.intro

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
          className="mx-auto mt-8 max-w-[48ch] text-lede font-light text-soma-ink/80"
        >
          {lede}
        </Reveal>
      </div>
    </section>
  )
}

// The two ways to book, side by side with a single hairline between them.
function Paths() {
  return (
    <section className="py-24 md:py-32">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl border-t border-soma-sand lg:grid-cols-2">
          {calendar.paths.map((path, i) => (
            <Reveal
              key={path.id}
              delay={i * 0.1}
              className={`py-14 lg:py-20 ${
                i === 0
                  ? 'border-b border-soma-sand lg:border-r lg:border-b-0 lg:pr-16'
                  : 'lg:pl-16'
              }`}
            >
              <h2 className="text-heading">{path.title}</h2>
              <p className="mt-4 text-[0.875rem] text-soma-clay-deep">{path.meta.join(' / ')}</p>
              <p className="mt-8 max-w-[44ch] text-lede font-light text-soma-ink/80">{path.body}</p>
              <ul className="mt-8 space-y-2.5 text-[0.9375rem] leading-[1.7] text-soma-ink/85">
                {path.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <TextLink href={mailto(path.title)} className="mt-10">
                {path.cta}
              </TextLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Week() {
  const { heading, rows, note, placeholder } = calendar.schedule

  return (
    <section className="bg-soma-linen py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Reveal as="h2" className="text-heading">
              {heading}
            </Reveal>
            {placeholder ? <DraftNote className="mt-5">{note}</DraftNote> : null}
          </div>
          <ul className="border-t border-soma-ink/15 lg:col-span-8 lg:col-start-5">
            {rows.map((row, i) => (
              <Reveal
                as="li"
                key={`${row.day}-${row.title}`}
                delay={i * 0.05}
                className="grid grid-cols-2 gap-x-6 gap-y-1 border-b border-soma-ink/15 py-6 sm:grid-cols-12 sm:items-baseline"
              >
                <p className="font-display text-[1.5rem] leading-[1.2] font-medium sm:col-span-3">
                  {row.day}
                </p>
                <p className="text-right text-[0.9375rem] text-soma-ink/80 tabular-nums sm:col-span-2 sm:text-left">
                  {row.time}
                </p>
                <p className="font-display text-[1.375rem] leading-[1.25] text-soma-moss italic sm:col-span-4">
                  {row.title}
                </p>
                <p className="text-right text-[0.875rem] text-soma-clay-deep sm:col-span-3">
                  {row.format}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Request() {
  const { heading, body, image } = calendar.request

  return (
    <section className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal as="h2" className="text-heading">
                {heading}
              </Reveal>
              <Reveal
                as="p"
                delay={0.08}
                className="mt-6 max-w-[42ch] text-lede font-light text-soma-ink/80"
              >
                {body}
              </Reveal>
              <Frame
                image={image}
                ratio="aspect-[3/2]"
                sizes="(min-width: 1024px) 30rem, 100vw"
                drift
                unveil
                className="mt-12 hidden lg:block"
              />
            </div>
            <div className="lg:col-span-7">
              <ConsultationBuilder />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Calendar() {
  useTitle('Calendar and Booking')

  return (
    <>
      <Intro />
      <Paths />
      <Week />
      <Request />
    </>
  )
}
