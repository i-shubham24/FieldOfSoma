import { Link } from 'react-router-dom'
import { ArrowRightIcon as ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight'

// An editorial link: plain text, a hairline underline, and an arrow that leans forward on hover.
export default function TextLink({ to, href, className = '', children, ...rest }) {
  const classes = `group inline-flex items-center gap-2.5 text-[0.9375rem] font-medium leading-none whitespace-nowrap ${className}`
  const content = (
    <>
      <span className="link-rest pb-1.5">{children}</span>
      <ArrowRight
        aria-hidden="true"
        size={15}
        weight="light"
        className="-mt-1.5 transition-transform duration-500 ease-soma group-hover:translate-x-1.5"
      />
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} className={classes} {...rest}>
      {content}
    </a>
  )
}
