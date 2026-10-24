import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { findPhoto, useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AdminPhoto, button, PageHeader, panel, SampleNote, Segmented, Tag } from '../ui'
import { formatDate } from '../util'

export const wordCount = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0)
export const readingTime = (text) => Math.max(1, Math.round(wordCount(text) / 200))

export default function WritingList() {
  useAdminTitle('Writing')
  const { data } = useAdminData()
  const [status, setStatus] = useState('All')
  const pieces = [...data.writing].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  const visible = pieces.filter((w) => status === 'All' || w.status === status)
  const subscribers = data.members.filter((m) => m.fieldNotes).length + data.messages.filter((m) => m.kind === 'notes').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Writing" intro={`Short pieces for the Writing page. Field Notes goes to ${subscribers} people.`}>
        <SampleNote />
        <Link to="/admin/writing/new" className={button.primary}>
          <PlusIcon size={16} weight="bold" aria-hidden="true" />
          New piece
        </Link>
      </PageHeader>

      <Segmented
        label="Filter by status"
        value={status}
        onChange={setStatus}
        options={['All', 'Published', 'Draft'].map((s) => [s, `${s} ${s === 'All' ? pieces.length : pieces.filter((w) => w.status === s).length}`])}
      />

      <ul className={`${panel} divide-y divide-[#EDE6DA]`}>
        {visible.map((piece) => (
          <li key={piece.id}>
            <Link to={`/admin/writing/${piece.id}`} className="group flex items-center gap-4 p-4 hover:bg-soma-paper">
              <AdminPhoto photo={findPhoto(data, piece.imageId)} alt="" sizes="96px" className="photo h-16 w-24 shrink-0 rounded-[2px]" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[0.875rem] text-soma-moss italic">{piece.topic}</span>
                  <Tag>{piece.status}</Tag>
                  {piece.sentToNotes ? <Tag tone="clay">Sent to Field Notes</Tag> : null}
                </span>
                <span className="mt-0.5 block text-[1rem] font-semibold group-hover:text-soma-moss">{piece.title || 'Untitled'}</span>
                <span className="mt-0.5 line-clamp-1 block text-[0.8125rem] text-[#5E5045]">{piece.excerpt}</span>
              </span>
              <span className="hidden shrink-0 text-right text-[0.8125rem] text-soma-clay-deep sm:block">
                <span className="block">{piece.date ? formatDate(piece.date, { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}</span>
                <span className="block">{readingTime(piece.body)} min read</span>
              </span>
            </Link>
          </li>
        ))}
        {visible.length === 0 ? <li className="p-8 text-center text-[0.875rem] text-soma-clay-deep">Nothing here yet.</li> : null}
      </ul>
    </div>
  )
}
