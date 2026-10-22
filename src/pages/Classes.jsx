import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { VideoCameraIcon } from '@phosphor-icons/react/dist/csr/VideoCamera'
import ClosingCall from '../components/layout/ClosingCall'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import DraftNote from '../components/ui/DraftNote'
import TextLink from '../components/ui/TextLink'
import { classes } from '../content/classes'
import { PAGE_TOP } from '../lib/layout'
import { EASE } from '../lib/motion'
import { priceValue, useCart } from '../lib/cart'
import { usePurchasedClasses } from '../lib/purchases'
import useTitle from '../lib/useTitle'
import { FullVideoPlayerModal, VideoPreviewModal } from '../components/classes/ClassPlayers'

function Intro() {
  const { label, headline, lede } = classes.intro

  return (
    <section className={`${PAGE_TOP} min-h-[45vh] flex flex-col justify-center`}>
      <div className="shell text-center">
        <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
          {label}
        </Reveal>
        <RevealLines as="h1" lines={headline} delay={0.1} className="mt-7 text-display" />
        <Reveal
          as="p"
          delay={0.4}
          className="mx-auto mt-8 max-w-[50ch] text-lede font-light text-soma-ink/80"
        >
          {lede}
        </Reveal>
      </div>
    </section>
  )
}

// Grid view: a quiet editorial card. Photo, practice and length, title, a line about it,
// then the price and one action.
function ClassCard({ item, isPurchased, inCart, onAddToCart, onPlayFullVideo }) {
  const original = priceValue(item.originalPrice)

  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/classes/${item.id}`}
        className="relative block overflow-hidden bg-soma-linen"
        aria-label={item.title}
        tabIndex={-1}
      >
        <img
          src={item.image.src}
          srcSet={item.image.srcSet}
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
          alt={item.image.alt}
          loading="lazy"
          decoding="async"
          className="photo aspect-[4/5] w-full object-cover transition-transform duration-700 ease-soma group-hover:scale-[1.03]"
        />
        {isPurchased ? (
          <span className="absolute top-3 right-3 bg-soma-moss px-2 py-0.5 text-[0.75rem] font-semibold tracking-wider text-white uppercase">
            Owned
          </span>
        ) : null}
      </Link>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <span className="font-display text-[1.125rem] leading-[1.2] text-soma-moss italic">
          {item.practiceName}
        </span>
        <span className="text-[0.8125rem] whitespace-nowrap text-soma-clay-deep tabular-nums">
          {item.duration}
        </span>
      </div>
      <h3 className="mt-2 text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.2]">
        <Link to={`/classes/${item.id}`} className="transition-colors hover:text-soma-moss">
          {item.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-[1.65] text-soma-ink/80">{item.focus}</p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        {isPurchased ? (
          <span className="text-[0.875rem] text-soma-moss">In My Videos</span>
        ) : (
          <span className="text-[0.9375rem] tabular-nums">
            <span className="font-semibold">{item.price}</span>
            {original > priceValue(item.price) ? (
              <span className="ml-2 text-[0.8125rem] text-soma-clay-deep line-through">{item.originalPrice}</span>
            ) : null}
          </span>
        )}
        {isPurchased ? (
          <TextLink onClick={() => onPlayFullVideo(item)}>Play</TextLink>
        ) : inCart ? (
          <TextLink to="/cart">Go to cart</TextLink>
        ) : (
          <TextLink onClick={() => onAddToCart(item)}>Add to cart</TextLink>
        )}
      </div>
    </article>
  )
}

function CinemaSection({ item, isPurchased, inCart, onAddToCart, onPreview, onPlayFullVideo }) {
  return (
    <section className="min-h-[85vh] md:min-h-screen border-b border-soma-sand/70 flex items-center py-16 md:py-24">
      <div className="shell w-full">
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Left Media Box */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] overflow-hidden bg-soma-sand border border-soma-sand shadow-sm group">
              <img
                src={item.image.src}
                srcSet={item.image.srcSet}
                alt={item.image.alt || item.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-soma group-hover:scale-105"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => {
                  if (isPurchased) onPlayFullVideo(item)
                  else onPreview(item)
                }}
                className="absolute inset-0 bg-black/20 group-hover:bg-black/35 flex items-center justify-center transition-colors cursor-pointer"
                aria-label={`Play ${item.title}`}
              >
                <div className="flex h-16 w-16 items-center justify-center bg-soma-paper text-soma-ink shadow-lg transition-transform group-hover:scale-110">
                  <PlayIcon size={28} weight="fill" />
                </div>
              </button>
              <div className="absolute bottom-4 left-4 bg-soma-ink/85 px-3 py-1.5 text-xs text-white">
                {isPurchased ? 'In your library' : 'Free preview'}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-soma-clay-deep px-1">
              <span>{item.duration} length • {item.level}</span>
              <span>{item.rating} ★ ({item.ratingCount} reviews)</span>
            </div>
          </div>

          {/* Right Details Box */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm italic text-soma-moss">
                {item.practiceName}
              </span>
              <span className="text-xs text-soma-clay-deep">/</span>
              <span className="text-xs text-soma-clay-deep uppercase tracking-wider">
                {isPurchased ? 'Purchased Video' : 'Full Guided Series'}
              </span>
            </div>

            <h2 className="mt-4 font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] text-soma-ink">
              {item.title}
            </h2>

            <p className="mt-5 text-lede font-light text-soma-ink/85 leading-relaxed">
              {item.subtitle || item.focus}
            </p>

            {item.whatYouWillLearn && item.whatYouWillLearn.length > 0 ? (
              <div className="mt-6 border-y border-soma-sand/70 py-4 space-y-2.5">
                <p className="text-xs uppercase font-medium tracking-wider text-soma-clay-deep">
                  What you will practise
                </p>
                {item.whatYouWillLearn.slice(0, 3).map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-soma-ink/90 font-light">
                    <CheckIcon size={14} className="mt-0.5 shrink-0 text-soma-moss" weight="bold" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex items-baseline gap-3">
              {isPurchased ? (
                <div className="flex items-center gap-2 text-soma-moss font-semibold text-lg">
                  <CheckIcon size={20} weight="bold" />
                  <span>Enrolled • In My Videos</span>
                </div>
              ) : (
                <>
                  <span className="font-sans text-3xl font-semibold text-soma-ink tabular-nums">
                    {item.price}
                  </span>
                  <span className="text-base text-soma-clay-deep line-through tabular-nums">
                    {item.originalPrice}
                  </span>
                  <span className="text-xs font-semibold uppercase text-soma-moss tracking-wider">
                    Special Price
                  </span>
                </>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              {isPurchased ? (
                <button
                  type="button"
                  onClick={() => onPlayFullVideo(item)}
                  className="cursor-pointer bg-soma-moss px-7 py-3.5 text-center text-sm font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light"
                >
                  Play Full Video Course
                </button>
              ) : inCart ? (
                <Link
                  to="/cart"
                  className="border border-soma-moss px-7 py-3.5 text-center text-sm font-medium text-soma-moss transition-colors duration-300 hover:bg-soma-moss hover:text-soma-paper"
                >
                  Go to cart
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onAddToCart(item)}
                  className="cursor-pointer bg-soma-moss px-7 py-3.5 text-center text-sm font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light"
                >
                  Add to cart
                </button>
              )}

              <Link
                to={`/classes/${item.id}`}
                className="border border-soma-sand px-6 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-soma-ink transition-colors hover:border-soma-ink"
              >
                View Full Curriculum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Library() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const { purchases, isPurchased } = usePurchasedClasses()
  const cart = useCart()

  const [filter, setFilter] = useState(tabParam === 'my-videos' ? 'my-videos' : 'all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'cinema'
  const [selectedPreviewCourse, setSelectedPreviewCourse] = useState(null)
  const [selectedFullVideoCourse, setSelectedFullVideoCourse] = useState(null)

  const reduce = useReducedMotion()

  // Sync tab query parameter if present
  useEffect(() => {
    if (tabParam === 'my-videos') {
      setFilter('my-videos')
    }
  }, [tabParam])

  // Compute filter tabs dynamically
  const filterTabs = [
    { id: 'all', label: 'All Classes' },
    {
      id: 'my-videos',
      label: purchases.length > 0 ? `My Videos (${purchases.length})` : 'My Videos',
    },
    ...classes.filters.filter((f) => f.id !== 'all'),
  ]

  // Filter visible items
  const visible = filter === 'my-videos'
    ? classes.items.filter((item) => purchases.includes(item.id))
    : filter === 'all'
    ? classes.items
    : classes.items.filter((item) => item.practice === filter)

  const handleFilterChange = (id) => {
    setFilter(id)
    if (id === 'my-videos') {
      setSearchParams({ tab: 'my-videos' })
    } else {
      setSearchParams({})
    }
  }

  return (
    <section className="py-20 md:py-28 min-h-[85vh] flex flex-col justify-center">
      {/* Top Filter and View Mode Switcher */}
      <div className="shell mb-10">
        <div className="mx-auto max-w-6xl">
          {classes.placeholder ? <DraftNote className="mb-5">{classes.note}</DraftNote> : null}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-y border-soma-sand py-5">
            {/* Filter buttons */}
            <div
              role="group"
              aria-label="Filter classes by practice"
              className="flex flex-wrap justify-center sm:justify-start gap-x-7 gap-y-3"
            >
              {filterTabs.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={filter === option.id}
                  onClick={() => handleFilterChange(option.id)}
                  className={`link-grow min-h-11 cursor-pointer pb-1 text-[0.875rem] tracking-[0.02em] transition-colors duration-500 ${
                    filter === option.id
                      ? 'font-medium text-soma-ink [background-size:100%_1px] [background-position:0_100%]'
                      : 'text-soma-ink/65 hover:text-soma-ink'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Layout Mode Switcher */}
            <div className="flex items-center gap-2 border border-soma-sand/80 p-1 bg-soma-linen/40 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`min-h-10 cursor-pointer px-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-soma-paper text-soma-ink shadow-2xs font-semibold'
                    : 'text-soma-clay-deep hover:text-soma-ink'
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cinema')}
                aria-pressed={viewMode === 'cinema'}
                className={`min-h-10 cursor-pointer px-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                  viewMode === 'cinema'
                    ? 'bg-soma-paper text-soma-ink shadow-2xs font-semibold'
                    : 'text-soma-clay-deep hover:text-soma-ink'
                }`}
              >
                Full Screen
              </button>
            </div>
          </div>
        </div>
      </div>

      {filter === 'my-videos' && visible.length > 0 ? (
        <div className="shell mb-8">
          <p className="mx-auto max-w-6xl border-b border-soma-sand/70 pb-3 text-[0.8125rem] text-soma-clay-deep">
            You own {visible.length} recorded {visible.length === 1 ? 'class' : 'classes'}.
          </p>
        </div>
      ) : null}

      {/* Empty State for My Videos category if user has not purchased yet */}
      {filter === 'my-videos' && visible.length === 0 ? (
        <div className="shell my-12">
          <div className="mx-auto max-w-lg border border-soma-sand bg-soma-linen/50 p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-soma-sand/80 text-soma-moss">
              <VideoCameraIcon size={28} />
            </div>
            <h3 className="mt-5 font-display text-2xl text-soma-ink">
              No Purchased Videos Yet
            </h3>
            <p className="mt-3 text-sm text-soma-clay-deep font-light leading-relaxed">
              Classes you buy will appear here, ready to watch.
            </p>
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className="mt-6 cursor-pointer bg-soma-moss px-6 py-3 text-xs font-medium uppercase tracking-wider text-soma-paper transition-colors hover:bg-soma-moss-light"
            >
              Explore Available Classes &rarr;
            </button>
          </div>
        </div>
      ) : null}

      {/* Full screen view */}
      {viewMode === 'cinema' && visible.length > 0 ? (
        <div className="w-full">
          {visible.map((item) => (
            <CinemaSection
              key={item.id}
              item={item}
              isPurchased={isPurchased(item.id)}
              inCart={cart.inCart(item.id)}
              onAddToCart={(course) => cart.add(course.id)}
              onPreview={(course) => setSelectedPreviewCourse(course)}
              onPlayFullVideo={(course) => setSelectedFullVideoCourse(course)}
            />
          ))}
        </div>
      ) : null}

      {/* Grid view */}
      {viewMode === 'grid' && visible.length > 0 ? (
        <div className="shell">
          <div className="mx-auto max-w-6xl">
            <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((item) => (
                  <motion.li
                    key={item.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <ClassCard
                      item={item}
                      isPurchased={isPurchased(item.id)}
                      inCart={cart.inCart(item.id)}
                      onAddToCart={(course) => cart.add(course.id)}
                      onPlayFullVideo={(course) => setSelectedFullVideoCourse(course)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      ) : null}

      {/* Full Screen Video Preview Modal */}
      <AnimatePresence>
        {selectedPreviewCourse ? (
          <VideoPreviewModal
            course={selectedPreviewCourse}
            onClose={() => setSelectedPreviewCourse(null)}
          />
        ) : null}
      </AnimatePresence>

      {/* Full Screen Enrolled Video Player Modal */}
      <AnimatePresence>
        {selectedFullVideoCourse ? (
          <FullVideoPlayerModal
            course={selectedFullVideoCourse}
            onClose={() => setSelectedFullVideoCourse(null)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default function Classes() {
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Recorded classes with Kirti Verma',
    itemListElement: classes.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://fieldofsoma.com/classes/${item.id}`,
      name: item.title,
    })),
  }

  useTitle('Recorded Classes: Somatic Movement Therapy, Tai Chi and Creative Movement', {
    description:
      'Recorded classes with Kirti Verma you can practise at home, in your own time: Somatic Movement Therapy, Tai Chi and Creative Movement.',
    path: '/classes',
    keywords:
      'somatic classes online, recorded somatics, neck shoulder release video, lower back somatic exercises, pandiculation lessons',
    breadcrumbs: [{ name: 'Recorded Classes', path: '/classes' }],
    schema: courseSchema,
  })

  return (
    <>
      <Intro />
      <Library />
      <ClosingCall {...classes.courses} booking={false} />
    </>
  )
}
