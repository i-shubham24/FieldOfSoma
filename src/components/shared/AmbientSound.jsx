import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'soma_ambient_sound'
const TARGET_VOLUME = 0.40

export default function AmbientSound() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize and attempt auto-play on whole site
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0
    audio.loop = true

    const savedPref = localStorage.getItem(STORAGE_KEY)
    if (savedPref === 'off') {
      setIsPlaying(false)
      return
    }

    // Smooth fade in helper
    const fadeIn = () => {
      let currentVol = 0
      audio.volume = 0
      const fadeInterval = setInterval(() => {
        if (currentVol < TARGET_VOLUME) {
          currentVol = Math.min(TARGET_VOLUME, currentVol + 0.04)
          audio.volume = currentVol
        } else {
          clearInterval(fadeInterval)
        }
      }, 40)
    }

    // Attempt direct autoplay
    const promise = audio.play()
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true)
          fadeIn()
        })
        .catch(() => {
          // Browser prevented autoplay before user interaction:
          // Listen for the very first interaction anywhere on page
          const onFirstInteraction = () => {
            const currentPref = localStorage.getItem(STORAGE_KEY)
            if (currentPref === 'off') return

            audio
              .play()
              .then(() => {
                setIsPlaying(true)
                fadeIn()
              })
              .catch(() => {})

            window.removeEventListener('pointerdown', onFirstInteraction)
            window.removeEventListener('click', onFirstInteraction)
            window.removeEventListener('scroll', onFirstInteraction)
            window.removeEventListener('keydown', onFirstInteraction)
          }

          window.addEventListener('pointerdown', onFirstInteraction, { passive: true })
          window.addEventListener('click', onFirstInteraction, { passive: true })
          window.addEventListener('scroll', onFirstInteraction, { passive: true })
          window.addEventListener('keydown', onFirstInteraction, { passive: true })
        })
    }
  }, [])

  const toggleSound = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      // Fade out smoothly and pause
      let vol = audio.volume
      const fadeOut = setInterval(() => {
        if (vol > 0.05) {
          vol = Math.max(0, vol - 0.06)
          audio.volume = vol
        } else {
          clearInterval(fadeOut)
          audio.pause()
          setIsPlaying(false)
          localStorage.setItem(STORAGE_KEY, 'off')
        }
      }, 35)
    } else {
      // Start and fade in smoothly
      audio.volume = 0
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          localStorage.setItem(STORAGE_KEY, 'on')
          let vol = 0
          const fadeIn = setInterval(() => {
            if (vol < TARGET_VOLUME) {
              vol = Math.min(TARGET_VOLUME, vol + 0.04)
              audio.volume = vol
            } else {
              audio.volume = TARGET_VOLUME
              clearInterval(fadeIn)
            }
          }, 40)
        })
        .catch(() => {})
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/ambient-soma.wav?v=4"
        preload="auto"
        loop
        aria-hidden="true"
      />

      {/* Minimal aesthetic audio button: zero background, zero border, large dark bold */}
      <aside
        aria-label="Ambient sound controller"
        className="fixed bottom-7 right-7 z-50 select-none print:hidden"
      >
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
          title={isPlaying ? 'Ambient sound playing: click to mute' : 'Ambient sound muted: click to play'}
          className="group relative flex h-12 w-12 cursor-pointer items-center justify-center bg-transparent border-0 shadow-none text-soma-ink hover:scale-110 active:scale-95 transition-transform duration-300 focus:outline-none"
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
