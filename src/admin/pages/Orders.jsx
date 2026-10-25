import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DownloadSimpleIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { ADMIN_EMAIL } from '../sampleData'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { button, PageHeader, panel, SampleNote, Segmented, StatCard, Tag } from '../ui'
import { downloadCsv, gmailCompose, plural, rupees, thisMonthLabel } from '../util'

const STATUSES = ['All', 'Paid', 'Refunded', 'Failed']

function timelineFor(order) {
  const steps = [{ what: 'Order placed', when: order.date, tone: 'bg-[#C9BFB0]' }]
  if (order.status === 'Failed') {
    steps.push({ what: 'Payment did not go through', when: 'Razorpay: declined by the bank', tone: 'bg-[#B24C28]' })
    return steps
  }
  steps.push({
    what: 'Payment received',
    when: order.date,
    tone: 'bg-soma-moss-light',
  })
  steps.push({ what: 'Access email sent', when: order.date, tone: 'bg-soma-moss-light' })
  if (order.access) steps.push({ what: 'Access email sent again', when: order.access, tone: 'bg-soma-moss-light' })
  if (order.status === 'Refunded') steps.push({ what: 'Refunded and access removed', when: order.refunded ?? 'Earlier', tone: 'bg-soma-clay' })
  return steps
}

