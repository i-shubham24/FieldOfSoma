import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { images } from '../../content/images'

export default function KinfolkStory() {
  const containerRef = useRef(null)
  const reduce = useReducedMotion()

  // Track scroll progress within this 220vh tall editorial runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // The background photograph smoothly scrolls upward through the frame while text stays pinned
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-38%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08])

  return (
    <section
      id="kinfolk-story"
      data-theme="dark"
      ref={containerRef}
      className="relative h-[220vh] bg-soma-ink text-soma-paper select-none"
    >
      {/* Pinned 100dvh viewport stage: text stays fixed while image scrolls behind */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Scrolling photographic canvas: extended from above to prominently feature her face */}
        <motion.div
          style={{
            y: reduce ? 0 : imageY,
            scale: reduce ? 1 : imageScale,
          }}
          className="absolute inset-x-0 -top-[25%] sm:-top-[30%] h-[180%] w-full will-change-transform"
        >
          {/* Editorial portrait backdrop with serene face and graceful movement visible */}
          <div className="relative h-full w-full">
            <img
              src={images.kinfolkStory.src}
              alt={images.kinfolkStory.alt}
              className="absolute inset-0 h-full w-full object-cover object-[center_10%] sm:object-[center_top] filter brightness-[0.85] contrast-[1.06]"
            />
            {/* Subtle atmospheric vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
          </div>
        </motion.div>

        {/* Fixed Editorial Typography Layer (Exact Kinfolk Layout) */}
        <div className="shell relative z-10 flex h-full flex-col justify-between pt-24 pb-4 sm:pt-28 sm:pb-5 lg:pt-32 lg:pb-5">
          {/* Top fixed line matching Kinfolk */}
          <div>
            <p className="font-sans text-[0.8125rem] font-normal tracking-[0.04em] text-soma-paper/90 sm:text-[0.9375rem]">
              An inquiry into somatic education and embodied presence.
            </p>
          </div>

          {/* Bottom fixed editorial headline + action bar */}
          <div className="space-y-5 sm:space-y-6">
            {/* Monumental display serif title across the bottom, identical to TAKING PLAY SERIOUSLY */}
            <h2 className="font-display text-[clamp(2.5rem,7.5vw,7.25rem)] font-normal tracking-[-0.01em] leading-[0.96] text-soma-paper drop-shadow-sm uppercase">
              Listening to the Sensing Body
            </h2>

            {/* Bottom bar matching Kinfolk login/subscribe strip sitting flush at bottom edge */}
            <div className="flex flex-col gap-3 border-t border-soma-paper/20 pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
              <p className="font-sans text-[0.8125rem] text-soma-paper/75 sm:text-[0.875rem]">
                Gentle neuromuscular repatterning for chronic tension and nervous system ease.
              </p>
              <div className="flex items-center gap-5 shrink-0">
                <Link
                  to="/login"
                  className="font-sans text-[0.8125rem] font-medium tracking-[0.06em] text-soma-paper/90 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/calendar"
                  className="border border-soma-paper/40 bg-soma-paper/10 px-4 py-2 font-sans text-[0.8125rem] font-medium text-soma-paper backdrop-blur-sm transition-all hover:bg-soma-paper hover:text-soma-ink"
                >
                  Book Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
