import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { ADMIN_EMAIL } from '../sampleData'
import { classTitle, useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AutoTextarea, button, field, Notice, PageHeader, panel, SampleNote, Segmented, StatCard, Tag, Toggle } from '../ui'
import { downloadCsv, gmailCompose, initials, rupees } from '../util'

const FILTERS = [
  ['all', 'All'],
  ['buyers', 'Bought a class'],
  ['notes', 'Field Notes'],
  ['none', 'No purchase yet'],
]

function MemberPanel({ member, onClose }) {
  const { data, patch, remove, log } = useAdminData()
  const [gift, setGift] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const theirOrders = data.orders.filter((o) => o.email === member.email)
  const giftable = data.classes.filter((c) => !member.owns.includes(c.id) && c.status === 'Published')

  const giveClass = () => {
    patch('members', member.id, (m) => ({ owns: [...m.owns, gift] }))
    log(`Gave ${member.name} the class "${classTitle(data, gift)}"`)
    setNotice(`${classTitle(data, gift)} added. They get an email with the link.`)
    setGift('')
  }

  const takeBack = (classId) => {
    patch('members', member.id, (m) => ({ owns: m.owns.filter((id) => id !== classId) }))
    log(`Removed ${member.name}'s access to "${classTitle(data, classId)}"`)
    setNotice(`${classTitle(data, classId)} removed from their account.`)
  }

  const deleteMember = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    remove('members', member.id)
    log(`Deleted the account of ${member.name}`)
    onClose()
  }

  return (
    <aside aria-label="Member details" className={`${panel} flex min-w-0 flex-[1_1_320px] flex-col gap-5 p-5 sm:p-6`}>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[50%] bg-soma-linen font-display text-[1.125rem] text-soma-moss">
          {initials(member.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[1.5rem] leading-tight font-normal">{member.name}</h2>
          <p className="text-[0.8125rem] break-all text-soma-clay-deep">{member.email}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close member details"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-[#5E5045] hover:text-soma-ink"
        >
          <XIcon size={18} aria-hidden="true" />
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-[0.8125rem]">
        <div>
          <dt className="text-soma-clay-deep">Joined</dt>
          <dd className="font-medium">{member.joined}</dd>
        </div>
        <div>
          <dt className="text-soma-clay-deep">Last visit</dt>
          <dd className="font-medium">{member.lastVisit}</dd>
        </div>
        <div>
          <dt className="text-soma-clay-deep">Spent</dt>
          <dd className="font-medium tabular-nums">{rupees(member.spent)}</dd>
        </div>
        <div>
          <dt className="text-soma-clay-deep">Field Notes</dt>
          <dd className="flex items-center gap-2 font-medium">
            <Toggle
              checked={member.fieldNotes}
              onChange={(on) => {
                patch('members', member.id, { fieldNotes: on })
                log(`${on ? 'Added' : 'Removed'} ${member.name} ${on ? 'to' : 'from'} Field Notes`)
              }}
              label={`${member.name} gets Field Notes`}
            />
            {member.fieldNotes ? 'Subscribed' : 'Not subscribed'}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2 border-t border-[#EDE6DA] pt-4">
        <h3 className="text-[0.875rem] font-semibold">Classes they can watch</h3>
        {member.owns.length ? (
          <ul className="flex flex-col gap-1 text-[0.875rem]">
            {member.owns.map((id) => (
              <li key={id} className="flex items-center justify-between gap-2">
                <span>{classTitle(data, id)}</span>
                <button type="button" onClick={() => takeBack(id)} className={`${button.quiet} min-h-9 px-2 text-[0.8125rem]`}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.875rem] text-soma-clay-deep">None yet.</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          <label htmlFor="gift-class" className="sr-only">
            Class to give
          </label>
          <select id="gift-class" value={gift} onChange={(event) => setGift(event.target.value)} className={`${field} h-11 min-w-0 flex-1`}>
            <option value="">Give a class for free…</option>
            {giftable.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button type="button" disabled={!gift} onClick={giveClass} className={button.outline}>
            Give class
          </button>
        </div>
      </div>

      {theirOrders.length ? (
        <div className="flex flex-col gap-2 border-t border-[#EDE6DA] pt-4">
          <h3 className="text-[0.875rem] font-semibold">Orders</h3>
          <ul className="flex flex-col gap-2 text-[0.8125rem]">
            {theirOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <span className="font-mono text-soma-moss">{o.id}</span>
                <span className="tabular-nums">{rupees(o.amount)}</span>
                <Tag>{o.status}</Tag>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-[#EDE6DA] pt-4">
        <label htmlFor="member-note" className="text-[0.875rem] font-semibold">
          Private note
        </label>
        <AutoTextarea
          id="member-note"
          minRows={3}
          value={member.note ?? ''}
          onChange={(event) => patch('members', member.id, { note: event.target.value })}
          placeholder="For example: prefers evening sessions, old knee injury"
        />
        <p className="text-[0.75rem] text-soma-clay-deep">Saved as you type. Only your team sees it.</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <a
          href={gmailCompose({ from: ADMIN_EMAIL, to: member.email, subject: 'From Field of Soma', body: `Hi ${member.name.split(' ')[0]},\n\n\n\nKirti\nField of Soma` })}
          target="_blank"
          rel="noreferrer"
          className={button.outline}
        >
          Email them
        </a>
        <button
          type="button"
          onClick={() => {
            log(`Sent a password reset link to ${member.email}`)
            setNotice(`Password reset link sent to ${member.email}.`)
          }}
          className={button.outline}
        >
          Send password reset
        </button>
        <button type="button" onClick={deleteMember} className={button.danger}>
          {confirmDelete ? 'Click again to delete for good' : 'Delete their data'}
        </button>
      </div>
      {notice ? <Notice>{notice}</Notice> : null}
      <p className="text-[0.75rem] leading-relaxed text-soma-clay-deep">
        Deleting removes their account, notes and newsletter sign-up. Order records are kept for accounts, without
        their name.
      </p>
    </aside>
  )
}

export default function Members() {
  useAdminTitle('Members')
  const { data } = useAdminData()
  const list = data.members
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(() => params.get('id'))

  // Opened from search: show that member
  const wanted = params.get('id')
  useEffect(() => {
    if (!wanted) return
    setSelectedId(wanted)
    setFilter('all')
    setParams({}, { replace: true })
  }, [wanted, setParams])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((m) => {
      const matches = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      const kind =
        filter === 'all' ||
        (filter === 'buyers' && m.owns.length > 0) ||
        (filter === 'notes' && m.fieldNotes) ||
        (filter === 'none' && m.owns.length === 0)
      return matches && kind
    })
  }, [list, query, filter])

  const selected = list.find((m) => m.id === selectedId) ?? null

  const exportCsv = () =>
    downloadCsv(
      'field-of-soma-members.csv',
      [['Name', 'Email', 'Joined', 'Classes', 'Spent', 'Field Notes']].concat(
        visible.map((m) => [m.name, m.email, m.joined, m.owns.map((id) => classTitle(data, id)).join('; '), m.spent, m.fieldNotes ? 'Yes' : 'No']),
      ),
    )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Members" intro="Everyone with an account on the site.">
        <SampleNote />
        <button type="button" onClick={exportCsv} className={button.outline}>
          <DownloadSimpleIcon size={16} aria-hidden="true" />
          Export CSV
        </button>
      </PageHeader>

      <section aria-label="Members at a glance" className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        <StatCard label="Members" value={String(list.length)} />
        <StatCard label="Bought a class" value={String(list.filter((m) => m.owns.length).length)} />
        <StatCard label="Get Field Notes" value={String(list.filter((m) => m.fieldNotes).length)} />
        <StatCard label="Joined this month" value={String(list.filter((m) => m.joined.includes('Oct')).length)} />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-11 w-full items-center gap-2 rounded-[2px] border border-[#D8CFC1] bg-[#FFFDF8] px-3 text-soma-clay-deep sm:w-80">
          <MagnifyingGlassIcon size={16} aria-hidden="true" />
          <span className="sr-only">Search members</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })}
            placeholder="Name or email"
            className="min-w-0 flex-1 bg-transparent text-base text-soma-ink placeholder:text-[#9A8E80] focus:outline-none sm:text-[0.875rem]"
          />
        </label>
        <Segmented label="Show" value={filter} onChange={setFilter} options={FILTERS} />
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <div className={`${panel} min-w-0 flex-[2_1_560px] overflow-x-auto`}>
          <table className="w-full min-w-[680px] border-collapse text-[0.875rem]">
            <thead>
              <tr className="text-left text-[0.75rem] tracking-[0.06em] text-soma-clay-deep uppercase">
                <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3.5 font-semibold">Member</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Joined</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Classes</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 text-right font-semibold">Spent</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3.5 font-semibold">Field Notes</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((m) => {
                const active = selected?.id === m.id
                return (
                  <tr key={m.id} className={active ? 'bg-soma-linen' : ''}>
                    <td className="border-b border-[#EDE6DA] px-4 py-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedId(m.id)}
                        aria-pressed={active}
                        className="flex min-h-12 cursor-pointer items-center gap-3 text-left"
                      >
                        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[50%] bg-soma-linen text-[0.75rem] font-semibold text-soma-moss">
                          {initials(m.name)}
                        </span>
                        <span>
                          <span className="block font-medium">{m.name}</span>
                          <span className="block text-[0.75rem] text-soma-clay-deep">{m.email}</span>
                        </span>
                      </button>
                    </td>
                    <td className="border-b border-[#EDE6DA] px-3 py-2.5 text-[#3D362F]">{m.joined}</td>
                    <td className="border-b border-[#EDE6DA] px-3 py-2.5 tabular-nums">{m.owns.length}</td>
                    <td className="border-b border-[#EDE6DA] px-3 py-2.5 text-right font-semibold tabular-nums">{rupees(m.spent)}</td>
                    <td className="border-b border-[#EDE6DA] px-4 py-2.5">{m.fieldNotes ? <Tag tone="moss">Yes</Tag> : <span className="text-soma-clay-deep">No</span>}</td>
                  </tr>
                )
              })}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-soma-clay-deep">
                    No members match.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {selected ? <MemberPanel key={selected.id} member={selected} onClose={() => setSelectedId(null)} /> : null}
      </div>
    </div>
  )
}
