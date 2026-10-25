import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { SpeakerSlashIcon } from '@phosphor-icons/react/dist/csr/SpeakerSlash'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { EASE } from '../../lib/motion'
import useDialog from '../../lib/useDialog'
import BreathOrb from './BreathOrb'

// Four phases of a slow pandiculation, with plain cues.
const PHASES = [
  {
    name: 'Contract',
    action: 'Breathe in gently',
    seconds: 4,
    guidance: 'Tighten the muscles a little, with only a fraction of your effort. Notice where it starts.',
  },
  {
    name: 'Release',
    action: 'Breathe out slowly',
    seconds: 7,
    guidance: 'Let go more slowly than you tightened. Take your time.',
  },
  {
    name: 'Rest',
    action: 'Stillness',
    seconds: 4,
    guidance: 'Let go completely. Let the floor or chair hold all of your weight.',
  },
  {
    name: 'Sense',
    action: 'Notice',
    seconds: 3,
    guidance: 'What feels different now? Warmth, tingling, a little more space?',
  },
]

const PITCHES = [384, 432, 324, 480]

// One shared audio context: browsers limit how many can be open at once.
let audioContext = null

function playChime(freq = 432) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    audioContext ??= new AudioCtx()
    const ctx = audioContext
    if (ctx.state === 'suspended') ctx.resume()
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
    // Sound is optional; the guide works without it
  }
}

// Mounted only while open, so the dialog hook can lock scroll and hold focus.
function PauseDialog({ onClose }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(true)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  useDialog(ref, onClose)

  const currentPhase = PHASES[phaseIndex]

  // Count down once a second while running
  useEffect(() => {
    if (!active) return undefined
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [active])

  // At zero, move to the next phase (side effects live here, not inside state updaters)
  useEffect(() => {
    if (secondsLeft > 0) return
    const nextIndex = (phaseIndex + 1) % PHASES.length
    if (nextIndex === 0) setCyclesCompleted((count) => count + 1)
    if (soundOn) playChime(PITCHES[nextIndex])
    setPhaseIndex(nextIndex)
    setSecondsLeft(PHASES[nextIndex].seconds)
  }, [secondsLeft, phaseIndex, soundOn])

  // Space pauses or resumes, unless a button has focus (where space already clicks)
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== ' ' || event.target.closest?.('button')) return
      event.preventDefault()
      setActive((prev) => !prev)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const toggleSound = () => {
    if (!soundOn) playChime(432)
    setSoundOn(!soundOn)
  }

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Somatic Pause, a guided pandiculation"
      tabIndex={-1}
      data-lenis-prevent
      className="fixed inset-0 z-[55] overflow-y-auto overscroll-contain bg-soma-paper/95 outline-none backdrop-blur-md"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="flex min-h-full flex-col px-5 py-4 sm:px-10 sm:py-8">
          {/* Top toolbar */}
          <div className="flex items-center justify-between gap-4">
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
                aria-pressed={soundOn}
                aria-label={soundOn ? 'Turn the tone off' : 'Turn the tone on'}
                className="flex h-11 min-w-11 items-center justify-center gap-2 text-[0.8125rem] text-soma-clay-deep transition-colors hover:text-soma-ink"
              >
                {soundOn ? <SpeakerHighIcon size={16} /> : <SpeakerSlashIcon size={16} />}
                <span className="hidden sm:inline">{soundOn ? 'Tone on' : 'Tone off'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="group flex h-11 min-w-11 items-center justify-center gap-2 text-[0.8125rem] text-soma-clay-deep transition-colors hover:text-soma-ink"
                aria-label="Close Somatic Pause"
              >
                <span className="hidden sm:inline">Close</span>
                <XIcon size={16} className="transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>

          {/* The breathing orb and its words */}
          <div className="relative mx-auto my-auto flex w-full max-w-xl flex-col items-center py-8 text-center">
            {/* A breathing orb that answers each phase of the guide */}
            <BreathOrb phaseIndex={phaseIndex} seconds={currentPhase.seconds} active={active}>
              <p className="font-display text-[clamp(2rem,10vw,2.75rem)] leading-none text-soma-ink italic sm:text-[3.25rem]">
                {currentPhase.name}
              </p>
              <p className="mt-3 font-sans text-label font-medium tracking-[0.18em] text-soma-moss uppercase">
                {currentPhase.action}
              </p>
              <p className="mt-2 text-[0.875rem] text-soma-clay-deep tabular-nums">{secondsLeft}s</p>
            </BreathOrb>

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
                className="link-rest min-h-11 pb-0.5 text-[0.8125rem] text-soma-clay-deep hover:text-soma-ink"
              >
                Restart cycle
              </button>
            </div>

            <p className="mt-6 hidden text-[0.8125rem] text-soma-clay-deep sm:block">
              Press Space to pause or resume, and Esc to close.
            </p>
          </div>
      </div>
    </motion.div>
  )
}

export default function SomaticPause({ open, onClose }) {
  return (
    <AnimatePresence>{open ? <PauseDialog onClose={onClose} /> : null}</AnimatePresence>
  )
}
