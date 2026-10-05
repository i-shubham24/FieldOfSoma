import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play'
import { PauseIcon } from '@phosphor-icons/react/dist/csr/Pause'
import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { EASE } from '../../lib/motion'

// Ambient harmonic acoustic synthesizer for practicing verbal cues.
function createVoiceDrone(pitch = 216) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(pitch, ctx.currentTime)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(pitch * 1.5, ctx.currentTime) // Harmonic fifth

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.2)

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc1.start()
    osc2.start()

    let stopped = false

    return {
      stop: () => {
        if (stopped) return
        stopped = true
        try {
          gainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8)
          setTimeout(() => {
            try {
              osc1.stop()
            } catch {}
            try {
              osc2.stop()
            } catch {}
            try {
              if (ctx && ctx.state !== 'closed') {
                ctx.close().catch(() => {})
              }
            } catch {}
          }, 900)
        } catch {}
      },
    }
  } catch {
    return null
  }
}

// Active audio guide dispatcher to ensure only one drone plays at any given moment
let activeStopper = null

function registerActivePlayer(stopFn) {
  if (activeStopper && activeStopper !== stopFn) {
    activeStopper()
  }
  activeStopper = stopFn
}

function unregisterActivePlayer(stopFn) {
  if (activeStopper === stopFn) {
    activeStopper = null
  }
}

export default function AudioGuide({ practiceTitle, verbs, duration = 45, transcript }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const reduce = useReducedMotion()
  const droneRef = useRef(null)
  const intervalRef = useRef(null)

  // Frequencies for each practice mood: Somatics (deep 192Hz), Tai Chi (grounded 162Hz), Creative (light 240Hz)
  const pitch = practiceTitle.includes('Somatics')
    ? 192
    : practiceTitle.includes('Tai Chi')
    ? 162
    : 240

  useEffect(() => {
    if (isPlaying) {
      const stopSelf = () => setIsPlaying(false)
      registerActivePlayer(stopSelf)

      droneRef.current = createVoiceDrone(pitch)
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            droneRef.current?.stop()
            return 0
          }
          return prev + 1
        })
      }, 1000)

      return () => {
        unregisterActivePlayer(stopSelf)
        droneRef.current?.stop()
        clearInterval(intervalRef.current)
      }
    } else {
      droneRef.current?.stop()
      clearInterval(intervalRef.current)
    }

    return () => {
      droneRef.current?.stop()
      clearInterval(intervalRef.current)
    }
  }, [isPlaying, duration, pitch])

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const progress = Math.min(100, (seconds / duration) * 100)

  return (
    <div className="mt-8 border border-soma-sand bg-soma-paper p-6 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? `Pause sample for ${practiceTitle}` : `Listen to verbal guidance for ${practiceTitle}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] bg-soma-moss text-soma-paper transition-colors duration-500 ease-soma hover:bg-soma-moss-light"
          >
            {isPlaying ? (
              <PauseIcon size={18} weight="fill" />
            ) : (
              <PlayIcon size={18} weight="fill" className="ml-0.5" />
            )}
          </button>

          <div>
            <p className="font-sans text-[0.6875rem] font-medium tracking-[0.16em] text-soma-moss uppercase">
              Spoken Guidance Sample
            </p>
            <p className="font-display text-[1.125rem] leading-[1.3] text-soma-ink">
              {practiceTitle}: {verbs}
            </p>
          </div>
        </div>

        {/* Audio waveform / state indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7].map((height, i) => (
              <motion.span
                key={i}
                className="w-1 bg-soma-moss/70"
                animate={
                  isPlaying && !reduce
                    ? {
                        scaleY: [height * 0.4, height * 1.4, height * 0.4],
                        opacity: [0.5, 1, 0.5],
                      }
                    : { scaleY: 0.3, opacity: 0.4 }
                }
                transition={{
                  duration: 0.8 + i * 0.1,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                style={{ height: '18px', transformOrigin: 'bottom' }}
              />
            ))}
          </div>

          <span className="font-sans text-[0.8125rem] text-soma-clay-deep tabular-nums">
            {formatTime(seconds)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Progress timeline bar */}
      <div className="mt-4 h-1 w-full overflow-hidden bg-soma-sand/60">
        <motion.div
          className="h-full bg-soma-moss"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.2, ease: 'linear' }}
        />
      </div>

      {/* Transcript toggle */}
      <div className="mt-4 flex items-center justify-between pt-1 text-[0.8125rem]">
        <button
          type="button"
          onClick={() => setShowTranscript((prev) => !prev)}
          className="link-rest pb-0.5 text-soma-clay-deep hover:text-soma-ink"
        >
          {showTranscript ? 'Hide spoken cue text' : 'Read spoken cue text'}
        </button>

        <span className="flex items-center gap-1.5 text-[0.75rem] text-soma-clay-deep">
          <SpeakerHighIcon size={13} />
          <span>Harmonic ambient resonance</span>
        </span>
      </div>

      {/* Expandable transcript */}
      {showTranscript ? (
        <motion.blockquote
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-4 border-t border-soma-sand/80 pt-4 font-sans text-[0.875rem] leading-[1.75] text-soma-ink/80 italic"
        >
          “{transcript}”
        </motion.blockquote>
      ) : null}
    </div>
  )
}
