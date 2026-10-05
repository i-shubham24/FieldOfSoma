import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import { contact } from '../content/contact'
import { sendMessage } from '../lib/contact'
import { PAGE_TOP } from '../lib/layout'
import { isEmail } from '../lib/newsletter'
import useTitle from '../lib/useTitle'

const EMPTY = { name: '', email: '', practice: contact.form.practice.options[0], message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = contact.form.name.error
  if (!isEmail(values.email)) errors.email = contact.form.email.error
  if (!values.message.trim()) errors.message = contact.form.message.error
  return errors
}

function MessageForm() {
  const { form } = contact
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('query') || searchParams.get('message') || ''
  const initialPractice = searchParams.get('practice') || contact.form.practice.options[0]

  const [values, setValues] = useState(() => ({
    ...EMPTY,
    message: initialQuery,
    practice: contact.form.practice.options.includes(initialPractice)
      ? initialPractice
      : contact.form.practice.options[0],
  }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const thanks = useRef(null)

  // Once sent, bring the confirmation into view and tell assistive technology.
  useEffect(() => {
    if (status !== 'done') return
    thanks.current?.focus({ preventScroll: true })
    thanks.current?.scrollIntoView({ block: 'center' })
  }, [status])

  // Sync if query parameter changes while on page
  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('message')
    if (q) {
      setValues((current) => ({ ...current, message: q }))
    }
  }, [searchParams])

  const set = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Send focus to the first field that needs attention.
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }
    setStatus('sending')
    await sendMessage(values)
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div ref={thanks} tabIndex={-1} role="status" className="min-h-[28rem] outline-none">
        <p className="font-display text-heading italic">{form.success.heading}</p>
        <p className="mt-5 max-w-[36ch] text-lede font-light text-soma-ink/80">
          {form.success.body}
        </p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-9">
      <div className="grid gap-9 sm:grid-cols-2 sm:gap-8">
        <Field
          id="name"
          label={form.name.label}
          autoComplete="name"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
        />
        <Field
          id="email"
          type="email"
          label={form.email.label}
          autoComplete="email"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
        />
      </div>
      <Field
        id="practice"
        as="select"
        label={form.practice.label}
        value={values.practice}
        onChange={set('practice')}
      >
        {form.practice.options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </Field>
      <Field
        id="message"
        as="textarea"
        label={form.message.label}
        hint={form.message.hint}
        value={values.message}
        onChange={set('message')}
        error={errors.message}
      />
      <Button type="submit" arrow disabled={status === 'sending'}>
        {status === 'sending' ? form.sending : form.submit}
      </Button>
    </form>
  )
}

export default function Contact() {
  useTitle('Contact')
  const { label, headline, lede, image } = contact.intro

  return (
    <section className={`${PAGE_TOP} pb-28 md:pb-40`}>
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
              {label}
            </Reveal>
            <RevealLines as="h1" lines={headline} delay={0.1} className="mt-7 text-display" />
            <Reveal
              as="p"
              delay={0.4}
              className="mt-8 max-w-[38ch] text-lede font-light text-soma-ink/80"
            >
              {lede}
            </Reveal>

            <Reveal as="dl" delay={0.5} className="mt-12 border-t border-soma-sand">
              {contact.details.map((detail) => (
                <div
                  key={detail.term}
                  className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-soma-sand py-4"
                >
                  <dt className="text-label font-medium text-soma-clay-deep uppercase">
                    {detail.term}
                  </dt>
                  <dd className="text-[0.9375rem] text-soma-ink/85">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="link-rest pb-0.5"
                        {...(detail.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </Reveal>

            <Frame
              image={image}
              ratio="aspect-[3/2]"
              sizes="(min-width: 1024px) 30rem, 100vw"
              drift
              className="mt-14 hidden lg:block"
            />
          </div>

          <Reveal delay={0.3} className="lg:col-span-6 lg:col-start-7 lg:pt-[4.25rem]">
            <MessageForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
