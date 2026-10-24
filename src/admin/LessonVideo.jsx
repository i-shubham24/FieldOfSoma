import { useEffect, useRef, useState } from 'react'
import { ArrowsClockwiseIcon } from '@phosphor-icons/react/dist/csr/ArrowsClockwise'
import { FilmSlateIcon } from '@phosphor-icons/react/dist/csr/FilmSlate'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash'
import { UploadSimpleIcon } from '@phosphor-icons/react/dist/csr/UploadSimple'
import { checkVideo, uploadVideo, useMediaUrl } from './media'
import { button, Modal, ProgressBar } from './ui'
import { formatBytes, formatDuration } from './util'

const small = `${button.outline} min-h-9 px-3 text-[0.8125rem]`

function Player({ video, onClose }) {
  const url = useMediaUrl(video.sample ? null : video.id)
  const poster = useMediaUrl(video.hasPoster ? `${video.id}:poster` : null)
  return (
    <Modal title={video.name} onClose={onClose} wide>
      {video.sample ? (
        <p className="text-[0.9375rem] leading-relaxed text-[#3D362F]">
          This lesson uses a sample video, so there is no file to play in this preview. Upload the real recording with
          Replace, and it will play here.
        </p>
      ) : url ? (
        <video src={url} poster={poster ?? undefined} controls autoPlay playsInline className="aspect-video w-full bg-soma-ink" />
      ) : (
        <p className="text-[0.9375rem] text-soma-clay-deep">Opening the video…</p>
      )}
    </Modal>
  )
}

function Thumb({ video }) {
  const poster = useMediaUrl(video.hasPoster ? `${video.id}:poster` : null)
  return poster ? (
    <img src={poster} alt="" className="h-12 w-20 shrink-0 rounded-[2px] bg-soma-ink object-cover" />
  ) : (
    <span aria-hidden="true" className="flex h-12 w-20 shrink-0 items-center justify-center rounded-[2px] bg-[#E6DED1] text-soma-clay-deep">
      <FilmSlateIcon size={20} weight="light" />
    </span>
  )
}

// The video for one lesson. onChange gets the new video details, or null when it is removed.
export default function LessonVideo({ video, lessonName, onChange, onBusy, startWith }) {
  const input = useRef(null)
  const controller = useRef(null)
  const [upload, setUpload] = useState(null) // { name, size, progress }
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [playing, setPlaying] = useState(false)

  const start = async (file) => {
    if (!file) return
    const problem = checkVideo(file)
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    controller.current?.abort()
    const mine = new AbortController()
    controller.current = mine
    setUpload({ name: file.name, size: file.size, progress: 0 })
    onBusy?.(true)
    try {
      const record = await uploadVideo(file, {
        signal: mine.signal,
        onProgress: (progress) => {
          if (controller.current === mine) setUpload((current) => (current ? { ...current, progress } : current))
        },
      })
      onChange(record)
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'The upload did not finish. Please try again.')
    } finally {
      // Only the latest upload clears the progress, in case a newer one has started
      if (controller.current === mine) {
        controller.current = null
        setUpload(null)
        onBusy?.(false)
      }
    }
  }

  // A file chosen with "Add lessons from videos" starts as soon as its lesson appears.
  // Leaving the page stops an upload that has not finished.
  const startRef = useRef(start)
  startRef.current = start
  useEffect(() => {
    if (startWith) startRef.current(startWith)
    return () => controller.current?.abort()
  }, [startWith])

  const picker = (
    <input
      ref={input}
      type="file"
      accept="video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.m4v,.webm"
      className="sr-only"
      tabIndex={-1}
      aria-hidden="true"
      onChange={(event) => {
        start(event.target.files[0])
        event.target.value = ''
      }}
    />
  )

  const dropProps = {
    onDragOver: (event) => {
      event.preventDefault()
      setDragging(true)
    },
    onDragLeave: () => setDragging(false),
    onDrop: (event) => {
      event.preventDefault()
      setDragging(false)
      start(event.dataTransfer.files[0])
    },
  }

  if (upload) {
    return (
      <div className="flex flex-col gap-2 rounded-[2px] border border-[#E4DCCF] bg-[#FFFDF8] p-3">
        <div className="flex items-center justify-between gap-3 text-[0.8125rem]">
          <span className="min-w-0 truncate font-medium">{upload.name}</span>
          <button type="button" onClick={() => controller.current?.abort()} className={`${button.quiet} min-h-9 px-2 text-[0.8125rem]`}>
            Cancel
          </button>
        </div>
        <ProgressBar value={upload.progress} label={`Uploading video for ${lessonName}`} />
        <p className="text-[0.75rem] text-soma-clay-deep tabular-nums" aria-live="polite">
          {upload.progress < 1
            ? `${Math.round(upload.progress * 100)}%, ${formatBytes(upload.size * upload.progress)} of ${formatBytes(upload.size)}`
            : 'Finishing…'}
        </p>
      </div>
    )
  }

  if (!video) {
    return (
      <div
        {...dropProps}
        className={`flex flex-col gap-2 rounded-[2px] border border-dashed p-3 transition-colors sm:flex-row sm:items-center sm:justify-between ${
          dragging ? 'border-soma-moss bg-[#E3E9DE]' : 'border-[#C9BFB0] bg-[#FFFDF8]'
        }`}
      >
        {picker}
        <p className="text-[0.8125rem] text-[#5E5045]">
          <span className="font-medium text-soma-ink">No video yet.</span> Drop a file here, or choose one. MP4, MOV or
          WebM, up to 5 GB.
        </p>
        <button type="button" onClick={() => input.current?.click()} className={`${button.primary} min-h-9 shrink-0 px-3 text-[0.8125rem]`}>
          <UploadSimpleIcon size={15} aria-hidden="true" />
          Upload video
        </button>
        {error ? (
          <p role="alert" className="text-[0.8125rem] font-medium text-[#8E3519] sm:basis-full">
            {error}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div
      {...dropProps}
      className={`flex flex-col gap-3 rounded-[2px] border p-2.5 sm:flex-row sm:items-center ${dragging ? 'border-soma-moss bg-[#E3E9DE]' : 'border-[#E4DCCF] bg-[#FFFDF8]'}`}
    >
      {picker}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Thumb video={video} />
        <div className="min-w-0">
          <p className="truncate text-[0.8125rem] font-medium">{video.name}</p>
          <p className="text-[0.75rem] text-soma-clay-deep tabular-nums">
            {video.sample
              ? `Sample video${video.duration ? `, ${formatDuration(video.duration)}` : ''}`
              : [formatDuration(video.duration), formatBytes(video.size), video.height ? `${video.height}p` : ''].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setPlaying(true)} className={small} aria-label={`Play the video for ${lessonName}`}>
          <PlayIcon size={14} weight="fill" aria-hidden="true" />
          Play
        </button>
        <button type="button" onClick={() => input.current?.click()} className={small} aria-label={`Replace the video for ${lessonName}`}>
          <ArrowsClockwiseIcon size={14} aria-hidden="true" />
          Replace
        </button>
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`${small} text-[#8E3519] hover:border-[#8E3519]`}
          aria-label={`Remove the video from ${lessonName}`}
        >
          <TrashIcon size={14} aria-hidden="true" />
          Remove
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-[0.8125rem] font-medium text-[#8E3519] sm:basis-full">
          {error}
        </p>
      ) : null}
      {playing ? <Player video={video} onClose={() => setPlaying(false)} /> : null}
    </div>
  )
}
