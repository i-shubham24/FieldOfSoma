import { CaretDownIcon } from '@phosphor-icons/react/dist/csr/CaretDown'

const labelClass = 'block text-label font-medium text-soma-clay-deep uppercase'

const controlClass =
  'w-full border-0 border-b border-soma-ink/40 bg-transparent px-0 text-base text-soma-ink transition-[border-color,box-shadow] duration-500 ease-soma focus:border-soma-moss focus:shadow-[0_1px_0_0_var(--color-soma-moss)] focus:outline-none aria-[invalid=true]:border-soma-ink'

const shapes = {
  input: 'mt-1 h-12',
  textarea: 'mt-2 min-h-36 resize-y py-2 leading-[1.7]',
  select: 'mt-1 h-12 cursor-pointer appearance-none rounded-none pr-8',
}

// A labelled form control with an underline only: label above, message below.
// `as` picks the control: "input" (default), "textarea" or "select".
export default function Field({ id, label, as = 'input', error, hint, children, ...rest }) {
  const Control = as
  const messageId = `${id}-message`
  const message = error ?? hint

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
        {as === 'select' ? (
          <CaretDownIcon
            aria-hidden="true"
            size={16}
            weight="light"
            className="pointer-events-none absolute right-0 bottom-4 text-soma-ink/70"
          />
        ) : null}
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
