import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

// Content settles into place once, as it enters the viewport.
export default function Reveal({
  as = 'div',
  delay = 0,
  y = 16,
  amount = 0.1,
  className,
  children,
  ...rest
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  return (
    <Tag
      className={className ? `${className} transform-gpu` : 'transform-gpu'}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
