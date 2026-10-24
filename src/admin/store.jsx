import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { clearFiles, removeUnusedFiles } from './media'
import { DATA_VERSION, seedData } from './sampleData'
import { newId } from './util'

// The admin's data. Every screen reads and changes it through useAdminData().
//
// PREVIEW (now): it lives in this browser (localStorage), starting from the sample data, so
// changes stay after a reload and show on every screen at once. Other people do not see them.
// LIVE: this file is the only one that changes. The same calls (patch, add, remove, setValue)
// become Supabase writes, and the screens stay as they are.

const STORAGE_KEY = 'soma_admin_data'
const AdminData = createContext(null)

// Version 3 dropped test orders, the team list and the test payment switch
function upgradeFrom2(saved) {
  const { team: _team, paymentMode: _mode, ...settings } = saved.settings
  return { ...saved, version: DATA_VERSION, orders: saved.orders.filter((o) => o.status !== 'Test'), settings }
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.version === DATA_VERSION) return saved
    if (saved?.version === 2) return upgradeFrom2(saved)
  } catch {
    // Nothing saved yet, or storage blocked: start from the sample data
  }
  return seedData()
}

// Every saved file a record still points to: lesson videos and uploaded photos.
function usedFileIds(data) {
  const ids = []
  data.classes.forEach((c) => c.lessons.forEach((lesson) => lesson.video && !lesson.video.sample && ids.push(lesson.video.id)))
  data.photos.forEach((photo) => photo.mediaId && ids.push(photo.mediaId))
  return ids
}

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(loadData)
  const [saveFailed, setSaveFailed] = useState(false)
  const latest = useRef(data)

  useEffect(() => {
    latest.current = data
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setSaveFailed(false)
    } catch {
      setSaveFailed(true)
    }
  }, [data])

  // Another tab of the admin saved something: show it here too
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const next = JSON.parse(event.newValue)
          if (next?.version === DATA_VERSION) setData(next)
        } catch {
          // Ignore a half-written value
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Tidy files left behind by replaced videos or uploads that were never saved
  useEffect(() => {
    removeUnusedFiles(usedFileIds(latest.current))
  }, [])

  const api = useMemo(() => {
    const change = (fn) => setData((current) => fn(current))

    return {
      data,
      saveFailed,
      // Change fields on one item: patch('orders', 'SOMA-1', { status: 'Refunded' })
      patch: (collection, id, changes) =>
        change((d) => ({
          ...d,
          [collection]: d[collection].map((item) =>
            item.id === id ? { ...item, ...(typeof changes === 'function' ? changes(item) : changes) } : item,
          ),
        })),
      add: (collection, item, { atEnd = false } = {}) =>
        change((d) => ({ ...d, [collection]: atEnd ? [...d[collection], item] : [item, ...d[collection]] })),
      remove: (collection, id) => change((d) => ({ ...d, [collection]: d[collection].filter((item) => item.id !== id) })),
      // Replace a whole value: setValue('profile', {...}) or setValue('schedule', (rows) => [...])
      setValue: (key, value) => change((d) => ({ ...d, [key]: typeof value === 'function' ? value(d[key]) : value })),
      // A short line for the activity list in Settings
      log: (text) =>
        change((d) => ({ ...d, activity: [{ id: newId('a'), text, at: Date.now() }, ...d.activity].slice(0, 60) })),
      reset: async () => {
        await clearFiles().catch(() => {})
        setData(seedData())
      },
    }
  }, [data, saveFailed])

  return <AdminData.Provider value={api}>{children}</AdminData.Provider>
}

export function useAdminData() {
  const api = useContext(AdminData)
  if (!api) throw new Error('useAdminData must be used inside AdminDataProvider')
  return api
}

// Handy lookups used on several screens
export const findPhoto = (data, id) => data.photos.find((p) => p.id === id) ?? null
export const classTitle = (data, id) => data.classes.find((c) => c.id === id)?.title ?? id
export const lessonsMissingVideo = (c) => c.lessons.filter((lesson) => !lesson.video).length
