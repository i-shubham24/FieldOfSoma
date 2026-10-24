import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/csr/ArrowSquareOut'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/csr/CheckCircle'
import { CircleIcon } from '@phosphor-icons/react/dist/csr/Circle'
import { articles as siteArticles } from '../../content/articles'
import PhotoPicker from '../PhotoPicker'
import SearchPreview from '../SearchPreview'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AutoTextarea, button, CharCount, field, label, Notice, panel, SampleNote, Segmented, Tag, Toggle } from '../ui'
import { slugify, todayIso } from '../util'
import NotFound from './NotFound'
import { readingTime, wordCount } from './WritingList'

const BASE_TOPICS = ['Somatics', 'Tai Chi', 'Creative Movement', 'Rest', 'News']
const ON_SITE = new Set([siteArticles.featured, ...siteArticles.list].map((a) => a.id))

const BLANK = {
  title: '',
  topic: BASE_TOPICS[0],
  excerpt: '',
  body: '',
  imageId: null,
  status: 'Draft',
  date: '',
  sendToNotes: false,
  sentToNotes: false,
  seoTitle: '',
  seoDescription: '',
}

const clean = (form) => ({
  ...form,
  title: form.title.trim(),
  excerpt: form.excerpt.trim(),
  body: form.body.trim(),
  seoTitle: form.seoTitle.trim(),
  seoDescription: form.seoDescription.trim(),
})

