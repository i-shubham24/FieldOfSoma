import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowDownIcon } from '@phosphor-icons/react/dist/csr/ArrowDown'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { ArrowSquareOutIcon } from '@phosphor-icons/react/dist/csr/ArrowSquareOut'
import { ArrowUpIcon } from '@phosphor-icons/react/dist/csr/ArrowUp'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/csr/CheckCircle'
import { CircleIcon } from '@phosphor-icons/react/dist/csr/Circle'
import { FilmSlateIcon } from '@phosphor-icons/react/dist/csr/FilmSlate'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash'
import { classes as siteClasses } from '../../content/classes'
import LessonVideo from '../LessonVideo'
import { safeName } from '../media'
import PhotoPicker from '../PhotoPicker'
import SearchPreview from '../SearchPreview'
import { PRACTICES } from '../sampleData'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AutoTextarea, button, field, label, Notice, panel, SampleNote, Tag, Toggle } from '../ui'
import { formatDuration, newId, rupees, slugify } from '../util'
import NotFound from './NotFound'

const LEVELS = ['All levels', 'Beginners', 'Some experience']
const ON_SITE = new Set(siteClasses.items.map((c) => c.id))

const blankLesson = (title = '') => ({ id: newId('l'), title, length: '', preview: false, video: null })

const BLANK = {
  title: '',
  subtitle: '',
  practiceName: PRACTICES[0],
  level: LEVELS[0],
  duration: '',
  priceValue: 0,
  originalValue: 0,
  status: 'Draft',
  imageId: null,
  overview: [],
  whatYouWillLearn: [''],
  requirements: [],
  lessons: [{ ...blankLesson(), preview: true }],
  seoTitle: '',
  seoDescription: '',
}

function toForm(source) {
  return {
    title: source.title,
    subtitle: source.subtitle ?? '',
    practiceName: source.practiceName,
    level: source.level,
    duration: source.duration ?? '',
    price: source.priceValue ? String(source.priceValue) : '',
    was: source.originalValue ? String(source.originalValue) : '',
    status: source.status,
    imageId: source.imageId ?? null,
    about: (source.overview ?? []).join('\n\n'),
    learn: source.whatYouWillLearn?.length ? [...source.whatYouWillLearn] : [''],
    needs: (source.requirements ?? []).join('\n'),
    lessons: source.lessons.map((lesson) => ({ ...lesson })),
    seoTitle: source.seoTitle ?? '',
    seoDescription: source.seoDescription ?? '',
  }
}

const lines = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

function fromForm(form) {
  const totalSeconds = form.lessons.reduce((total, lesson) => total + (lesson.video?.duration || 0), 0)
  return {
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    practiceName: form.practiceName,
    level: form.level,
    duration: form.duration.trim() || (totalSeconds ? `${Math.max(1, Math.round(totalSeconds / 60))} min` : ''),
    priceValue: Number(form.price) || 0,
    originalValue: Number(form.was) || 0,
    status: form.status,
    imageId: form.imageId,
    overview: form.about
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    whatYouWillLearn: form.learn.map((l) => l.trim()).filter(Boolean),
    requirements: lines(form.needs),
    lessons: form.lessons.map(({ startWith: _unused, ...lesson }) => ({ ...lesson, title: lesson.title.trim() })),
    seoTitle: form.seoTitle.trim(),
    seoDescription: form.seoDescription.trim(),
  }
}

// What a class needs before it can go on sale
function readiness(form) {
  return [
    ['A title', Boolean(form.title.trim())],
    ['A price', Number(form.price) > 0],
    ['A cover photo', Boolean(form.imageId)],
    ['At least one lesson', form.lessons.length > 0],
    ['Every lesson has a title', form.lessons.every((l) => l.title.trim())],
    ['Every lesson has a video', form.lessons.length > 0 && form.lessons.every((l) => l.video)],
  ]
}

