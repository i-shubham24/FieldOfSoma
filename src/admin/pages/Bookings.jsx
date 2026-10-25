import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarPlusIcon } from '@phosphor-icons/react/dist/csr/CalendarPlus'
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash'
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { ADMIN_EMAIL, PRACTICES } from '../sampleData'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { button, field, FieldError, label, Notice, PageHeader, panel, SampleNote, StatCard, Tag, Toggle } from '../ui'
import { formatDate, formatTime, gmailCompose, newId, todayIso } from '../util'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const FORMATS = ['Online', 'In person', 'In person, monthly', 'Online and in person']
const PLACE_FOR = { Online: 'Online, link sent by email', 'In person': 'Studio, Dharamshala' }

const longDate = (iso) => formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long' })

function detailsEmail(session) {
  const first = session.name.split(' ')[0]
  return gmailCompose({
    from: ADMIN_EMAIL,
    to: session.email,
    subject: `Your session with Kirti on ${formatDate(session.date, { weekday: 'long', day: 'numeric', month: 'long' })}`,
    body: `Hi ${first},\n\nYour private session is booked:\n\n${longDate(session.date)}, ${formatTime(session.time)}\n${session.practice}, ${session.format.toLowerCase()}\nWhere: ${session.where}\n\nIf the time no longer works, just reply to this email.\n\nKirti\nField of Soma`,
  })
}

