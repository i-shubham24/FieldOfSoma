import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Button from '../components/ui/Button'
import DraftNote from '../components/ui/DraftNote'
import Field from '../components/ui/Field'
import SendFallback from '../components/ui/SendFallback'
import TextLink from '../components/ui/TextLink'
import ConsultationBuilder from '../components/interactive/ConsultationBuilder'
import { calendar } from '../content/calendar'
import { isEmail, sendForm } from '../lib/forms'
import { PAGE_TOP } from '../lib/layout'
import { EASE } from '../lib/motion'
import useDialog from '../lib/useDialog'
import useTitle from '../lib/useTitle'
import Honeypot from '../components/ui/Honeypot'
import { pages } from '../content/seo'

// Kirti's Cal.com or Calendly link, set in Vercel. See content/calendar.js.
const BOOKING_URL = import.meta.env.VITE_BOOKING_URL

const classLabel = (row) => `${row.title}, ${row.day} ${row.time} (${row.format})`

function Intro() {
  const { label, headline, lede } = calendar.intro

  return (
    <section className={PAGE_TOP}>
      <div className="shell text-center">
        <Reveal as="p" className="text-label font-medium text-soma-clay-deep uppercase">
          {label}
        </Reveal>
        <RevealLines as="h1" lines={headline} delay={0.1} className="mt-7 text-display" />
        <Reveal
          as="p"
          delay={0.4}
          className="mx-auto mt-8 max-w-[48ch] text-lede font-light text-soma-ink/80"
        >
          {lede}
        </Reveal>
      </div>
    </section>
  )
}

