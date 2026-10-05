import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { site } from '../../content/site'
import { EASE } from '../../lib/motion'

const FOCUSES = [
  { id: 'somatics', label: 'Clinical Somatics', note: 'Release chronic pain and holding patterns' },
  { id: 'taichi', label: 'Tai Chi', note: 'Rooted balance, circular flow and quiet focus' },
  { id: 'creative', label: 'Creative Movement', note: 'Dance-based freedom and emotional aliveness' },
  { id: 'exploratory', label: 'Not sure yet', note: 'Let Kirti recommend a way in based on your body' },
]

const FORMATS = [
  { id: 'private', label: 'Private session', time: '60 to 75 minutes', setting: 'Online or in person' },
  { id: 'group', label: 'Small group class', time: '60 minutes', setting: 'Weekly schedule' },
]

const TIMES = ['Weekday morning', 'Weekday evening', 'Saturday morning']

export default function ConsultationBuilder() {
  const [focus, setFocus] = useState('somatics')
  const [format, setFormat] = useState('private')
  const [time, setTime] = useState('Weekday morning')
  const reduce = useReducedMotion()

  const selectedFocus = FOCUSES.find((f) => f.id === focus) || FOCUSES[0]
  const selectedFormat = FORMATS.find((f) => f.id === format) || FORMATS[0]

  // Pre-composed thoughtful consultation email message
  const subject = `Consultation request: ${selectedFocus.label} (${selectedFormat.label})`
  const bodyText = `Hello Kirti,\n\nI would like to request a consultation with you for ${selectedFocus.label}.\n\nPreferred format: ${selectedFormat.label} (${selectedFormat.time})\nPreferred timing: ${time}\n\nA few notes on what my body is experiencing:\n[Please share a few lines here]\n\nWarmly,`
  const mailtoLink = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`

  return (
    <div className="border border-soma-sand bg-soma-paper p-8 sm:p-10">
      <div className="border-b border-soma-sand/80 pb-6">
        <p className="font-sans text-label font-medium tracking-[0.16em] text-soma-moss uppercase">
          Consultation Builder
        </p>
        <h3 className="mt-2 font-display text-[1.75rem] leading-[1.2] text-soma-ink">
          Tailor your inquiry
        </h3>
        <p className="mt-2 text-[0.875rem] text-soma-clay-deep">
          Choose what your body needs today. Your selections will be placed in a prepared message to Kirti.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Step 1: Practice focus */}
        <div>
          <label className="block font-sans text-label font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
            1. Focus of practice
          </label>
          <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
            {FOCUSES.map((item) => {
              const active = focus === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFocus(item.id)}
                  className={`flex flex-col rounded-[2px] border p-3.5 text-left transition-colors duration-500 ease-soma ${
                    active
                      ? 'border-soma-moss bg-soma-linen/70 text-soma-ink'
                      : 'border-soma-sand bg-transparent text-soma-ink/80 hover:border-soma-ink/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[1.125rem] font-medium">{item.label}</span>
                    {active ? <CheckIcon size={14} className="text-soma-moss" weight="bold" /> : null}
                  </div>
                  <span className="mt-1 text-[0.8125rem] text-soma-clay-deep">{item.note}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Format */}
        <div>
          <label className="block font-sans text-label font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
            2. Session format
          </label>
          <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
            {FORMATS.map((item) => {
              const active = format === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormat(item.id)}
                  className={`flex flex-col rounded-[2px] border p-3.5 text-left transition-colors duration-500 ease-soma ${
                    active
                      ? 'border-soma-moss bg-soma-linen/70 text-soma-ink'
                      : 'border-soma-sand bg-transparent text-soma-ink/80 hover:border-soma-ink/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[1.125rem] font-medium">{item.label}</span>
                    <span className="text-[0.75rem] text-soma-clay-deep">{item.time}</span>
                  </div>
                  <span className="mt-1 text-[0.8125rem] text-soma-clay-deep">{item.setting}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 3: Preferred time */}
        <div>
          <label className="block font-sans text-label font-medium tracking-[0.14em] text-soma-clay-deep uppercase">
            3. Preferred timing
          </label>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {TIMES.map((item) => {
              const active = time === item
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTime(item)}
                  className={`rounded-[2px] border px-4 py-2 text-[0.8125rem] transition-colors duration-500 ease-soma ${
                    active
                      ? 'border-soma-moss bg-soma-moss text-soma-paper'
                      : 'border-soma-sand bg-transparent text-soma-ink hover:border-soma-ink'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        {/* Prepared request action */}
        <div className="border-t border-soma-sand/80 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-[1.125rem] leading-[1.3] text-soma-ink">
                Ready to send to Kirti
              </p>
              <p className="text-[0.8125rem] text-soma-clay-deep">
                {selectedFocus.label} / {selectedFormat.label} / {time}
              </p>
            </div>

            <motion.a
              href={mailtoLink}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              className="inline-flex h-11 items-center justify-center gap-2.5 rounded-[2px] bg-soma-moss px-7 text-[0.8125rem] font-medium text-soma-paper transition-colors duration-500 ease-soma hover:bg-soma-moss-light"
            >
              <span>Write to book</span>
              <ArrowRightIcon size={14} weight="light" />
            </motion.a>
          </div>

          <p className="mt-5 text-[0.75rem] leading-[1.65] text-soma-clay-deep">
            Sends directly to {site.email}. Kirti personally replies within 24 to 48 hours to confirm slot availability.
          </p>
        </div>
      </div>
    </div>
  )
}