export default function Orders() {
  useAdminTitle('Orders')
  const { data, patch, setValue, log } = useAdminData()
  const list = data.orders
  const [params, setParams] = useSearchParams()
  const [status, setStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(() => params.get('id') ?? list[0]?.id)
  const [notice, setNotice] = useState('')
  const [confirmRefund, setConfirmRefund] = useState(false)

  // Moving to another order, by clicking or through search, disarms a half-clicked refund
  useEffect(() => {
    setConfirmRefund(false)
    setNotice('')
  }, [selectedId])

  // Opened from search: show that order
  const wanted = params.get('id')
  useEffect(() => {
    if (!wanted) return
    setSelectedId(wanted)
    setStatus('All')
    setQuery('')
    setParams({}, { replace: true })
  }, [wanted, setParams])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter(
      (o) =>
        (status === 'All' || o.status === status) &&
        (!q || [o.id, o.name, o.email].some((value) => value.toLowerCase().includes(q))),
    )
  }, [list, status, query])

  const selected = visible.find((o) => o.id === selectedId) ?? null
  const paid = list.filter((o) => o.status === 'Paid')
  const paidTotal = paid.reduce((total, o) => total + o.amount, 0)
  // Order dates look like "24 Oct, 9:58 am"
  const month = thisMonthLabel().split(' ')[0]
  const paidThisMonth = paid.filter((o) => o.date.split(',')[0].endsWith(month))
  const refunded = list.filter((o) => o.status === 'Refunded')

  const select = (id) => {
    setSelectedId(id)
    setNotice('')
    setConfirmRefund(false)
  }

  const stamp = () => new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

  // A refund also takes away the buyer's access to the classes in that order
  const refund = () => {
    if (!selected) return
    if (!confirmRefund) {
      setConfirmRefund(true)
      return
    }
    const classIds = selected.items.map((item) => item.id)
    patch('orders', selected.id, { status: 'Refunded', refunded: stamp() })
    setValue('members', (members) =>
      members?.map((m) =>
        m.email === selected.email ? { ...m, owns: m.owns.filter((id) => !classIds.includes(id)), spent: Math.max(0, m.spent - selected.amount) } : m,
      ),
    )
    log(`Refunded ${rupees(selected.amount)} for order ${selected.id}`)
    setConfirmRefund(false)
    setNotice(`Refund of ${rupees(selected.amount)} started and access removed. It reaches ${selected.name} in 5 to 7 days.`)
  }

  const resend = () => {
    patch('orders', selected.id, { access: stamp() })
    log(`Sent the access email again for order ${selected.id}`)
    setNotice(`Access email sent again to ${selected.email}.`)
  }

  const exportCsv = () => {
    downloadCsv(
      'field-of-soma-orders.csv',
      [['Order', 'Date', 'Buyer', 'Email', 'Classes', 'Promo', 'Discount', 'Amount', 'Paid with', 'Status', 'Razorpay ID']].concat(
        visible.map((o) => [o.id, o.date, o.name, o.email, o.items.map((i) => i.title).join('; '), o.promo, o.discount, o.amount, o.method, o.status, o.payId]),
      ),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Orders" intro="Every purchase of a recorded class, with its payment.">
        <SampleNote />
        <button type="button" onClick={exportCsv} className={button.outline}>
          <DownloadSimpleIcon size={16} aria-hidden="true" />
          Export CSV for accounts
        </button>
      </PageHeader>

      <section aria-label="This month" className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        <StatCard label="Paid this month" value={rupees(paidThisMonth.reduce((total, o) => total + o.amount, 0))} note={plural(paidThisMonth.length, 'order')} />
        <StatCard label="Refunded" value={rupees(refunded.reduce((t, o) => t + o.amount, 0))} note={`${refunded.length} ${refunded.length === 1 ? 'order' : 'orders'}`} />
        <StatCard label="Payments that failed" value={String(list.filter((o) => o.status === 'Failed').length)} note="Buyers can try again from their email" />
        <StatCard label="Average order" value={rupees(paidTotal / Math.max(1, paid.length))} note="Paid orders only" />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-11 w-full items-center gap-2 rounded-[2px] border border-[#D8CFC1] bg-[#FFFDF8] px-3 text-soma-clay-deep sm:w-80">
          <MagnifyingGlassIcon size={16} aria-hidden="true" />
          <span className="sr-only">Search orders</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Order number, name or email"
            className="min-w-0 flex-1 bg-transparent text-base text-soma-ink placeholder:text-[#9A8E80] focus:outline-none sm:text-[0.875rem]"
          />
        </label>
        <Segmented label="Filter by status" value={status} onChange={setStatus} options={STATUSES.map((s) => [s, s])} />
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <div className={`${panel} min-w-0 flex-[2_1_560px] overflow-x-auto`}>
          <table className="w-full min-w-[760px] border-collapse text-[0.875rem]">
            <thead>
              <tr className="text-left text-[0.75rem] tracking-[0.06em] text-soma-clay-deep uppercase">
                <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3.5 font-semibold">Order</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Buyer</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Classes</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Paid with</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 text-right font-semibold">Amount</th>
                <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => {
                const active = selected?.id === o.id
                return (
                  <tr key={o.id} className={active ? 'bg-soma-linen' : ''}>
                    <td className="border-b border-[#EDE6DA] px-4 py-1.5">
                      <button
                        type="button"
                        onClick={() => select(o.id)}
                        aria-pressed={active}
                        className="flex min-h-11 cursor-pointer flex-col items-start justify-center text-left"
                      >
                        <span className="font-mono text-[0.8125rem] font-semibold text-soma-moss">{o.id}</span>
                        <span className="text-[0.75rem] text-soma-clay-deep">{o.date}</span>
                      </button>
                    </td>
                    <td className="border-b border-[#EDE6DA] px-3 py-2.5">
                      <span className="block font-medium">{o.name}</span>
                      <span className="block text-[0.75rem] text-soma-clay-deep">{o.email}</span>
                    </td>
                    <td className="max-w-[240px] border-b border-[#EDE6DA] px-3 py-2.5">
                      <span className="block">{o.items.map((i) => i.title).join(', ')}</span>
                      {o.promo ? <span className="mt-1 block font-mono text-[0.75rem] font-semibold text-[#6B5326]">{o.promo}</span> : null}
                    </td>
                    <td className="border-b border-[#EDE6DA] px-3 py-2.5 text-[#3D362F]">{o.method}</td>
                    <td className="border-b border-[#EDE6DA] px-3 py-2.5 text-right font-semibold tabular-nums">{rupees(o.amount)}</td>
                    <td className="border-b border-[#EDE6DA] px-4 py-2.5">
                      <Tag>{o.status}</Tag>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-soma-clay-deep">
                    No orders match.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {selected ? (
          <aside aria-label="Order details" className={`${panel} flex min-w-0 flex-[1_1_320px] flex-col gap-4 p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[0.8125rem] font-semibold text-soma-moss">{selected.id}</p>
                <h2 className="mt-1 font-display text-[1.5rem] leading-tight font-normal">{selected.name}</h2>
                <p className="text-[0.8125rem] break-all text-soma-clay-deep">{selected.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close order details"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-[#5E5045] hover:text-soma-ink"
              >
                <XIcon size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="flex items-center gap-2">
              <Tag>{selected.status}</Tag>
              <span className="text-[0.8125rem] text-soma-clay-deep">{selected.date}</span>
            </p>

            <div className="flex flex-col gap-2 border-y border-[#EDE6DA] py-3.5 text-[0.875rem]">
              {selected.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span>{item.title}</span>
                  <span className="tabular-nums">{rupees(item.price)}</span>
                </div>
              ))}
              {selected.promo ? (
                <div className="flex justify-between gap-3 text-soma-moss">
                  <span>Promo code {selected.promo}</span>
                  <span className="tabular-nums">-{rupees(selected.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between gap-3 pt-1.5 text-[0.9375rem] font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{rupees(selected.amount)}</span>
              </div>
            </div>

            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[0.8125rem]">
              <dt className="text-soma-clay-deep">Paid with</dt>
              <dd>{selected.method}</dd>
              <dt className="text-soma-clay-deep">Razorpay ID</dt>
              <dd className="font-mono break-all">{selected.payId}</dd>
              <dt className="text-soma-clay-deep">Access</dt>
              <dd>
                {selected.status === 'Paid'
                  ? `Can watch ${selected.items.length} ${selected.items.length === 1 ? 'class' : 'classes'}`
                  : 'No access'}
              </dd>
            </dl>

            <ol className="flex flex-col gap-2.5">
              {timelineFor(selected).map((step) => (
                <li key={step.what} className="flex gap-2.5 text-[0.8125rem]">
                  <span aria-hidden="true" className={`mt-[5px] h-2 w-2 shrink-0 rounded-[50%] ${step.tone}`} />
                  <span>
                    <span className="block font-medium">{step.what}</span>
                    <span className="block text-soma-clay-deep">{step.when}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-2.5">
              {selected.status === 'Paid' ? (
                <button type="button" onClick={resend} className={button.primary}>
                  Resend access email
                </button>
              ) : null}
              {selected.status === 'Paid' ? (
                <button type="button" onClick={refund} className={button.danger}>
                  {confirmRefund ? `Click again to refund ${rupees(selected.amount)}` : `Refund ${rupees(selected.amount)}`}
                </button>
              ) : null}
              <a
                href={gmailCompose({ from: ADMIN_EMAIL, to: selected.email, subject: `Your Field of Soma order ${selected.id}`, body: `Hi ${selected.name.split(' ')[0]},\n\n\n\nKirti\nField of Soma` })}
                target="_blank"
                rel="noreferrer"
                className={button.outline}
              >
                Email the buyer
              </a>
            </div>
            {notice ? (
              <p role="status" className="rounded-[2px] bg-[#E3E9DE] px-3 py-2.5 text-[0.8125rem] text-[#34452F]">
                {notice}
              </p>
            ) : null}
            <p className="text-[0.75rem] leading-relaxed text-soma-clay-deep">
              Refunds go back to the buyer through Razorpay in 5 to 7 days, and their access to the class is removed at
              the same time.
            </p>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
