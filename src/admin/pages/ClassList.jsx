import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus'
import { findPhoto, lessonsMissingVideo, useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AdminPhoto, button, PageHeader, panel, SampleNote, Segmented, Tag } from '../ui'
import { rupees } from '../util'

export default function ClassList() {
  useAdminTitle('Recorded classes')
  const { data } = useAdminData()
  const [status, setStatus] = useState('All')
  const visible = data.classes.filter((c) => status === 'All' || c.status === status)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Recorded classes" intro="The classes people can buy and watch on the site.">
        <SampleNote />
        <Link to="/admin/classes/new" className={button.primary}>
          <PlusIcon size={16} weight="bold" aria-hidden="true" />
          Add a class
        </Link>
      </PageHeader>

      <Segmented
        label="Filter by status"
        value={status}
        onChange={setStatus}
        options={['All', 'Published', 'Draft', 'Hidden'].map((s) => [s, `${s} ${s === 'All' ? data.classes.length : data.classes.filter((c) => c.status === s).length}`])}
      />

      {visible.length === 0 ? (
        <p className="border border-dashed border-[#D8CFC1] p-7 text-center text-[0.875rem] text-soma-clay-deep">No classes here yet.</p>
      ) : null}

      <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr))]">
        {visible.map((c) => {
          const missing = lessonsMissingVideo(c)
          return (
            <li key={c.id}>
              <Link to={`/admin/classes/${c.id}`} className={`${panel} group flex h-full flex-col overflow-hidden transition-colors hover:border-[#C9BFB0]`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-soma-linen">
                  <AdminPhoto photo={findPhoto(data, c.imageId)} alt="" sizes="320px" className="photo h-full w-full" />
                  <span className="absolute top-3 left-3">
                    <Tag>{c.status}</Tag>
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <p className="font-display text-[0.9375rem] text-soma-moss italic">{c.practiceName}</p>
                  <h2 className="text-[1.0625rem] leading-snug font-semibold group-hover:text-soma-moss">{c.title}</h2>
                  <p className="text-[0.8125rem] text-soma-clay-deep">
                    {[c.duration, `${c.lessons.length} ${c.lessons.length === 1 ? 'lesson' : 'lessons'}`].filter(Boolean).join(', ')}
                  </p>
                  {missing ? (
                    <p className="text-[0.8125rem] font-medium text-[#8E3519]">
                      {missing === c.lessons.length ? 'No videos yet' : `${missing} ${missing === 1 ? 'lesson needs' : 'lessons need'} a video`}
                    </p>
                  ) : null}
                  <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-[#EDE6DA] pt-3 text-[0.875rem]">
                    <span className="font-semibold tabular-nums">{c.priceValue ? rupees(c.priceValue) : 'No price yet'}</span>
                    <span className="text-soma-clay-deep">
                      {c.sold} sold, {rupees(c.revenue)}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
