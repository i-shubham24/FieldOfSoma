import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import DraftNote from '../components/ui/DraftNote'
import { articles } from '../content/articles'
import { PAGE_TOP } from '../lib/layout'
import { useDragScroll } from '../lib/useDragScroll'
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

function Featured({ onSelect }) {
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
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[0.875rem] text-soma-clay-deep">{length}</span>
              <button
                type="button"
                onClick={() => onSelect(articles.featured)}
                className="cursor-pointer font-sans text-[0.875rem] font-medium text-soma-moss transition-colors hover:text-soma-ink"
              >
                Read essay &rarr;
              </button>
            </div>
          </Reveal>
        </article>
      </div>
    </section>
  )
}

function Index({ onSelect }) {
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
                className="border-b border-soma-sand"
              >
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="group w-full text-left py-7 grid gap-2 md:grid-cols-12 md:items-baseline md:gap-8 cursor-pointer transition-colors hover:bg-soma-sand/20 px-2"
                >
                  <p className="font-display text-[1.125rem] leading-[1.3] text-soma-moss italic md:col-span-3">
                    {item.topic}
                  </p>
                  <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.2] text-soma-ink transition-colors group-hover:text-soma-moss md:col-span-7">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between md:col-span-2 md:justify-end gap-3 text-[0.875rem] text-soma-clay-deep tabular-nums">
                    <span>{item.length}</span>
                    <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </div>
                </button>
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

function ArticleReader({ article, onClose }) {
  const scrollRef = useDragScroll()

  useEffect(() => {
    if (!article) return undefined

    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.__lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [article, onClose])

  if (!article) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-soma-ink/40 backdrop-blur-xs"
        />
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-none border border-soma-sand bg-soma-paper p-6 sm:p-10 shadow-xl touch-pan-y"
        >
          <div className="flex items-center justify-between border-b border-soma-sand/70 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-soma-moss">{article.topic}</span>
              <span className="text-xs text-soma-clay-deep">/</span>
              <span className="text-xs text-soma-clay-deep">{article.length}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-xs font-medium uppercase tracking-wider text-soma-clay-deep transition-colors hover:text-soma-ink"
            >
              Close [Esc]
            </button>
          </div>

          <h2 className="mt-6 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.15] text-soma-ink">
            {article.title}
          </h2>

          <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.8] text-soma-ink/90 font-light">
            {article.paragraphs?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-soma-sand/70 pt-5 flex items-center justify-between">
            <span className="text-xs text-soma-clay-deep uppercase tracking-widest">
              Field of Soma Writing
            </span>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-xs font-medium text-soma-moss uppercase tracking-wider hover:text-soma-ink"
            >
              Back to essays &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default function Articles() {
  useTitle('Writing')
  const [activeArticle, setActiveArticle] = useState(null)

  return (
    <>
      <Intro />
      <Featured onSelect={setActiveArticle} />
      <Letters />
      <Index onSelect={setActiveArticle} />
      {activeArticle ? (
        <ArticleReader article={activeArticle} onClose={() => setActiveArticle(null)} />
      ) : null}
    </>
  )
}
