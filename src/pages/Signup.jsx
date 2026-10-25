import { useState } from 'react'
import { Link } from 'react-router-dom'
import { images } from '../content/images'
import useTitle from '../lib/useTitle'
import { pages } from '../content/seo'

const fieldClass =
  'w-full rounded-[2px] border border-soma-sand bg-[#F2EFEB] px-3.5 py-2 sm:py-2.5 font-sans text-xs sm:text-[0.8125rem] text-soma-ink placeholder:text-soma-clay-deep/50 transition-colors focus:border-soma-moss focus:bg-white focus:outline-none'
const labelClass = 'mb-1 block font-sans text-[0.75rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase'

// Member accounts are not switched on yet. The form checks what it can, then says so plainly
// instead of claiming an account was made. Classes bought meanwhile stay on this device.
export default function Signup() {
  useTitle(pages.signup)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('The two passwords do not match.')
      document.getElementById('confirmPassword')?.focus()
      return
    }
    setError('')
    setSubmitted(true)
  }

  // Sized to fit one screen: the photo drops out on short screens. Only very small or
  // zoomed windows fall back to scrolling, so nothing is ever cut off.
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-[#F7F5F0] px-6 pt-12 pb-6 text-soma-ink lg:px-12">
      {/* Back to the website */}
      <Link
        to="/"
        className="absolute top-2 left-2 flex min-h-11 items-center gap-1.5 px-2 font-sans text-xs text-soma-clay-deep transition-colors hover:text-soma-ink sm:top-4 sm:left-4"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Field of Soma</span>
      </Link>

      <div className="max-w-5xl w-full mx-auto grid lg:grid-cols-12 gap-7 lg:gap-14 items-center">
        {/* Left: the name, a short line and a photo */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-soma-sand bg-white shadow-xs">
              <svg
                className="h-4.5 w-4.5 text-soma-moss"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 4a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4Z" />
                <path d="M12 20a4 4 0 0 1-4-4c0-3 4-6 4-6s4 3 4 6a4 4 0 0 1-4 4Z" />
              </svg>
            </div>
            <span className="font-display text-xl sm:text-[1.35rem] font-medium tracking-tight text-soma-ink">
              Field of Soma
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-[1.85rem] font-normal leading-tight text-soma-ink">
            Your classes, all in one place
          </h1>

          <p className="font-sans text-xs sm:text-[0.8125rem] leading-relaxed text-soma-clay-deep max-w-[38ch]">
            An account keeps the recorded classes you buy together, ready to watch whenever you like.
          </p>

          {/* Framed photo */}
          <div className="rounded-[4px] border border-soma-sand overflow-hidden bg-white p-2 shadow-xs max-w-sm">
            <div className="h-32 sm:h-38 w-full overflow-hidden rounded-[2px] bg-soma-linen">
              <img
                src={images.himalayanCedarForest.src}
                alt={images.himalayanCedarForest.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pt-2 pb-0.5 px-1.5 flex justify-between items-center text-[0.75rem] tracking-[0.18em] text-soma-clay-deep font-sans uppercase">
              <span>Est. 2026</span>
              <span>Dharamshala and online</span>
            </div>
          </div>
        </div>

        {/* Right: the form */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="bg-white rounded-[4px] border border-soma-sand p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.035)] max-w-[420px] w-full">
            <h2 className="font-display text-xl sm:text-[1.65rem] font-normal text-soma-ink leading-tight">
              Create an account
            </h2>
            <p className="mt-1 font-sans text-xs leading-relaxed text-soma-clay-deep">
              Member accounts open soon. Until then, classes you buy are kept on this device.
            </p>

            {submitted ? (
              <div role="status" className="mt-5 rounded-[2px] border border-soma-sand bg-soma-paper p-5 text-center">
                <p className="font-display text-lg text-soma-moss">Thank you, {name.trim().split(' ')[0] || 'friend'}</p>
                <p className="mt-1 text-xs leading-relaxed text-soma-clay-deep">
                  Accounts are not open yet, so no account was made and no email was sent. You can still buy and watch
                  classes on this device.
                </p>
                <Link
                  to="/classes"
                  className="mt-3 inline-flex min-h-11 items-center text-xs font-medium text-soma-ink underline underline-offset-4"
                >
                  Browse the classes &rarr;
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-2.5 sm:space-y-3">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
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
                  <label htmlFor="createPassword" className={labelClass}>
                    Password
                  </label>
                  <input
                    id="createPassword"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="At least 6 characters"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Password again
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'signup-error' : undefined}
                    placeholder="Type it once more"
                    className={fieldClass}
                  />
                  {error ? (
                    <p id="signup-error" role="alert" className="mt-1.5 text-xs font-medium text-[#8E3519]">
                      {error}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] bg-[#233827] py-2.5 sm:py-3 font-sans text-xs sm:text-[0.8125rem] font-medium text-white shadow-sm transition-colors hover:bg-[#1a2b1a]"
                >
                  Create account
                </button>
              </form>
            )}

            <div className="mt-3.5 text-center">
              <p className="font-sans text-xs text-soma-clay-deep">
                Already have an account?{' '}
                <Link to="/login" className="inline-flex min-h-11 items-center font-medium text-soma-ink underline-offset-4 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
