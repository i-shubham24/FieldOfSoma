import { useState } from 'react'
import { Link } from 'react-router-dom'
import { images } from '../content/images'
import useTitle from '../lib/useTitle'

export default function Signup() {
  useTitle('Create Account')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="relative min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] w-full overflow-y-auto lg:overflow-hidden flex items-center justify-center px-6 lg:px-12 py-10 lg:py-0 bg-[#F7F5F0] text-soma-ink select-none">
      {/* Return to website shortcut */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 font-sans text-xs text-soma-clay-deep transition-colors hover:text-soma-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Field of Soma</span>
      </Link>

      <div className="max-w-5xl w-full mx-auto grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Editorial Branding Column matching Knotless Signup */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white shadow-xs">
              <svg
                className="h-4.5 w-4.5 text-soma-moss"
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
            <span className="font-serif text-xl sm:text-[1.35rem] font-medium tracking-tight text-soma-ink">
              Field of Soma
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-[1.85rem] font-normal leading-tight text-soma-ink">
            Join the tactile archive of quiet wisdom.
          </h1>

          <p className="font-sans text-xs sm:text-[0.8125rem] leading-relaxed text-soma-clay-deep max-w-[38ch]">
            A dedicated space for students, practitioners, and educators to cultivate awareness with intentionality and somatic depth.
          </p>

          {/* Framed Image Card */}
          <div className="rounded-xl border border-stone-200/80 overflow-hidden bg-white p-2 shadow-xs max-w-sm">
            <div className="h-32 sm:h-38 w-full overflow-hidden rounded-lg bg-soma-linen">
              <img
                src={images.sanctuaryInterior.src}
                alt={images.sanctuaryInterior.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pt-2 pb-0.5 px-1.5 flex justify-between items-center text-[0.625rem] tracking-[0.18em] text-soma-clay-deep font-sans uppercase">
              <span>Est. 2026</span>
              <span>Dharamshala : Online</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="bg-white rounded-[24px] border border-stone-200/70 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.035)] max-w-[420px] w-full">
            <h2 className="font-serif text-xl sm:text-[1.65rem] font-normal text-soma-ink leading-tight">
              Create Account
            </h2>
            <p className="mt-1 font-sans text-xs text-soma-clay-deep">
              Begin your journey in our curated community.
            </p>

            {submitted ? (
              <div className="mt-5 rounded-xl bg-soma-paper p-5 text-center border border-soma-sand">
                <p className="font-serif text-lg text-soma-moss">Welcome to Field of Soma.</p>
                <p className="mt-1 text-xs text-soma-clay-deep">
                  Your archive credentials have been prepared. Please check your inbox to confirm.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-block text-xs font-medium text-soma-ink underline underline-offset-4"
                >
                  Proceed to Login &rarr;
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-2.5 sm:space-y-3">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1 block font-sans text-[0.625rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Hiroshi Andersson"
                    className="w-full rounded-xl border border-transparent bg-[#F2EFEB] px-3.5 py-2 sm:py-2.5 font-sans text-xs sm:text-[0.8125rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-all focus:border-soma-moss focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block font-sans text-[0.625rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
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
                    className="w-full rounded-xl border border-transparent bg-[#F2EFEB] px-3.5 py-2 sm:py-2.5 font-sans text-xs sm:text-[0.8125rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-all focus:border-soma-moss focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="createPassword"
                    className="mb-1 block font-sans text-[0.625rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
                  >
                    Create Password
                  </label>
                  <input
                    id="createPassword"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl border border-transparent bg-[#F2EFEB] px-3.5 py-2 sm:py-2.5 font-sans text-xs sm:text-[0.8125rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-all focus:border-soma-moss focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block font-sans text-[0.625rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-transparent bg-[#F2EFEB] px-3.5 py-2 sm:py-2.5 font-sans text-xs sm:text-[0.8125rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-all focus:border-soma-moss focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Micro-copy information note from Knotless */}
                <div className="flex items-center gap-2 rounded-lg border border-stone-200/70 bg-[#FAF8F5] px-3 py-1.5 text-[0.6875rem] text-soma-clay-deep">
                  <span className="shrink-0 text-soma-moss font-medium">ⓘ</span>
                  <p>Clarify, respect silence, and contribute authentic knowledge.</p>
                </div>

                <button
                  type="submit"
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233827] py-2.5 sm:py-3 font-sans text-xs sm:text-[0.8125rem] font-medium text-white shadow-sm transition-all hover:bg-[#1a2b1a]"
                >
                  Create Account
                </button>
              </form>
            )}

            <div className="mt-3.5 text-center">
              <p className="font-sans text-xs text-soma-clay-deep">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-soma-ink underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
