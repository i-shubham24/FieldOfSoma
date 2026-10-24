import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { chartSets } from '../sampleData'
import { findPhoto, lessonsMissingVideo, useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AdminPhoto, button, panel, Segmented, StatCard, Tag } from '../ui'
import { formatDate, formatTime, rupees, todayIso } from '../util'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function greeting() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

// A simple line chart drawn as SVG: the line, a soft area under it and today's point.
function MoneyChart({ set }) {
  const W = 640
  const base = 184
  const pad = 12
  const max = Math.max(...set.values) * 1.15 || 1
  const points = set.values.map((value, index) => [
    pad + (index * (W - 2 * pad)) / (set.values.length - 1),
    base - (value / max) * (base - 24),
  ])
  const line = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = points[points.length - 1]
  const area = `${line} L ${lastX.toFixed(1)} ${base} L ${pad} ${base} Z`

  return (
    <>
      <svg
        role="img"
        aria-label={`Money in ${set.caption}: ${rupees(set.total)}`}
        viewBox="0 0 640 200"
        preserveAspectRatio="none"
        className="block h-[220px] w-full"
      >
        {[40, 88, 136].map((y) => (
          <line key={y} x1="12" x2="628" y1={y} y2={y} stroke="#EDE6DA" />
        ))}
        <line x1="12" x2="628" y1="184" y2="184" stroke="#D8CFC1" />
        <path d={area} fill="#465942" fillOpacity="0.09" />
        <path d={line} fill="none" stroke="#465942" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <circle cx={lastX} cy={lastY} r="4" fill="#FFFDF8" stroke="#465942" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div aria-hidden="true" className="flex justify-between px-1 text-[0.75rem] text-soma-clay-deep">
        {set.labels.map((labelText) => (
          <span key={labelText}>{labelText}</span>
        ))}
      </div>
    </>
  )
}

