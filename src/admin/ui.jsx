import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { useMediaUrl } from './media'

// Shared admin building blocks, in the site's palette: paper, ink and moss, square corners.

export const panel = 'rounded-[4px] border border-[#E4DCCF] bg-[#FFFDF8]'

const buttonBase =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[2px] px-4 text-[0.875rem] transition-colors disabled:cursor-not-allowed disabled:opacity-50'

export const button = {
  primary: `${buttonBase} bg-soma-moss font-semibold text-soma-paper hover:bg-soma-moss-light`,
  outline: `${buttonBase} border border-[#C9BFB0] bg-[#FFFDF8] font-medium text-soma-ink hover:border-soma-ink`,
  danger: `${buttonBase} border border-[#C47A5C] bg-[#FFFDF8] font-semibold text-[#8E3519] hover:bg-[#F6E3DB]`,
  quiet: `${buttonBase} font-medium text-soma-ink/80 hover:text-soma-ink`,
}

export const field =
  'w-full rounded-[2px] border border-[#D8CFC1] bg-[#FFFDF8] px-3 text-base text-soma-ink placeholder:text-[#9A8E80] focus:border-soma-moss focus:ring-1 focus:ring-soma-moss focus:outline-none sm:text-[0.9375rem]'

export const label = 'text-[0.75rem] font-semibold tracking-[0.08em] text-soma-clay-deep uppercase'

const TONES = {
  moss: 'bg-[#E3E9DE] text-[#34452F]',
  sand: 'bg-[#EFE7D6] text-[#6B5326]',
  clay: 'bg-[#ECE6E0] text-[#5E5045]',
  warn: 'bg-[#F6E3DB] text-[#8E3519]',
}

// Which tone each status word gets, across every screen.
export const STATUS_TONE = {
  New: 'moss',
  Read: 'clay',
  Replied: 'sand',
  Done: 'clay',
  Paid: 'moss',
  Refunded: 'clay',
  Failed: 'warn',
  Published: 'moss',
  Draft: 'sand',
  Hidden: 'clay',
  Active: 'moss',
  Scheduled: 'sand',
  Paused: 'clay',
  Ended: 'clay',
  Waiting: 'sand',
  Approved: 'moss',
  Requested: 'moss',
  Booked: 'sand',
  Cancelled: 'clay',
}

export function Tag({ tone, children }) {
  const name = tone ?? STATUS_TONE[children] ?? 'sand'
  return (
    <span
      className={`inline-flex h-[22px] items-center rounded-[2px] px-[7px] text-[0.75rem] font-semibold whitespace-nowrap ${TONES[name]}`}
    >
      {children}
    </span>
  )
}

export function PageHeader({ title, intro, children }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-[#E4DCCF] pb-6">
      <div className="min-w-0">
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.125rem)] leading-tight font-normal">{title}</h1>
        {intro ? <p className="mt-1 text-[0.9375rem] text-[#5E5045]">{intro}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2.5">{children}</div> : null}
    </header>
  )
}

export function StatCard({ label: title, value, note }) {
  return (
    <div className={`${panel} flex flex-col gap-2 px-5 py-4`}>
      <p className="text-[0.8125rem] font-medium text-[#5E5045]">{title}</p>
      <p className="font-display text-[2rem] leading-none [font-variant-numeric:lining-nums_tabular-nums]">{value}</p>
      {note ? <p className="text-[0.8125rem] text-soma-moss">{note}</p> : null}
    </div>
  )
}

