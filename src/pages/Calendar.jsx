import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import Frame from '../components/media/Frame'
import Reveal from '../components/motion/Reveal'
import RevealLines from '../components/motion/RevealLines'
import Button from '../components/ui/Button'
import DraftNote from '../components/ui/DraftNote'
import TextLink from '../components/ui/TextLink'
import ConsultationBuilder from '../components/interactive/ConsultationBuilder'
import { calendar } from '../content/calendar'
import { site } from '../content/site'
import { sendMessage } from '../lib/contact'
import { PAGE_TOP } from '../lib/layout'
import { useDragScroll } from '../lib/useDragScroll'
import useTitle from '../lib/useTitle'

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

function BookingModal({ config, onClose }) {
  const isPrivate = typeof config === 'string' ? config === 'private' : config?.type === 'private'
  const initialClass = typeof config === 'object' ? config?.classTitle : null

  const [focus, setFocus] = useState('somatics')
  const [selectedClass, setSelectedClass] = useState(initialClass || 'Somatic Movement')
  const [format, setFormat] = useState('in-person')
  const [timing, setTiming] = useState('Weekday morning')
  const [groupType, setGroupType] = useState('drop-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const scrollRef = useDragScroll()

  useEffect(() => {
    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.__lenis?.start()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!name.trim()) errs.name = 'Please enter your name'
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('submitting')
    await sendMessage({
      type: isPrivate ? 'Private Session' : 'Weekly Group Class',
      focus: isPrivate ? focus : selectedClass,
      format: isPrivate ? format : groupType,
      timing,
      name,
      email,
      notes,
    })
    setStatus('done')
  }

  const handleJumpToBuilder = () => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById('consultation')
      el?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-soma-ink/50 backdrop-blur-xs"
      />

      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto overscroll-contain border border-soma-sand bg-soma-paper p-6 sm:p-8 shadow-2xl touch-pan-y"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-soma-sand/70 pb-5">
          <div>
            <span className="text-[0.6875rem] font-medium uppercase tracking-widest text-soma-moss">
              {isPrivate ? 'One-to-One Work' : 'Weekly Cohort'}
            </span>
            <h2 className="mt-1 font-display text-[1.75rem] leading-[1.2] text-soma-ink">
              {isPrivate ? 'Request a Private Session' : 'Join a Weekly Class'}
            </h2>
            <p className="mt-1.5 text-xs text-soma-clay-deep">
              {isPrivate
                ? '60 to 75 minutes • In person or online • Guided by Kirti'
                : '60 minutes • Small groups • Progressively taught'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 text-soma-clay-deep transition-colors hover:text-soma-ink"
            aria-label="Close dialog"
          >
            <XIcon size={20} />
          </button>
        </div>

        {status === 'done' ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-soma-moss/10 text-soma-moss mb-5">
              <CheckIcon size={28} weight="bold" />
            </div>
            <h3 className="font-display text-2xl text-soma-ink">
              Request Received
            </h3>
            <p className="mt-3 text-sm text-soma-clay-deep leading-relaxed max-w-[42ch] mx-auto font-light">
              Thank you, <span className="font-medium text-soma-ink">{name}</span>. Your request has been sent to Kirti. You will receive a personal confirmation at{' '}
              <span className="font-medium text-soma-ink">{email}</span> within 24 to 48 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 cursor-pointer bg-soma-moss px-7 py-3 text-xs font-medium uppercase tracking-wider text-soma-paper transition-colors hover:bg-soma-moss-light"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {isPrivate ? (
              <>
                <div>
                  <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-2.5">
                    Practice Focus
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'somatics', label: 'Clinical Somatics' },
                      { id: 'taichi', label: 'Tai Chi Flow' },
                      { id: 'creative', label: 'Creative Movement' },
                      { id: 'exploratory', label: 'Not Sure Yet' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFocus(opt.id)}
                        className={`cursor-pointer border p-2.5 text-left text-xs transition-colors ${
                          focus === opt.id
                            ? 'border-soma-moss bg-soma-linen text-soma-ink font-medium'
                            : 'border-soma-sand bg-transparent text-soma-ink/80 hover:border-soma-ink/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-2">
                      Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full border border-soma-sand bg-transparent px-3 py-2.5 text-xs text-soma-ink focus:border-soma-moss focus:outline-none"
                    >
                      <option value="in-person">In person (Studio)</option>
                      <option value="online">Live Online (Zoom)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-2">
                      Preferred Time
                    </label>
                    <select
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      className="w-full border border-soma-sand bg-transparent px-3 py-2.5 text-xs text-soma-ink focus:border-soma-moss focus:outline-none"
                    >
                      <option value="Weekday morning">Weekday morning</option>
                      <option value="Weekday evening">Weekday evening</option>
                      <option value="Saturday morning">Saturday morning</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-2.5">
                    Select Group Class
                  </label>
                  <div className="space-y-2">
                    {[
                      { title: 'Somatic Movement', meta: 'Monday 7:00 am • Online' },
                      { title: 'Tai Chi', meta: 'Wednesday 6:30 pm • In person' },
                      { title: 'Tai Chi (Online)', meta: 'Friday 7:00 am • Online' },
                      { title: 'Creative Movement', meta: 'Saturday 10:00 am • In person, monthly' },
                    ].map((cls) => (
                      <button
                        key={cls.title}
                        type="button"
                        onClick={() => setSelectedClass(cls.title)}
                        className={`w-full cursor-pointer flex items-center justify-between border p-3 text-left text-xs transition-colors ${
                          selectedClass === cls.title
                            ? 'border-soma-moss bg-soma-linen text-soma-ink font-medium'
                            : 'border-soma-sand bg-transparent text-soma-ink/80 hover:border-soma-ink/50'
                        }`}
                      >
                        <span className="font-display text-sm">{cls.title}</span>
                        <span className="text-[0.6875rem] text-soma-clay-deep">{cls.meta}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-2">
                    Attendance Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGroupType('drop-in')}
                      className={`cursor-pointer border p-2.5 text-center text-xs transition-colors ${
                        groupType === 'drop-in'
                          ? 'border-soma-moss bg-soma-linen text-soma-ink font-medium'
                          : 'border-soma-sand bg-transparent text-soma-ink/80 hover:border-soma-ink/50'
                      }`}
                    >
                      Single Drop-in
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupType('term')}
                      className={`cursor-pointer border p-2.5 text-center text-xs transition-colors ${
                        groupType === 'term'
                          ? 'border-soma-moss bg-soma-linen text-soma-ink font-medium'
                          : 'border-soma-sand bg-transparent text-soma-ink/80 hover:border-soma-ink/50'
                      }`}
                    >
                      Full Term Series
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-soma-sand bg-transparent px-3 py-2.5 text-xs text-soma-ink placeholder:text-soma-clay-deep/60 focus:border-soma-moss focus:outline-none"
                />
                {errors.name ? (
                  <p className="mt-1 text-[0.6875rem] text-red-700">{errors.name}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full border border-soma-sand bg-transparent px-3 py-2.5 text-xs text-soma-ink placeholder:text-soma-clay-deep/60 focus:border-soma-moss focus:outline-none"
                />
                {errors.email ? (
                  <p className="mt-1 text-[0.6875rem] text-red-700">{errors.email}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-[0.6875rem] font-medium uppercase tracking-wider text-soma-clay-deep mb-1.5">
                Notes on your body (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any areas of tension, previous injuries, or what you hope to explore..."
                className="w-full border border-soma-sand bg-transparent px-3 py-2 text-xs text-soma-ink placeholder:text-soma-clay-deep/60 focus:border-soma-moss focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 border-t border-soma-sand/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={handleJumpToBuilder}
                className="cursor-pointer text-[0.6875rem] text-soma-clay-deep underline hover:text-soma-ink text-left"
              >
                Or customize via Consultation Builder below &darr;
              </button>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="cursor-pointer bg-soma-moss px-7 py-3 text-xs font-medium uppercase tracking-wider text-soma-paper transition-colors hover:bg-soma-moss-light disabled:opacity-50"
              >
                {status === 'submitting'
                  ? 'Submitting...'
                  : isPrivate
                  ? 'Send Session Request'
                  : 'Join Class Request'}
              </button>
            </div>
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
              <TextLink
                onClick={() => onSelectPath(path.id)}
                className="mt-10 cursor-pointer"
              >
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
                key={`${row.day}-${row.title}`}
                delay={i * 0.05}
                className="grid grid-cols-2 gap-x-6 gap-y-1 border-b border-soma-ink/15 py-6 sm:grid-cols-12 sm:items-baseline"
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
                <p className="text-left text-[0.875rem] text-soma-clay-deep sm:col-span-2">
                  {row.format}
                </p>
                <div className="col-span-2 sm:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectClass(row.title)}
                    className="cursor-pointer text-[0.75rem] font-medium uppercase tracking-wider text-soma-moss underline hover:text-soma-ink transition-colors"
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
  const { heading, body, image } = calendar.request

  return (
    <section id="consultation" className="py-28 md:py-40">
      <div className="shell">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal as="h2" className="text-heading">
                {heading}
              </Reveal>
              <Reveal
                as="p"
                delay={0.08}
                className="mt-6 max-w-[42ch] text-lede font-light text-soma-ink/80"
              >
                {body}
              </Reveal>
              <Frame
                image={image}
                ratio="aspect-[3/2]"
                sizes="(min-width: 1024px) 30rem, 100vw"
                drift
                unveil
                className="mt-12 hidden lg:block"
              />
            </div>
            <div className="lg:col-span-7">
              <ConsultationBuilder />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Calendar() {
  useTitle('Calendar and Booking')
  const [activeBooking, setActiveBooking] = useState(null)

  return (
    <>
      <Intro />
      <Paths onSelectPath={(pathId) => setActiveBooking(pathId)} />
      <Week onSelectClass={(classTitle) => setActiveBooking({ type: 'group', classTitle })} />
      <Request />

      <AnimatePresence>
        {activeBooking ? (
          <BookingModal
            config={activeBooking}
            onClose={() => setActiveBooking(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
