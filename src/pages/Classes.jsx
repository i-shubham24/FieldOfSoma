import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { HandSwipeLeftIcon } from '@phosphor-icons/react/dist/csr/HandSwipeLeft'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { RowsIcon } from '@phosphor-icons/react/dist/csr/Rows'
import { SquaresFourIcon } from '@phosphor-icons/react/dist/csr/SquaresFour'
import { VideoCameraIcon } from '@phosphor-icons/react/dist/csr/VideoCamera'
import ClosingCall from '../components/layout/ClosingCall'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Button from '../components/ui/Button'
import DraftNote from '../components/ui/DraftNote'
import { classes } from '../content/classes'
import { PAGE_TOP } from '../lib/layout'
import { EASE } from '../lib/motion'
import { usePurchasedClasses } from '../lib/purchases'
import { useDragScroll } from '../lib/useDragScroll'
import useTitle from '../lib/useTitle'
import { CheckoutModal, FullVideoPlayerModal, VideoPreviewModal } from './ClassDetail'

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

function ClassCard({ item, isPurchased, isDragging, onEnroll, onPreview, onPlayFullVideo }) {
  const handleClick = (e) => {
    if (isDragging) {
      e.preventDefault()
    }
  }

  return (
    <article className="group flex flex-col justify-between h-full border border-soma-sand/90 bg-soma-paper p-6 sm:p-7 shadow-2xs transition-shadow duration-500 hover:shadow-sm">
      <div>
        {/* Card Thumbnail with Play Preview */}
        <div className="relative overflow-hidden bg-soma-sand aspect-[16/10]">
          <Link
            to={`/classes/${item.id}`}
            onClick={handleClick}
            className="block h-full w-full"
            tabIndex={isDragging ? -1 : 0}
          >
            <img
              src={item.image.src}
              srcSet={item.image.srcSet}
              alt={item.image.alt || item.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-soma group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {isPurchased ? (
            <button
              type="button"
              onClick={(e) => {
                if (isDragging) return
                e.stopPropagation()
                onPlayFullVideo(item)
              }}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-soma-moss px-3 py-1.5 text-[0.6875rem] font-medium text-soma-paper uppercase tracking-wider backdrop-blur-xs transition-colors hover:bg-soma-moss-light"
            >
              <PlayIcon size={12} weight="fill" />
              <span>Play Video</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                if (isDragging) return
                e.stopPropagation()
                onPreview(item)
              }}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-soma-ink/85 px-3 py-1.5 text-[0.6875rem] font-medium text-white uppercase tracking-wider backdrop-blur-xs transition-colors hover:bg-soma-moss"
            >
              <PlayIcon size={12} weight="fill" />
              <span>Sample</span>
            </button>
          )}

          {isPurchased ? (
            <span className="absolute top-3 right-3 bg-soma-moss px-2 py-0.5 text-[0.625rem] font-semibold text-white uppercase tracking-wider">
              Enrolled
            </span>
          ) : null}
        </div>

        {/* Practice and Meta */}
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <span className="font-display text-[1.125rem] leading-[1.2] text-soma-moss italic">
            {item.practiceName}
          </span>
          <span className="text-[0.75rem] text-soma-clay-deep uppercase tracking-wider tabular-nums">
            {item.duration} • {item.level}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/classes/${item.id}`}
          onClick={handleClick}
          className="mt-2 block"
        >
          <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.2] transition-colors group-hover:text-soma-moss">
            {item.title}
          </h3>
        </Link>

        {/* Focus description */}
        <p className="mt-3 text-[0.875rem] leading-[1.65] text-soma-ink/80 line-clamp-3">
          {item.focus}
        </p>

        {/* Highlights */}
        {item.whatYouWillLearn && item.whatYouWillLearn.length > 0 ? (
          <div className="mt-4 pt-3 border-t border-soma-sand/60">
            <p className="text-[0.6875rem] uppercase tracking-wider text-soma-clay-deep font-medium">
              Core Outcome
            </p>
            <p className="mt-1 text-xs text-soma-ink/85 line-clamp-1 italic">
              {item.whatYouWillLearn[0]}
            </p>
          </div>
        ) : null}
      </div>

      {/* Pricing & Dual Actions */}
      <div className="mt-6 pt-4 border-t border-soma-sand/70">
        <div className="flex items-baseline justify-between mb-4">
          {isPurchased ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-soma-moss">
              <CheckIcon size={14} weight="bold" />
              <span>Full Access Unlocked</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-[1.25rem] font-semibold tabular-nums text-soma-ink">
                {item.price}
              </span>
              <span className="text-xs text-soma-clay-deep line-through tabular-nums">
                {item.originalPrice}
              </span>
            </div>
          )}

          <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-soma-moss">
            {isPurchased ? 'In My Videos' : 'Instant Access'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {isPurchased ? (
            <button
              type="button"
              onClick={(e) => {
                if (isDragging) return
                e.stopPropagation()
                onPlayFullVideo(item)
              }}
              className="cursor-pointer bg-soma-moss py-2.5 text-center text-xs font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light"
            >
              Play Video
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                if (isDragging) return
                e.stopPropagation()
                onEnroll(item)
              }}
              className="cursor-pointer bg-soma-moss py-2.5 text-center text-xs font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light"
            >
              Enroll Now
            </button>
          )}

          <Link
            to={`/classes/${item.id}`}
            onClick={handleClick}
            className="flex items-center justify-center border border-soma-sand py-2.5 text-center text-xs font-medium uppercase tracking-wider text-soma-ink transition-colors hover:border-soma-ink"
          >
            {isPurchased ? 'Syllabus' : 'Details'}
          </Link>
        </div>
      </div>
    </article>
  )
}

function CinemaSection({ item, isPurchased, onEnroll, onPreview, onPlayFullVideo }) {
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
                {isPurchased ? 'Full Course Access Available' : 'Free Lesson Preview Available'}
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
                  What you will practice:
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
              ) : (
                <button
                  type="button"
                  onClick={() => onEnroll(item)}
                  className="cursor-pointer bg-soma-moss px-7 py-3.5 text-center text-sm font-medium text-soma-paper transition-colors duration-300 hover:bg-soma-moss-light"
                >
                  Enroll & Access Now
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
  const { purchases, isPurchased, clearPurchases } = usePurchasedClasses()

  const [filter, setFilter] = useState(tabParam === 'my-videos' ? 'my-videos' : 'all')
  const [viewMode, setViewMode] = useState('carousel') // 'carousel' | 'cinema' | 'grid'
  const [selectedCheckoutCourse, setSelectedCheckoutCourse] = useState(null)
  const [selectedPreviewCourse, setSelectedPreviewCourse] = useState(null)
  const [selectedFullVideoCourse, setSelectedFullVideoCourse] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragConstraint, setDragConstraint] = useState(0)

  const carouselRef = useRef(null)
  const trackRef = useRef(null)
  const x = useMotionValue(0)
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

  // Measure track and container for drag constraints
  useEffect(() => {
    const measure = () => {
      if (carouselRef.current && trackRef.current) {
        const containerWidth = carouselRef.current.offsetWidth
        const trackWidth = trackRef.current.scrollWidth
        const maxDrag = Math.min(0, containerWidth - trackWidth)
        setDragConstraint(maxDrag)

        if (x.get() < maxDrag) {
          animate(x, maxDrag, { duration: 0.35 })
        }
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [visible, viewMode, x])

  const handleFilterChange = (id) => {
    setFilter(id)
    animate(x, 0, { duration: 0.4 })
    if (id === 'my-videos') {
      setSearchParams({ tab: 'my-videos' })
    } else {
      setSearchParams({})
    }
  }

  const scrollStep = (direction) => {
    const stepSize = 440
    const current = x.get()
    const target = Math.max(dragConstraint, Math.min(0, current + direction * stepSize))
    animate(x, target, { duration: 0.5, ease: [0.16, 1, 0.3, 1] })
  }

  return (
    <section className="py-20 md:py-28 min-h-[85vh] flex flex-col justify-center">
      {/* Top Filter and View Mode Switcher */}
      <div className="shell mb-10">
        <div className="mx-auto max-w-6xl">
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
                  className={`link-grow pb-1 text-[0.875rem] tracking-[0.02em] transition-colors duration-500 cursor-pointer ${
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
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  viewMode === 'carousel'
                    ? 'bg-soma-paper text-soma-ink shadow-2xs font-semibold'
                    : 'text-soma-clay-deep hover:text-soma-ink'
                }`}
              >
                Touch Slider
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cinema')}
                aria-pressed={viewMode === 'cinema'}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  viewMode === 'cinema'
                    ? 'bg-soma-paper text-soma-ink shadow-2xs font-semibold'
                    : 'text-soma-clay-deep hover:text-soma-ink'
                }`}
              >
                Full Screen
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-soma-paper text-soma-ink shadow-2xs font-semibold'
                    : 'text-soma-clay-deep hover:text-soma-ink'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset demo purchases bar for My Videos */}
      {filter === 'my-videos' && visible.length > 0 ? (
        <div className="shell mb-8">
          <div className="mx-auto max-w-6xl flex items-center justify-between border-b border-soma-sand/70 pb-3 text-xs text-soma-clay-deep">
            <span>
              You have unlocked lifetime access to {visible.length} recorded {visible.length === 1 ? 'class' : 'classes'}.
            </span>
            <button
              type="button"
              onClick={() => clearPurchases()}
              className="cursor-pointer underline hover:text-soma-ink transition-colors"
            >
              Reset demo purchases
            </button>
          </div>
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
              When you enroll in any recorded class, your lifetime on-demand videos, downloadable audio tracks, and illustrated guides will be ready here.
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

      {/* MODE 1: Touch-Draggable Horizontal Carousel */}
      {viewMode === 'carousel' && visible.length > 0 ? (
        <div className="w-full">
          {/* Header Controls with touch hint and arrows */}
          <div className="shell mb-6">
            <div className="mx-auto max-w-6xl flex items-center justify-between text-xs text-soma-clay-deep">
              <div className="flex items-center gap-2">
                <HandSwipeLeftIcon size={16} className="text-soma-moss" />
                <span>Swipe or drag cards horizontally</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="tabular-nums mr-2">
                  {visible.length} {visible.length === 1 ? 'class' : 'classes'} shown
                </span>
                <button
                  type="button"
                  onClick={() => scrollStep(1)}
                  aria-label="Previous classes"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center border border-soma-sand bg-soma-paper text-soma-ink transition-colors hover:border-soma-ink"
                >
                  <ArrowLeftIcon size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollStep(-1)}
                  aria-label="Next classes"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center border border-soma-sand bg-soma-paper text-soma-ink transition-colors hover:border-soma-ink"
                >
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Draggable Motion Track */}
          <div
            ref={carouselRef}
            className="w-full overflow-hidden select-none touch-pan-y"
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              drag="x"
              dragConstraints={{ right: 0, left: dragConstraint }}
              dragElastic={0.12}
              dragTransition={{ power: 0.25, timeConstant: 220 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => {
                setTimeout(() => setIsDragging(false), 80)
              }}
              className="flex gap-6 sm:gap-8 px-6 sm:px-10 md:px-14 lg:px-20 py-4 cursor-grab active:cursor-grabbing"
            >
              {visible.map((item) => (
                <div
                  key={item.id}
                  className="w-[84vw] sm:w-[380px] md:w-[420px] lg:w-[450px] shrink-0"
                >
                  <ClassCard
                    item={item}
                    isPurchased={isPurchased(item.id)}
                    isDragging={isDragging}
                    onEnroll={(course) => setSelectedCheckoutCourse(course)}
                    onPreview={(course) => setSelectedPreviewCourse(course)}
                    onPlayFullVideo={(course) => setSelectedFullVideoCourse(course)}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* MODE 2: Full Screen Cinema Mode */}
      {viewMode === 'cinema' && visible.length > 0 ? (
        <div className="w-full">
          {visible.map((item) => (
            <CinemaSection
              key={item.id}
              item={item}
              isPurchased={isPurchased(item.id)}
              onEnroll={(course) => setSelectedCheckoutCourse(course)}
              onPreview={(course) => setSelectedPreviewCourse(course)}
              onPlayFullVideo={(course) => setSelectedFullVideoCourse(course)}
            />
          ))}
        </div>
      ) : null}

      {/* MODE 3: Classic 3-Column Grid */}
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
                      isDragging={false}
                      onEnroll={(course) => setSelectedCheckoutCourse(course)}
                      onPreview={(course) => setSelectedPreviewCourse(course)}
                      onPlayFullVideo={(course) => setSelectedFullVideoCourse(course)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      ) : null}

      {classes.placeholder && classes.note ? (
        <div className="shell mt-16">
          <div className="mx-auto max-w-6xl">
            <DraftNote>{classes.note}</DraftNote>
          </div>
        </div>
      ) : null}

      {/* Full Screen Checkout Modal */}
      <AnimatePresence>
        {selectedCheckoutCourse ? (
          <CheckoutModal
            course={selectedCheckoutCourse}
            onClose={() => setSelectedCheckoutCourse(null)}
            onOpenFullVideo={(course) => setSelectedFullVideoCourse(course)}
          />
        ) : null}
      </AnimatePresence>

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
  useTitle('Recorded Classes')

  return (
    <>
      <Intro />
      <Library />
      <ClosingCall {...classes.courses} booking={false} />
    </>
  )
}
