import { Children, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CaretDownIcon } from '@phosphor-icons/react/dist/csr/CaretDown'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'

const labelClass = 'block text-label font-medium text-soma-clay-deep uppercase'

const controlClass =
  'w-full border-0 border-b border-soma-ink/40 bg-transparent px-0 text-base text-soma-ink transition-[border-color,box-shadow] duration-500 ease-soma focus:border-soma-moss focus:shadow-[0_1px_0_0_var(--color-soma-moss)] focus:outline-none aria-[invalid=true]:border-soma-ink'

const shapes = {
  input: 'mt-1 h-12',
  textarea: 'mt-2 min-h-36 resize-y py-2 leading-[1.7]',
}

// Bespoke accessible dropdown replacing raw OS select with warm paper editorial styling
function SelectControl({ id, value, onChange, options = [], children, error, messageId }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  // Extract option labels from props or children
  const resolvedOptions =
    options.length > 0
      ? options
      : Children.map(children, (child) => {
          if (!child) return null
          return typeof child === 'object' && child.props
            ? child.props.value ?? child.props.children
            : String(child)
        }).filter(Boolean)

  const selectedValue = value || (resolvedOptions[0] ?? '')

  // Close on outside click or escape
  useEffect(() => {
    if (!open) return undefined

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleSelect = (opt) => {
    onChange?.({ target: { name: id, value: opt } })
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative mt-1">
      <input type="hidden" id={id} name={id} value={selectedValue} />

      <button
        type="button"
        id={`${id}-button`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={messageId}
        aria-invalid={error ? true : undefined}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-12 w-full cursor-pointer items-center justify-between border-0 border-b bg-transparent px-0 text-left text-base text-soma-ink transition-[border-color,box-shadow] duration-500 ease-soma focus:outline-none ${
          open
            ? 'border-soma-moss shadow-[0_1px_0_0_var(--color-soma-moss)]'
            : 'border-soma-ink/40 hover:border-soma-ink'
        }`}
      >
        <span className="truncate">{selectedValue}</span>
        <CaretDownIcon
          size={16}
          weight="light"
          className={`shrink-0 text-soma-ink/70 transition-transform duration-300 ease-soma ${
            open ? 'rotate-180 text-soma-moss' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-labelledby={`${id}-button`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full right-0 left-0 z-40 mt-1 max-h-60 overflow-y-auto border border-soma-sand bg-soma-paper py-1 shadow-lg"
          >
            {resolvedOptions.map((opt) => {
              const isSelected = opt === selectedValue
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`flex cursor-pointer items-center justify-between px-4 py-3 text-[0.9375rem] transition-colors duration-200 ${
                    isSelected
                      ? 'bg-soma-linen/80 font-medium text-soma-moss'
                      : 'text-soma-ink hover:bg-soma-linen hover:text-soma-moss'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected ? (
                    <CheckIcon size={14} weight="bold" className="text-soma-moss" />
                  ) : null}
                </li>
              )
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// A labelled form control with an underline: label above, message below.
// `as` picks the control: "input" (default), "textarea" or "select".
export default function Field({ id, label, as = 'input', error, hint, children, ...rest }) {
  const messageId = `${id}-message`
  const message = error ?? hint

  if (as === 'select') {
    return (
      <div>
        <label htmlFor={`${id}-button`} className={labelClass}>
          {label}
        </label>
        <SelectControl
          id={id}
          error={error}
          messageId={message ? messageId : undefined}
          {...rest}
        >
          {children}
        </SelectControl>
        {message ? (
          <p
            id={messageId}
            role={error ? 'alert' : undefined}
            className={`mt-2 text-[0.8125rem] ${error ? 'font-medium text-soma-ink' : 'text-soma-clay-deep'}`}
          >
            {message}
          </p>
        ) : null}
      </div>
    )
  }

  const Control = as

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <Control
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={`${controlClass} ${shapes[as]}`}
          {...rest}
        >
          {children}
        </Control>
      </div>
      {message ? (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={`mt-2 text-[0.8125rem] ${error ? 'font-medium text-soma-ink' : 'text-soma-clay-deep'}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
