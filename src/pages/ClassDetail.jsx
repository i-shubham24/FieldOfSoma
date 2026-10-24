import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { FullVideoPlayerModal, VideoPreviewModal } from '../components/classes/ClassPlayers'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import DraftNote from '../components/ui/DraftNote'
import { classes } from '../content/classes'
import { images } from '../content/images'
import { priceValue, useCart } from '../lib/cart'
import { PAGE_TOP } from '../lib/layout'
import { paymentsLive } from '../lib/payments'
import { usePurchasedClasses } from '../lib/purchases'
import useTitle from '../lib/useTitle'
import NotFound from './NotFound'
import { classSeo } from '../content/seo'

const solid =
  'flex min-h-12 w-full cursor-pointer items-center justify-center bg-soma-moss text-center text-sm font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light'
const outline =
  'flex min-h-11 w-full cursor-pointer items-center justify-center border border-soma-sand text-center text-xs font-medium tracking-wider text-soma-ink uppercase transition-colors hover:border-soma-ink'

function BuyBox({ course, owned, onPreview, onPlay }) {
  const cart = useCart()
  const navigate = useNavigate()
  const inCart = cart.inCart(course.id)
  const price = priceValue(course.price)
  const original = priceValue(course.originalPrice)
  const off = original > price ? Math.round((1 - price / original) * 100) : 0

  return (
    <div className="border border-soma-sand bg-soma-paper p-6 shadow-sm sm:p-8">
      <button
        type="button"
        onClick={owned ? onPlay : onPreview}
        aria-label={owned ? `Play ${course.title}` : `Watch the free preview of ${course.title}`}
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-soma-sand"
      >
        <img
          src={course.image.src}
          srcSet={course.image.srcSet}
          sizes="(min-width: 1024px) 26rem, 100vw"
          alt=""
          className="photo h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
          <span className="flex h-14 w-14 items-center justify-center bg-soma-paper text-soma-ink shadow-lg transition-transform group-hover:scale-110">
            <PlayIcon size={24} weight="fill" aria-hidden="true" />
          </span>
        </span>
        <span className="absolute bottom-3 left-3 bg-soma-ink/80 px-2.5 py-1 text-[0.75rem] font-medium tracking-wider text-white uppercase">
          {owned ? 'Play class' : 'Preview this class'}
        </span>
      </button>

      <div className="mt-6">
        {owned ? (
          <p className="flex items-center gap-2 border border-soma-moss/30 bg-soma-linen/60 px-3.5 py-2 text-xs font-medium text-soma-moss">
            <CheckIcon size={14} weight="bold" aria-hidden="true" />
            <span>In your library</span>
          </p>
        ) : (
          <p className="flex flex-wrap items-baseline gap-3">
            <span className="font-sans text-3xl font-semibold text-soma-ink tabular-nums">{course.price}</span>
            {off > 0 ? (
              <>
                <span className="text-base text-soma-clay-deep line-through tabular-nums">{course.originalPrice}</span>
                <span className="text-xs font-semibold tracking-wider text-soma-moss uppercase">{off}% off</span>
              </>
            ) : null}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {owned ? (
          <button type="button" onClick={onPlay} className={solid}>
            Play the class
          </button>
        ) : (
          <>
            {inCart ? (
              <Link to="/cart" className={solid}>
                Go to cart
              </Link>
            ) : (
              <button type="button" onClick={() => cart.add(course.id)} className={solid}>
                Add to cart
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                cart.add(course.id)
                navigate('/checkout')
              }}
              className={outline}
            >
              Buy now
            </button>
          </>
        )}
      </div>

      {!owned ? (
        <p className="mt-4 text-center text-[0.8125rem] text-soma-clay-deep">
          {paymentsLive ? 'Secure payment by Razorpay: UPI, cards and net banking.' : 'Checkout is in test mode. No real payment is taken.'}
        </p>
      ) : null}

      {course.includes?.length ? (
        <div className="mt-8 border-t border-soma-sand/80 pt-6">
          <p className="font-display text-sm font-medium">This class includes</p>
          <ul className="mt-3.5 space-y-2.5 text-[0.8125rem] text-soma-ink/85">
            {course.includes.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <CheckIcon size={14} weight="bold" className="mt-0.5 shrink-0 text-soma-moss" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default function ClassDetail() {
  const { id } = useParams()
  const course = classes.items.find((item) => item.id === id)
  const { isPurchased } = usePurchasedClasses()
  const [showPreview, setShowPreview] = useState(false)
  const [showFull, setShowFull] = useState(false)

  useTitle({
    ...(course ? classSeo(course) : { title: 'Class not found' }),
    breadcrumbs: course
      ? [
          { name: 'Recorded Classes', path: '/classes' },
          { name: course.title, path: `/classes/${course.id}` },
        ]
      : undefined,
    schema: course
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.subtitle,
          provider: { '@id': 'https://fieldofsoma.com/#organization' },
        }
      : undefined,
    noindex: !course,
  })

  if (!course) return <NotFound />

  const owned = isPurchased(course.id)

  return (
    <>
      <section className={`${PAGE_TOP} pb-28 md:pb-40`}>
        <div className="shell">
          <div className="mx-auto max-w-6xl">
            <Link
              to="/classes"
              className="inline-flex min-h-11 items-center gap-2 text-xs font-medium tracking-wider text-soma-clay-deep uppercase transition-colors hover:text-soma-ink"
            >
              <ArrowLeftIcon size={14} aria-hidden="true" />
              <span>Back to Recorded Classes</span>
            </Link>

            <div className="mt-8 grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <p className="flex items-center gap-3 text-xs text-soma-clay-deep">
                  <span className="font-display text-sm text-soma-moss italic">{course.practiceName}</span>
                  <span aria-hidden="true">/</span>
                  <span>{course.level}</span>
                </p>
                <RevealLines as="h1" lines={[{ text: course.title }]} delay={0.05} className="mt-4 text-display" />
                <Reveal as="p" delay={0.15} className="mt-6 text-lede leading-relaxed font-light text-soma-ink/85">
                  {course.subtitle}
                </Reveal>

                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-soma-sand/70 py-3.5 text-xs text-soma-clay-deep">
                  {course.rating ? (
                    <span className="flex items-center gap-1.5 font-medium text-soma-ink">
                      <span className="text-amber-700">{course.rating}</span>
                      <span className="flex text-amber-700" aria-hidden="true">
                        {[0, 1, 2, 3, 4].map((star) => (
                          <StarIcon key={star} size={13} weight="fill" />
                        ))}
                      </span>
                      <span>({course.ratingCount} reviews)</span>
                    </span>
                  ) : null}
                  {course.studentsCount ? <span>{course.studentsCount} students</span> : null}
                  <span>With Kirti Verma</span>
                  <span>{course.duration}</span>
                </div>
                {classes.placeholder ? <DraftNote className="mt-4">{classes.note}</DraftNote> : null}

                {course.whatYouWillLearn?.length ? (
                  <div className="mt-10 border border-soma-sand bg-soma-linen/60 p-6 sm:p-8">
                    <h2 className="font-display text-[1.375rem] font-medium">What you will practise</h2>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {course.whatYouWillLearn.map((line) => (
                        <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed font-light text-soma-ink/90">
                          <CheckIcon size={16} weight="bold" className="mt-0.5 shrink-0 text-soma-moss" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {course.curriculum?.length ? (
                  <div className="mt-14">
                    <div className="flex items-baseline justify-between gap-4 border-b border-soma-sand pb-4">
                      <h2 className="text-heading">The class</h2>
                      <span className="text-xs text-soma-clay-deep tabular-nums">
                        {course.curriculum.length} parts, {course.duration}
                      </span>
                    </div>
                    <ol className="divide-y divide-soma-sand/70 border-b border-soma-sand/70">
                      {course.curriculum.map((lesson) => (
                        <li key={lesson.id} className="flex items-start justify-between gap-4 py-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="text-sm font-medium">{lesson.title}</span>
                              {owned ? (
                                <button
                                  type="button"
                                  onClick={() => setShowFull(true)}
                                  className="min-h-8 cursor-pointer text-[0.75rem] font-semibold tracking-wider text-soma-moss uppercase hover:underline"
                                >
                                  Play
                                </button>
                              ) : lesson.previewable ? (
                                <button
                                  type="button"
                                  onClick={() => setShowPreview(true)}
                                  className="min-h-8 cursor-pointer text-[0.75rem] font-semibold tracking-wider text-soma-moss uppercase hover:underline"
                                >
                                  Free preview
                                </button>
                              ) : null}
                            </div>
                            <p className="mt-1 text-xs font-light text-soma-clay-deep">{lesson.summary}</p>
                          </div>
                          <span className="mt-0.5 shrink-0 text-xs text-soma-clay-deep tabular-nums">{lesson.duration}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {course.requirements?.length ? (
                  <div className="mt-14">
                    <h2 className="text-heading">You will need</h2>
                    <ul className="mt-4 list-inside list-disc space-y-2 text-sm font-light text-soma-ink/85">
                      {course.requirements.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {course.overview?.length ? (
                  <div className="mt-14">
                    <h2 className="text-heading">About this class</h2>
                    <div className="mt-4 space-y-4 text-lede leading-relaxed font-light text-soma-ink/85">
                      {course.overview.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-16 border-t border-soma-sand pt-10">
                  <p className="text-label font-medium tracking-wider text-soma-clay-deep uppercase">Your teacher</p>
                  <div className="mt-4 flex items-center gap-5">
                    <div className="h-16 w-16 shrink-0 overflow-hidden bg-soma-sand">
                      <img
                        src={images.kirtiPortrait.src}
                        alt={images.kirtiPortrait.alt}
                        loading="lazy"
                        className="photo h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-xl">Kirti Verma</p>
                      <p className="text-xs text-soma-clay-deep">Movement and Somatic Educator</p>
                    </div>
                  </div>
                  <Link to="/about" className="link-rest mt-4 inline-block pb-0.5 text-sm text-soma-ink/80 hover:text-soma-ink">
                    About Kirti
                  </Link>
                </div>
              </div>

              <div className="lg:sticky lg:top-28 lg:col-span-5">
                <BuyBox
                  course={course}
                  owned={owned}
                  onPreview={() => setShowPreview(true)}
                  onPlay={() => setShowFull(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showPreview ? <VideoPreviewModal course={course} onClose={() => setShowPreview(false)} /> : null}
      </AnimatePresence>
      <AnimatePresence>
        {showFull ? <FullVideoPlayerModal course={course} onClose={() => setShowFull(false)} /> : null}
      </AnimatePresence>
    </>
  )
}
