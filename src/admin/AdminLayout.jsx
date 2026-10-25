import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/csr/ArrowSquareOut'
import { BellIcon } from '@phosphor-icons/react/dist/csr/Bell'
import { CalendarBlankIcon } from '@phosphor-icons/react/dist/csr/CalendarBlank'
import { ListIcon } from '@phosphor-icons/react/dist/csr/List'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { MonitorPlayIcon } from '@phosphor-icons/react/dist/csr/MonitorPlay'
import { PencilSimpleIcon } from '@phosphor-icons/react/dist/csr/PencilSimple'
import { ReceiptIcon } from '@phosphor-icons/react/dist/csr/Receipt'
import { SignOutIcon } from '@phosphor-icons/react/dist/csr/SignOut'
import { SlidersHorizontalIcon } from '@phosphor-icons/react/dist/csr/SlidersHorizontal'
import { SquaresFourIcon } from '@phosphor-icons/react/dist/csr/SquaresFour'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { TrayIcon } from '@phosphor-icons/react/dist/csr/Tray'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import Wordmark from '../components/layout/Wordmark'
import { KIND_LABEL } from './sampleData'
import { isSignedIn, signOut } from './session'
import { findPhoto, useAdminData } from './store'
import { AdminPhoto, SampleNote, Tag } from './ui'
import { rupees } from './util'

function navFor(data) {
  const count = (list, test) => list.filter(test).length
  return [
    {
      title: 'Today',
      items: [
        { to: '/admin', label: 'Dashboard', icon: SquaresFourIcon, end: true },
        { to: '/admin/inbox', label: 'Inbox', icon: TrayIcon, badge: count(data.messages, (m) => m.status === 'New'), strong: true },
      ],
    },
    {
      title: 'Teaching',
      items: [
        { to: '/admin/bookings', label: 'Bookings', icon: CalendarBlankIcon, badge: count(data.sessions, (s) => s.status === 'Requested'), strong: true },
        { to: '/admin/classes', label: 'Recorded classes', icon: MonitorPlayIcon },
        { to: '/admin/reviews', label: 'Reviews', icon: StarIcon, badge: count(data.reviews, (r) => r.status === 'Waiting') },
      ],
    },
    {
      title: 'Business',
      items: [
        { to: '/admin/orders', label: 'Orders', icon: ReceiptIcon },
        { to: '/admin/writing', label: 'Writing', icon: PencilSimpleIcon },
      ],
    },
    {
      title: 'Website',
      items: [
        { to: '/admin/settings', label: 'Settings', icon: SlidersHorizontalIcon },
      ],
    },
  ]
}

