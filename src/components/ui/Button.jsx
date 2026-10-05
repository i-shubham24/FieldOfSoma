import { Link } from 'react-router-dom'
import { ArrowRightIcon as ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight'

const base =
  'group inline-flex items-center justify-center gap-3 rounded-[2px] font-medium tracking-[0.02em] whitespace-nowrap transition-colors duration-500 ease-soma active:translate-y-px'

const sizes = {
  md: 'h-12 px-7 text-[0.875rem]',
  sm: 'h-10 px-5 text-[0.8125rem]',
}

const variants = {
  solid: 'bg-soma-moss text-soma-paper hover:bg-soma-moss-light',
  outline:
    'border border-soma-ink/60 text-soma-ink hover:border-soma-ink hover:bg-soma-ink hover:text-soma-paper',
}

// Rectangular, never rounded into a pill. Renders a router link, an anchor or a button.
export default function Button({
  to,
  href,
  variant = 'solid',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const content = (
    <>
      <span>{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          size={16}
          weight="light"
          className="transition-transform duration-500 ease-soma group-hover:translate-x-1"
        />
      ) : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}
