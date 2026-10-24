import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import DraftNote from '../components/ui/DraftNote'
import TextLink from '../components/ui/TextLink'
import { allArticles, articles, readingTime } from '../content/articles'
import { PAGE_TOP } from '../lib/layout'
import useTitle from '../lib/useTitle'
import NotFound from './NotFound'
import { articleSeo } from '../content/seo'

// One piece of writing at its own address, so it can be shared and found in search.
export default function Article() {
  const { id } = useParams()
  const index = allArticles.findIndex((item) => item.id === id)
  const article = allArticles[index]
  const next = article ? allArticles[(index + 1) % allArticles.length] : null

  useTitle({
    ...(article ? articleSeo(article) : { title: 'Page not found' }),
    breadcrumbs: article
      ? [
          { name: 'Writing', path: '/articles' },
          { name: article.title, path: `/articles/${article.id}` },
        ]
      : undefined,
    schema: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          author: { '@id': 'https://fieldofsoma.com/#person' },
          publisher: { '@id': 'https://fieldofsoma.com/#organization' },
        }
      : undefined,
    noindex: !article,
  })

  if (!article) return <NotFound />

  return (
    <article className={`${PAGE_TOP} pb-28 md:pb-40`}>
      <div className="shell">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/articles"
            className="inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-medium text-soma-clay-deep transition-colors hover:text-soma-ink"
          >
            <ArrowLeftIcon size={14} aria-hidden="true" />
            <span>All writing</span>
          </Link>
          <p className="mt-8 font-display text-[1.25rem] text-soma-moss italic">
            {article.topic}
            <span className="ml-3 font-sans text-[0.875rem] text-soma-clay-deep not-italic">
              {readingTime(article)}
            </span>
          </p>
          <RevealLines
            as="h1"
            lines={[{ text: article.title }]}
            delay={0.05}
            className="mt-4 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08]"
          />
          {articles.placeholder ? <DraftNote className="mt-6">{articles.note}</DraftNote> : null}
        </div>

        {article.image ? (
          <Frame
            image={article.image}
            ratio="aspect-[3/2]"
            sizes="(min-width: 1024px) 56rem, 100vw"
            priority
            unveil
            className="mx-auto mt-14 max-w-4xl"
          />
        ) : null}

        <Reveal className="mx-auto mt-14 max-w-2xl space-y-6 text-[1.125rem] leading-[1.8] font-light text-soma-ink/90">
          {article.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>

        <div className="mx-auto mt-20 flex max-w-2xl flex-col gap-6 border-t border-soma-sand pt-10 sm:flex-row sm:items-center sm:justify-between">
          <TextLink to={`/articles/${next.id}`}>Next: {next.title}</TextLink>
          <TextLink to="/articles#field-notes">Get Field Notes</TextLink>
        </div>
      </div>
    </article>
  )
}
