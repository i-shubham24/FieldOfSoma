import { ArrowDownIcon } from '@phosphor-icons/react/dist/csr/ArrowDown'
import ClosingCall from '../components/layout/ClosingCall'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import TextLink from '../components/ui/TextLink'
import { practices } from '../content/practices'
import { booking } from '../content/site'
import { PAGE_TOP } from '../lib/layout'
import useTitle from '../lib/useTitle'

function Intro() {
  const { label, headline, lede } = practices.intro

  return (
    <section className={PAGE_TOP}>
      <div className="shell">
        <div className="mx-auto grid max-w-6xl items-end gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
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

          <Reveal
            as="nav"
            delay={0.5}
            aria-label="On this page"
            className="lg:col-span-4 lg:col-start-9"
          >
            <ul className="border-t border-soma-sand">
              {practices.items.map((item) => (
                <li key={item.id} className="border-b border-soma-sand">
                  <a
                    href={`#${item.id}`}
                    className="group flex items-baseline justify-between gap-6 py-4"
                  >
                    <span className="font-display text-[1.5rem] leading-[1.2] font-medium">
                      {item.name}
                    </span>
                    <span className="flex items-center gap-3 font-display text-[1.0625rem] text-soma-moss italic">
                      {item.verbs}
                      <ArrowDownIcon
                        aria-hidden="true"
                        size={15}
                        weight="light"
                        className="transition-transform duration-500 ease-soma group-hover:translate-y-1"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Heading({ item }) {
  return (
    <>
      <Reveal as="p" className="font-display text-[1.5rem] leading-[1.2] text-soma-moss italic">
        {item.verbs}
      </Reveal>
      <Reveal as="h2" delay={0.06} className="mt-3 text-heading">
        {item.name}
      </Reveal>
      <Reveal
        as="p"
        delay={0.12}
        className="mt-8 max-w-[38ch] font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.4]"
      >
        {item.intention}
      </Reveal>
    </>
  )
}

function Session({ item }) {
  return (
    <Reveal>
      <h3 className="text-[1.75rem] leading-[1.2]">Sixty minutes, in outline</h3>
      <ol className="mt-6 border-t border-soma-ink/15">
        {item.session.map((part) => (
          <li
            key={part.title}
            className="grid grid-cols-[5.5rem_1fr] gap-x-4 border-b border-soma-ink/15 py-5 sm:grid-cols-[7rem_1fr]"
          >
            <p className="pt-1.5 text-[0.8125rem] text-soma-clay-deep tabular-nums">
              {part.time} min
            </p>
            <div>
              <p className="font-display text-[1.375rem] leading-[1.25] font-medium">
                {part.title}
              </p>
              <p className="mt-1.5 max-w-[46ch] text-[0.9375rem] leading-[1.75] text-soma-ink/80">
                {part.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

function Serves({ item }) {
  return (
    <Reveal>
      <h3 className="text-[1.75rem] leading-[1.2]">Who it serves</h3>
      <ul className="mt-5 space-y-2.5 text-[0.9375rem] leading-[1.7] text-soma-ink/85">
        {item.serves.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="mt-7 text-[0.8125rem] text-soma-clay-deep">{item.format}</p>
      <TextLink to={booking.to} className="mt-7">
        {item.cta}
      </TextLink>
    </Reveal>
  )
}

// Text beside a tall photograph. `flip` puts the photograph on the right.
function SplitPractice({ item, flip = false }) {
  return (
    <section id={item.id} className="scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-12 lg:gap-8">
          <div
            className={`lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : 'lg:col-start-1'}`}
          >
            <Frame
              image={item.image}
              ratio="aspect-[4/5]"
              sizes="(min-width: 1024px) 34rem, 100vw"
              drift
              unveil
              className="lg:sticky lg:top-28"
            />
          </div>
          <div className={`lg:col-span-6 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}>
            <Heading item={item} />
            <div className="mt-16 space-y-16">
              <Session item={item} />
              <Serves item={item} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// A wide photograph above, the heading and the detail in two columns below.
function WidePractice({ item }) {
  return (
    <section id={item.id} className="scroll-mt-24 bg-soma-linen py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <Frame
            image={item.image}
            ratio="aspect-[4/3] md:aspect-[21/9]"
            sizes="(min-width: 1280px) 72rem, 100vw"
            drift
            unveil
          />
          <div className="mt-16 grid gap-16 md:mt-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Heading item={item} />
            </div>
            <div className="space-y-16 lg:col-span-6 lg:col-start-7">
              <Session item={item} />
              <Serves item={item} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Practices() {
  useTitle('The Practices')
  const [somatics, taiChi, creative] = practices.items

  return (
    <>
      <Intro />
      <SplitPractice item={somatics} />
      <WidePractice item={taiChi} />
      <SplitPractice item={creative} flip />
      <ClosingCall {...practices.closing} />
    </>
  )
}
