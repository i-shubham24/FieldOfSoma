import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'soma_ambient_sound'
const TARGET_VOLUME = 0.4

// Storage can be blocked (private windows, strict settings); sound is a nicety, so never throw.
const readPref = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
const writePref = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // ignore
  }
}

// Ambient flute that starts on the visitor's first click or key press (browsers only allow
// sound after a real gesture), unless they have turned it off before. The file is not
// downloaded until then.
export default function AmbientSound() {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const fadeTo = (target, done) => {
    const audio = audioRef.current
    clearInterval(fadeRef.current)
    fadeRef.current = setInterval(() => {
      const step = target > audio.volume ? 0.04 : -0.06
      const next = Math.min(1, Math.max(0, audio.volume + step))
      audio.volume = next
      if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
        clearInterval(fadeRef.current)
        done?.()
      }
    }, 40)
  }

  const start = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0
    audio
      .play()
      .then(() => {
        setIsPlaying(true)
        fadeTo(TARGET_VOLUME)
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (readPref() === 'off') return undefined

    const onFirstGesture = (event) => {
      // A click on the sound button itself is handled by the button.
      if (event.target.closest?.('[data-ambient-toggle]')) return
      remove()
      start()
    }
    const remove = () => {
      window.removeEventListener('click', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
    window.addEventListener('click', onFirstGesture)
    window.addEventListener('keydown', onFirstGesture)

    return () => {
      remove()
      clearInterval(fadeRef.current)
    }
    // start is stable enough here: it only reads refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleSound = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      writePref('off')
      fadeTo(0, () => {
        audio.pause()
        setIsPlaying(false)
      })
    } else {
      writePref('on')
      start()
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/ambient-soma.wav?v=5"
        preload="none"
        loop
        aria-hidden="true"
      />

      {/* Sits under the menu (z-40) and dialogs (z-55), so it never covers them */}
      <aside
        aria-label="Ambient sound"
        className="fixed right-3 bottom-3 z-30 select-none sm:right-7 sm:bottom-7 print:hidden"
      >
        <button
          type="button"
          data-ambient-toggle
          onClick={toggleSound}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
          title={isPlaying ? 'Ambient sound playing: click to mute' : 'Ambient sound muted: click to play'}
          className="group relative flex h-12 w-12 cursor-pointer items-center justify-center bg-transparent border-0 shadow-none text-soma-ink hover:scale-110 active:scale-95 transition-transform duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-soma-ink"
        >
          <div className="relative flex h-8 w-8 items-center justify-center">
            {isPlaying ? (
              /* Bold dark breathing soundwave bars */
              <div className="flex items-center gap-[4px]" aria-hidden="true">
                <span className="block w-[2.5px] rounded-xs bg-soma-ink h-3.5 animate-[soma-wave-1_1.3s_ease-in-out_infinite]" />
                <span className="block w-[2.5px] rounded-xs bg-soma-ink h-6 animate-[soma-wave-2_1.3s_ease-in-out_infinite]" />
                <span className="block w-[2.5px] rounded-xs bg-soma-ink h-3 animate-[soma-wave-3_1.3s_ease-in-out_infinite]" />
                <span className="block w-[2.5px] rounded-xs bg-soma-ink h-5 animate-[soma-wave-4_1.3s_ease-in-out_infinite]" />
              </div>
            ) : (
              /* Bold dark muted state with diagonal strike */
              <div className="relative flex items-center justify-center" aria-hidden="true">
                <div className="flex items-center gap-[4px] opacity-40 group-hover:opacity-75 transition-opacity">
                  <span className="block h-3.5 w-[2.5px] rounded-xs bg-soma-ink" />
                  <span className="block h-5.5 w-[2.5px] rounded-xs bg-soma-ink" />
                  <span className="block h-3.5 w-[2.5px] rounded-xs bg-soma-ink" />
                  <span className="block h-5.5 w-[2.5px] rounded-xs bg-soma-ink" />
                </div>
                <span className="absolute inset-x-[-2px] h-[2.5px] w-7 bg-soma-ink rotate-45 transform origin-center" />
              </div>
            )}
          </div>
        </button>
      </aside>
    </>
  )
}