function BookingModal({ request, onClose }) {
  const { form, schedule } = calendar
  const isPrivate = request.type === 'private'
  const copy = isPrivate ? form.private : form.group
  const ref = useRef(null)
  const reduce = useReducedMotion()
  useDialog(ref, onClose)

  const [values, setValues] = useState({
    focus: form.private.focusOptions[0],
    format: form.private.formatOptions[0],
    time: form.timeOptions[0],
    class: request.classLabel ?? classLabel(schedule.rows[0]),
    name: '',
    email: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | fallback
  const [fallback, setFallback] = useState(null)

  const set = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const found = {}
    if (!values.name.trim()) found.name = 'Please add your name.'
    if (!isEmail(values.email)) found.email = 'Please enter a valid email address.'
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`booking-${Object.keys(found)[0]}`)?.focus()
      return
    }

    setStatus('sending')
    const fields = isPrivate
      ? {
          request: 'Private session',
          practice: values.focus,
          format: values.format,
          preferredTime: values.time,
        }
      : { request: 'Join a weekly class', class: values.class }
    const result = await sendForm(copy.heading, {
      ...fields,
      name: values.name.trim(),
      email: values.email.trim(),
      notes: values.notes.trim(),
    })
    if (result.ok) {
      setStatus('done')
    } else {
      setFallback(result)
      setStatus('fallback')
    }
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-soma-ink/50"
        aria-hidden="true"
      />

      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: EASE }}
        data-lenis-prevent
        className="relative z-10 max-h-[92dvh] w-full max-w-xl overflow-y-auto overscroll-contain border border-soma-sand bg-soma-paper px-6 pt-6 pb-8 outline-none sm:p-9"
      >
        <div className="flex items-start justify-between gap-4 border-b border-soma-sand pb-5">
          <div>
            <p className="text-label font-medium text-soma-moss uppercase">{copy.label}</p>
            <h2 id="booking-title" className="mt-2 font-display text-[1.75rem] leading-[1.2]">
              {copy.heading}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mt-2 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-soma-clay-deep transition-colors hover:text-soma-ink"
            aria-label="Close"
          >
            <XIcon size={20} aria-hidden="true" />
          </button>
        </div>

        {status === 'done' ? (
          <div role="status" className="py-10">
            <p className="font-display text-heading italic">{form.success.heading}</p>
            <p className="mt-4 max-w-[38ch] text-lede font-light text-soma-ink/80">
              {form.success.body}
            </p>
            <Button variant="outline" size="sm" className="mt-8" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : status === 'fallback' ? (
          <SendFallback mailto={fallback.mailto} gmail={fallback.gmail} className="py-8" />
        ) : (
          <form noValidate onSubmit={onSubmit} className="mt-8 space-y-8">
            <Honeypot />
            {isPrivate ? (
              <>
                <Field id="booking-focus" as="select" label="Practice" value={values.focus} onChange={set('focus')}>
                  {form.private.focusOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </Field>
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field id="booking-format" as="select" label="In person or online" value={values.format} onChange={set('format')}>
                    {form.private.formatOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Field>
                  <Field id="booking-time" as="select" label="Best time" value={values.time} onChange={set('time')}>
                    {form.timeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Field>
                </div>
              </>
            ) : (
              <Field id="booking-class" as="select" label="Class" value={values.class} onChange={set('class')}>
                {schedule.rows.map((row) => (
                  <option key={row.id}>{classLabel(row)}</option>
                ))}
              </Field>
            )}

            <div className="grid gap-8 sm:grid-cols-2">
              <Field
                id="booking-name"
                label="Full name"
                autoComplete="name"
                value={values.name}
                onChange={set('name')}
                error={errors.name}
              />
              <Field
                id="booking-email"
                type="email"
                label="Email"
                autoComplete="email"
                value={values.email}
                onChange={set('email')}
                error={errors.email}
              />
            </div>

            <Field
              id="booking-notes"
              as="textarea"
              label="Anything Kirti should know (optional)"
              hint="Old injuries, areas of tension, or what you hope for."
              value={values.notes}
              onChange={set('notes')}
            />

            <Button type="submit" arrow disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending' : copy.submit}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

function Paths({ onSelectPath }) {
  return (
    <section className="py-24 md:py-32">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl border-t border-soma-sand lg:grid-cols-2">
          {calendar.paths.map((path, i) => (
            <Reveal
              key={path.id}
              delay={i * 0.1}
              className={`py-14 lg:py-20 ${
                i === 0
                  ? 'border-b border-soma-sand lg:border-r lg:border-b-0 lg:pr-16'
                  : 'lg:pl-16'
              }`}
            >
              <h2 className="text-heading">{path.title}</h2>
              <p className="mt-4 text-[0.875rem] text-soma-clay-deep">{path.meta.join(' / ')}</p>
              <p className="mt-8 max-w-[44ch] text-lede font-light text-soma-ink/80">{path.body}</p>
              <ul className="mt-8 space-y-2.5 text-[0.9375rem] leading-[1.7] text-soma-ink/85">
                {path.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <TextLink onClick={() => onSelectPath(path.id)} className="mt-10 cursor-pointer">
                {path.cta}
              </TextLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Week({ onSelectClass }) {
  const { heading, rows, note, placeholder } = calendar.schedule

  return (
    <section className="bg-soma-linen py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Reveal as="h2" className="text-heading">
              {heading}
            </Reveal>
            {placeholder ? <DraftNote className="mt-5">{note}</DraftNote> : null}
          </div>
          <ul className="border-t border-soma-ink/15 lg:col-span-8 lg:col-start-5">
            {rows.map((row, i) => (
              <Reveal
                as="li"
                key={row.id}
                delay={i * 0.05}
                className="grid grid-cols-2 items-baseline gap-x-6 gap-y-1 border-b border-soma-ink/15 py-6 sm:grid-cols-12"
              >
                <p className="font-display text-[1.5rem] leading-[1.2] font-medium sm:col-span-3">
                  {row.day}
                </p>
                <p className="text-right text-[0.9375rem] text-soma-ink/80 tabular-nums sm:col-span-2 sm:text-left">
                  {row.time}
                </p>
                <p className="font-display text-[1.375rem] leading-[1.25] text-soma-moss italic sm:col-span-4">
                  {row.title}
                </p>
                <p className="text-right text-[0.875rem] text-soma-clay-deep sm:col-span-2 sm:text-left">
                  {row.format}
                </p>
                <div className="col-span-2 text-right sm:col-span-1">
                  <button
                    type="button"
                    onClick={() => onSelectClass(classLabel(row))}
                    aria-label={`Ask to join ${row.title} on ${row.day}`}
                    className="tap-area link-rest -mr-2 min-h-11 cursor-pointer px-2 text-[0.875rem] font-medium text-soma-moss transition-colors hover:text-soma-ink"
                  >
                    Join
                  </button>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Request() {
  const { heading, body, bookingBody, image } = calendar.request

  return (
    <section id="consultation" className="scroll-mt-24 py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <Reveal as="h2" className="text-heading">
              {heading}
            </Reveal>
            <Reveal
              as="p"
              delay={0.08}
              className="mt-6 max-w-[42ch] text-lede font-light text-soma-ink/80"
            >
              {BOOKING_URL ? bookingBody : body}
            </Reveal>
            <Frame
              image={image}
              ratio="aspect-[3/2]"
              sizes="(min-width: 1024px) 30rem, 100vw"
              unveil
              className="mt-12 hidden lg:block"
            />
          </div>
          <div className="lg:col-span-7">
            {BOOKING_URL ? (
              <iframe
                src={BOOKING_URL}
                title="Book a time with Kirti Verma"
                loading="lazy"
                className="h-[44rem] w-full border border-soma-sand bg-soma-paper"
              />
            ) : (
              <ConsultationBuilder />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Calendar() {
  useTitle({
    ...pages.calendar,
  })
  const [request, setRequest] = useState(null)

  return (
    <>
      <Intro />
      <Paths onSelectPath={(type) => setRequest({ type })} />
      <Week onSelectClass={(label) => setRequest({ type: 'group', classLabel: label })} />
      <Request />

      <AnimatePresence>
        {request ? <BookingModal request={request} onClose={() => setRequest(null)} /> : null}
      </AnimatePresence>
    </>
  )
}
