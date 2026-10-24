import { useState } from 'react'
import { ArrowDownIcon } from '@phosphor-icons/react/dist/csr/ArrowDown'
import { ArrowUpIcon } from '@phosphor-icons/react/dist/csr/ArrowUp'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash'
import { classTitle, useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { button, field, label, PageHeader, panel, SampleNote, Tag, Toggle } from '../ui'
import { newId } from '../util'

const TABS = ['Waiting', 'Approved', 'Hidden']

function Stars({ count }) {
  return (
    <span role="img" aria-label={`${count} out of 5 stars`} className="flex text-[#A0782C]">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={15} weight={n <= count ? 'fill' : 'regular'} aria-hidden="true" />
      ))}
    </span>
  )
}

function AddTestimonial({ onAdd, onCancel }) {
  const [values, setValues] = useState({ quote: '', name: '', context: '', permission: false })
  const [error, setError] = useState('')
  const set = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    if (!values.quote.trim() || !values.name.trim()) {
      setError('Add the words and the name.')
      return
    }
    onAdd(values)
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 rounded-[2px] border border-[#EDE6DA] bg-soma-paper p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="t-quote" className={label}>
          Their words
        </label>
        <textarea id="t-quote" rows={3} value={values.quote} onChange={set('quote')} className={`${field} resize-y py-2.5`} />
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <div className="flex flex-col gap-2">
          <label htmlFor="t-name" className={label}>
            Name, as it should show
          </label>
          <input id="t-name" value={values.name} onChange={set('name')} placeholder="For example Priya M." className={`${field} h-11`} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="t-context" className={label}>
            Practice or class
          </label>
          <input id="t-context" value={values.context} onChange={set('context')} placeholder="Tai Chi, weekly class" className={`${field} h-11`} />
        </div>
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9375rem]">
        <input
          type="checkbox"
          checked={values.permission}
          onChange={(event) => setValues((c) => ({ ...c, permission: event.target.checked }))}
          className="h-4 w-4 accent-soma-moss"
        />
        They have said yes to this being on the website
      </label>
      {error ? <p role="alert" className="text-[0.8125rem] font-medium text-[#8E3519]">{error}</p> : null}
      <div className="flex gap-2.5">
        <button type="submit" className={button.primary}>
          Add testimonial
        </button>
        <button type="button" onClick={onCancel} className={button.outline}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function Reviews() {
  useAdminTitle('Reviews')
  const { data, add, patch, remove, setValue, log } = useAdminData()
  const { reviews, testimonials } = data
  const [tab, setTab] = useState('Waiting')
  const [adding, setAdding] = useState(false)

  const setStatus = (review, status) => {
    patch('reviews', review.id, { status })
    log(`${status === 'Approved' ? 'Approved' : 'Hid'} ${review.name}'s review`)
  }
  const patchTestimonial = (id, changes) => patch('testimonials', id, changes)
  const moveTestimonial = (index, step) =>
    setValue('testimonials', (current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(index + step, 0, item)
      return next
    })

  const visible = reviews.filter((r) => r.status === tab)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Reviews" intro="Class reviews wait here until you approve them. Only approved reviews show on the site.">
        <SampleNote />
      </PageHeader>

      <section aria-labelledby="class-reviews" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E4DCCF]">
          <h2 id="class-reviews" className="pb-3 font-display text-[1.375rem] font-normal">
            Class reviews
          </h2>
          <div role="tablist" aria-label="Review status" className="-mb-px flex gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`flex min-h-11 cursor-pointer items-center gap-1.5 border-b-2 px-3.5 text-[0.875rem] ${
                  tab === t ? 'border-soma-moss font-semibold text-soma-ink' : 'border-transparent font-medium text-[#5E5045] hover:text-soma-ink'
                }`}
              >
                {t}
                <span className="text-[0.75rem] text-soma-clay-deep">{reviews.filter((r) => r.status === t).length}</span>
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="border border-dashed border-[#D8CFC1] p-7 text-center text-[0.875rem] text-soma-clay-deep">
            {tab === 'Waiting' ? 'All caught up. New reviews will appear here.' : 'Nothing here yet.'}
          </p>
        ) : null}

        <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr))]">
          {visible.map((r) => (
            <li key={r.id} className={`${panel} flex flex-col gap-3 p-5`}>
              <div className="flex items-center justify-between gap-3">
                <Stars count={r.stars} />
                <span className="text-[0.75rem] text-soma-clay-deep">{r.when}</span>
              </div>
              <p className="font-display text-[1.0625rem] leading-relaxed italic">“{r.text}”</p>
              <p className="text-[0.8125rem] text-[#5E5045]">
                <span className="font-semibold text-soma-ink">{r.name}</span> on {classTitle(data, r.classId)}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[#EDE6DA] pt-3">
                {r.status !== 'Approved' ? (
                  <button type="button" onClick={() => setStatus(r, 'Approved')} className={`${button.primary} min-h-10`}>
                    Approve
                  </button>
                ) : null}
                {r.status !== 'Hidden' ? (
                  <button type="button" onClick={() => setStatus(r, 'Hidden')} className={`${button.outline} min-h-10`}>
                    Hide
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="testimonials-title" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E4DCCF] pb-3">
          <div>
            <h2 id="testimonials-title" className="font-display text-[1.375rem] font-normal">
              Testimonials
            </h2>
            <p className="mt-1 text-[0.875rem] text-[#5E5045]">Student words for the Home and About pages. Only ones with permission go live.</p>
          </div>
          {!adding ? (
            <button type="button" onClick={() => setAdding(true)} className={button.primary}>
              <PlusIcon size={15} weight="bold" aria-hidden="true" />
              Add testimonial
            </button>
          ) : null}
        </div>

        {adding ? (
          <AddTestimonial
            onCancel={() => setAdding(false)}
            onAdd={(values) => {
              add('testimonials', { id: newId('t'), ...values, onHome: true, onAbout: false })
              log(`Added a testimonial from ${values.name}`)
              setAdding(false)
            }}
          />
        ) : null}

        <ol className="flex flex-col gap-3">
          {testimonials.map((t, index) => (
            <li key={t.id} className={`${panel} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5`}>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[1rem] leading-relaxed italic">“{t.quote}”</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.8125rem] text-[#5E5045]">
                  <span className="font-semibold text-soma-ink">{t.name}</span>
                  {t.context ? <span>{t.context}</span> : null}
                  {t.permission ? <Tag tone="moss">Permission given</Tag> : <Tag tone="warn">No permission yet</Tag>}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-[#3D362F]">
                <label className="flex min-h-11 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={t.permission}
                    onChange={(event) => patchTestimonial(t.id, { permission: event.target.checked })}
                    className="h-4 w-4 accent-soma-moss"
                  />
                  Permission
                </label>
                <span className="flex items-center gap-1.5">
                  <Toggle checked={t.onHome} onChange={(on) => patchTestimonial(t.id, { onHome: on })} label={`Show ${t.name} on the Home page`} />
                  Home
                </span>
                <span className="flex items-center gap-1.5">
                  <Toggle checked={t.onAbout} onChange={(on) => patchTestimonial(t.id, { onAbout: on })} label={`Show ${t.name} on the About page`} />
                  About
                </span>
                <span className="flex">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveTestimonial(index, -1)}
                    aria-label={`Move ${t.name} up`}
                    className="flex h-11 w-9 cursor-pointer items-center justify-center text-soma-clay-deep hover:text-soma-ink disabled:cursor-default disabled:opacity-30"
                  >
                    <ArrowUpIcon size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={index === testimonials.length - 1}
                    onClick={() => moveTestimonial(index, 1)}
                    aria-label={`Move ${t.name} down`}
                    className="flex h-11 w-9 cursor-pointer items-center justify-center text-soma-clay-deep hover:text-soma-ink disabled:cursor-default disabled:opacity-30"
                  >
                    <ArrowDownIcon size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      remove('testimonials', t.id)
                      log(`Removed the testimonial from ${t.name}`)
                    }}
                    aria-label={`Remove the testimonial from ${t.name}`}
                    className="flex h-11 w-9 cursor-pointer items-center justify-center text-soma-clay-deep hover:text-[#8E3519]"
                  >
                    <TrashIcon size={16} aria-hidden="true" />
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
