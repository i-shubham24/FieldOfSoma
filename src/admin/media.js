import { useEffect, useState } from 'react'
import { newId } from './util'

// Videos and photos uploaded in the admin.
//
// PREVIEW (now): files are checked, then kept in this browser with IndexedDB, so they play
// and show after a reload. Nothing leaves the computer.
//
// LIVE (when the backend is connected), only uploadVideo and uploadPhoto change:
// - Videos go to Bunny Stream as private videos. A Supabase edge function creates the video
//   and signs the upload; the browser then sends the file in resumable pieces (tus), so a
//   dropped connection carries on where it stopped. Bunny makes the streaming versions.
// - Photos go to Supabase Storage as WebP, made here in the browser first (see uploadPhoto).

const DB_NAME = 'soma_admin_media'
const STORE = 'files'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function run(mode, action) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode)
    const request = action(transaction.objectStore(STORE))
    transaction.oncomplete = () => {
      db.close()
      resolve(request?.result)
    }
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving the file was stopped.'))
  })
}

export const putFile = (id, blob) => run('readwrite', (store) => store.put(blob, id))
export const getFile = (id) => run('readonly', (store) => store.get(id))
export const deleteFile = (id) => run('readwrite', (store) => store.delete(id))
export const listFileIds = () => run('readonly', (store) => store.getAllKeys())
export const clearFiles = () => run('readwrite', (store) => store.clear())

// When a file was saved, read from its id (newId puts the time first, after the prefix)
const savedAt = (id) => parseInt(String(id).split(':')[0].split('_')[1]?.slice(0, 8) ?? '', 36)

// Deletes saved files that nothing points to any more (a replaced video, an upload that was
// never saved). Only files older than a day go, so an upload still open in another tab is safe.
export async function removeUnusedFiles(usedIds) {
  try {
    const keep = new Set(usedIds)
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000
    const ids = await listFileIds()
    const unused = ids.filter((id) => {
      const time = savedAt(id)
      return !keep.has(String(id).split(':')[0]) && Number.isFinite(time) && time < dayAgo
    })
    await Promise.all(unused.map((id) => deleteFile(id)))
  } catch {
    // Storage blocked or unavailable: nothing to tidy
  }
}

// A temporary address for a saved file, so an <img> or <video> can show it.
// `missing` turns true when the file is no longer in this browser.
export function useMediaFile(id) {
  const [entry, setEntry] = useState({ id: null, url: null, missing: false })

  useEffect(() => {
    if (!id) return undefined
    let objectUrl = null
    let alive = true
    getFile(id)
      .then((blob) => {
        if (!alive) return
        if (!blob) {
          setEntry({ id, url: null, missing: true })
          return
        }
        objectUrl = URL.createObjectURL(blob)
        setEntry({ id, url: objectUrl, missing: false })
      })
      .catch(() => alive && setEntry({ id, url: null, missing: true }))
    return () => {
      alive = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id])

  return entry.id === id ? entry : { url: null, missing: false }
}

export const useMediaUrl = (id) => useMediaFile(id).url

/* Checking what a file really is */

// The first bytes of a file say what it is, whatever its name claims. A renamed .exe or
// .html file called "class.mp4" is turned away here.
async function sniff(file) {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const text = (from, to) => String.fromCharCode(...head.slice(from, to))
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpeg'
  if (head[0] === 0x89 && text(1, 4) === 'PNG') return 'png'
  if (text(0, 4) === 'RIFF' && text(8, 12) === 'WEBP') return 'webp'
  // MP4, MOV and M4V start with an "ftyp" box; older QuickTime files with one of these
  if (['ftyp', 'moov', 'mdat', 'wide', 'free', 'skip'].includes(text(4, 8))) return 'mp4'
  if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) return 'webm'
  return null
}

// File names are shown on screen and kept, so keep them plain and short.
export const safeName = (name) =>
  String(name)
    .replace(/^.*[\\/]/, '')
    .replace(/[\u0000-\u001F\u007F<>:"|?*]/g, '')
    .trim()
    .slice(0, 120) || 'file'

/* Videos */

export const MAX_VIDEO_BYTES = 5 * 1024 ** 3
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v']

export function checkVideo(file) {
  if (!VIDEO_TYPES.includes(file.type) && !/\.(mp4|m4v|mov|webm)$/i.test(file.name)) {
    return 'Choose a video file: MP4, MOV or WebM.'
  }
  if (file.size === 0) return 'This file is empty.'
  if (file.size > MAX_VIDEO_BYTES) return 'This video is over 5 GB. Export it a little smaller and try again.'
  return ''
}

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Upload stopped', 'AbortError'))
    })
  })

