import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { SpeakerSlashIcon } from '@phosphor-icons/react/dist/csr/SpeakerSlash'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { pause } from '../../content/pause'
import { EASE } from '../../lib/motion'
import useDialog from '../../lib/useDialog'
import FluidOrb from './FluidOrb'
import { MOODS, rgba } from './pauseMoods'

// Stage 0 is the arrival countdown. Stages 1 to 6 are the steps, which then repeat.
const STAGES = [{ id: 'arrive', name: 'Arrive', ...pause.arrival }, ...pause.steps]
const FIRST_STEP = 1
const LAST_STEP = STAGES.length - 1
const ROUND_SECONDS = pause.steps.reduce((total, step) => total + step.seconds, 0)

// A soft tone at the start of each step, a different note for each
const PITCHES = { inhale: 396, exhale: 352, tense: 440, release: 330, rest: 294, sense: 392 }

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

// Which subtitle shows `seconds` into a stage
function cueAt(cues, seconds) {
  let index = 0
  cues.forEach((cue, i) => {
    if (seconds >= cue.at) index = i
  })
  return index
}

// What the page needs to show from the clock: the stage, whole seconds left, the subtitle
function readClock(clock) {
  const stage = STAGES[clock.stage]
  return {
    stage: clock.stage,
    left: Math.max(1, Math.ceil(stage.seconds - clock.elapsed)),
    cue: cueAt(stage.cues, clock.elapsed),
    cycle: clock.cycle,
  }
}

const sameView = (a, b) =>
  a.stage === b.stage && a.left === b.left && a.cue === b.cue && a.cycle === b.cycle

const LETTER = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(8px)' },
  shown: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
}
const LETTER_STILL = { hidden: { opacity: 0 }, shown: { opacity: 1 } }

// The arrival: a number counting down from 10, each one blurring into the next
function Countdown({ left, reduce }) {
  return (
    <motion.div
      className="grid"
      exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.4 } }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={left}
          className="col-start-1 row-start-1 font-display text-[clamp(3.5rem,14vw,5rem)] leading-none text-soma-ink italic"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {left}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}

// A step's name rises in letter by letter, with the seconds left beneath it
function StepName({ name, left, paused, reduce }) {
  return (
    <motion.div exit={{ opacity: 0, y: -8, filter: 'blur(6px)', transition: { duration: 0.35 } }}>
      <motion.p
        aria-hidden="true"
        className="font-display text-[clamp(2.25rem,9vw,3.25rem)] leading-none text-soma-ink italic"
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { staggerChildren: reduce ? 0 : 0.05 } } }}
      >
        {[...name].map((letter, i) => (
          <motion.span key={i} className="inline-block" variants={reduce ? LETTER_STILL : LETTER}>
            {letter}
          </motion.span>
        ))}
      </motion.p>
      <p className="mt-3 text-[0.875rem] text-soma-clay-deep tabular-nums">
        {paused ? 'Paused' : `${left}s`}
      </p>
    </motion.div>
  )
}

