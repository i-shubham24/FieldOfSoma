import { Fragment, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

function ScrollReadMotion({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')
  // Each word takes three steps to reach full ink, so neighbours overlap softly.
  const steps = words.length + 2

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <Word progress={scrollYProgress} range={[i / steps, (i + 3) / steps]}>
            {word}
          </Word>{' '}
        </Fragment>
      ))}
    </p>
  )
}

// A passage that comes into ink word by word, at the pace of the reader's scroll.
export default function ScrollRead({ text, className }) {
  const reduce = useReducedMotion()
  if (reduce) return <p className={className}>{text}</p>
  return <ScrollReadMotion text={text} className={className} />
}
