import { site } from '../../content/site'
import Button from './Button'

// Shown when a form could not send (no form key yet, or the network failed). The
// visitor's words are carried into a prefilled email, so nothing is lost.
export default function SendFallback({ mailto, className = '' }) {
  return (
    <div role="status" className={className}>
      <p className="max-w-[40ch] text-[0.9375rem] leading-[1.7] text-soma-ink/85">
        This form could not send from here. Your words are ready in an email to Kirti instead.
      </p>
      <Button href={mailto} variant="outline" size="sm" className="mt-5">
        Email {site.email}
      </Button>
    </div>
  )
}