function Section({ title, hint, children, action }) {
  return (
    <section className={`${panel} flex flex-col gap-4 p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[1rem] font-semibold">{title}</h2>
          {hint ? <p className="mt-1 text-[0.8125rem] text-soma-clay-deep">{hint}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

const iconButton =
  'flex h-11 w-9 cursor-pointer items-center justify-center text-soma-clay-deep hover:text-soma-ink disabled:cursor-default disabled:opacity-30'

// Keyed by the class id, so moving from one class to another starts a fresh form.
export default function ClassEditor() {
  const { id } = useParams()
  const { data } = useAdminData()
  // A mistyped address should not open an empty form, so anything but "new" must be a real class.
  if (id !== 'new' && !data.classes.some((c) => c.id === id)) return <NotFound />
  return <Editor key={id} id={id} />
}

function Editor({ id }) {
  const { data, add, patch, remove, log } = useAdminData()
  const navigate = useNavigate()
  const location = useLocation()
  const isNew = id === 'new'
  const saved = isNew ? null : data.classes.find((c) => c.id === id)
  useAdminTitle(isNew ? 'New class' : saved.title)

  const [form, setForm] = useState(() => toForm(saved ?? BLANK))
  const [notice, setNotice] = useState(location.state?.notice ?? null)
  const [busy, setBusy] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const bulkInput = useRef(null)

  const dirty = JSON.stringify(fromForm(form)) !== JSON.stringify(fromForm(toForm(saved ?? BLANK)))
  const uploading = Object.values(busy).some(Boolean)

  // Closing the tab with unsaved changes or an upload running asks first
  useEffect(() => {
    if (!dirty && !uploading) return undefined
    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty, uploading])

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: typeof value === 'function' ? value(current[key]) : value }))
    setNotice(null)
  }
  const set = (key) => (event) => update(key, event.target.value)
  const updateLesson = (lessonId, changes) =>
    update('lessons', (lessons) => lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, ...changes } : lesson)))
  const moveLesson = (index, step) =>
    update('lessons', (lessons) => {
      const next = [...lessons]
      const [item] = next.splice(index, 1)
      next.splice(index + step, 0, item)
      return next
    })

  // One new lesson per video, named after the file, each starting its upload straight away
  const addFromVideos = (files) => {
    const created = [...files].map((file) => ({
      ...blankLesson(safeName(file.name).replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()),
      startWith: file,
    }))
    if (created.length) update('lessons', (lessons) => [...lessons, ...created])
  }

  const price = Number(form.price) || 0
  const was = Number(form.was) || 0
  const off = was > price && price > 0 ? Math.round((1 - price / was) * 100) : 0
  const checks = readiness(form)
  const ready = checks.every(([, ok]) => ok)
  const videoSeconds = form.lessons.reduce((total, lesson) => total + (lesson.video?.duration || 0), 0)
  const slug = isNew ? slugify(form.title || 'new-class', ['new', ...data.classes.map((c) => c.id)]) : id

  const save = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setNotice({ tone: 'warn', text: 'Give the class a title before saving.' })
      return
    }
    if (uploading) {
      setNotice({ tone: 'warn', text: 'A video is still uploading. Save once it has finished.' })
      return
    }
    let record = fromForm(form)
    let message = 'Saved.'
    if (record.status === 'Published' && !ready) {
      record = { ...record, status: 'Draft' }
      setForm((current) => ({ ...current, status: 'Draft' }))
      const missing = checks.filter(([, ok]) => !ok).map(([what]) => what.toLowerCase())
      message = `Saved as a draft. To publish, it still needs: ${missing.join(', ')}.`
    }

    if (isNew) {
      const newClass = { ...record, id: slug, sold: 0, revenue: 0 }
      add('classes', newClass, { atEnd: true })
      log(`Added the class "${record.title}"`)
      navigate(`/admin/classes/${slug}`, { replace: true, state: { notice: { tone: message === 'Saved.' ? 'moss' : 'warn', text: message } } })
      return
    }
    patch('classes', id, record)
    log(`Saved the class "${record.title}"${record.status !== saved.status ? `, now ${record.status.toLowerCase()}` : ''}`)
    setNotice({ tone: message === 'Saved.' ? 'moss' : 'warn', text: message === 'Saved.' ? 'Saved. Your changes are kept.' : message })
  }

  const deleteClass = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    remove('classes', id)
    log(`Deleted the class "${saved.title}"`)
    navigate('/admin/classes')
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-6" noValidate>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E4DCCF] pb-6">
        <div className="min-w-0">
          <Link to="/admin/classes" className="inline-flex min-h-9 items-center gap-1.5 text-[0.8125rem] font-medium text-soma-clay-deep hover:text-soma-ink">
            <ArrowLeftIcon size={14} aria-hidden="true" />
            Recorded classes
          </Link>
          <h1 className="mt-1 flex flex-wrap items-center gap-3 font-display text-[clamp(1.75rem,3vw,2.125rem)] leading-tight font-normal">
            {form.title || 'New class'}
            <Tag>{form.status}</Tag>
            {dirty ? <Tag tone="sand">Unsaved changes</Tag> : null}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SampleNote />
          {!isNew && ON_SITE.has(id) ? (
            <a href={`/classes/${id}`} target="_blank" rel="noreferrer" className={button.outline}>
              See it on the site
              <ArrowSquareOutIcon size={15} aria-hidden="true" />
            </a>
          ) : null}
          <button type="submit" className={button.primary} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Save changes'}
          </button>
        </div>
      </header>

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-5">
          <Section title="The basics">
            <div className="flex flex-col gap-2">
              <label htmlFor="class-title" className={label}>
                Title
              </label>
              <input id="class-title" value={form.title} onChange={set('title')} required className={`${field} h-11`} />
              {isNew && form.title ? <p className="text-[0.75rem] text-soma-clay-deep">Its address will be /classes/{slug}</p> : null}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="class-subtitle" className={label}>
                Short line under the title
              </label>
              <AutoTextarea id="class-subtitle" minRows={2} value={form.subtitle} onChange={set('subtitle')} />
            </div>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
              <div className="flex flex-col gap-2">
                <label htmlFor="class-practice" className={label}>
                  Practice
                </label>
                <select id="class-practice" value={form.practiceName} onChange={set('practiceName')} className={`${field} h-11`}>
                  {PRACTICES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="class-level" className={label}>
                  Level
                </label>
                <select id="class-level" value={form.level} onChange={set('level')} className={`${field} h-11`}>
                  {LEVELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="class-length" className={label}>
                  Length
                </label>
                <input
                  id="class-length"
                  value={form.duration}
                  onChange={set('duration')}
                  placeholder={videoSeconds ? `${Math.max(1, Math.round(videoSeconds / 60))} min` : '45 min'}
                  className={`${field} h-11`}
                />
              </div>
            </div>
          </Section>

          <Section title="About this class" hint="Leave a blank line between paragraphs.">
            <label htmlFor="class-about" className="sr-only">
              About this class
            </label>
            <AutoTextarea id="class-about" minRows={5} value={form.about} onChange={set('about')} />
          </Section>

          <Section
            title="Lessons"
            hint={`Each lesson needs a video before the class can be published. Free previews can be watched by anyone.${
              videoSeconds ? ` Videos so far: ${formatDuration(videoSeconds)} in total.` : ''
            }`}
          >
            <ol className="flex flex-col gap-3">
              {form.lessons.map((lesson, index) => {
                const name = lesson.title || `lesson ${index + 1}`
                return (
                  <li key={lesson.id} className="flex flex-col gap-3 rounded-[2px] border border-[#EDE6DA] bg-soma-paper p-3.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="flex h-11 w-7 shrink-0 items-center text-[0.8125rem] font-semibold text-soma-clay-deep tabular-nums">{index + 1}</span>
                      <label htmlFor={`lesson-title-${lesson.id}`} className="sr-only">
                        Lesson {index + 1} title
                      </label>
                      <input
                        id={`lesson-title-${lesson.id}`}
                        value={lesson.title}
                        onChange={(event) => updateLesson(lesson.id, { title: event.target.value })}
                        placeholder="Lesson title"
                        className={`${field} h-11 min-w-0 flex-[1_1_220px]`}
                      />
                      <div className="ml-auto flex shrink-0 items-center">
                        <button type="button" disabled={index === 0} onClick={() => moveLesson(index, -1)} aria-label={`Move ${name} up`} className={iconButton}>
                          <ArrowUpIcon size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={index === form.lessons.length - 1}
                          onClick={() => moveLesson(index, 1)}
                          aria-label={`Move ${name} down`}
                          className={iconButton}
                        >
                          <ArrowDownIcon size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => update('lessons', (lessons) => lessons.filter((l) => l.id !== lesson.id))}
                          aria-label={`Remove ${name}`}
                          className={`${iconButton} hover:text-[#8E3519]`}
                        >
                          <TrashIcon size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="sm:pl-9">
                      <LessonVideo
                        video={lesson.video}
                        lessonName={name}
                        startWith={lesson.startWith}
                        onBusy={(on) => setBusy((current) => ({ ...current, [lesson.id]: on }))}
                        onChange={(video) =>
                          updateLesson(lesson.id, {
                            video,
                            startWith: undefined,
                            ...(video?.duration ? { length: formatDuration(video.duration) } : {}),
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-[#3D362F] sm:pl-9">
                      <span className="flex items-center gap-2">
                        <label htmlFor={`lesson-length-${lesson.id}`}>Length</label>
                        <input
                          id={`lesson-length-${lesson.id}`}
                          value={lesson.length}
                          onChange={(event) => updateLesson(lesson.id, { length: event.target.value })}
                          placeholder="12:30"
                          className={`${field} h-10 w-24`}
                        />
                      </span>
                      <span className="flex items-center gap-2">
                        <Toggle
                          checked={lesson.preview}
                          onChange={(on) => updateLesson(lesson.id, { preview: on })}
                          label={`${name} is a free preview`}
                        />
                        Free preview, anyone can watch it
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={() => update('lessons', (lessons) => [...lessons, blankLesson()])} className={button.outline}>
                <PlusIcon size={15} aria-hidden="true" />
                Add a lesson
              </button>
              <input
                ref={bulkInput}
                type="file"
                multiple
                accept="video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.m4v,.webm"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(event) => {
                  addFromVideos(event.target.files)
                  event.target.value = ''
                }}
              />
              <button type="button" onClick={() => bulkInput.current?.click()} className={button.outline}>
                <FilmSlateIcon size={16} aria-hidden="true" />
                Add lessons from videos
              </button>
            </div>
            <p className="text-[0.75rem] leading-relaxed text-soma-clay-deep">
              Tip: choose several videos at once and each becomes a lesson, named after its file. Lengths fill in from the
              videos.
            </p>
          </Section>

        </div>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
          <Section title="Cover photo">
            <PhotoPicker value={form.imageId} onChange={(photoId) => update('imageId', photoId)} />
          </Section>

          <Section title="Price">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="class-price" className={label}>
                  Price (₹)
                </label>
                <input id="class-price" type="number" min="0" inputMode="numeric" value={form.price} onChange={set('price')} className={`${field} h-11`} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="class-was" className={label}>
                  Was (₹)
                </label>
                <input id="class-was" type="number" min="0" inputMode="numeric" value={form.was} onChange={set('was')} placeholder="Optional" className={`${field} h-11`} />
              </div>
            </div>
            <p className="text-[0.8125rem] text-[#5E5045]">
              {off ? `Shows as ${rupees(price)}, ${off}% off ${rupees(was)}.` : 'No discount shown. Add a "was" price to show one.'}
            </p>
          </Section>

          <Section title="Who can see it">
            <fieldset className="flex flex-col gap-1">
              <legend className="sr-only">Visibility</legend>
              {[
                ['Published', 'Published: on the site and for sale'],
                ['Draft', 'Draft: only you can see it'],
                ['Hidden', 'Hidden: off the site, buyers keep access'],
              ].map(([value, text]) => (
                <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9375rem]">
                  <input type="radio" name="class-status" checked={form.status === value} onChange={() => update('status', value)} className="h-4 w-4 accent-soma-moss" />
                  {text}
                </label>
              ))}
            </fieldset>
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

          {!isNew ? (
            <Section title="How it is doing">
              <dl className="grid grid-cols-2 gap-3 text-[0.875rem]">
                <div>
                  <dt className="text-soma-clay-deep">Sold</dt>
                  <dd className="font-display text-[1.5rem]">{saved.sold}</dd>
                </div>
                <div>
                  <dt className="text-soma-clay-deep">Money in</dt>
                  <dd className="font-display text-[1.5rem]">{rupees(saved.revenue)}</dd>
                </div>
              </dl>
            </Section>
          ) : null}

          <Section title="What you will practise" hint="Short lines. They show as a ticked list on the class page.">
            <ul className="flex flex-col gap-2">
              {form.learn.map((line, index) => (
                <li key={index} className="flex gap-2">
                  <label htmlFor={`learn-${index}`} className="sr-only">
                    Line {index + 1}
                  </label>
                  <input
                    id={`learn-${index}`}
                    value={line}
                    onChange={(event) => update('learn', (all) => all.map((l, i) => (i === index ? event.target.value : l)))}
                    className={`${field} h-11`}
                  />
                  <button
                    type="button"
                    onClick={() => update('learn', (all) => all.filter((_, i) => i !== index))}
                    aria-label={`Remove line ${index + 1}`}
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-soma-clay-deep hover:text-[#8E3519]"
                  >
                    <TrashIcon size={17} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => update('learn', (all) => [...all, ''])} className={`${button.outline} self-start`}>
              <PlusIcon size={15} aria-hidden="true" />
              Add a line
            </button>
          </Section>

          <Section title="You will need" hint="One item per line.">
            <label htmlFor="class-needs" className="sr-only">
              You will need
            </label>
            <AutoTextarea id="class-needs" minRows={3} value={form.needs} onChange={set('needs')} />
          </Section>
        </div>
      </div>

      <SearchPreview
        id="class-seo"
        path={['classes', slug]}
        title={form.seoTitle}
        description={form.seoDescription}
        fallbackTitle={form.title ? `${form.title}: Recorded ${form.practiceName} Class` : ''}
        fallbackDescription={form.subtitle}
        onTitle={(value) => update('seoTitle', value)}
        onDescription={(value) => update('seoDescription', value)}
        hint="How this class may look in search results. Left empty, they use the title and the short line."
      />

      {!isNew && saved.sold === 0 ? (
        <section className={`${panel} flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}>
          <div>
            <h2 className="text-[1rem] font-semibold">Delete this class</h2>
            <p className="mt-1 text-[0.8125rem] text-soma-clay-deep">Only classes nobody has bought can be deleted. Bought classes can be hidden instead.</p>
          </div>
          <button type="button" onClick={deleteClass} className={button.danger}>
            {confirmDelete ? 'Click again to delete for good' : 'Delete class'}
          </button>
        </section>
      ) : null}
    </form>
  )
}
