import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { EASE } from '../../lib/motion'

function Item({ question, answer, open, onToggle }) {
  const id = useId()
  const reduce = useReducedMotion()

  return (
    <div className="border-t border-soma-sand last:border-b">
      <h3 className="font-sans">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-8 py-7 text-left"
        >
          <span className="font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.25] font-medium">
            {question}
          </span>
          <PlusIcon
            aria-hidden="true"
            size={20}
            weight="light"
            className={`shrink-0 text-soma-moss transition-transform duration-700 ease-soma ${open ? 'rotate-45' : ''}`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            className="overflow-hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="max-w-[60ch] pb-8 text-lede font-light text-soma-ink/80">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// Questions that open one at a time. Hairlines sit between items, never around them.
export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div>
      {items.map((item, i) => (
        <Item
          key={item.question}
          {...item}
          open={i === openIndex}
          onToggle={() => setOpenIndex(i === openIndex ? -1 : i)}
        />
      ))}
    </div>
  )
}
