import { AutoTextarea, CharCount, field, label, panel } from './ui'

const cut = (text, max) => (text.length > max ? `${text.slice(0, max - 3)}...` : text)

// How a page may look in Google results, beside the two fields that shape it.
// Empty fields fall back to the page's own title and summary, as the site does.
export default function SearchPreview({ id, path, title, description, fallbackTitle = '', fallbackDescription = '', onTitle, onDescription, hint }) {
  const shownTitle = title || fallbackTitle
  const shownDescription = description || fallbackDescription

  return (
    <section aria-labelledby={`${id}-heading`} className={`${panel} flex flex-col gap-5 p-5 sm:p-6`}>
      <div>
        <h2 id={`${id}-heading`} className="text-[1rem] font-semibold">
          On Google
        </h2>
        {hint ? <p className="mt-1 text-[0.8125rem] text-soma-clay-deep">{hint}</p> : null}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <div className="min-w-0 rounded-[2px] border border-[#EDE6DA] bg-white px-4 py-3.5 font-[Arial,sans-serif]">
          <p className="truncate text-[0.75rem] text-[#4D5156]">fieldofsoma.com › {path.join(' › ')}</p>
          <p className="mt-1 truncate text-[1.25rem] leading-snug text-[#1A0DAB]">{cut(shownTitle || 'Page title', 60)}</p>
          <p className="mt-1 text-[0.875rem] leading-relaxed text-[#4D5156]">{cut(shownDescription || 'A short description of this page.', 155)}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-title`} className={`${label} flex items-baseline justify-between gap-3`}>
              Search title <CharCount length={shownTitle.length} max={60} />
            </label>
            <input id={`${id}-title`} value={title} placeholder={fallbackTitle} onChange={(event) => onTitle(event.target.value)} className={`${field} h-11`} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-description`} className={`${label} flex items-baseline justify-between gap-3`}>
              Search description <CharCount length={shownDescription.length} max={155} />
            </label>
            <AutoTextarea
              id={`${id}-description`}
              minRows={3}
              value={description}
              placeholder={fallbackDescription}
              onChange={(event) => onDescription(event.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
