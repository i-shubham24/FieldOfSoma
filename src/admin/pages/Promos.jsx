import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { button, field, FieldError, label, Notice, PageHeader, panel, SampleNote, Segmented, StatCard, Tag, Toggle } from '../ui'
import { formatDate, rupees } from '../util'

const EMPTY = { code: '', kind: 'percent', value: '', starts: '', ends: '', limit: '' }

const discountText = (promo) => (promo.kind === 'percent' ? `${promo.value}% off` : `${rupees(promo.value)} off`)

function randomCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return `SOMA${Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')}`
}

// A code works on every class: just a discount, the dates it runs and how many times it can be used.
function NewCodeForm({ existing, onSave, onCancel }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const set = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const found = {}
    const code = values.code.trim().toUpperCase()
    if (!/^[A-Z0-9]{3,20}$/.test(code)) found.code = 'Use 3 to 20 letters or numbers, no spaces.'
    else if (existing.includes(code)) found.code = 'That code already exists.'
    const value = Number(values.value)
    if (!value || value < 1) found.value = 'Enter how much it takes off.'
    else if (values.kind === 'percent' && value > 90) found.value = 'Keep it at 90% or less.'
    if (values.starts && values.ends && values.ends < values.starts) found.ends = 'The end date is before the start date.'
    setErrors(found)
    if (Object.keys(found).length) return

    const today = new Date().toISOString().slice(0, 10)
    const show = (iso) => formatDate(iso, { day: 'numeric', month: 'short', year: 'numeric' })
    onSave({
      id: code,
      code,
      kind: values.kind,
      value,
      used: 0,
      limit: Number(values.limit) || 0,
      starts: values.starts ? show(values.starts) : 'Today',
      ends: values.ends ? show(values.ends) : 'No end date',
      status: values.starts && values.starts > today ? 'Scheduled' : 'Active',
      revenue: 0,
    })
  }

  return (
    <form onSubmit={submit} noValidate className={`${panel} flex flex-col gap-6 p-5 sm:p-7`} aria-labelledby="new-code-title">
      <h2 id="new-code-title" className="font-display text-[1.5rem] font-normal">
        New promo code
      </h2>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
        <div className="flex flex-col gap-2">
          <label htmlFor="promo-code" className={label}>
            Code
          </label>
          <div className="flex gap-2">
            <input
              id="promo-code"
              value={values.code}
              onChange={set('code')}
              placeholder="For example WELCOME10"
              aria-invalid={errors.code ? true : undefined}
              className={`${field} h-11 font-mono uppercase`}
            />
            <button type="button" onClick={() => setValues((c) => ({ ...c, code: randomCode() }))} className={button.outline}>
              Make one
            </button>
          </div>
          <FieldError>{errors.code}</FieldError>
        </div>

        <div className="flex flex-col gap-2">
          <span className={label}>Discount</span>
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              label="Type of discount"
              value={values.kind}
              onChange={(kind) => setValues((c) => ({ ...c, kind }))}
              options={[
                ['percent', 'Percent'],
                ['amount', 'Rupees'],
              ]}
            />
            <label htmlFor="promo-value" className="sr-only">
              {values.kind === 'percent' ? 'Percent off' : 'Rupees off'}
            </label>
            <input
              id="promo-value"
              type="number"
              min="1"
              inputMode="numeric"
              value={values.value}
              onChange={set('value')}
              placeholder={values.kind === 'percent' ? '10' : '150'}
              aria-invalid={errors.value ? true : undefined}
              className={`${field} h-11 w-28`}
            />
            <span className="text-[0.875rem] text-[#5E5045]">{values.kind === 'percent' ? '% off' : '₹ off'}</span>
          </div>
          <FieldError>{errors.value}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))]">
        {[
          ['starts', 'Starts', 'date', ''],
          ['ends', 'Ends', 'date', ''],
          ['limit', 'Total uses allowed', 'number', 'No limit'],
        ].map(([key, text, type, placeholder]) => (
          <div key={key} className="flex flex-col gap-2">
            <label htmlFor={`promo-${key}`} className={label}>
              {text}
            </label>
            <input id={`promo-${key}`} type={type} min="0" value={values[key]} onChange={set(key)} placeholder={placeholder} className={`${field} h-11`} />
            <FieldError>{errors[key]}</FieldError>
          </div>
        ))}
      </div>
      <p className="-mt-2 text-[0.8125rem] text-soma-clay-deep">Codes work on every class. Leave the dates empty to start now and run until you switch it off.</p>

      <div className="flex flex-wrap gap-2.5 border-t border-[#EDE6DA] pt-5">
        <button type="submit" className={button.primary}>
          Save code
        </button>
        <button type="button" onClick={onCancel} className={button.outline}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function Promos() {
  useAdminTitle('Promo codes')
  const { data, add, patch, remove, log } = useAdminData()
  const list = data.promos
  const [params] = useSearchParams()
  const highlight = params.get('code')
  const [creating, setCreating] = useState(false)
  const [saved, setSaved] = useState('')

  const active = list.filter((p) => p.status === 'Active')
  const usedThisMonth = active.reduce((total, p) => total + p.used, 0)
  const revenue = list.filter((p) => p.status !== 'Ended').reduce((total, p) => total + p.revenue, 0)

  const setActive = (code, on) => {
    patch('promos', code, { status: on ? 'Active' : 'Paused' })
    log(`${on ? 'Switched on' : 'Paused'} the promo code ${code}`)
  }

  const deleteCode = (code) => {
    remove('promos', code)
    log(`Deleted the promo code ${code}`)
    setSaved(`${code} deleted.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Promo codes" intro="Discounts people can enter at checkout. Each code is checked on the server, so it cannot be faked.">
        <SampleNote />
        {!creating ? (
          <button type="button" onClick={() => { setCreating(true); setSaved('') }} className={button.primary}>
            <PlusIcon size={16} weight="bold" aria-hidden="true" />
            New code
          </button>
        ) : null}
      </PageHeader>

      <section aria-label="Promo codes at a glance" className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <StatCard label="Active codes" value={String(active.length)} />
        <StatCard label="Times used (active codes)" value={String(usedThisMonth)} />
        <StatCard label="Sales that used a code" value={rupees(revenue)} note="Money in, after the discount" />
      </section>

      {creating ? (
        <NewCodeForm
          existing={list.map((p) => p.code)}
          onCancel={() => setCreating(false)}
          onSave={(promo) => {
            add('promos', promo)
            log(`Created the promo code ${promo.code}`)
            setCreating(false)
            setSaved(promo.status === 'Scheduled' ? `${promo.code} is saved and starts on ${promo.starts}.` : `${promo.code} is live. Share it however you like.`)
          }}
        />
      ) : null}
      {saved ? <Notice>{saved}</Notice> : null}

      <div className={`${panel} relative overflow-x-auto`}>
        <table className="w-full min-w-[700px] border-collapse text-[0.875rem]">
          <thead>
            <tr className="text-left text-[0.75rem] tracking-[0.06em] text-soma-clay-deep uppercase">
              <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3.5 font-semibold">Code</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Discount</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Used</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Dates</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">Status</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-3 py-3.5 font-semibold">On</th>
              <th scope="col" className="border-b border-[#E4DCCF] px-4 py-3.5 font-semibold">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const pct = p.limit ? Math.min(100, Math.round((p.used / p.limit) * 100)) : 0
              const canToggle = p.status === 'Active' || p.status === 'Paused'
              return (
                <tr key={p.code} className={highlight === p.code ? 'bg-soma-linen' : ''}>
                  <td className="border-b border-[#EDE6DA] px-4 py-3 font-mono text-[0.875rem] font-semibold">{p.code}</td>
                  <td className="border-b border-[#EDE6DA] px-3 py-3">{discountText(p)}</td>
                  <td className="border-b border-[#EDE6DA] px-3 py-3">
                    <span className="block tabular-nums">
                      {p.used}
                      {p.limit ? ` of ${p.limit}` : ''}
                    </span>
                    {p.limit ? (
                      <span aria-hidden="true" className="mt-1.5 block h-1 w-24 overflow-hidden rounded-[2px] bg-[#EDE6DA]">
                        <span className="block h-full bg-soma-moss-light" style={{ width: `${pct}%` }} />
                      </span>
                    ) : null}
                  </td>
                  <td className="border-b border-[#EDE6DA] px-3 py-3 text-[0.8125rem] text-[#3D362F]">
                    {p.starts}
                    <span className="block text-soma-clay-deep">to {p.ends}</span>
                  </td>
                  <td className="border-b border-[#EDE6DA] px-3 py-3">
                    <Tag>{p.status}</Tag>
                  </td>
                  <td className="border-b border-[#EDE6DA] px-3 py-1">
                    {canToggle ? (
                      <Toggle checked={p.status === 'Active'} onChange={(on) => setActive(p.code, on)} label={`${p.code} switched on`} />
                    ) : (
                      <span className="text-[0.8125rem] text-soma-clay-deep">{p.status === 'Ended' ? 'Ended' : 'Starts later'}</span>
                    )}
                  </td>
                  <td className="border-b border-[#EDE6DA] px-4 py-1">
                    {p.used === 0 ? (
                      <button
                        type="button"
                        onClick={() => deleteCode(p.code)}
                        aria-label={`Delete ${p.code}`}
                        className="flex h-11 w-9 cursor-pointer items-center justify-center text-soma-clay-deep hover:text-[#8E3519]"
                      >
                        <TrashIcon size={16} aria-hidden="true" />
                      </button>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
