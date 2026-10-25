import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AutoTextarea, button, field, FieldError, label, Notice, PageHeader, panel, SampleNote, Tag, Toggle } from '../ui'
import { downloadFile, formatDate, isEmail, isWebLink, timeAgo, todayIso } from '../util'

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || ''
const FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''
const ENV_BOOKING = import.meta.env.VITE_BOOKING_URL || ''

const NOTIFY = [
  ['messages', 'A new message or session request'],
  ['orders', 'A new order'],
  ['reviews', 'A new review to approve'],
]

const POLICIES = [
  ['refund', 'Refund policy', 'For example: if a recorded class is not right for you, write within 7 days of buying it for a full refund.'],
  ['privacy', 'Privacy policy', 'What you collect (name, email, payments through Razorpay), why, and how people can ask for it to be deleted.'],
  ['terms', 'Terms of use', 'How classes may be used: for personal practice, not to be shared or resold.'],
]

function Card({ id, title, intro, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${panel} flex scroll-mt-24 flex-col gap-5 p-5 sm:p-7`}>
      <div>
        <h2 id={`${id}-title`} className="font-display text-[1.375rem] font-normal">
          {title}
        </h2>
        {intro ? <p className="mt-1 text-[0.875rem] text-[#5E5045]">{intro}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Status({ ok, children }) {
  return <Tag tone={ok ? 'moss' : 'warn'}>{children}</Tag>
}

function YourData() {
  const { data, reset } = useAdminData()
  const [confirm, setConfirm] = useState(false)
  const [notice, setNotice] = useState('')

  return (
    <Card id="data" title="Your data" intro="A copy of everything here, or a fresh start.">
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => downloadFile(`field-of-soma-admin-${todayIso()}.json`, JSON.stringify(data, null, 2), 'application/json')}
          className={button.outline}
        >
          <DownloadSimpleIcon size={16} aria-hidden="true" />
          Download everything
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!confirm) {
              setConfirm(true)
              return
            }
            await reset()
            setConfirm(false)
            setNotice('Back to the sample data. Uploaded videos and photos were removed from this browser.')
          }}
          className={button.danger}
        >
          {confirm ? 'Click again to reset everything' : 'Reset sample data'}
        </button>
      </div>
      {notice ? <Notice>{notice}</Notice> : null}
      <p className="text-[0.75rem] leading-relaxed text-soma-clay-deep">
        In this preview, everything is kept in this browser only. Videos and photos are not included in the download.
      </p>
    </Card>
  )
}

export default function Settings() {
  useAdminTitle('Settings')
  const { data, setValue, log } = useAdminData()
  const location = useLocation()
  const [form, setForm] = useState(data.settings)

  // After "Reset sample data" the form starts again from the fresh values
  useEffect(() => {
    setForm(data.settings)
    setErrors({})
    // Only a reset should replace what is being typed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.seededAt])
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  // Links like /admin/settings#booking open at that section
  useEffect(() => {
    if (!location.hash) return undefined
    const timer = setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    return () => clearTimeout(timer)
  }, [location.hash])

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setNotice('')
  }
  const sections = ['bookingUrl', 'notifyEmail', 'notify', 'policies']
  const dirty = sections.some((key) => JSON.stringify(form[key]) !== JSON.stringify(data.settings[key]))

  const save = (event) => {
    event.preventDefault()
    const found = {}
    if (form.bookingUrl.trim() && !isWebLink(form.bookingUrl)) found.bookingUrl = 'Paste the full link, starting with https://'
    if (!isEmail(form.notifyEmail)) found.notifyEmail = 'Add the email that should get notifications.'
    setErrors(found)
    if (Object.keys(found).length) {
      setNotice('')
      return
    }
    const policiesChanged = JSON.stringify(form.policies) !== JSON.stringify(data.settings.policies)
    setValue('settings', (current) => ({
      ...current,
      ...Object.fromEntries(sections.map((key) => [key, form[key]])),
      bookingUrl: form.bookingUrl.trim(),
      policiesUpdated: policiesChanged ? todayIso() : current.policiesUpdated,
    }))
    setForm((current) => ({ ...current, bookingUrl: current.bookingUrl.trim() }))
    log('Saved the settings')
    setNotice('Settings saved.')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" intro="Payments, bookings, emails and policies.">
        <SampleNote />
      </PageHeader>

      <form onSubmit={save} noValidate className="flex flex-col gap-6">
        <Card id="payments" title="Payments" intro="Classes are paid for through Razorpay: UPI, cards, net banking and wallets. Razorpay emails each buyer a receipt.">
          <div className="flex flex-wrap items-center gap-2 text-[0.875rem]">
            Razorpay: {RAZORPAY_KEY ? <Status ok>Connected</Status> : <Status>Key not added yet</Status>}
          </div>
        </Card>

        <Card id="booking" title="Online booking" intro="A Cal.com or Calendly link lets people pick a time themselves on the Calendar page.">
          <div className="flex flex-wrap items-center gap-2 text-[0.875rem]">
            On the site now: {ENV_BOOKING ? <Status ok>Connected</Status> : <Tag tone="sand">Requests only</Tag>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="s-booking" className={label}>
              Booking link
            </label>
            <input id="s-booking" type="url" value={form.bookingUrl} onChange={set('bookingUrl')} placeholder="https://cal.com/kirti-verma" className={`${field} h-11`} />
            <FieldError>{errors.bookingUrl}</FieldError>
          </div>
        </Card>

        <Card id="email" title="Emails" intro="Where the site sends messages, and what you hear about.">
          <div className="flex flex-wrap items-center gap-2 text-[0.875rem]">
            Contact forms: {FORMS_KEY ? <Status ok>Sending</Status> : <Status>Not connected yet</Status>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="s-notify" className={label}>
              Send notifications to
            </label>
            <input id="s-notify" type="email" value={form.notifyEmail} onChange={set('notifyEmail')} className={`${field} h-11`} />
            <FieldError>{errors.notifyEmail}</FieldError>
          </div>
          <fieldset className="flex flex-col gap-1">
            <legend className={`${label} mb-2`}>Email me about</legend>
            {NOTIFY.map(([key, text]) => (
              <div key={key} className="flex items-center gap-2.5 text-[0.9375rem]">
                <Toggle
                  checked={form.notify[key]}
                  onChange={(on) => {
                    setForm((current) => ({ ...current, notify: { ...current.notify, [key]: on } }))
                    setNotice('')
                  }}
                  label={text}
                />
                {text}
              </div>
            ))}
          </fieldset>
        </Card>

        <Card
          id="policies"
          title="Policies"
          intro={`Shown at checkout and in the footer.${data.settings.policiesUpdated ? ` Last updated ${formatDate(data.settings.policiesUpdated, { day: 'numeric', month: 'long', year: 'numeric' })}.` : ''}`}
        >
          {POLICIES.map(([key, text, hint]) => (
            <div key={key} className="flex flex-col gap-2">
              <label htmlFor={`s-${key}`} className={label}>
                {text}
              </label>
              <AutoTextarea
                id={`s-${key}`}
                minRows={4}
                value={form.policies[key]}
                placeholder={hint}
                onChange={(event) => {
                  const value = event.target.value
                  setForm((current) => ({ ...current, policies: { ...current.policies, [key]: value } }))
                  setNotice('')
                }}
              />
            </div>
          ))}
        </Card>

        <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-3 border-t border-[#E4DCCF] bg-soma-paper/95 px-1 py-3 backdrop-blur">
          <button type="submit" className={button.primary}>
            Save settings
          </button>
          {dirty ? <span className="text-[0.8125rem] font-semibold text-[#6B5326]">Unsaved changes</span> : null}
          {notice ? (
            <span role="status" className="text-[0.8125rem] text-soma-moss">
              {notice}
            </span>
          ) : null}
          {Object.keys(errors).length ? (
            <span role="alert" className="text-[0.8125rem] font-medium text-[#8E3519]">
              Some settings need a look.
            </span>
          ) : null}
        </div>
      </form>

      <YourData />

      <Card id="activity" title="Recent activity" intro="What has changed here, newest first.">
        {data.activity.length ? (
          <ol className="flex flex-col divide-y divide-[#EDE6DA] text-[0.875rem]">
            {data.activity.slice(0, 25).map((entry) => (
              <li key={entry.id} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2.5">
                <span>{entry.text}</span>
                <span className="text-[0.8125rem] text-soma-clay-deep">{timeAgo(entry.at)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[0.875rem] text-soma-clay-deep">Nothing yet. Changes you make show here.</p>
        )}
      </Card>
    </div>
  )
}
