import Reveal from '../../components/motion/Reveal'
import ScrollRead from '../../components/motion/ScrollRead'
import { manifesto } from '../../content/home'
import { site } from '../../content/site'

// One sentence, alone on linen. It comes into ink as it is read.
export default function Manifesto() {
  return (
    <section className="mt-28 bg-soma-linen py-32 md:mt-40 md:py-48">
      <div className="shell text-center">
        <ScrollRead
          text={manifesto.text}
          className="mx-auto max-w-3xl font-display text-manifesto"
        />
        <Reveal as="p" className="mt-12 text-[0.875rem] text-soma-clay-deep" amount={0.8}>
          {site.person}
        </Reveal>
      </div>
    </section>
  )
}
