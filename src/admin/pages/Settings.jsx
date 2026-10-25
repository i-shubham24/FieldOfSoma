import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple'
import PhotoPicker from '../PhotoPicker'
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

function ProfileField({ id, text, hint, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children}
      {hint ? <p className="text-[0.75rem] text-soma-clay-deep">{hint}</p> : null}
      <FieldError>{error}</FieldError>
    </div>
  )
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
            setNotice('Back to sample data. Uploaded files were reset in this browser.')
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

  const [profileForm, setProfileForm] = useState(data.profile)
  const [settingsForm, setSettingsForm] = useState(data.settings)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  // After "Reset sample data" the forms start again from the fresh values
  useEffect(() => {
    setProfileForm(data.profile)
    setSettingsForm(data.settings)
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.seededAt])

  // Links like /admin/settings#booking open at that section
  useEffect(() => {
    if (!location.hash) return undefined
    const timer = setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    return () => clearTimeout(timer)
  }, [location.hash])

  const setProfile = (key) => (event) => {
    setProfileForm((current) => ({ ...current, [key]: event.target.value }))
    setNotice('')
  }

  const setSettings = (key) => (event) => {
    setSettingsForm((current) => ({ ...current, [key]: event.target.value }))
    setNotice('')
  }

  const sections = ['bookingUrl', 'notifyEmail', 'notify', 'policies']
  const settingsDirty = sections.some((key) => JSON.stringify(settingsForm[key]) !== JSON.stringify(data.settings[key]))
  const profileDirty = JSON.stringify(profileForm) !== JSON.stringify(data.profile)
  const isDirty = settingsDirty || profileDirty

  const save = (event) => {
    event.preventDefault()
    const found = {}

    // Profile validations
    if (!profileForm.name.trim()) found.name = 'Add your name.'
    if (!isEmail(profileForm.email)) found.email = 'This does not look like an email address.'
    if (profileForm.whatsapp && profileForm.whatsapp.replace(/\D/g, '').length < 10) found.whatsapp = 'Add the full number, with the country code.'
    if (profileForm.instagram && !isWebLink(profileForm.instagram)) found.instagram = 'Paste the full link, starting with https://'

    // Settings validations
    if (settingsForm.bookingUrl.trim() && !isWebLink(settingsForm.bookingUrl)) found.bookingUrl = 'Paste the full link, starting with https://'
    if (!isEmail(settingsForm.notifyEmail)) found.notifyEmail = 'Add the email that should get notifications.'

    setErrors(found)
    if (Object.keys(found).length) {
      setNotice('')
      return
    }

    // Save profile
    const cleanProfile = Object.fromEntries(Object.entries(profileForm).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]))
    setValue('profile', cleanProfile)
    setProfileForm(cleanProfile)

    // Save settings
    const policiesChanged = JSON.stringify(settingsForm.policies) !== JSON.stringify(data.settings.policies)
    setValue('settings', (current) => ({
      ...current,
      ...Object.fromEntries(sections.map((key) => [key, settingsForm[key]])),
      bookingUrl: settingsForm.bookingUrl.trim(),
      policiesUpdated: policiesChanged ? todayIso() : current.policiesUpdated,
    }))
    setSettingsForm((current) => ({ ...current, bookingUrl: current.bookingUrl.trim() }))

    log('Saved settings and profile')
    setNotice('Saved. Your details and settings are updated across the admin.')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings and Profile" intro="Your bio, contact channels, payments, bookings, and policies.">
        <SampleNote />
      </PageHeader>

      <form onSubmit={save} noValidate className="flex flex-col gap-6">
        {/* Profile and Bio Section */}
        <Card id="profile" title="About you" intro="How you appear on the site, your photo, and your bio.">
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex min-w-0 flex-[2_1_480px] flex-col gap-5">
              <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                <ProfileField id="p-name" text="Name" error={errors.name}>
                  <input id="p-name" value={profileForm.name} onChange={setProfile('name')} autoComplete="name" className={`${field} h-11`} />
                </ProfileField>
                <ProfileField id="p-role" text="What you do" hint="The line under your name on the About page.">
                  <input id="p-role" value={profileForm.role} onChange={setProfile('role')} className={`${field} h-11`} />
                </ProfileField>
              </div>

              <ProfileField id="p-bio" text="Short bio" hint="A few sentences in your own words.">
                <AutoTextarea id="p-bio" minRows={4} value={profileForm.bio} onChange={setProfile('bio')} />
              </ProfileField>

              <ProfileField id="p-location" text="Where you teach">
                <input id="p-location" value={profileForm.location} onChange={setProfile('location')} className={`${field} h-11`} />
              </ProfileField>
            </div>

            <div className="flex flex-col gap-2.5 sm:w-56 shrink-0">
              <p className={label}>Your photo</p>
              <PhotoPicker
                value={profileForm.photoId}
                round
                allowRemove={false}
                onChange={(photoId) => {
                  setProfileForm((current) => ({ ...current, photoId }))
                  setNotice('')
                }}
              />
            </div>
          </div>

          <div className="mt-3 border-t border-[#EDE6DA] pt-5">
            <h3 className="text-[1rem] font-semibold text-soma-ink">How people reach you</h3>
            <div className="mt-4 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              <ProfileField id="p-email" text="Public email" error={errors.email} hint="Where inquiries are sent.">
                <input id="p-email" type="email" value={profileForm.email} onChange={setProfile('email')} className={`${field} h-11`} />
              </ProfileField>
              <ProfileField id="p-whatsapp" text="WhatsApp number" error={errors.whatsapp} hint="Full number with country code.">
                <input id="p-whatsapp" type="tel" value={profileForm.whatsapp} onChange={setProfile('whatsapp')} className={`${field} h-11`} />
              </ProfileField>
              <ProfileField id="p-instagram" text="Instagram link" error={errors.instagram} hint="Full URL starting with https://">
                <input id="p-instagram" type="url" value={profileForm.instagram} onChange={setProfile('instagram')} className={`${field} h-11`} />
              </ProfileField>
            </div>
          </div>
        </Card>

        {/* Payments Section */}
        <Card id="payments" title="Payments" intro="Classes are paid for through Razorpay: UPI, cards, net banking, and wallets.">
          <div className="flex flex-wrap items-center gap-2 text-[0.875rem]">
            Razorpay: {RAZORPAY_KEY ? <Status ok>Connected</Status> : <Status>Key not added yet</Status>}
          </div>
        </Card>

        {/* Online Booking Section */}
        <Card id="booking" title="Online booking" intro="A Cal.com or Calendly link lets people select a time directly on the Calendar page.">
          <div className="flex flex-wrap items-center gap-2 text-[0.875rem]">
            On the site now: {ENV_BOOKING ? <Status ok>Connected</Status> : <Tag tone="sand">Requests only</Tag>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="s-booking" className={label}>
              Booking link
            </label>
            <input id="s-booking" type="url" value={settingsForm.bookingUrl} onChange={setSettings('bookingUrl')} placeholder="https://cal.com/kirti-verma" className={`${field} h-11`} />
            <FieldError>{errors.bookingUrl}</FieldError>
          </div>
        </Card>

        {/* Notifications and Emails */}
        <Card id="email" title="Emails and notifications" intro="Where notification messages go, and what alerts you receive.">
          <div className="flex flex-wrap items-center gap-2 text-[0.875rem]">
            Contact form: {FORMS_KEY ? <Status ok>Sending</Status> : <Status>Not connected yet</Status>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="s-notify" className={label}>
              Send alerts to
            </label>
            <input id="s-notify" type="email" value={settingsForm.notifyEmail} onChange={setSettings('notifyEmail')} className={`${field} h-11`} />
            <FieldError>{errors.notifyEmail}</FieldError>
          </div>
          <fieldset className="flex flex-col gap-1">
            <legend className={`${label} mb-2`}>Email alerts for</legend>
            {NOTIFY.map(([key, text]) => (
              <div key={key} className="flex items-center gap-2.5 text-[0.9375rem]">
                <Toggle
                  checked={settingsForm.notify[key]}
                  onChange={(on) => {
                    setSettingsForm((current) => ({ ...current, notify: { ...current.notify, [key]: on } }))
                    setNotice('')
                  }}
                  label={text}
                />
                {text}
              </div>
            ))}
          </fieldset>
        </Card>

        {/* Legal Policies */}
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
                value={settingsForm.policies[key]}
                placeholder={hint}
                onChange={(event) => {
                  const value = event.target.value
                  setSettingsForm((current) => ({ ...current, policies: { ...current.policies, [key]: value } }))
                  setNotice('')
                }}
              />
            </div>
          ))}
        </Card>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-3 border-t border-[#E4DCCF] bg-soma-paper/95 px-1 py-3 backdrop-blur">
          <button type="submit" className={button.primary}>
            Save changes
          </button>
          {isDirty ? <span className="text-[0.8125rem] font-semibold text-[#6B5326]">Unsaved changes</span> : null}
          {notice ? (
            <span role="status" className="text-[0.8125rem] text-soma-moss">
              {notice}
            </span>
          ) : null}
          {Object.keys(errors).length ? (
            <span role="alert" className="text-[0.8125rem] font-medium text-[#8E3519]">
              Please check the highlighted fields above.
            </span>
          ) : null}
        </div>
      </form>

      <YourData />

      {/* Activity Log */}
      <Card id="activity" title="Recent activity" intro="Recent administrative actions, newest first.">
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
          <p className="text-[0.875rem] text-soma-clay-deep">No recorded activity yet.</p>
        )}
      </Card>
    </div>
  )
}
