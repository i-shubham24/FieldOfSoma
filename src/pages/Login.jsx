import { useState } from 'react'
import { Link } from 'react-router-dom'
import useTitle from '../lib/useTitle'

export default function Login() {
  useTitle('Member Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="relative min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] w-full overflow-y-auto lg:overflow-hidden flex flex-col justify-center items-center px-4 py-8 lg:py-0 bg-[#F7F5F0] text-soma-ink select-none">
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

      {/* SOMA background watermark - sized to viewport height so all 4 letters are 100% fully visible without clipping */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 sm:right-10 lg:right-20 top-1/2 -translate-y-1/2 select-none opacity-25 sm:opacity-35"
      >
        <span className="block font-serif text-[clamp(3.5rem,10.5vh,6.75rem)] font-light tracking-[0.14em] text-[#DDD6CA] [writing-mode:vertical-rl] uppercase leading-none select-none">
          SOMA
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Top Branding Header matching Knotless reference */}
        <div className="flex flex-col items-center text-center">
          {/* Somatic Knot Emblem */}
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border border-stone-200/80 bg-white shadow-xs">
            <svg
              className="h-5 w-5 text-soma-moss"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4Z" />
              <path d="M12 20a4 4 0 0 1-4-4c0-3 4-6 4-6s4 3 4 6a4 4 0 0 1-4 4Z" />
            </svg>
          </div>

          <h1 className="mt-3 font-serif text-[1.625rem] sm:text-[1.75rem] font-normal tracking-tight text-soma-ink leading-tight">
            Field of Soma
          </h1>
          <p className="mt-1 font-sans text-[0.6875rem] font-medium tracking-[0.22em] text-soma-clay-deep uppercase">
            The Somatic Archive
          </p>
        </div>

        {/* Center Card */}
        <div className="mt-5 w-full rounded-[24px] border border-stone-200/70 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
          <h2 className="text-center font-serif text-[1.65rem] sm:text-[1.75rem] font-normal text-soma-ink leading-tight">
            Welcome Back
          </h2>
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
                  className="mb-1.5 block font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
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
                    className="block font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
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
