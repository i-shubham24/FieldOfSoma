import { useState } from 'react'
import Button from '../../components/ui/Button'
import { invitation } from '../../content/home'
import { isEmail, subscribe } from '../../lib/newsletter'

export default function NewsletterForm() {
  const { newsletter } = invitation
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | invalid | sending | done

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!isEmail(email)) {
      setStatus('invalid')
      return
    }
    setStatus('sending')
    await subscribe(email)
    setStatus('done')
  }

  return (
    <div>
      <h3 className="text-[2rem] leading-[1.15]">{newsletter.title}</h3>
      <p className="mt-3 text-[0.9375rem] text-soma-ink/80">{newsletter.body}</p>

      {status === 'done' ? (
        <p role="status" className="mt-9 min-h-[9.5rem] font-display text-[1.5rem] leading-[1.3] italic">
          {newsletter.success}
        </p>
      ) : (
        <form noValidate onSubmit={onSubmit} className="mt-9">
          <label
            htmlFor="newsletter-email"
            className="text-label font-medium text-soma-clay-deep uppercase"
          >
            {newsletter.fieldLabel}
          </label>
          <div className="mt-1 flex flex-col gap-5 sm:flex-row sm:items-end lg:flex-col lg:items-stretch xl:flex-row xl:items-end">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status === 'invalid') setStatus('idle')
              }}
              aria-invalid={status === 'invalid'}
              aria-describedby="newsletter-help"
              className="h-12 w-full min-w-0 flex-1 border-0 border-b border-soma-ink/40 bg-transparent px-0 text-base text-soma-ink transition-[border-color,box-shadow] duration-500 ease-soma focus:border-soma-moss focus:shadow-[0_1px_0_0_var(--color-soma-moss)] focus:outline-none"
            />
            <Button type="submit" variant="outline" disabled={status === 'sending'}>
              {newsletter.submit}
            </Button>
          </div>
          <p
            id="newsletter-help"
            role={status === 'invalid' ? 'alert' : undefined}
            className={`mt-4 text-[0.8125rem] ${
              status === 'invalid' ? 'font-medium text-soma-ink' : 'text-soma-clay-deep'
            }`}
          >
            {status === 'invalid' ? newsletter.error : newsletter.microcopy}
          </p>
        </form>
      )}
    </div>
  )
}
