import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarBlankIcon } from '@phosphor-icons/react/dist/csr/CalendarBlank'
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple'
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { ADMIN_EMAIL, KIND_LABEL, MESSAGE_KINDS } from '../sampleData'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AutoTextarea, button, PageHeader, panel, SampleNote, Tag } from '../ui'
import { downloadCsv, gmailCompose, mailtoCompose } from '../util'

const REPLY_SUBJECT = 'Re: your message to Field of Soma'

// The reply body: a greeting, room to write, then their message quoted underneath.
function replyBody(message) {
  const firstName = message.name.split(' ')[0]
  const quoted = message.message
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')
  return `Hi ${firstName},\n\n\n\nKirti\nField of Soma\n\n${message.name} wrote:\n${quoted}`
}

const reply = (message) => ({ from: ADMIN_EMAIL, to: message.email, subject: REPLY_SUBJECT, body: replyBody(message) })

export default function Inbox() {
  useAdminTitle('Inbox')
  const { data, patch, remove, log } = useAdminData()
  const items = data.messages
  const [params, setParams] = useSearchParams()
  const [kind, setKind] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(() => Number(params.get('id')) || items[0]?.id)
  const [copied, setCopied] = useState(false)
  const detailRef = useRef(null)

  // Opened from search: show that message
  const wanted = Number(params.get('id'))
  useEffect(() => {
    if (!wanted) return
    setSelectedId(wanted)
    setKind('all')
    setQuery('')
    setParams({}, { replace: true })
    if (items.find((m) => m.id === wanted)?.status === 'New') patch('messages', wanted, { status: 'Read' })
  }, [wanted, setParams, items, patch])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (m) =>
        (kind === 'all' || m.kind === kind) &&
        (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)),
    )
  }, [items, kind, query])

  const selected = visible.find((m) => m.id === selectedId) ?? visible[0]

  const setStatus = (status) => {
    if (!selected) return
    patch('messages', selected.id, { status })
    log(`Marked the message from ${selected.name} as ${status.toLowerCase()}`)
  }
  const session = selected?.kind === 'session' ? data.sessions.find((s) => s.messageId === selected.id) : null

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(selected.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the address is still on screen to select by hand
    }
  }

  const removeAsSpam = () => {
    if (!selected) return
    remove('messages', selected.id)
    log(`Removed a message from ${selected.name} as spam`)
  }

  const open = (id) => {
    setSelectedId(id)
    setCopied(false)
    // Opening a new message counts as reading it
    const message = items.find((m) => m.id === id)
    if (message?.status === 'New') patch('messages', id, { status: 'Read' })
    // On narrow screens the message sits below the list, so bring it into view
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const exportCsv = () => {
    downloadCsv(
      'field-of-soma-inbox.csv',
      [['Type', 'Name', 'Email', 'Phone', 'Received', 'Status', 'Message', 'Private note']].concat(
        visible.map((m) => [KIND_LABEL[m.kind], m.name, m.email, m.phone, m.received, m.status, m.message, m.note]),
      ),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inbox" intro="Every message from the website, in one place.">
        <SampleNote />
        <button type="button" onClick={exportCsv} className={button.outline}>
          <DownloadSimpleIcon size={16} aria-hidden="true" />
          Export CSV
        </button>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4DCCF]">
        <div role="tablist" aria-label="Kind of message" className="-mb-px flex flex-wrap gap-1">
          {MESSAGE_KINDS.map(([id, text]) => {
            const count = items.filter((m) => id === 'all' || m.kind === id).length
            const active = kind === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setKind(id)}
                className={`flex min-h-11 cursor-pointer items-center gap-1.5 border-b-2 px-3.5 text-[0.875rem] transition-colors ${
                  active ? 'border-soma-moss font-semibold text-soma-ink' : 'border-transparent font-medium text-[#5E5045] hover:text-soma-ink'
                }`}
              >
                {text}
                <span className="text-[0.75rem] font-medium text-soma-clay-deep">{count}</span>
              </button>
            )
          })}
        </div>
        <label className="mb-2 flex h-11 w-full items-center gap-2 rounded-[2px] border border-[#D8CFC1] bg-[#FFFDF8] px-3 text-soma-clay-deep sm:w-64">
          <MagnifyingGlassIcon size={16} aria-hidden="true" />
          <span className="sr-only">Search messages</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or email"
            className="min-w-0 flex-1 bg-transparent text-base text-soma-ink placeholder:text-[#9A8E80] focus:outline-none sm:text-[0.875rem]"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <section aria-label="Messages" className="flex min-w-0 flex-[1_1_340px] flex-col gap-2">
          {visible.length === 0 ? (
            <p className="border border-dashed border-[#D8CFC1] p-7 text-center text-[0.875rem] text-soma-clay-deep">
              Nothing here right now.
            </p>
          ) : null}
          {visible.map((m) => {
            const active = selected?.id === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => open(m.id)}
                aria-pressed={active}
                className={`flex w-full cursor-pointer flex-col gap-1.5 rounded-[2px] border px-3.5 py-3.5 text-left transition-colors ${
                  active ? 'border-soma-moss bg-soma-linen' : 'border-[#E4DCCF] bg-[#FFFDF8] hover:border-[#C9BFB0]'
                }`}
              >
                <span className="flex w-full items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`h-[7px] w-[7px] shrink-0 rounded-[50%] ${m.status === 'New' ? 'bg-soma-moss' : 'bg-transparent'}`}
                  />
                  <span className="truncate text-[0.875rem] font-semibold">{m.name}</span>
                  <span className="ml-auto shrink-0 text-[0.75rem] text-soma-clay-deep">{m.when}</span>
                </span>
                <span className="flex items-center gap-2 pl-[15px]">
                  <span className="text-[0.75rem] font-semibold text-[#5E5045]">{KIND_LABEL[m.kind]}</span>
                  <Tag>{m.status}</Tag>
                </span>
                <span className="line-clamp-2 pl-[15px] text-[0.8125rem] leading-relaxed text-[#4A4038]">{m.message}</span>
              </button>
            )
          })}
        </section>

        {selected ? (
          <article ref={detailRef} aria-label="Selected message" className={`${panel} flex min-w-0 flex-[2_1_460px] scroll-mt-20 flex-col gap-5 p-5 sm:p-7`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2">
                  <span className="text-[0.75rem] font-semibold tracking-[0.08em] text-soma-clay-deep uppercase">
                    {KIND_LABEL[selected.kind]}
                  </span>
                  <Tag>{selected.status}</Tag>
                </p>
                <h2 className="mt-1.5 font-display text-[1.75rem] leading-tight font-normal break-words">{selected.name}</h2>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.875rem]">
                  <span className="flex items-baseline gap-2.5">
                    <span className="break-all text-soma-moss">{selected.email}</span>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="cursor-pointer text-[0.8125rem] text-soma-clay-deep underline-offset-2 hover:text-soma-ink hover:underline"
                    >
                      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </span>
                  {selected.phone ? <span className="text-[#5E5045]">{selected.phone}</span> : null}
                </p>
              </div>
              <p className="text-[0.8125rem] text-soma-clay-deep">Received {selected.received}</p>
            </div>

            {selected.details.length ? (
              <dl className="grid gap-3 rounded-[2px] bg-[#F7F2EA] p-4 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
                {selected.details.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[0.75rem] font-semibold tracking-[0.06em] text-soma-clay-deep uppercase">{k}</dt>
                    <dd className="mt-0.5 text-[0.875rem] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <blockquote className="border-l-2 border-[#D8CFC1] py-1 pl-4 text-[0.9375rem] leading-[1.7] whitespace-pre-line text-[#2E2924]">
              {selected.message}
            </blockquote>

            <div className="flex flex-wrap gap-2.5">
              <a href={gmailCompose(reply(selected))} target="_blank" rel="noreferrer" className={button.primary}>
                <EnvelopeSimpleIcon size={16} aria-hidden="true" />
                Reply in Gmail
              </a>
              {selected.phone ? (
                <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className={button.outline}>
                  <WhatsappLogoIcon size={16} aria-hidden="true" />
                  WhatsApp
                </a>
              ) : null}
              {session ? (
                <Link to={`/admin/bookings?id=${session.id}`} className={button.outline}>
                  <CalendarBlankIcon size={16} aria-hidden="true" />
                  {session.status === 'Requested' ? 'Offer a time' : 'See the booking'}
                </Link>
              ) : null}
              <button type="button" onClick={() => setStatus('Replied')} className={button.outline}>
                Mark replied
              </button>
              <button type="button" onClick={() => setStatus('Done')} className={button.outline}>
                Mark done
              </button>
              <button type="button" onClick={removeAsSpam} className={`${button.quiet} ml-auto text-[#8E3519]`}>
                Spam
              </button>
            </div>
            <p className="-mt-2 text-[0.8125rem] text-soma-clay-deep">
              Use another email app?{' '}
              <a href={mailtoCompose(reply(selected))} className="text-soma-moss underline underline-offset-2 hover:text-soma-ink">
                Open your email app
              </a>{' '}
              or copy the address above.
            </p>

            <div className="flex flex-col gap-2 border-t border-[#EDE6DA] pt-4">
              <label htmlFor="private-note" className="text-[0.8125rem] font-semibold">
                Private note <span className="font-normal text-soma-clay-deep">(only your team sees this)</span>
              </label>
              <AutoTextarea
                id="private-note"
                minRows={3}
                value={selected.note ?? ''}
                onChange={(event) => patch('messages', selected.id, { note: event.target.value })}
                placeholder="For example: offered Tuesday 8 am, waiting to hear back"
              />
              <p className="text-[0.75rem] text-soma-clay-deep">Saved as you type.</p>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  )
}
