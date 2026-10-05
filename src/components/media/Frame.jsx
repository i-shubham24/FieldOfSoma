import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { EASE } from '../../lib/motion'
import DappledLight from './DappledLight'

const VEILED = 'inset(100% 0% 0% 0%)'
const OPEN = 'inset(0% 0% 0% 0%)'

// The image moves a little slower than the page, so the frame reads as a window.
function Drift({ children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.16, 1.08])
  const y = useTransform(scrollYProgress, [0, 1], ['-3.5%', '3.5%'])

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div style={{ scale, y }} className="absolute inset-0 will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

// A fixed-ratio slot for a photograph. Pass `image` ({ src, srcSet, alt }) from
// content/images.js. Without one it shows a tonal stand-in and an optional note.
export default function Frame({
  image,
  tone = 'sand',
  ratio = 'aspect-[3/2]',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  position = 'object-center',
  note,
  caption,
  drift = false,
  unveil = false,
  priority = false,
  delay = 0,
  className = '',
}) {
  const reduce = useReducedMotion()
  // Visibility is read from the figure, not the masked layer: a fully masked
  // element reports itself as out of view and would never open.
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const masked = unveil && !reduce

  const media = image ? (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={`photo absolute inset-0 h-full w-full object-cover ${position}`}
    />
  ) : (
    <DappledLight tone={tone} />
  )

  const text = caption ?? (image ? null : note)

  return (
    <figure ref={ref} className={className}>
      <motion.div
        className={`relative overflow-hidden bg-soma-linen ${ratio}`}
        initial={masked ? { clipPath: VEILED } : false}
        animate={masked ? { clipPath: inView ? OPEN : VEILED } : undefined}
        transition={{ duration: 1.8, delay, ease: EASE }}
      >
        {drift && !reduce ? <Drift>{media}</Drift> : media}
      </motion.div>
      {text ? (
        <figcaption className="mt-4 text-[0.8125rem] leading-normal text-soma-clay-deep">
          {text}
        </figcaption>
      ) : null}
    </figure>
  )
}