function SideNav({ onSignOut }) {
  const { data } = useAdminData()
  return (
    <nav aria-label="Admin" className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      <Link to="/admin" className="flex min-h-11 items-center px-2.5">
        <Wordmark className="text-[1.0625rem]" />
      </Link>

      <div className="flex flex-col gap-5">
        {navFor(data).map((group) => (
          <div key={group.title} className="flex flex-col gap-0.5">
            <p className="mb-1.5 px-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-soma-clay-deep uppercase">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex min-h-10 items-center gap-2.5 rounded-[2px] px-2.5 text-[0.875rem] transition-colors ${
                      isActive ? 'bg-[#E6DED1] font-semibold text-soma-ink' : 'font-medium text-[#3D362F] hover:bg-[#EDE6DA] hover:text-soma-ink'
                    }`
                  }
                >
                  <Icon size={18} weight="light" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span
                      className={`ml-auto inline-flex h-5 min-w-[22px] items-center justify-center rounded-[2px] px-1.5 text-[0.75rem] font-semibold ${
                        item.strong ? 'bg-soma-moss text-soma-paper' : 'bg-[#E6DED1] text-[#3D362F]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2.5 border-t border-[#E4DCCF] pt-4 pl-2.5">
        <Link to="/admin/settings" className="flex min-w-0 items-center gap-2.5 hover:text-soma-moss">
          <AdminPhoto photo={findPhoto(data, data.profile.photoId)} alt="" sizes="36px" className="h-9 w-9 shrink-0 rounded-[50%]" />
          <span className="min-w-0">
            <span className="block truncate text-[0.875rem] font-semibold">{data.profile.name}</span>
            <span className="block text-[0.75rem] text-soma-clay-deep">Owner</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Sign out"
          className="ml-auto flex h-11 w-11 cursor-pointer items-center justify-center text-[#5E5045] hover:text-soma-ink"
        >
          <SignOutIcon size={18} weight="light" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

// Finds people, orders, messages, bookings, classes, writing and codes, at most four of each.
function searchAll(data, q) {
  const has = (...values) => values.some((value) => String(value ?? '').toLowerCase().includes(q))
  const groups = [
    ['Orders', data.orders.filter((o) => has(o.id, o.name, o.email)).map((o) => ({ title: o.id, detail: `${o.name}, ${rupees(o.amount)}, ${o.status}`, to: `/admin/orders?id=${o.id}` }))],
    ['Inbox', data.messages.filter((m) => has(m.name, m.email, m.message)).map((m) => ({ title: m.name, detail: `${KIND_LABEL[m.kind]}, ${m.when}`, to: `/admin/inbox?id=${m.id}` }))],
    ['Bookings', data.sessions.filter((s) => has(s.name, s.email)).map((s) => ({ title: s.name, detail: `${s.practice}, ${s.status}`, to: `/admin/bookings?id=${s.id}` }))],
    ['Classes', data.classes.filter((c) => has(c.title, c.practiceName)).map((c) => ({ title: c.title, detail: `${c.practiceName}, ${c.status}`, to: `/admin/classes/${c.id}` }))],
    ['Writing', data.writing.filter((w) => has(w.title, w.topic)).map((w) => ({ title: w.title, detail: `${w.topic}, ${w.status}`, to: `/admin/writing/${w.id}` }))],
  ]
  return groups.map(([title, items]) => [title, items.slice(0, 4)]).filter(([, items]) => items.length)
}

function GlobalSearch() {
  const { data } = useAdminData()
  const navigate = useNavigate()
  const box = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const q = query.trim().toLowerCase()
  const groups = q.length >= 2 ? searchAll(data, q) : []
  const results = groups.flatMap(([, items]) => items)
  const showing = open && q.length >= 2

  useEffect(() => {
    if (!open) return undefined
    const onDown = (event) => {
      if (!box.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const go = (item) => {
    if (!item) return
    navigate(item.to)
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  let index = -1
  return (
    <div ref={box} className="relative min-w-0 flex-1 sm:max-w-xl">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          go(results[active] ?? results[0])
        }}
        className="flex h-11 items-center gap-2 rounded-[2px] border border-[#D8CFC1] bg-[#FFFDF8] px-3 text-soma-clay-deep focus-within:border-soma-moss"
      >
        <MagnifyingGlassIcon size={16} aria-hidden="true" />
        <input
          type="search"
          role="combobox"
          aria-label="Search the admin"
          aria-expanded={showing}
          aria-controls="admin-search-results"
          aria-autocomplete="list"
          aria-activedescendant={showing && results.length ? `admin-search-${active}` : undefined}
          placeholder="Search people, orders, classes, writing"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-base text-soma-ink placeholder:text-[#9A8E80] focus:outline-none sm:text-[0.875rem]"
        />
      </form>
      {showing ? (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-40 max-h-[min(70vh,460px)] overflow-y-auto rounded-[4px] border border-[#E4DCCF] bg-[#FFFDF8] py-2 shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-[0.875rem] text-soma-clay-deep">Nothing found for “{query.trim()}”.</p>
          ) : (
            <ul id="admin-search-results" role="listbox" aria-label="Search results">
              {groups.map(([title, items]) => (
                <li key={title} role="presentation">
                  <p className="px-4 pt-2 pb-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-soma-clay-deep uppercase">{title}</p>
                  <ul role="presentation">
                    {items.map((item) => {
                      index += 1
                      const i = index
                      return (
                        <li
                          key={item.to}
                          id={`admin-search-${i}`}
                          role="option"
                          aria-selected={i === active}
                          onMouseDown={(event) => event.preventDefault()}
                          onMouseEnter={() => setActive(i)}
                          onClick={() => go(item)}
                          className={`flex min-h-11 cursor-pointer flex-col justify-center px-4 py-1.5 ${i === active ? 'bg-soma-linen' : ''}`}
                        >
                          <span className="text-[0.875rem] font-medium text-soma-ink">{item.title}</span>
                          <span className="truncate text-[0.75rem] text-soma-clay-deep">{item.detail}</span>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}

function TopBar() {
  const { data, saveFailed } = useAdminData()
  const unread = data.messages.some((m) => m.status === 'New')

  return (
    <div className="border-b border-[#E4DCCF]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center gap-3 px-5 py-3 sm:px-8 lg:px-10">
        <GlobalSearch />
        <div className="ml-auto flex items-center gap-2">
          {saveFailed ? <Tag tone="warn">Not saved: browser storage is full</Tag> : null}
          {/* Each page header also shows this, so phones skip it here to give search room. */}
          <span className="hidden sm:inline-flex">
            <SampleNote />
          </span>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center gap-1.5 px-2 text-[0.875rem] font-medium text-soma-moss hover:text-soma-ink sm:inline-flex"
          >
            View site
            <ArrowSquareOutIcon size={15} aria-hidden="true" />
          </a>
          <Link
            to="/admin/inbox"
            aria-label={unread ? 'Notifications: new messages in the inbox' : 'Notifications: nothing new'}
            className="relative flex h-11 w-11 items-center justify-center rounded-[2px] border border-[#D8CFC1] bg-[#FFFDF8] text-[#3D362F] hover:text-soma-ink"
          >
            <BellIcon size={18} weight="light" aria-hidden="true" />
            {unread ? <span aria-hidden="true" className="absolute top-2.5 right-2.5 h-[7px] w-[7px] rounded-[50%] bg-[#B24C28]" /> : null}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  // A new screen closes the phone menu and starts at the top, unless it links to a section
  useEffect(() => {
    setMenuOpen(false)
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  if (!isSignedIn()) return <Navigate to="/admin/login" replace />

  const handleSignOut = () => {
    signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-dvh bg-soma-paper font-sans text-soma-ink lg:flex">
      {/* Phones and tablets: a slim bar with the menu button */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E4DCCF] bg-[#F3EEE6] px-4 py-1.5 lg:hidden">
        <Link to="/admin" className="flex min-h-11 items-center">
          <Wordmark className="text-[1rem]" />
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={menuOpen}
          className="flex h-11 w-11 cursor-pointer items-center justify-center"
        >
          <ListIcon size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Large screens: the side menu stays in place. Smaller screens: it slides over. */}
      <aside className="hidden border-r border-[#E4DCCF] bg-[#F3EEE6] lg:sticky lg:top-0 lg:block lg:h-dvh lg:w-[248px] lg:shrink-0">
        <SideNav onSignOut={handleSignOut} />
      </aside>
      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-soma-ink/40"
          />
          <div className="relative h-full w-[280px] max-w-[85vw] bg-[#F3EEE6] shadow-xl">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close admin menu"
              className="absolute top-5 right-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center"
            >
              <XIcon size={20} aria-hidden="true" />
            </button>
            <SideNav onSignOut={handleSignOut} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 pt-7 pb-16 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
