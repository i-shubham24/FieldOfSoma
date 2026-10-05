import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { SpeakerSlashIcon } from '@phosphor-icons/react/dist/csr/SpeakerSlash'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { EASE } from '../../lib/motion'

// Four phases of a Hanna pandiculation cycle with physiological somatic cues.
const PHASES = [
  {
    name: 'Contract',
    action: 'Inhale gently',
    seconds: 4,
    guidance: 'Contract the muscles with only 20% to 30% effort. Feel where the tension begins.',
    scale: 1.28,
  },
  {
    name: 'Release',
    action: 'Exhale slower',
    seconds: 7,
    guidance: 'Release at half speed. Feel the brain regain conscious control of the muscle fibres.',
    scale: 0.92,
  },
  {
    name: 'Rest',
    action: 'Stillness',
    seconds: 4,
    guidance: 'Completely unclamp. Let the floor or chair carry your entire weight.',
    scale: 0.88,
  },
  {
    name: 'Sense',
    action: 'Attention',
    seconds: 3,
    guidance: 'Notice what has changed: warmth, tingling, or a new sense of space.',
    scale: 1.0,
  },
]

// Pure synthesized harmonic tone for phase transition (432Hz calming pitch).
function playChime(freq = 432) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.035, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 2.3)
  } catch {
    // Graceful fallback if audio is not permitted by browser
  }
}

export default function SomaticPause({ open, onClose }) {
  const [active, setActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  const reduce = useReducedMotion()
  const timerRef = useRef(null)

  const currentPhase = PHASES[phaseIndex]

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      window.__lenis?.stop()
      document.body.style.overflow = 'hidden'
      setActive(true)
      setPhaseIndex(0)
      setSecondsLeft(PHASES[0].seconds)
      setCyclesCompleted(0)
    } else {
      window.__lenis?.start()
      document.body.style.overflow = ''
      setActive(false)
      clearInterval(timerRef.current)
    }
    return () => {
      window.__lenis?.start()
      document.body.style.overflow = ''
      clearInterval(timerRef.current)
    }
  }, [open])

  // Handle escape key
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ') {
        e.preventDefault()
        setActive((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Timer loop
  useEffect(() => {
    if (!open || !active) {
      clearInterval(timerRef.current)
      return undefined
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Advance to next phase
          setPhaseIndex((currIdx) => {
            const nextIdx = (currIdx + 1) % PHASES.length
            if (nextIdx === 0) {
              setCyclesCompleted((c) => c + 1)
            }
            if (soundOn) {
              const pitches = [384, 432, 324, 480]
              playChime(pitches[nextIdx])
            }
            return nextIdx
          })
          const nextIdx = (phaseIndex + 1) % PHASES.length
          return PHASES[nextIdx].seconds
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [open, active, phaseIndex, soundOn])

  const toggleSound = () => {
    if (!soundOn) {
      playChime(432)
    }
    setSoundOn(!soundOn)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Somatic Pause Guided Pandiculation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-soma-paper/95 p-6 backdrop-blur-md"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Top toolbar */}
          <div className="absolute top-6 right-6 left-6 flex items-center justify-between md:top-10 md:right-10 md:left-10">
            <div className="flex items-center gap-4">
              <span className="font-sans text-label font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
                Somatic Pause
              </span>
              <span className="text-[0.8125rem] text-soma-clay-deep tabular-nums">
                Cycle {cyclesCompleted + 1}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={toggleSound}
                className="flex items-center gap-2 text-[0.8125rem] text-soma-clay-deep transition-colors hover:text-soma-ink"
                title={soundOn ? 'Mute sound chime' : 'Enable gentle chime'}
              >
                {soundOn ? <SpeakerHighIcon size={16} /> : <SpeakerSlashIcon size={16} />}
                <span className="hidden sm:inline">{soundOn ? 'Tone on' : 'Tone off'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="group flex items-center gap-2 text-[0.8125rem] text-soma-clay-deep transition-colors hover:text-soma-ink"
                aria-label="Close Somatic Pause"
              >
                <span className="hidden sm:inline">Close</span>
                <XIcon size={16} className="transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>

          {/* Central breath circle experience */}
          <div className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center">
            {/* Visual breathing geometry */}
            <div className="relative flex h-72 w-72 items-center justify-center sm:h-84 sm:w-84">
              {/* Soft background aura */}
              <motion.div
                className="absolute inset-0 rounded-[2px] bg-soma-linen"
                animate={
                  reduce
                    ? undefined
                    : {
                        scale: active ? currentPhase.scale * 1.05 : 1,
                        opacity: active ? 0.85 : 0.4,
                      }
                }
                transition={{ duration: currentPhase.seconds, ease: EASE }}
              />

              {/* Main somatic resonant circle */}
              <motion.div
                className="relative flex h-52 w-52 items-center justify-center rounded-none border border-soma-moss/40 bg-soma-paper sm:h-60 sm:w-60"
                animate={
                  reduce
                    ? undefined
                    : {
                        scale: active ? currentPhase.scale : 1,
                        borderColor:
                          phaseIndex === 0
                            ? 'rgba(70, 89, 66, 0.7)'
                            : phaseIndex === 1
                            ? 'rgba(96, 119, 91, 0.5)'
                            : 'rgba(222, 214, 201, 0.8)',
                      }
                }
                transition={{ duration: currentPhase.seconds, ease: EASE }}
              >
                {/* Secondary inner ring */}
                <div className="absolute inset-4 border border-soma-sand/70" />

                <div className="relative z-10 px-4">
                  <p className="font-display text-[2.75rem] leading-none text-soma-ink italic sm:text-[3.25rem]">
                    {currentPhase.name}
                  </p>
                  <p className="mt-3 font-sans text-label font-medium tracking-[0.18em] text-soma-moss uppercase">
                    {currentPhase.action}
                  </p>
                  <p className="mt-2 text-[0.875rem] text-soma-clay-deep tabular-nums">
                    {secondsLeft}s
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Somatic verbal guidance cue */}
            <motion.p
              key={currentPhase.name}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-10 min-h-[3.5rem] max-w-[42ch] font-sans text-lede font-light text-soma-ink/85"
            >
              {currentPhase.guidance}
            </motion.p>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActive(!active)}
                className="h-11 rounded-[2px] bg-soma-moss px-7 text-[0.8125rem] font-medium tracking-[0.02em] text-soma-paper transition-colors duration-500 ease-soma hover:bg-soma-moss-light"
              >
                {active ? 'Pause guide' : 'Resume guide'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhaseIndex(0)
                  setSecondsLeft(PHASES[0].seconds)
                  setActive(true)
                }}
                className="link-rest pb-0.5 text-[0.8125rem] text-soma-clay-deep hover:text-soma-ink"
              >
                Restart cycle
              </button>
            </div>

            <p className="mt-6 text-[0.75rem] text-soma-clay-deep">
              Press space to pause or resume. Escape to close.
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
