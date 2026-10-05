import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import TextLink from '../components/ui/TextLink'
import useTitle from '../lib/useTitle'

export default function NotFound() {
  useTitle('Page not found')

  return (
    <section className="pt-[calc(4.5rem+5rem)] pb-28 text-center md:pt-[calc(4.5rem+8rem)] md:pb-40">
      <div className="shell">
        <RevealLines
          as="h1"
          lines={[{ text: 'Nothing lives' }, { text: 'at this address.', italic: true }]}
          className="text-display"
        />
        <Reveal
          as="p"
          delay={0.4}
          className="mx-auto mt-8 max-w-[40ch] text-lede font-light text-soma-ink/80"
        >
          The page may have moved, or the link may be mistyped.
        </Reveal>
        <Reveal delay={0.5} className="mt-10">
          <TextLink to="/">Return to the home page</TextLink>
        </Reveal>
      </div>
    </section>
  )
}
