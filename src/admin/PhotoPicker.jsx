import { useRef, useState } from 'react'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { UploadSimpleIcon } from '@phosphor-icons/react/dist/csr/UploadSimple'
import { uploadPhoto } from './media'
import { findPhoto, useAdminData } from './store'
import { AdminPhoto, button, Modal, Notice } from './ui'

// Uploads photos into the library. Returns the new photo records.
export function usePhotoUpload() {
  const { add, log } = useAdminData()
  const [busy, setBusy] = useState([])
  const [errors, setErrors] = useState([])

  const upload = async (fileList) => {
    const files = [...fileList]
    if (!files.length) return []
    setErrors([])
    setBusy((current) => [...current, ...files.map((f) => f.name)])
    const added = []
    for (const file of files) {
      try {
        const photo = await uploadPhoto(file)
        add('photos', photo)
        added.push(photo)
      } catch (error) {
        setErrors((current) => [...current, `${file.name}: ${error.message}`])
      } finally {
        setBusy((current) => current.filter((name) => name !== file.name))
      }
    }
    if (added.length) log(`Uploaded ${added.length} ${added.length === 1 ? 'photo' : 'photos'}`)
    return added
  }

  return { upload, busy, errors }
}

export function UploadPhotosButton({ onUploaded, multiple = true, children = 'Upload photos', className }) {
  const input = useRef(null)
  const { upload, busy, errors } = usePhotoUpload()
  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={async (event) => {
          const added = await upload(event.target.files)
          event.target.value = ''
          if (added.length) onUploaded?.(added)
        }}
      />
      <button type="button" onClick={() => input.current?.click()} disabled={busy.length > 0} className={className ?? button.outline}>
        <UploadSimpleIcon size={16} aria-hidden="true" />
        {busy.length ? `Uploading ${busy.length}…` : children}
      </button>
      {errors.map((text, index) => (
        <Notice key={`${index}-${text}`} tone="warn">
          {text}
        </Notice>
      ))}
    </>
  )
}

function PickerDialog({ value, onPick, onClose }) {
  const { data } = useAdminData()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = [...data.photos]
    .sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))
    .filter((p) => !q || p.name.toLowerCase().includes(q) || (p.alt ?? '').toLowerCase().includes(q))

  return (
    <Modal title="Choose a photo" onClose={onClose} wide>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-[2px] border border-[#D8CFC1] bg-[#FFFDF8] px-3 text-soma-clay-deep">
            <MagnifyingGlassIcon size={16} aria-hidden="true" />
            <span className="sr-only">Search photos</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or description"
              className="min-w-0 flex-1 bg-transparent text-base text-soma-ink placeholder:text-[#9A8E80] focus:outline-none sm:text-[0.875rem]"
            />
          </label>
          <UploadPhotosButton multiple={false} onUploaded={([photo]) => onPick(photo.id)}>
            Upload a new photo
          </UploadPhotosButton>
        </div>
        <ul className="grid max-h-[60vh] gap-3 overflow-y-auto pr-1 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
          {list.map((photo) => {
            const chosen = photo.id === value
            return (
              <li key={photo.id}>
                <button
                  type="button"
                  onClick={() => onPick(photo.id)}
                  aria-pressed={chosen}
                  className={`group relative block w-full cursor-pointer overflow-hidden rounded-[2px] border-2 text-left ${chosen ? 'border-soma-moss' : 'border-transparent hover:border-[#C9BFB0]'}`}
                >
                  <AdminPhoto photo={photo} sizes="180px" className="aspect-[4/3] w-full" />
                  <span className="block truncate bg-[#FFFDF8] px-2 py-1.5 text-[0.75rem] text-[#3D362F]">{photo.name}</span>
                  {chosen ? (
                    <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-[2px] bg-soma-moss text-soma-paper">
                      <CheckIcon size={14} weight="bold" aria-hidden="true" />
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
        {list.length === 0 ? <p className="text-[0.875rem] text-soma-clay-deep">No photos match.</p> : null}
      </div>
    </Modal>
  )
}

// The chosen photo, with buttons to change or remove it.
export default function PhotoPicker({ value, onChange, round = false, allowRemove = true }) {
  const { data } = useAdminData()
  const [open, setOpen] = useState(false)
  const photo = findPhoto(data, value)

  return (
    <div className="flex flex-col gap-3">
      <AdminPhoto
        photo={photo}
        className={
          round
            ? 'h-28 w-28 rounded-[50%]'
            : photo
              ? 'aspect-[16/10] w-full rounded-[2px]'
              : 'h-28 w-full rounded-[2px] border border-dashed border-[#D8CFC1]'
        }
      />
      {photo && !photo.alt ? (
        <p className="text-[0.8125rem] text-[#8E3519]">This photo has no description yet. Add one in Photos, for people using screen readers.</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpen(true)} className={button.outline}>
          {photo ? 'Change photo' : 'Choose a photo'}
        </button>
        {photo && allowRemove ? (
          <button type="button" onClick={() => onChange(null)} className={button.quiet}>
            Remove
          </button>
        ) : null}
      </div>
      {open ? (
        <PickerDialog
          value={value}
          onClose={() => setOpen(false)}
          onPick={(id) => {
            onChange(id)
            setOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
