import { useState } from 'react'
import Reveal from '../../components/motion/Reveal'
import SomaticPause from '../../components/interactive/SomaticPause'
import TextLink from '../../components/ui/TextLink'
import { windowSection } from '../../content/home'
import Cycle from './Cycle'

// The window onto Somatics: the one full band of colour on the page.
export default function Window() {
  const { label, heading, body, link, cycle } = windowSection
  const [pauseOpen, setPauseOpen] = useState(false)

  return (
    <>
      <section className="on-moss bg-soma-moss py-28 text-soma-paper md:py-40">
        <div className="shell">
          <div className="mx-auto grid max-w-6xl items-center gap-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <Reveal as="p" className="text-label font-medium text-soma-sand uppercase">
                {label}
              </Reveal>
              <Reveal as="h2" delay={0.08} className="mt-7 text-heading">
                {heading}
              </Reveal>
              <Reveal
                delay={0.16}
                className="mt-9 max-w-[52ch] space-y-5 text-lede font-light text-soma-paper/85"
              >
                {body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Reveal>
              <Reveal delay={0.24} className="mt-10 flex flex-wrap items-center gap-8">
                <TextLink to={link.to}>{link.label}</TextLink>
                <button
                  type="button"
                  onClick={() => setPauseOpen(true)}
                  className="link-rest pb-0.5 text-[0.875rem] font-medium tracking-[0.02em] text-soma-sand transition-colors hover:text-soma-paper"
                >
                  Experience guided pandiculation
                </button>
              </Reveal>
            </div>

            <Reveal className="lg:col-span-5 lg:col-start-8" amount={0.3}>
              <Cycle {...cycle} onOpenPause={() => setPauseOpen(true)} />
            </Reveal>
          </div>
        </div>
      </section>

      <SomaticPause open={pauseOpen} onClose={() => setPauseOpen(false)} />
    </>
  )
}
