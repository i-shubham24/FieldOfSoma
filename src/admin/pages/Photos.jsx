import { useState } from 'react'
import { UploadSimpleIcon } from '@phosphor-icons/react/dist/csr/UploadSimple'
import { usePhotoUpload } from '../PhotoPicker'
import { useAdminData } from '../store'
import useAdminTitle from '../useAdminTitle'
import { AdminPhoto, AutoTextarea, button, Notice, PageHeader, panel, SampleNote, Segmented, Tag } from '../ui'
import { formatBytes } from '../util'

// Where a photo is used in the admin's own records
function usesOf(data, photoId) {
  const uses = []
  data.classes.forEach((c) => c.imageId === photoId && uses.push(`Class: ${c.title}`))
  data.writing.forEach((w) => w.imageId === photoId && uses.push(`Writing: ${w.title}`))
  if (data.profile.photoId === photoId) uses.push('Your profile')
  return uses
}

function PhotoCard({ photo }) {
  const { data, patch, remove, log } = useAdminData()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const uses = usesOf(data, photo.id)
  const fromSite = photo.source === 'site'

  return (
    <li className={`${panel} flex flex-col overflow-hidden`}>
      <AdminPhoto photo={photo} sizes="320px" className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-[0.875rem] font-semibold" title={photo.name}>
            {photo.name}
          </p>
          {fromSite ? <Tag tone="clay">On the site</Tag> : <Tag tone="moss">Uploaded</Tag>}
        </div>
        {!fromSite ? (
          <p className="text-[0.75rem] text-soma-clay-deep tabular-nums">
            {photo.width} by {photo.height} px, {formatBytes(photo.size)}
            {photo.width < 1200 ? <span className="block font-medium text-[#8E3519]">Small for a full-width photo. 1200 px wide or more looks best.</span> : null}
          </p>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`alt-${photo.id}`} className="text-[0.8125rem] font-semibold">
            Description
          </label>
          <AutoTextarea
            id={`alt-${photo.id}`}
            minRows={2}
            value={photo.alt ?? ''}
            onChange={(event) => patch('photos', photo.id, { alt: event.target.value })}
            placeholder="What is in the photo, for people who cannot see it"
            className="text-[0.875rem]"
          />
          {!photo.alt ? <p className="text-[0.75rem] font-medium text-[#8E3519]">Needs a description</p> : null}
        </div>
        {uses.length ? (
          <ul className="flex flex-col gap-0.5 text-[0.75rem] text-[#5E5045]">
            {uses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        ) : null}
        {!fromSite ? (
          <div className="mt-auto pt-1">
            {uses.length ? (
              <p className="text-[0.75rem] text-soma-clay-deep">In use, so it cannot be deleted. Choose another photo there first.</p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!confirmDelete) {
                    setConfirmDelete(true)
                    return
                  }
                  remove('photos', photo.id)
                  log(`Deleted the photo ${photo.name}`)
                }}
                className={`${button.danger} min-h-10`}
              >
                {confirmDelete ? 'Click again to delete' : 'Delete photo'}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </li>
  )
}

export default function Photos() {
  useAdminTitle('Photos')
  const { data } = useAdminData()
  const { upload, busy, errors } = usePhotoUpload()
  const [filter, setFilter] = useState('all')
  const [dragging, setDragging] = useState(false)
  const [added, setAdded] = useState(0)

  const sorted = [...data.photos].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))
  const visible = sorted.filter(
    (p) =>
      filter === 'all' ||
      (filter === 'upload' && p.source === 'upload') ||
      (filter === 'site' && p.source === 'site') ||
      (filter === 'missing' && !p.alt),
  )
  const missing = data.photos.filter((p) => !p.alt).length

  const take = async (files) => {
    const result = await upload(files)
    setAdded(result.length)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Photos" intro="Every photo you can use for classes, writing and your profile.">
        <SampleNote />
      </PageHeader>

      <label
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          take(event.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed px-6 py-8 text-center transition-colors focus-within:border-soma-moss ${
          dragging ? 'border-soma-moss bg-[#E3E9DE]' : 'border-[#C9BFB0] bg-[#FFFDF8] hover:border-soma-moss'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            take(event.target.files)
            event.target.value = ''
          }}
        />
        <UploadSimpleIcon size={26} weight="light" className="text-soma-moss" aria-hidden="true" />
        <span className="text-[0.9375rem] font-semibold">{busy.length ? `Uploading ${busy.length}…` : 'Drop photos here, or click to choose'}</span>
        <span className="text-[0.8125rem] text-soma-clay-deep">
          JPG, PNG or WebP, up to 25 MB each. They are made web-ready (WebP, up to 1600 px wide) as they upload.
        </span>
      </label>

      {added ? <Notice>{added === 1 ? 'Photo added.' : `${added} photos added.`} Give each a short description below.</Notice> : null}
      {errors.map((text) => (
        <Notice key={text} tone="warn">
          {text}
        </Notice>
      ))}

      <Segmented
        label="Show"
        value={filter}
        onChange={setFilter}
        options={[
          ['all', `All ${data.photos.length}`],
          ['upload', 'Uploaded'],
          ['site', 'On the site'],
          ['missing', `Need a description ${missing}`],
        ]}
      />

      <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(250px,100%),1fr))]">
        {visible.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </ul>
      {visible.length === 0 ? <p className="border border-dashed border-[#D8CFC1] p-7 text-center text-[0.875rem] text-soma-clay-deep">Nothing here.</p> : null}
    </div>
  )
}