// A row of joined buttons where one is chosen, such as Week, Month, Year.
export function Segmented({ label: groupLabel, options, value, onChange }) {
  return (
    <div role="group" aria-label={groupLabel} className="flex w-fit max-w-full flex-wrap overflow-hidden rounded-[2px] border border-[#D8CFC1]">
      {options.map(([id, text]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`min-h-10 cursor-pointer px-3.5 text-[0.8125rem] transition-colors ${
            value === id ? 'bg-soma-moss font-semibold text-soma-paper' : 'bg-[#FFFDF8] text-[#3D362F] hover:bg-soma-linen'
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

// An on/off switch with square corners, matching the site's no-pill rule.
export function Toggle({ checked, onChange, label: text }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={text}
      onClick={() => onChange(!checked)}
      className="inline-flex min-h-11 cursor-pointer items-center"
    >
      <span
        className={`relative inline-block h-[22px] w-[40px] rounded-[3px] transition-colors ${
          checked ? 'bg-soma-moss' : 'bg-[#D8CFC1]'
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 rounded-[2px] bg-[#FFFDF8] transition-[left] ${checked ? 'left-[21px]' : 'left-[3px]'}`}
        />
      </span>
    </button>
  )
}

export function SampleNote() {
  return <Tag tone="sand">Sample data</Tag>
}

// A text box that grows with its words, so long text never hides behind a scroll bar.
export function AutoTextarea({ value, minRows = 3, className = '', ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const box = ref.current
    if (!box) return
    box.style.height = 'auto'
    box.style.height = `${box.scrollHeight + 2}px`
  }, [value])
  return <textarea ref={ref} rows={minRows} value={value} className={`${field} resize-none overflow-hidden py-2.5 leading-relaxed ${className}`} {...props} />
}

// "61 / 60", turning red once text is longer than search results show.
export function CharCount({ length, max }) {
  return (
    <span className={`text-[0.75rem] font-normal tracking-normal normal-case tabular-nums ${length > max ? 'font-semibold text-[#8E3519]' : 'text-soma-clay-deep'}`}>
      {length} / {max}
    </span>
  )
}

const NOTICE_TONES = {
  moss: 'bg-[#E3E9DE] text-[#34452F]',
  warn: 'bg-[#F6E3DB] text-[#8E3519]',
  sand: 'bg-[#EFE7D6] text-[#6B5326]',
}

export function Notice({ tone = 'moss', children, className = '' }) {
  return (
    <p role={tone === 'warn' ? 'alert' : 'status'} className={`rounded-[2px] px-4 py-3 text-[0.875rem] leading-relaxed ${NOTICE_TONES[tone]} ${className}`}>
      {children}
    </p>
  )
}

export function FieldError({ children }) {
  return children ? (
    <p role="alert" className="text-[0.8125rem] font-medium text-[#8E3519]">
      {children}
    </p>
  ) : null
}

export function ProgressBar({ value, label: text }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <span
      role="progressbar"
      aria-label={text}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="block h-1.5 w-full overflow-hidden rounded-[2px] bg-[#E4DCCF]"
    >
      <span className="block h-full bg-soma-moss transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </span>
  )
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, video[controls], [tabindex]:not([tabindex="-1"])'

// A dialog over the page. Escape or the close button shuts it, Tab stays inside, and focus
// returns to where it was. It is drawn at the end of <body>, outside any form on the page,
// so pressing Enter in a field inside it never submits the editor behind it.
export function Modal({ title, onClose, children, wide = false }) {
  const box = useRef(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const before = document.activeElement
    box.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') {
        close.current()
        return
      }
      if (event.key !== 'Tab' || !box.current) return
      const items = [...box.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      const inside = items.includes(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      before?.focus?.()
    }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-8">
      <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 cursor-default bg-soma-ink/45" />
      <div
        ref={box}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} rounded-[4px] border border-[#E4DCCF] bg-[#FFFDF8] shadow-2xl focus:outline-none`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#EDE6DA] py-2 pr-2 pl-5">
          <h2 className="font-display text-[1.25rem] font-normal">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#5E5045] hover:text-soma-ink">
            <XIcon size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

// Shows a photo from the library: one of the site's own, or one uploaded in the admin.
export function AdminPhoto({ photo, sizes = '400px', className = '', alt }) {
  const uploaded = useMediaUrl(photo?.mediaId)
  if (!photo) {
    return <span className={`flex items-center justify-center bg-soma-linen text-[0.8125rem] text-soma-clay-deep ${className}`}>No photo</span>
  }
  const src = photo.mediaId ? uploaded : photo.src
  if (!src) return <span aria-hidden="true" className={`block animate-pulse bg-soma-linen ${className}`} />
  return <img src={src} srcSet={photo.mediaId ? undefined : photo.srcSet} sizes={sizes} alt={alt ?? photo.alt ?? ''} className={`object-cover ${className}`} />
}
