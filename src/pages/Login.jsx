import { useState } from 'react'
import { Link } from 'react-router-dom'
import Wordmark from '../components/layout/Wordmark'
import { site } from '../content/site'
import useTitle from '../lib/useTitle'
import { pages } from '../content/seo'

const fieldClass =
  'w-full rounded-[2px] border border-soma-sand bg-[#F2EFEB] px-4 py-2.5 sm:py-3 font-sans text-[0.875rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-colors focus:border-soma-moss focus:bg-white focus:outline-none'
const labelClass = 'block font-sans text-[0.75rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase'

// Member accounts are not switched on yet, so this page says so plainly instead of pretending
// to sign anyone in. Classes bought meanwhile are kept on this device, under My Videos.
export default function Login() {
  useTitle(pages.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [resetNote, setResetNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const onForgot = () =>
    setResetNote(
      email.trim()
        ? `Password resets arrive with member accounts. For help now, write to ${site.email}.`
        : 'Add your email above first.',
    )

  // Centred when it fits; on short or zoomed screens the page simply scrolls
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-[#F7F5F0] px-4 pt-16 pb-10 text-soma-ink">
      {/* Back to the website, pinned top left so it never adds height */}
      <Link
        to="/"
        className="absolute top-2 left-2 flex min-h-11 items-center gap-1.5 px-2 font-sans text-xs text-soma-clay-deep transition-colors hover:text-soma-ink sm:top-4 sm:left-4"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Field of Soma</span>
      </Link>

      {/* A large SOMA watermark down the right side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[3%] sm:right-[5%] lg:right-[6%] top-1/2 -translate-y-1/2 select-none z-0"
      >
        <span className="block font-display text-[clamp(9rem,20vw,20rem)] font-bold tracking-[0.1em] text-[#1c1a17]/[0.05] [writing-mode:vertical-rl] uppercase leading-none select-none">
          SOMA
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* The same wordmark as the site's top bar */}
        <Link to="/" aria-label="Field of Soma, home" className="flex min-h-11 items-center">
          <Wordmark className="text-[1.375rem] sm:text-[1.5rem]" />
        </Link>

        <div className="mt-5 w-full rounded-[4px] border border-soma-sand bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
          <h1 className="text-center font-display text-[1.65rem] sm:text-[1.75rem] font-normal text-soma-ink leading-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-center font-sans text-[0.8125rem] leading-normal text-soma-clay-deep">
            Member accounts open soon. Until then, classes you buy are kept on this device.
          </p>

          {submitted ? (
            <div role="status" className="mt-6 rounded-[2px] border border-soma-sand bg-soma-paper p-5 text-center">
              <p className="font-display text-lg text-soma-moss">Accounts are not open yet</p>
              <p className="mt-1 text-xs leading-relaxed text-soma-clay-deep">
                You do not need to log in to watch. The classes you have bought on this device are in My Videos.
              </p>
              <Link
                to="/classes?tab=my-videos"
                className="mt-3 inline-flex min-h-11 items-center text-xs font-medium text-soma-ink underline underline-offset-4"
              >
                Go to My Videos &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label htmlFor="email" className={`${labelClass} mb-1.5`}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={onForgot}
                    className="-my-3 min-h-11 cursor-pointer px-1 font-sans text-[0.75rem] text-soma-clay-deep transition-colors hover:text-soma-ink"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={fieldClass}
                />
                {resetNote ? (
                  <p role="status" className="mt-2 text-xs font-medium leading-relaxed text-soma-moss">
                    {resetNote}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className="mt-5 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] bg-[#233827] py-2.5 sm:py-3 font-sans text-[0.875rem] font-medium text-white shadow-sm transition-colors hover:bg-[#1a2b1a]"
              >
                <span>Log in</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <p className="font-sans text-[0.8125rem] text-soma-clay-deep">
              New here?{' '}
              <Link to="/signup" className="inline-flex min-h-11 items-center font-medium text-soma-ink underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