function Section({ title, hint, children }) {
  return (
    <section className={`${panel} flex flex-col gap-4 p-5 sm:p-6`}>
      <div>
        <h2 className="text-[1rem] font-semibold">{title}</h2>
        {hint ? <p className="mt-1 text-[0.8125rem] text-soma-clay-deep">{hint}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default function WritingEditor() {
  const { id } = useParams()
  const { data } = useAdminData()
  if (id !== 'new' && !data.writing.some((w) => w.id === id)) return <NotFound />
  return <Editor key={id} id={id} />
}

function Editor({ id }) {
  const { data, add, patch, remove, log } = useAdminData()
  const navigate = useNavigate()
  const location = useLocation()
  const isNew = id === 'new'
  const saved = isNew ? null : data.writing.find((w) => w.id === id)
  useAdminTitle(isNew ? 'New piece' : saved.title)

  const [form, setForm] = useState(() => ({ ...BLANK, ...(saved ?? {}) }))
  const [mode, setMode] = useState('write')
  const [notice, setNotice] = useState(location.state?.notice ?? null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const dirty = JSON.stringify(clean(form)) !== JSON.stringify(clean({ ...BLANK, ...(saved ?? {}) }))
  useEffect(() => {
    if (!dirty) return undefined
    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setNotice(null)
  }
  const set = (key) => (event) => update(key, event.target.value)

  const topics = [...new Set([...BASE_TOPICS, ...data.writing.map((w) => w.topic)])]
  const subscribers = data.members.filter((m) => m.fieldNotes).length + data.messages.filter((m) => m.kind === 'notes').length
  const paragraphs = form.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const checks = [
    ['A title', Boolean(form.title.trim())],
    ['A short summary', Boolean(form.excerpt.trim())],
    ['A cover photo', Boolean(form.imageId)],
    ['The piece itself', wordCount(form.body) >= 30],
  ]
  const ready = checks.every(([, ok]) => ok)
  const slug = isNew ? slugify(form.title || 'new-piece', data.writing.map((w) => w.id)) : id

  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setNotice({ tone: 'warn', text: 'Give the piece a title before saving.' })
      return
    }
    let record = clean(form)
    const messages = []
    if (record.status === 'Published' && !ready) {
      record = { ...record, status: 'Draft' }
      setForm((current) => ({ ...current, status: 'Draft' }))
      messages.push(`Saved as a draft. To publish, it still needs: ${checks.filter(([, ok]) => !ok).map(([what]) => what.toLowerCase()).join(', ')}.`)
    }
    if (record.status === 'Published') {
      if (!record.date) record.date = todayIso()
      if (record.sendToNotes && !record.sentToNotes) {
        record = { ...record, sentToNotes: true, sendToNotes: false }
        messages.push(`Sent to ${subscribers} Field Notes readers.`)
        log(`Sent "${record.title}" to Field Notes`)
      }
    }
    setForm((current) => ({ ...current, date: record.date, sentToNotes: record.sentToNotes, sendToNotes: record.sendToNotes }))
    const text = messages.length ? messages.join(' ') : 'Saved.'
    const tone = record.status !== form.status ? 'warn' : 'moss'

    if (isNew) {
      add('writing', { ...record, id: slug })
      log(`Added the piece "${record.title}"`)
      navigate(`/admin/writing/${slug}`, { replace: true, state: { notice: { tone, text } } })
      return
    }
    patch('writing', id, record)
    log(`Saved the piece "${record.title}"`)
    setNotice({ tone, text })
  }

  const deletePiece = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    remove('writing', id)
    log(`Deleted the piece "${saved.title}"`)
    navigate('/admin/writing')
  }

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E4DCCF] pb-6">
        <div className="min-w-0">
          <Link to="/admin/writing" className="inline-flex min-h-9 items-center gap-1.5 text-[0.8125rem] font-medium text-soma-clay-deep hover:text-soma-ink">
            <ArrowLeftIcon size={14} aria-hidden="true" />
            Writing
          </Link>
          <h1 className="mt-1 flex flex-wrap items-center gap-3 font-display text-[clamp(1.75rem,3vw,2.125rem)] leading-tight font-normal">
            {form.title || 'New piece'}
            <Tag>{form.status}</Tag>
            {dirty ? <Tag tone="sand">Unsaved changes</Tag> : null}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SampleNote />
          {!isNew && ON_SITE.has(id) ? (
            <a href={`/articles/${id}`} target="_blank" rel="noreferrer" className={button.outline}>
              See it on the site
              <ArrowSquareOutIcon size={15} aria-hidden="true" />
            </a>
          ) : null}
          <button type="submit" className={button.primary}>
            Save changes
          </button>
        </div>
      </header>

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-5">
          <Section title="Title and summary">
            <div className="flex flex-col gap-2">
              <label htmlFor="piece-title" className={label}>
                Title
              </label>
              <input id="piece-title" value={form.title} onChange={set('title')} className={`${field} h-11`} />
              {isNew && form.title ? <p className="text-[0.75rem] text-soma-clay-deep">Its address will be /articles/{slug}</p> : null}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="piece-excerpt" className={`${label} flex items-baseline justify-between gap-3`}>
                Short summary <CharCount length={form.excerpt.length} max={160} />
              </label>
              <AutoTextarea id="piece-excerpt" minRows={2} value={form.excerpt} onChange={set('excerpt')} />
              <p className="text-[0.75rem] text-soma-clay-deep">Shows under the title on the Writing page, and in Field Notes.</p>
            </div>
          </Section>

          <Section title="The piece" hint="Leave a blank line between paragraphs.">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Segmented
                label="Write or preview"
                value={mode}
                onChange={setMode}
                options={[
                  ['write', 'Write'],
                  ['preview', 'Preview'],
                ]}
              />
              <p className="text-[0.8125rem] text-soma-clay-deep tabular-nums">
                {wordCount(form.body)} words, about {readingTime(form.body)} min to read
              </p>
            </div>
            {mode === 'write' ? (
              <>
                <label htmlFor="piece-body" className="sr-only">
                  The piece
                </label>
                <AutoTextarea id="piece-body" minRows={12} value={form.body} onChange={set('body')} className="text-[1rem] leading-[1.75]" />
              </>
            ) : (
              <article className="rounded-[2px] border border-[#EDE6DA] bg-soma-paper px-5 py-6 sm:px-8">
                <p className="font-display text-[0.9375rem] text-soma-moss italic">{form.topic}</p>
                <h2 className="mt-1 font-display text-[1.875rem] leading-tight font-normal">{form.title || 'Untitled'}</h2>
                <div className="mt-5 flex max-w-[62ch] flex-col gap-4 text-[1.0625rem] leading-[1.8] text-[#2E2924]">
                  {paragraphs.length ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p className="text-soma-clay-deep">Nothing written yet.</p>}
                </div>
              </article>
            )}
          </Section>
        </div>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
          <Section title="Publishing">
            <fieldset className="flex flex-col gap-1">
              <legend className="sr-only">Status</legend>
              {[
                ['Published', 'Published: on the Writing page'],
                ['Draft', 'Draft: only you can see it'],
              ].map(([value, text]) => (
                <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9375rem]">
                  <input type="radio" name="piece-status" checked={form.status === value} onChange={() => update('status', value)} className="h-4 w-4 accent-soma-moss" />
                  {text}
                </label>
              ))}
            </fieldset>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="piece-topic" className={label}>
                  Topic
                </label>
                <select id="piece-topic" value={form.topic} onChange={set('topic')} className={`${field} h-11`}>
                  {topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="piece-date" className={label}>
                  Date
                </label>
                <input id="piece-date" type="date" value={form.date} onChange={set('date')} className={`${field} h-11`} />
              </div>
            </div>
            {form.sentToNotes ? (
              <p className="text-[0.8125rem] text-[#34452F]">Already sent to Field Notes.</p>
            ) : (
              <div className="flex items-start gap-2.5 text-[0.875rem]">
                <Toggle checked={form.sendToNotes} onChange={(on) => update('sendToNotes', on)} label="Send to Field Notes when published" />
                <span className="pt-2.5">
                  Send to Field Notes when published
                  <span className="block text-[0.75rem] text-soma-clay-deep">Goes to {subscribers} people, once.</span>
                </span>
              </div>
            )}
            <div className="rounded-[2px] bg-soma-paper p-3.5">
              <p className="text-[0.8125rem] font-semibold">{ready ? 'Ready to publish' : 'Before it can be published'}</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-[0.8125rem]">
                {checks.map(([what, ok]) => (
                  <li key={what} className={`flex items-center gap-2 ${ok ? 'text-[#34452F]' : 'text-[#5E5045]'}`}>
                    {ok ? <CheckCircleIcon size={16} weight="fill" aria-hidden="true" /> : <CircleIcon size={16} aria-hidden="true" />}
                    <span>
                      {what}
                      <span className="sr-only">{ok ? ': done' : ': not yet'}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section title="Cover photo">
            <PhotoPicker value={form.imageId} onChange={(photoId) => update('imageId', photoId)} />
          </Section>
        </div>
      </div>

      <SearchPreview
        id="piece-seo"
        path={['articles', slug]}
        title={form.seoTitle}
        description={form.seoDescription}
        fallbackTitle={form.title}
        fallbackDescription={form.excerpt}
        onTitle={(value) => update('seoTitle', value)}
        onDescription={(value) => update('seoDescription', value)}
        hint="How this piece may look in search results. Left empty, they use the title and the short summary."
      />

      {!isNew ? (
        <section className={`${panel} flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}>
          <div>
            <h2 className="text-[1rem] font-semibold">Delete this piece</h2>
            <p className="mt-1 text-[0.8125rem] text-soma-clay-deep">It comes off the Writing page straight away.</p>
          </div>
          <button type="button" onClick={deletePiece} className={button.danger}>
            {confirmDelete ? 'Click again to delete for good' : 'Delete piece'}
          </button>
        </section>
      ) : null}
    </form>
  )
}
