import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

// Content settles into place once, as it enters the viewport.
export default function Reveal({
  as = 'div',
  delay = 0,
  y = 22,
  amount = 0.2,
  className,
  children,
  ...rest
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