export default function Dashboard() {
  useAdminTitle('Dashboard')
  const { data } = useAdminData()
  const [range, setRange] = useState('month')
  const set = chartSets[range]

  const newMessages = data.messages.filter((m) => m.status === 'New')
  const sessionRequests = data.sessions.filter((s) => s.status === 'Requested').length
  const waitingReviews = data.reviews.filter((r) => r.status === 'Waiting').length
  const needVideo = data.classes.filter((c) => c.lessons.length === 0 || lessonsMissingVideo(c) > 0)
  const best = [...data.classes].sort((a, b) => b.sold - a.sold).slice(0, 4)
  const today = todayIso()
  const upcoming = data.sessions
    .filter((s) => s.status === 'Booked' && s.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 3)
  const weekly = data.schedule.filter((row) => row.onSite).sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.time.localeCompare(b.time))

  const needs = [
    { count: newMessages.length, title: 'New messages', detail: 'Questions and sign-ups from the website', to: '/admin/inbox', tone: 'moss' },
    { count: sessionRequests, title: 'Session requests', detail: 'Waiting for a time from you', to: '/admin/bookings', tone: 'moss' },
    { count: waitingReviews, title: 'Reviews to approve', detail: 'Only approved reviews show on the site', to: '/admin/reviews', tone: 'sand' },
    ...(needVideo.length
      ? [
          {
            count: needVideo.length,
            title: needVideo.length === 1 ? 'Class without all its videos' : 'Classes without all their videos',
            detail: needVideo.length === 1 ? `${needVideo[0].title} stays a draft until then` : 'They stay drafts until then',
            to: needVideo.length === 1 ? `/admin/classes/${needVideo[0].id}` : '/admin/classes',
            tone: 'warn',
          },
        ]
      : []),
  ].filter((item) => item.count > 0)

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E4DCCF] pb-6">
        <div>
          <p className="text-[0.8125rem] text-soma-clay-deep">{formatDate(today, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="mt-1 font-display text-[clamp(1.75rem,3vw,2.125rem)] leading-tight font-normal">
            {greeting()}, {data.profile.name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/classes/new" className={button.primary}>
            <PlusIcon size={16} weight="bold" aria-hidden="true" />
            Add a class
          </Link>
          <Link to="/admin/promos" className={button.outline}>
            New promo code
          </Link>
          <Link to="/admin/inbox" className={button.outline}>
            Open inbox
          </Link>
        </div>
      </header>

      <section aria-label="This month at a glance" className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
        <StatCard label="Money this month" value={rupees(18400)} note="18% more than September" />
        <StatCard label="Classes sold" value="31" note="6 more than September" />
        <StatCard label="New members" value="12" note="9 also joined Field Notes" />
        <StatCard label="Unread messages" value={String(newMessages.length)} note={`${sessionRequests} ${sessionRequests === 1 ? 'is a session request' : 'are session requests'}`} />
      </section>

      <div className="flex flex-wrap gap-4">
        <section aria-labelledby="money-title" className={`${panel} flex min-w-0 flex-[2_1_520px] flex-col gap-4 p-5 sm:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="money-title" className="text-[0.9375rem] font-semibold">
                Money in
              </h2>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-[1.875rem] [font-variant-numeric:lining-nums_tabular-nums]">{rupees(set.total)}</span>
                <span className="text-[0.8125rem] text-soma-clay-deep">{set.caption}</span>
              </p>
            </div>
            <Segmented
              label="Time range"
              value={range}
              onChange={setRange}
              options={[
                ['week', 'Week'],
                ['month', 'Month'],
                ['year', 'Year'],
              ]}
            />
          </div>
          <MoneyChart set={set} />
        </section>

        <section aria-labelledby="needs-title" className={`${panel} flex min-w-0 flex-[1_1_300px] flex-col gap-2.5 p-5 sm:p-6`}>
          <h2 id="needs-title" className="mb-1 text-[0.9375rem] font-semibold">
            Needs you
          </h2>
          {needs.length === 0 ? <p className="text-[0.875rem] text-soma-clay-deep">All caught up. Nothing is waiting for you.</p> : null}
          {needs.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="flex min-h-14 items-center gap-3.5 rounded-[2px] border border-[#EDE6DA] bg-soma-paper px-3 py-2 transition-colors hover:border-[#C9BFB0]"
            >
              <span className="flex h-9 min-w-9 items-center justify-center font-display text-[1.125rem]">
                <Tag tone={item.tone}>{item.count}</Tag>
              </span>
              <span className="min-w-0">
                <span className="block text-[0.875rem] font-semibold">{item.title}</span>
                <span className="block text-[0.8125rem] text-soma-clay-deep">{item.detail}</span>
              </span>
              <CaretRightIcon size={16} className="ml-auto shrink-0 text-soma-clay-deep" aria-hidden="true" />
            </Link>
          ))}
        </section>
      </div>

      <div className="flex flex-wrap gap-4">
        <section aria-labelledby="week-title" className={`${panel} min-w-0 flex-[1_1_320px] p-5 sm:p-6`}>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="week-title" className="text-[0.9375rem] font-semibold">
              This week
            </h2>
            <Link to="/admin/bookings" className="text-[0.8125rem] font-medium text-soma-moss hover:text-soma-ink">
              Bookings
            </Link>
          </div>
          <ul>
            {upcoming.map((session) => (
              <li key={session.id} className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 border-t border-[#EDE6DA] py-3">
                <div className="text-[0.8125rem]">
                  <p className="font-semibold">{formatDate(session.date, { weekday: 'short', day: 'numeric' })}</p>
                  <p className="text-soma-clay-deep">{formatTime(session.time)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.875rem] font-medium">Private session: {session.name}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-soma-clay-deep">
                    {session.practice}, {session.format.toLowerCase()}
                  </p>
                </div>
              </li>
            ))}
            {weekly.map((row) => (
              <li key={row.id} className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 border-t border-[#EDE6DA] py-3">
                <div className="text-[0.8125rem]">
                  <p className="font-semibold">{row.day.slice(0, 3)}</p>
                  <p className="text-soma-clay-deep">{formatTime(row.time)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.875rem] font-medium">{row.title}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-soma-clay-deep">{row.format}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="best-title" className={`${panel} min-w-0 flex-[1_1_320px] p-5 sm:p-6`}>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="best-title" className="text-[0.9375rem] font-semibold">
              Best-selling classes
            </h2>
            <span className="text-[0.8125rem] text-soma-clay-deep">All time</span>
          </div>
          <ul>
            {best.map((item) => (
              <li key={item.id} className="border-t border-[#EDE6DA]">
                <Link to={`/admin/classes/${item.id}`} className="flex items-center gap-3 py-2.5 hover:text-soma-moss">
                  <AdminPhoto photo={findPhoto(data, item.imageId)} alt="" sizes="48px" className="photo h-12 w-12 shrink-0 rounded-[2px]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.875rem] font-medium">{item.title}</span>
                    <span className="block text-[0.8125rem] text-soma-clay-deep">{item.sold} sold</span>
                  </span>
                  <span className="text-[0.875rem] font-semibold tabular-nums">{rupees(item.revenue)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="recent-title" className={`${panel} min-w-0 flex-[1_1_320px] p-5 sm:p-6`}>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="recent-title" className="text-[0.9375rem] font-semibold">
              Recent orders
            </h2>
            <Link to="/admin/orders" className="text-[0.8125rem] font-medium text-soma-moss hover:text-soma-ink">
              All orders
            </Link>
          </div>
          <ul>
            {data.orders.slice(0, 4).map((order) => (
              <li key={order.id} className="flex items-center gap-3 border-t border-[#EDE6DA] py-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.875rem] font-medium">{order.name}</span>
                  <span className="block text-[0.8125rem] text-soma-clay-deep">
                    {order.items[0].title}, {order.date.split(',')[0]}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <span className="text-[0.875rem] font-semibold tabular-nums">{rupees(order.amount)}</span>
                  <Tag>{order.status}</Tag>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
