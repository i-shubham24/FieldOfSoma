import { useState } from 'react'
import { Link } from 'react-router-dom'
import Wordmark from '../components/layout/Wordmark'
import useTitle from '../lib/useTitle'
import { pages } from '../content/seo'

export default function Login() {
  useTitle(pages.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  // Centred when it fits; on short or zoomed screens the page simply scrolls
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-[#F7F5F0] px-4 pt-16 pb-10 text-soma-ink">
      {/* Return to website shortcut - pinned to top-left so it never affects vertical height */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 font-sans text-xs text-soma-clay-deep transition-colors hover:text-soma-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Field of Soma</span>
      </Link>

      {/* SOMA background watermark matching Knotless reference (.watermark { font-size: 20rem; font-weight: 700; letter-spacing: .1em; writing-mode: vertical-rl; top: 50%; right: 5%; transform: translateY(-50%); }) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[3%] sm:right-[5%] lg:right-[6%] top-1/2 -translate-y-1/2 select-none z-0"
      >
        <span className="block font-serif text-[clamp(9rem,20vw,20rem)] font-bold tracking-[0.1em] text-[#1c1a17]/[0.05] [writing-mode:vertical-rl] uppercase leading-none select-none">
          SOMA
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* The same wordmark as the site's top bar */}
        <Link to="/" aria-label="Field of Soma, home" className="flex min-h-11 items-center">
          <Wordmark className="text-[1.375rem] sm:text-[1.5rem]" />
        </Link>

        {/* Center Card */}
        <div className="mt-5 w-full rounded-[24px] border border-stone-200/70 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
          <h1 className="text-center font-serif text-[1.65rem] sm:text-[1.75rem] font-normal text-soma-ink leading-tight">
            Welcome Back
          </h1>
          <p className="mt-1 text-center font-sans text-[0.8125rem] leading-normal text-soma-clay-deep">
            Please enter your credentials to access your archive.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl bg-soma-paper p-5 text-center border border-soma-sand">
              <p className="font-serif text-lg text-soma-moss">Welcome back to the practice.</p>
              <p className="mt-1 text-xs text-soma-clay-deep">
                Your archive session has been restored.
              </p>
              <Link
                to="/classes"
                className="mt-4 inline-block text-xs font-medium text-soma-ink underline underline-offset-4"
              >
                Go to Recorded Classes &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block font-sans text-[0.75rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-transparent bg-[#F2EFEB] px-4 py-2.5 sm:py-3 font-sans text-[0.875rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-all focus:border-soma-moss focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block font-sans text-[0.75rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="cursor-pointer font-sans text-[0.75rem] text-soma-clay-deep transition-colors hover:text-soma-ink"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-transparent bg-[#F2EFEB] px-4 py-2.5 sm:py-3 font-sans text-[0.875rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-all focus:border-soma-moss focus:bg-white focus:outline-none"
                />
                {resetSent ? (
                  <p className="mt-2 text-xs text-soma-moss font-medium">
                    Password reset link sent to your registered email.
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233827] py-2.5 sm:py-3 font-sans text-[0.875rem] font-medium text-white shadow-sm transition-all hover:bg-[#1a2b1a]"
              >
                <span>Login</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <p className="font-sans text-[0.8125rem] text-soma-clay-deep">
              New to the hub?{' '}
              <Link
                to="/signup"
                className="font-medium text-soma-ink underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