// Pick a date, time and place for a session
function TimeForm({ session, onSave, onCancel }) {
  const [values, setValues] = useState({
    date: session.date || '',
    time: session.time || '',
    where: session.where || PLACE_FOR[session.format] || '',
  })
  const [error, setError] = useState('')
  const set = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    if (!values.date || !values.time) {
      setError('Choose a date and a time.')
      return
    }
    if (values.date < todayIso()) {
      setError('That date has passed. Choose today or later.')
      return
    }
    onSave({ ...values, where: values.where.trim() || PLACE_FOR[session.format] || 'To be confirmed' })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3 rounded-[2px] border border-[#EDE6DA] bg-soma-paper p-3.5">
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`date-${session.id}`} className={label}>
            Date
          </label>
          <input id={`date-${session.id}`} type="date" min={todayIso()} value={values.date} onChange={set('date')} className={`${field} h-11`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`time-${session.id}`} className={label}>
            Time
          </label>
          <input id={`time-${session.id}`} type="time" step="900" value={values.time} onChange={set('time')} className={`${field} h-11`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`where-${session.id}`} className={label}>
            Where
          </label>
          <input id={`where-${session.id}`} value={values.where} onChange={set('where')} className={`${field} h-11`} />
        </div>
      </div>
      <FieldError>{error}</FieldError>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={button.primary}>
          Book this time
        </button>
        <button type="button" onClick={onCancel} className={button.outline}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function SessionCard({ session, message, highlight, onBook, onStatus, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const past = session.status === 'Booked' && session.date < todayIso()

  return (
    <li
      id={`session-${session.id}`}
      className={`${panel} flex scroll-mt-24 flex-col gap-3 p-4 sm:p-5 ${highlight ? 'border-soma-moss ring-1 ring-soma-moss' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-[1rem] font-semibold">{session.name}</span>
            <Tag>{session.status}</Tag>
            {past ? <Tag tone="warn">Date has passed</Tag> : null}
          </p>
          <p className="mt-0.5 text-[0.8125rem] text-soma-clay-deep">
            {session.practice}, {session.format.toLowerCase()}
            {session.status === 'Requested' ? `. Prefers ${session.preferred.toLowerCase()}. Asked ${session.requested.toLowerCase()}.` : ''}
          </p>
        </div>
        {session.date && session.status !== 'Requested' ? (
          <p className="text-right text-[0.875rem]">
            <span className="block font-semibold">{formatDate(session.date)}</span>
            <span className="block text-soma-clay-deep">{formatTime(session.time)}</span>
          </p>
        ) : null}
      </div>

      {session.where && session.status !== 'Requested' ? <p className="text-[0.8125rem] text-[#3D362F]">Where: {session.where}</p> : null}
      {message && session.status === 'Requested' ? (
        <blockquote className="border-l-2 border-[#D8CFC1] pl-3 text-[0.8125rem] leading-relaxed whitespace-pre-line text-[#4A4038]">
          {message.message}
        </blockquote>
      ) : null}

      {editing ? (
        <TimeForm
          session={session}
          onCancel={() => setEditing(false)}
          onSave={(values) => {
            onBook(values)
            setEditing(false)
          }}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {session.status === 'Requested' ? (
            <>
              <button type="button" onClick={() => setEditing(true)} className={button.primary}>
                <CalendarPlusIcon size={16} aria-hidden="true" />
                Offer a time
              </button>
              <button type="button" onClick={() => onStatus('Cancelled')} className={button.outline}>
                Decline
              </button>
            </>
          ) : null}
          {session.status === 'Booked' ? (
            <>
              <a href={detailsEmail(session)} target="_blank" rel="noreferrer" className={button.primary}>
                <EnvelopeSimpleIcon size={16} aria-hidden="true" />
                Email the details
              </a>
              <button type="button" onClick={() => setEditing(true)} className={button.outline}>
                Change time
              </button>
              <button type="button" onClick={() => onStatus('Done')} className={button.outline}>
                Mark done
              </button>
              <button
                type="button"
                onClick={() => (confirmCancel ? onStatus('Cancelled') : setConfirmCancel(true))}
                className={`${button.quiet} text-[#8E3519]`}
              >
                {confirmCancel ? 'Click again to cancel it' : 'Cancel session'}
              </button>
            </>
          ) : null}
          {session.status === 'Done' || session.status === 'Cancelled' ? (
            <button type="button" onClick={onDelete} className={`${button.quiet} text-[#8E3519]`}>
              Delete from history
            </button>
          ) : null}
          {session.phone ? (
            <a href={`https://wa.me/${session.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className={button.outline}>
              <WhatsappLogoIcon size={16} aria-hidden="true" />
              WhatsApp
            </a>
          ) : null}
          {message ? (
            <Link to={`/admin/inbox?id=${message.id}`} className={button.quiet}>
              Their message
            </Link>
          ) : null}
        </div>
      )}
    </li>
  )
}

function WeeklyClasses() {
  const { data, add, patch, remove, log } = useAdminData()
  const rows = [...data.schedule].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.time.localeCompare(b.time))
  const change = (id, changes) => patch('schedule', id, changes)

  return (
    <section aria-labelledby="weekly-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E4DCCF] pb-3">
        <div>
          <h2 id="weekly-title" className="font-display text-[1.375rem] font-normal">
            Weekly classes
          </h2>
          <p className="mt-1 text-[0.875rem] text-[#5E5045]">The week on the Calendar page. Changes save as you make them.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            add('schedule', { id: newId('w'), day: 'Monday', time: '07:00', title: PRACTICES[0], format: 'Online', onSite: false }, { atEnd: true })
            log('Added a weekly class')
          }}
          className={button.primary}
        >
          <PlusIcon size={16} weight="bold" aria-hidden="true" />
          Add a weekly class
        </button>
      </div>

      <div className={`${panel} relative overflow-x-auto`}>
        <table className="w-full min-w-[700px] border-collapse text-[0.875rem]">
          <thead>
            <tr className="text-left text-[0.75rem] tracking-[0.06em] text-soma-clay-deep uppercase">
              <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3 font-semibold">Day</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-2 py-3 font-semibold">Time</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-2 py-3 font-semibold">Class</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-2 py-3 font-semibold">Format</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-2 py-3 font-semibold">On the site</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const name = `${row.title} on ${row.day}`
              return (
                <tr key={row.id}>
                  <td className="border-b border-[#EDE6DA] px-4 py-2">
                    <select aria-label={`Day for ${name}`} value={row.day} onChange={(e) => change(row.id, { day: e.target.value })} className={`${field} h-10`}>
                      {DAYS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border-b border-[#EDE6DA] px-2 py-2">
                    <input aria-label={`Time for ${name}`} type="time" step="900" value={row.time} onChange={(e) => change(row.id, { time: e.target.value })} className={`${field} h-10 w-[120px]`} />
                  </td>
                  <td className="border-b border-[#EDE6DA] px-2 py-2">
                    <select aria-label={`Practice for ${name}`} value={row.title} onChange={(e) => change(row.id, { title: e.target.value })} className={`${field} h-10`}>
                      {PRACTICES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border-b border-[#EDE6DA] px-2 py-2">
                    <select aria-label={`Format for ${name}`} value={row.format} onChange={(e) => change(row.id, { format: e.target.value })} className={`${field} h-10`}>
                      {[...new Set([...FORMATS, row.format])].map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border-b border-[#EDE6DA] px-2 py-2">
                    <Toggle checked={row.onSite} onChange={(on) => change(row.id, { onSite: on })} label={`Show ${name} on the site`} />
                  </td>
                  <td className="border-b border-[#EDE6DA] px-4 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        remove('schedule', row.id)
                        log(`Removed the ${row.title} class on ${row.day}`)
                      }}
                      aria-label={`Remove ${name}`}
                      className="flex h-10 w-9 cursor-pointer items-center justify-center text-soma-clay-deep hover:text-[#8E3519]"
                    >
                      <TrashIcon size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-soma-clay-deep">
                  No weekly classes. Add one above.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function Bookings() {
  useAdminTitle('Bookings')
  const { data, patch, remove, log } = useAdminData()
  const [params, setParams] = useSearchParams()
  const [highlight, setHighlight] = useState(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const today = todayIso()

  // Opened from search or the inbox: bring that session into view
  const wanted = params.get('id')
  useEffect(() => {
    if (!wanted) return
    setHighlight(wanted)
    if (['Done', 'Cancelled'].includes(data.sessions.find((s) => s.id === wanted)?.status)) setHistoryOpen(true)
    setParams({}, { replace: true })
    setTimeout(() => document.getElementById(`session-${wanted}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }, [wanted, setParams, data.sessions])

  const byTime = (a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
  const requests = data.sessions.filter((s) => s.status === 'Requested')
  const booked = data.sessions.filter((s) => s.status === 'Booked').sort(byTime)
  const history = data.sessions.filter((s) => s.status === 'Done' || s.status === 'Cancelled').sort((a, b) => byTime(b, a))
  const comingUp = booked.filter((s) => s.date >= today)
  const shown = data.schedule.filter((row) => row.onSite)
  const bookingLink = data.settings.bookingUrl || import.meta.env.VITE_BOOKING_URL || ''

  const card = (session) => {
    const message = data.messages.find((m) => m.id === session.messageId)
    return (
      <SessionCard
        key={session.id}
        session={session}
        message={message}
        highlight={highlight === session.id}
        onBook={(values) => {
          const next = { ...session, ...values, status: 'Booked' }
          patch('sessions', session.id, { ...values, status: 'Booked' })
          if (message && (message.status === 'New' || message.status === 'Read')) patch('messages', message.id, { status: 'Replied' })
          log(`Booked ${session.name} for ${formatDate(values.date)} at ${formatTime(values.time)}`)
          setNotice({ session: next, text: `${session.name} is booked for ${longDate(values.date)} at ${formatTime(values.time)}.` })
        }}
        onStatus={(status) => {
          patch('sessions', session.id, { status })
          log(`${status === 'Done' ? 'Marked done' : 'Cancelled'}: the session with ${session.name}`)
          setNotice({ text: status === 'Done' ? `Session with ${session.name} marked done.` : `Session with ${session.name} cancelled.` })
        }}
        onDelete={() => {
          remove('sessions', session.id)
          log(`Deleted the session with ${session.name} from history`)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Bookings" intro="Private sessions and the weekly classes.">
        <SampleNote />
      </PageHeader>

      <section aria-label="Bookings at a glance" className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        <StatCard label="Requests waiting" value={String(requests.length)} note={requests.length ? 'Offer each a time' : 'All answered'} />
        <StatCard label="Sessions coming up" value={String(comingUp.length)} note={comingUp[0] ? `Next: ${formatDate(comingUp[0].date)}, ${formatTime(comingUp[0].time)}` : 'Nothing booked'} />
        <StatCard label="Weekly classes" value={String(shown.length)} note="Shown on the site" />
      </section>

      {notice ? (
        <Notice>
          {notice.text}{' '}
          {notice.session ? (
            <a href={detailsEmail(notice.session)} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
              Email them the details
            </a>
          ) : null}
        </Notice>
      ) : null}

      <section aria-labelledby="requests-title" className="flex flex-col gap-4">
        <h2 id="requests-title" className="border-b border-[#E4DCCF] pb-3 font-display text-[1.375rem] font-normal">
          Requests <span className="font-sans text-[0.875rem] text-soma-clay-deep">{requests.length}</span>
        </h2>
        {requests.length ? (
          <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr))]">{requests.map(card)}</ul>
        ) : (
          <p className="border border-dashed border-[#D8CFC1] p-6 text-center text-[0.875rem] text-soma-clay-deep">
            No requests waiting. New ones arrive from the Calendar and Contact pages.
          </p>
        )}
      </section>

      <section aria-labelledby="booked-title" className="flex flex-col gap-4">
        <h2 id="booked-title" className="border-b border-[#E4DCCF] pb-3 font-display text-[1.375rem] font-normal">
          Booked sessions <span className="font-sans text-[0.875rem] text-soma-clay-deep">{booked.length}</span>
        </h2>
        {booked.length ? (
          <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr))]">{booked.map(card)}</ul>
        ) : (
          <p className="border border-dashed border-[#D8CFC1] p-6 text-center text-[0.875rem] text-soma-clay-deep">Nothing booked yet.</p>
        )}
      </section>

      <WeeklyClasses />

      <section aria-labelledby="link-title" className={`${panel} flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}>
        <div className="min-w-0">
          <h2 id="link-title" className="text-[1rem] font-semibold">
            Online booking link
          </h2>
          <p className="mt-1 text-[0.875rem] break-all text-[#5E5045]">
            {bookingLink
              ? `People can pick a time themselves at ${bookingLink}`
              : 'Not set. People send a request, and you offer them a time here. Add a Cal.com or Calendly link to let them book directly.'}
          </p>
        </div>
        <Link to="/admin/settings#booking" className={button.outline}>
          {bookingLink ? 'Change link' : 'Add a link'}
        </Link>
      </section>

      {history.length ? (
        <details className="group" open={historyOpen} onToggle={(event) => setHistoryOpen(event.currentTarget.open)}>
          <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-[0.9375rem] font-semibold">
            Past and cancelled sessions <span className="font-normal text-soma-clay-deep">{history.length}</span>
          </summary>
          <ul className="mt-3 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr))]">{history.map(card)}</ul>
        </details>
      ) : null}
    </div>
  )
}
