import { site } from '../../content/site'
import Button from './Button'

// Shown when a form could not send (no form key yet, or the network failed). The
// visitor's words are carried into a prefilled email (their email app, or Gmail in the
// browser when no app is set up), so nothing is lost.
export default function SendFallback({ mailto, gmail, className = '' }) {
  return (
    <div role="status" className={className}>
      <p className="max-w-[40ch] text-[0.9375rem] leading-[1.7] text-soma-ink/85">
        This form could not send from here. Your words are ready in an email to Kirti instead.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href={mailto} variant="outline" size="sm">
          Email {site.email}
        </Button>
        {gmail ? (
          <Button href={gmail} target="_blank" rel="noreferrer" variant="outline" size="sm">
            Open in Gmail
          </Button>
        ) : null}
      </div>
    </div>
  )
}