// Reads the length and size of a video, and grabs a still frame to use as its thumbnail.
function readVideo(file, signal) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    let finished = false
    const done = (result, error) => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      URL.revokeObjectURL(url)
      video.removeAttribute('src')
      video.load()
      if (error) reject(error)
      else resolve(result)
    }
    const timer = setTimeout(
      () => done(null, new Error('This video took too long to open. Try exporting it again as MP4.')),
      20000,
    )
    video.onerror = () => done(null, new Error('This video could not be opened. Try exporting it again as MP4 (H.264).'))
    signal?.addEventListener('abort', () => done(null, new DOMException('Upload stopped', 'AbortError')), { once: true })
    video.onloadedmetadata = () => {
      const length = Number.isFinite(video.duration) ? video.duration : null
      const info = { duration: length, width: video.videoWidth, height: video.videoHeight, poster: null }
      // No picture or no known length: keep the video, skip the thumbnail
      if (!video.videoWidth || !length) {
        done(info)
        return
      }
      const noFrame = setTimeout(() => done(info), 5000)
      video.onseeked = () => {
        clearTimeout(noFrame)
        try {
          const canvas = document.createElement('canvas')
          const scale = Math.min(1, 480 / video.videoWidth)
          canvas.width = Math.round(video.videoWidth * scale)
          canvas.height = Math.round(video.videoHeight * scale)
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => done({ ...info, poster: blob }), 'image/jpeg', 0.75)
        } catch {
          done(info)
        }
      }
      video.currentTime = Math.min(2, length / 10)
    }
    video.src = url
  })
}

// Checks, reads and keeps a video. onProgress gets a number from 0 to 1.
export async function uploadVideo(file, { onProgress = () => {}, signal } = {}) {
  const problem = checkVideo(file)
  if (problem) throw new Error(problem)
  if (!['mp4', 'webm'].includes(await sniff(file))) {
    throw new Error('This file does not look like a video, even though its name says so. Export it again as MP4.')
  }

  if (signal?.aborted) throw new DOMException('Upload stopped', 'AbortError')
  const info = await readVideo(file, signal)
  if (signal?.aborted) throw new DOMException('Upload stopped', 'AbortError')

  // Preview: show the transfer at a steady speed, then keep the file in this browser.
  const seconds = Math.min(12, Math.max(1.5, file.size / (40 * 1024 ** 2)))
  const steps = Math.round(seconds * 10)
  for (let step = 1; step <= steps; step += 1) {
    await wait(100, signal)
    onProgress(Math.min(0.97, step / steps))
  }

  const id = newId('vid_')
  await putFile(id, file)
  if (info.poster) await putFile(`${id}:poster`, info.poster)
  // Cancelled while the file was being saved: take it back out
  if (signal?.aborted) {
    await Promise.all([deleteFile(id), deleteFile(`${id}:poster`)]).catch(() => {})
    throw new DOMException('Upload stopped', 'AbortError')
  }
  onProgress(1)

  return {
    id,
    name: safeName(file.name),
    size: file.size,
    duration: info.duration,
    width: info.width,
    height: info.height,
    hasPoster: Boolean(info.poster),
    uploadedAt: Date.now(),
  }
}

/* Photos */

export const MAX_PHOTO_BYTES = 25 * 1024 ** 2
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function checkPhoto(file) {
  if (!PHOTO_TYPES.includes(file.type)) return 'Choose a JPG, PNG or WebP photo.'
  if (file.size > MAX_PHOTO_BYTES) return 'This photo is over 25 MB. Export it a little smaller and try again.'
  return ''
}

// Makes a web-sized WebP (up to 1600 px wide), the same format the site uses, and keeps it.
export async function uploadPhoto(file) {
  const problem = checkPhoto(file)
  if (problem) throw new Error(problem)
  if (!['jpeg', 'png', 'webp'].includes(await sniff(file))) {
    throw new Error('This file does not look like a photo, even though its name says so. Save it again as a JPG.')
  }

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('This photo could not be opened. Try saving it again as a JPG.')
  }
  // Very large images can freeze the browser, and no web photo needs more than 40 megapixels
  if (bitmap.width * bitmap.height > 40_000_000) {
    bitmap.close()
    throw new Error('This photo is too large. Make it under 8000 px on its longest side and try again.')
  }
  const scale = Math.min(1, 1600 / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const { width, height } = bitmap
  bitmap.close()
  const webp = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82))
  const blob = webp ?? file

  const id = newId('img_')
  await putFile(id, blob)

  return {
    id,
    mediaId: id,
    source: 'upload',
    name: safeName(file.name).replace(/\.[^.]+$/, ''),
    alt: '',
    width,
    height,
    size: blob.size,
    addedAt: Date.now(),
  }
}
