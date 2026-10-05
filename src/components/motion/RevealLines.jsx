import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

// A headline whose lines rise from behind their own baseline, one after another.
// The padding on each line keeps italic descenders and overhangs from being clipped.
export default function RevealLines({ as = 'h1', lines, delay = 0, className }) {
  const reduce = useReducedMotion()
  const Tag = as

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span
          key={line.text}
          className="-mx-[0.08em] -mb-[0.18em] block overflow-hidden px-[0.08em] pb-[0.18em]"
        >
          <motion.span
            className={line.italic ? 'block font-normal italic' : 'block'}
            initial={reduce ? false : { y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.4, delay: delay + i * 0.14, ease: EASE }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
