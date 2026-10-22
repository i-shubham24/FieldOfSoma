import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import useDialog from '../../lib/useDialog'

// Turns a YouTube, Vimeo or direct video link into something the page can play.
function embedFor(url) {
  if (!url) return null
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (youtube) return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0` }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  return { type: 'video', src: url }
}

function Player({ url, course, waiting }) {
  const media = embedFor(url)

  if (media?.type === 'iframe') {
    return (
      <iframe
        src={media.src}
        title={course.title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    )
  }
  if (media?.type === 'video') {
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return <video src={media.src} controls playsInline className="absolute inset-0 h-full w-full bg-black" />
  }

  // No link yet: say so plainly instead of showing a player that does nothing.
  return (
    <>
      <img
        src={course.image.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40 blur-xs"
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center border border-white/40 bg-white/10 backdrop-blur-md">
          <PlayIcon size={28} weight="fill" className="text-white" aria-hidden="true" />
        </div>
        <p className="mt-5 font-display text-2xl text-white">The video is on its way</p>
        <p className="mt-2 max-w-[40ch] text-sm leading-relaxed font-light text-white/80">{waiting}</p>
      </div>
    </>
  )
}

function Shell({ label, onClose, children, className = '' }) {
  const ref = useRef(null)
  useDialog(ref, onClose)

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
      className={`fixed inset-0 z-[55] flex h-dvh flex-col overflow-y-auto overscroll-contain text-soma-paper outline-none ${className}`}
    >
      {children}
    </motion.div>
  )
}

const closeButton =
  'flex min-h-11 shrink-0 cursor-pointer items-center text-xs font-medium tracking-wider text-white/70 uppercase hover:text-white'

export function VideoPreviewModal({ course, onClose }) {
  const first = course.curriculum?.[0]

  return (
    <Shell label={`${course.title}, free preview`} onClose={onClose} className="bg-black">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-2 sm:px-6">
        <p className="truncate font-display text-sm italic">{course.title}: free preview</p>
        <button type="button" onClick={onClose} className={closeButton}>
          Close
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="relative aspect-video w-full max-w-5xl overflow-hidden border border-white/10 bg-black">
          <Player
            url={course.previewUrl}
            course={course}
            waiting="Kirti is recording this class. The free preview will appear here soon."
          />
        </div>
      </div>

      {first ? (
        <footer className="border-t border-white/10 px-5 py-4 text-sm text-white/70 sm:px-6">
          {first.title}
        </footer>
      ) : null}
    </Shell>
  )
}

export function FullVideoPlayerModal({ course, onClose }) {
  const lessons = course.curriculum ?? []
  const [active, setActive] = useState(0)
  const current = lessons[active]

  return (
    <Shell label={`${course.title}, full class`} onClose={onClose} className="bg-stone-950">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-black/90 px-4 py-2 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/classes?tab=my-videos" onClick={onClose} className={`${closeButton} gap-1.5`}>
            <ArrowLeftIcon size={14} aria-hidden="true" />
            <span>My Videos</span>
          </Link>
          <span className="text-white/20" aria-hidden="true">
            |
          </span>
          <span className="truncate font-display text-sm italic">{course.title}</span>
        </div>
        <button type="button" onClick={onClose} className={closeButton}>
          Close
        </button>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black">
              <Player
                url={course.videoUrl}
                course={course}
                waiting="You own this class. Kirti is finishing the recording, and it will play here as soon as it is uploaded."
              />
            </div>
            {current ? (
              <div className="space-y-2 border border-white/10 bg-white/5 p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-white">{current.title}</h3>
                  <span className="shrink-0 text-xs text-white/60 tabular-nums">{current.duration}</span>
                </div>
                <p className="text-sm leading-relaxed font-light text-white/80">{current.summary}</p>
              </div>
            ) : null}
          </div>

          {lessons.length > 0 ? (
            <div className="border border-white/10 bg-white/5 p-5 sm:p-6 lg:col-span-4">
              <h4 className="border-b border-white/10 pb-3 font-display text-lg text-white">
                In this class ({lessons.length} parts)
              </h4>
              <div className="mt-4 divide-y divide-white/10">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id || index}
                    type="button"
                    aria-current={active === index ? 'true' : undefined}
                    onClick={() => setActive(index)}
                    className={`flex w-full cursor-pointer items-start justify-between gap-3 px-3 py-3.5 text-left transition-colors ${
                      active === index ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-sm leading-snug">{lesson.title}</span>
                    <span className="mt-0.5 shrink-0 text-xs text-white/60 tabular-nums">{lesson.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </Shell>
  )
}
