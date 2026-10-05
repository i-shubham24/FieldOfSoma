import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

function Item({ question, answer, index, open, onToggle }) {
  const id = useId()
  const reduce = useReducedMotion()
  const num = String(index + 1).padStart(2, '0')

  return (
    <div className="border-t border-dashed border-[#C5BCAD]/80 last:border-b">
      <h3 className="font-sans">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-4 sm:gap-8 py-5 sm:py-6 text-left cursor-pointer"
        >
          <div className="flex items-center gap-4 sm:gap-7 flex-1">
            <span className="font-sans text-sm sm:text-base font-medium tracking-wide text-[#A4884E] w-6 sm:w-8 shrink-0 select-none">
              {num}
            </span>
            <span className="font-sans text-[1rem] sm:text-[1.125rem] text-[#2C2925] font-normal leading-snug group-hover:text-soma-ink transition-colors">
              {question}
            </span>
          </div>
          <div
            className={`h-8 w-8 sm:h-9 sm:w-9 rounded-[999px] flex items-center justify-center shrink-0 transition-all duration-300 ${
              open
                ? 'bg-[#D7C7A8] text-[#2C2925] shadow-xs'
                : 'border border-dashed border-[#B29D68] text-[#B29D68] group-hover:border-[#8C7A58] group-hover:text-[#8C7A58]'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-500 ease-soma ${open ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
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
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="pl-10 sm:pl-15 pr-6 sm:pr-12 pb-6 pt-1">
              <p className="max-w-[65ch] text-[0.9375rem] sm:text-base font-light text-soma-ink/80 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div>
      {items.map((item, i) => (
        <Item
          key={item.question}
          {...item}
          index={i}
          open={i === openIndex}
          onToggle={() => setOpenIndex(i === openIndex ? -1 : i)}
        />
      ))}
    </div>
  )
}
