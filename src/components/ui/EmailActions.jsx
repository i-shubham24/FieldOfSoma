import { useState } from 'react'
import { gmailFor } from '../../lib/forms'

// The email address as a mailto link, plus two ways that work even when the computer has
// no email app set up (common on Windows, where a mailto click then does nothing).
export default function EmailActions({ email, className = '' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the address is still on screen to select by hand
    }
  }

  const action = 'tap-area link-rest min-h-8 cursor-pointer text-[0.8125rem] text-soma-clay-deep hover:text-soma-ink'

  return (
    <span className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${className}`}>
      <a href={`mailto:${email}`} className="tap-area link-rest pb-0.5">
        {email}
      </a>
      <span className="flex items-baseline gap-3">
        <button type="button" onClick={copy} className={action}>
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <a href={gmailFor(email)} target="_blank" rel="noreferrer" className={action}>
          Gmail
        </a>
      </span>
    </span>
  )
}