// Mounted only while open, so the dialog hook can lock scroll and hold focus.
function PauseDialog({ onClose }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const clockRef = useRef({ stage: 0, elapsed: 0, cycle: 0, active: true })
  const barRefs = useRef([])
  const soundRef = useRef(false)
  const [view, setView] = useState(() => readClock(clockRef.current))
  const [active, setActive] = useState(true)
  const [soundOn, setSoundOn] = useState(false)
  useDialog(ref, onClose)

  useEffect(() => {
    clockRef.current.active = active
  }, [active])

  useEffect(() => {
    soundRef.current = soundOn
  }, [soundOn])

  // One clock drives the countdown, the step bars and the orb, so they never drift apart.
  // It runs on animation frames, so it also rests while the tab is hidden.
  useEffect(() => {
    let frame = 0
    let last = performance.now()
    let shown = readClock(clockRef.current)
    const written = []

    const tick = (now) => {
      const clock = clockRef.current
      if (clock.active) {
        clock.elapsed += Math.min((now - last) / 1000, 0.1)
        if (clock.elapsed >= STAGES[clock.stage].seconds) {
          if (clock.stage === LAST_STEP) clock.cycle += 1
          clock.stage = clock.stage === LAST_STEP ? FIRST_STEP : clock.stage + 1
          clock.elapsed = 0
        }
      }
      last = now

      // Step bars: full for steps done, filling for this one, empty for those ahead
      for (let i = FIRST_STEP; i <= LAST_STEP; i += 1) {
        const value =
          i < clock.stage ? 1 : i > clock.stage ? 0 : clock.elapsed / STAGES[i].seconds
        const bar = barRefs.current[i]
        if (bar && written[i] !== value) {
          bar.style.transform = `scaleX(${value})`
          written[i] = value
        }
      }

      const next = readClock(clock)
      if (!sameView(next, shown)) {
        shown = next
        setView(next)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // A tone as each step begins, when sound is on
  useEffect(() => {
    const pitch = PITCHES[STAGES[view.stage].id]
    if (pitch && soundRef.current) playChime(pitch)
  }, [view.stage])

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

  const goTo = (stage) => {
    Object.assign(clockRef.current, { stage, elapsed: 0, active: true })
    setActive(true)
  }

  const toggleSound = () => {
    if (!soundOn) playChime(432)
    setSoundOn(!soundOn)
  }

  const stage = STAGES[view.stage]
  const mood = MOODS[stage.id]
  const arriving = view.stage === 0
  const cue = stage.cues[view.cue]

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Somatic Pause, a short guided practice"
      tabIndex={-1}
      data-lenis-prevent
      className="fixed inset-0 z-[55] overflow-x-hidden overflow-y-auto overscroll-contain outline-none transition-[background-color] duration-[2400ms] ease-in-out"
      style={{ backgroundColor: mood.tint }}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* A wide, soft wash of the step's colour, crossfading as the steps change */}
      <AnimatePresence initial={false}>
        <motion.div
          key={stage.id}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 55% at 50% 38%, ${rgba(mood.colours[0], 0.16)}, transparent 72%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      <div className="relative flex min-h-full flex-col px-5 py-4 sm:px-10 sm:py-8">
        {/* Top toolbar */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-sans text-label font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
              Somatic Pause
            </span>
            {arriving ? null : (
              <span className="text-[0.8125rem] text-soma-clay-deep tabular-nums">
                Cycle {view.cycle + 1}
              </span>
            )}
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

        {/* The orb, its words and the subtitles */}
        <div className="mx-auto my-auto flex w-full max-w-xl flex-col items-center py-8 text-center">
          <FluidOrb clockRef={clockRef} stages={STAGES} reduce={reduce}>
            <AnimatePresence mode="wait" initial={false}>
              {arriving ? (
                <Countdown key="arrive" left={view.left} reduce={reduce} />
              ) : (
                <StepName
                  key={stage.id}
                  name={stage.name}
                  left={view.left}
                  paused={!active}
                  reduce={reduce}
                />
              )}
            </AnimatePresence>
          </FluidOrb>

          {/* Subtitles: one line at a time, like the captions on a film */}
          <div className="relative -mt-2 flex min-h-[4.5rem] w-full max-w-[30ch] items-start justify-center sm:-mt-3 sm:max-w-[34ch]">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${stage.id}-${view.cue}`}
                className="font-display text-[1.25rem] leading-[1.45] text-soma-ink/85 sm:text-[1.4375rem]"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {cue.text}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="sr-only" aria-live="polite">
            {arriving ? cue.text : `${stage.name}, ${stage.seconds} seconds. ${cue.text}`}
          </p>

          {/* Controls */}
          <div className="relative mt-6 flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActive(!active)}
              className="h-11 rounded-[2px] bg-soma-moss px-7 text-[0.8125rem] font-medium tracking-[0.02em] text-soma-paper transition-colors duration-500 ease-soma hover:bg-soma-moss-light"
            >
              {active ? 'Pause guide' : 'Resume guide'}
            </button>

            <button
              type="button"
              onClick={() => goTo(FIRST_STEP)}
              className="link-rest min-h-11 pb-0.5 text-[0.8125rem] text-soma-clay-deep hover:text-soma-ink"
            >
              {arriving ? 'Begin now' : 'Restart cycle'}
            </button>
          </div>
        </div>

        {/* The steps and their timings, with a bar that fills as each one runs */}
        <div className="relative mx-auto w-full max-w-3xl pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-sans text-label font-medium tracking-[0.16em] text-soma-clay-deep uppercase">
              The steps
            </p>
            <p className="text-[0.8125rem] text-soma-clay-deep tabular-nums">
              {ROUND_SECONDS} seconds a round
            </p>
          </div>
          <ol className="mt-4 grid grid-cols-3 gap-x-5 gap-y-5 sm:grid-cols-6">
            {pause.steps.map((step, i) => {
              const index = i + FIRST_STEP
              const now = view.stage === index
              const done = view.stage > index
              return (
                <li key={step.id} aria-current={now ? 'step' : undefined}>
                  <span className="relative block h-px overflow-hidden bg-soma-ink/15">
                    <span
                      ref={(node) => {
                        barRefs.current[index] = node
                      }}
                      className="absolute inset-0 origin-left bg-soma-moss"
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </span>
                  <span className="mt-2.5 flex items-baseline justify-between gap-2 text-[0.8125rem]">
                    <span
                      className={`transition-colors duration-700 ${
                        now ? 'font-medium text-soma-ink' : done ? 'text-soma-moss' : 'text-soma-clay-deep'
                      }`}
                    >
                      {step.name}
                    </span>
                    <span className="text-soma-clay-deep tabular-nums">{step.seconds}s</span>
                  </span>
                </li>
              )
            })}
          </ol>
          <p className="mt-6 hidden text-center text-[0.8125rem] text-soma-clay-deep sm:block">
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
