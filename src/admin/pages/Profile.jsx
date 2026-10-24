import { useState } from 'react'
import { LockIcon } from '@phosphor-icons/react/dist/csr/Lock'
import PhotoPicker from '../PhotoPicker'
import { ADMIN_EMAIL } from '../sampleData'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AutoTextarea, button, field, FieldError, label, Notice, PageHeader, panel, SampleNote } from '../ui'
import { isEmail, isWebLink } from '../util'

function Field({ id, text, hint, error, children }) {
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

export default function Profile() {
  useAdminTitle('Profile')
  const { data, setValue, log } = useAdminData()
  const [form, setForm] = useState(data.profile)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const dirty = JSON.stringify(form) !== JSON.stringify(data.profile)

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setNotice('')
  }

  const save = (event) => {
    event.preventDefault()
    const found = {}
    if (!form.name.trim()) found.name = 'Add your name.'
    if (!isEmail(form.email)) found.email = 'This does not look like an email address.'
    if (form.whatsapp && form.whatsapp.replace(/\D/g, '').length < 10) found.whatsapp = 'Add the full number, with the country code.'
    if (form.instagram && !isWebLink(form.instagram)) found.instagram = 'Paste the full link, starting with https://'
    setErrors(found)
    if (Object.keys(found).length) return
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]))
    setValue('profile', clean)
    setForm(clean)
    log('Updated your profile')
    setNotice('Saved. Your name and photo update across the admin straight away.')
  }

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-6">
      <PageHeader title="Profile" intro="How you appear on the site, and the details people use to reach you.">
        <SampleNote />
        <button type="submit" className={button.primary}>
          Save changes
        </button>
      </PageHeader>

      {notice ? <Notice>{notice}</Notice> : null}
      {dirty && !notice ? <Notice tone="sand">You have unsaved changes.</Notice> : null}

      <div className="flex flex-wrap items-start gap-5">
        <section className={`${panel} flex min-w-0 flex-[2_1_520px] flex-col gap-5 p-5 sm:p-7`} aria-labelledby="about-you">
          <h2 id="about-you" className="text-[1rem] font-semibold">
            About you
          </h2>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <Field id="p-name" text="Name" error={errors.name}>
              <input id="p-name" value={form.name} onChange={set('name')} autoComplete="name" className={`${field} h-11`} />
            </Field>
            <Field id="p-role" text="What you do" hint="The line under your name on the About page.">
              <input id="p-role" value={form.role} onChange={set('role')} className={`${field} h-11`} />
            </Field>
          </div>
          <Field id="p-bio" text="Short bio" hint="A few sentences, in your own words.">
            <AutoTextarea id="p-bio" minRows={4} value={form.bio} onChange={set('bio')} />
          </Field>
          <Field id="p-location" text="Where you teach">
            <input id="p-location" value={form.location} onChange={set('location')} className={`${field} h-11`} />
          </Field>

          <h2 className="mt-2 border-t border-[#EDE6DA] pt-5 text-[1rem] font-semibold">How people reach you</h2>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <Field id="p-email" text="Email on the site" error={errors.email} hint="Where messages from the contact form go.">
              <input id="p-email" type="email" value={form.email} onChange={set('email')} className={`${field} h-11`} />
            </Field>
            <Field id="p-whatsapp" text="WhatsApp" error={errors.whatsapp}>
              <input id="p-whatsapp" type="tel" value={form.whatsapp} onChange={set('whatsapp')} className={`${field} h-11`} />
            </Field>
          </div>
          <Field id="p-instagram" text="Instagram link" error={errors.instagram}>
            <input id="p-instagram" type="url" value={form.instagram} onChange={set('instagram')} className={`${field} h-11`} />
          </Field>
        </section>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
          <section className={`${panel} flex flex-col gap-4 p-5 sm:p-6`} aria-labelledby="your-photo">
            <h2 id="your-photo" className="text-[1rem] font-semibold">
              Your photo
            </h2>
            <PhotoPicker
              value={form.photoId}
              round
              allowRemove={false}
              onChange={(photoId) => {
                setForm((current) => ({ ...current, photoId }))
                setNotice('')
              }}
            />
          </section>

          <section className={`${panel} flex flex-col gap-3 p-5 sm:p-6`} aria-labelledby="sign-in">
            <h2 id="sign-in" className="flex items-center gap-2 text-[1rem] font-semibold">
              <LockIcon size={17} aria-hidden="true" />
              Signing in
            </h2>
            <dl className="text-[0.875rem]">
              <dt className="text-soma-clay-deep">Sign-in email</dt>
              <dd className="font-medium break-all">{ADMIN_EMAIL}</dd>
            </dl>
            <p className="text-[0.8125rem] leading-relaxed text-[#5E5045]">
              Your password is set when sign-in goes live. Each time you sign in, a 6-digit code is also emailed to you, so
              nobody else can get in even if they guess the password. Never share it in a message or email.
            </p>
            <button type="button" disabled className={`${button.outline} self-start`}>
              Change password
            </button>
            <p className="text-[0.75rem] text-soma-clay-deep">Available once sign-in is connected.</p>
          </section>
        </div>
      </div>
    </form>
  )
}
