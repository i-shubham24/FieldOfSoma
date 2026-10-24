import { useNavigate } from 'react-router-dom'
import { LockIcon } from '@phosphor-icons/react/dist/csr/Lock'
import Wordmark from '../../components/layout/Wordmark'
import { images } from '../../content/images'
import { ADMIN_EMAIL } from '../sampleData'
import { signIn } from '../session'
import useAdminTitle from '../useAdminTitle'
import { button, field, label } from '../ui'

export default function Login() {
  useAdminTitle('Sign in')
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    signIn()
    navigate('/admin')
  }

  return (
    <div className="flex min-h-dvh flex-wrap bg-soma-paper font-sans text-soma-ink">
      <div className="relative min-h-[260px] flex-[1_1_420px] overflow-hidden bg-soma-ink">
        <img
          src={images.kirtiForestHero.src}
          srcSet={images.kirtiForestHero.srcSet}
          sizes="50vw"
          alt={images.kirtiForestHero.alt}
          className="photo absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-soma-ink/75" />
        <div className="absolute inset-x-8 bottom-8 text-soma-paper sm:inset-x-12 sm:bottom-12">
          <p className="max-w-[18ch] font-display text-[clamp(1.5rem,2.6vw,1.875rem)] leading-tight italic">
            Our bodies are inherently an intelligent ecosystem.
          </p>
          <p className="mt-3 text-[0.8125rem] tracking-[0.16em] text-soma-paper/85 uppercase">Field of Soma admin</p>
        </div>
      </div>

      <div className="flex flex-[1_1_480px] items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[380px] flex-col gap-7">
          <a href="/" className="flex min-h-11 items-center self-start">
            <Wordmark className="text-[1.25rem]" />
          </a>
          <div>
            <h1 className="font-display text-[2.5rem] leading-tight font-normal">Welcome back</h1>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#5E5045]">
              Sign in to look after your classes, messages and website.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-email" className={label}>
                Email
              </label>
              <input id="admin-email" type="email" autoComplete="email" defaultValue={ADMIN_EMAIL} className={`${field} h-12`} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className={label}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                className={`${field} h-12`}
              />
            </div>
            <button type="submit" className={`${button.primary} h-12 w-full`}>
              Sign in
            </button>
          </form>

          <div className="flex gap-3 rounded-[2px] border border-[#E4DCCF] bg-soma-linen px-4 py-3.5 text-[0.8125rem] leading-relaxed text-[#4A4038]">
            <LockIcon size={18} className="mt-0.5 shrink-0 text-soma-moss" aria-hidden="true" />
            <span>
              Preview: sign-in is not connected yet, so any password opens the sample admin. When it is live, a
              6-digit code is also emailed to you, so only you can get in.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
