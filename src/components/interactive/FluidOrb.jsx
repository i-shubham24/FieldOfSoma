import { useEffect, useRef } from 'react'
import { MOODS, rgba } from './pauseMoods'

const POINTS = 72
const TAU = Math.PI * 2
const PAPER = [250, 246, 240]

const clamp = (value, low, high) => Math.min(high, Math.max(low, value))
// Smallest signed angle between two directions
const turn = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b))
// Eases a value towards its goal at a steady rate, whatever the frame rate
const toward = (value, goal, rate, dt) => value + (goal - value) * (1 - Math.exp(-rate * dt))

// Slow waves around the edge, of different lengths and drifting different ways,
// so the outline keeps changing and never settles into a plain circle.
function ripple(angle, t) {
  return (
    (Math.sin(2 * angle + t * 0.9 + 0.3) +
      0.7 * Math.sin(3 * angle - t * 1.3 + 1.7) +
      0.45 * Math.sin(4 * angle + t * 1.7 + 4.1) +
      0.3 * Math.sin(5 * angle - t * 2.3 + 2.2)) /
    1.6
  )
}

// A soft, fluid orb for the Somatic Pause, drawn on a canvas. It breathes with the guide
// (it reads `clockRef` every frame), changes colour with each step, leans towards the
// cursor and wobbles like jelly when tapped. The words sit in `children` and float with it.
export default function FluidOrb({ clockRef, stages, reduce, children }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !ctx) return undefined

    // `box` is the orb's place in the layout. The canvas is centred on it and up to 1.6 times
    // larger (never wider than the screen), so the glow and shadow fade out before its edges.
    let box = 0
    let size = 0
    let dpr = 1
    const fit = () => {
      box = wrap.clientWidth
      size = canvas.clientWidth || box
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(wrap)
    observer.observe(canvas)

    // How far each point of the edge is pulled out (or pushed in), with its speed
    const offset = new Float32Array(POINTS)
    const velocity = new Float32Array(POINTS)
    const body = new Float32Array(POINTS * 2)
    const echo = new Float32Array(POINTS * 2)

    const start = MOODS[stages[clockRef.current.stage].id]
    let phase = 0
    let scale = start.from
    let wobble = start.wobble
    let tremor = start.tremor
    let speed = start.speed
    let stir = 0
    let ring = 1
    let echoes = 0
    let driftX = 0
    let driftY = 0
    const colours = start.colours.map((colour) => [...colour])

    // The pointer, measured from the orb's centre in CSS pixels
    const pointer = { x: 0, y: 0, here: false, travel: 0 }
    const locate = (event) => {
      const box = wrap.getBoundingClientRect()
      const x = event.clientX - box.left - box.width / 2
      const y = event.clientY - box.top - box.height / 2
      if (pointer.here) pointer.travel += Math.hypot(x - pointer.x, y - pointer.y)
      pointer.x = x
      pointer.y = y
      pointer.here = true
    }
    // A tap near the orb dents its edge, and the dent ripples away round the outline
    const poke = (event) => {
      locate(event)
      if (reduce) return
      const radius = box * 0.35
      if (Math.hypot(pointer.x, pointer.y) > radius * 1.9) return
      const aim = Math.atan2(pointer.y, pointer.x)
      for (let i = 0; i < POINTS; i += 1) {
        const gap = turn((i / POINTS) * TAU, aim)
        velocity[i] -= radius * 0.07 * Math.exp(-(gap * gap) / 0.5)
      }
      stir = Math.min(stir + 0.6, 1.2)
    }
    const lift = (event) => {
      if (event.pointerType !== 'mouse') pointer.here = false
    }
    const leave = () => {
      pointer.here = false
    }
    window.addEventListener('pointermove', locate, { passive: true })
    window.addEventListener('pointerdown', poke, { passive: true })
    window.addEventListener('pointerup', lift, { passive: true })
    window.addEventListener('blur', leave)
    document.documentElement.addEventListener('pointerleave', leave)

    // Points around the edge. `reach` is how much of the cursor's pull this line follows.
    const outline = (out, cx, cy, radius, t, reach) => {
      const loose = wobble + stir * 0.03
      for (let i = 0; i < POINTS; i += 1) {
        const angle = (i / POINTS) * TAU
        const r =
          radius * (1 + loose * ripple(angle, t) + tremor * Math.sin(9 * angle + t * 11)) +
          offset[i] * reach
        out[i * 2] = cx + Math.cos(angle) * r
        out[i * 2 + 1] = cy + Math.sin(angle) * r
      }
    }

    // A smooth closed curve, using the midpoints between edge points as anchors
    const trace = (points) => {
      const last = (POINTS - 1) * 2
      ctx.beginPath()
      ctx.moveTo((points[last] + points[0]) / 2, (points[last + 1] + points[1]) / 2)
      for (let i = 0; i < POINTS; i += 1) {
        const x = points[i * 2]
        const y = points[i * 2 + 1]
        const j = ((i + 1) % POINTS) * 2
        ctx.quadraticCurveTo(x, y, (x + points[j]) / 2, (y + points[j + 1]) / 2)
      }
      ctx.closePath()
    }

    let last = performance.now()
    let frame = 0

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const steps = dt * 60
      const clock = clockRef.current
      const stage = stages[clock.stage]
      const mood = MOODS[stage.id]
      const arriving = stage.id === 'arrive'

      // Size follows the guide: a gentle ease from this stage's start size to its end size
      const progress = Math.min(clock.elapsed / stage.seconds, 1)
      const eased = 0.5 - Math.cos(Math.PI * progress) / 2
      scale = toward(scale, mood.from + (mood.to - mood.from) * eased, 5, dt)
      wobble = toward(wobble, mood.wobble, 1.2, dt)
      tremor = toward(tremor, mood.tremor, 2.5, dt)
      speed = toward(speed, clock.active ? mood.speed : mood.speed * 0.35, 1.5, dt)
      ring = toward(ring, arriving ? 1 : 0, 2.5, dt)
      echoes = toward(echoes, arriving ? 0 : 1, 1.2, dt)
      colours.forEach((colour, i) => {
        for (let k = 0; k < 3; k += 1) colour[k] = toward(colour[k], mood.colours[i][k], 0.9, dt)
      })
      if (!reduce) phase += dt * speed

      // Quick cursor movement stirs the edge for a moment
      stir = Math.min(toward(stir, 0, 1.4, dt) + Math.min(pointer.travel / Math.max(box, 1), 0.5) * 0.5, 1.2)
      pointer.travel = 0

      const unit = box * 0.35
      const radius = unit * scale

      // The edge reaches towards the cursor when it comes near
      let pull = 0
      let aim = 0
      if (pointer.here && !reduce) {
        aim = Math.atan2(pointer.y, pointer.x)
        pull = unit * 0.28 * clamp(1 - (Math.hypot(pointer.x, pointer.y) - radius) / (unit * 1.6), 0, 1)
      }
      for (let i = 0; i < POINTS; i += 1) {
        const gap = turn((i / POINTS) * TAU, aim)
        const spring = (pull * Math.exp(-(gap * gap) / 0.42) - offset[i]) * 0.07
        const neighbours =
          (offset[(i + POINTS - 1) % POINTS] + offset[(i + 1) % POINTS] - 2 * offset[i]) * 0.12
        velocity[i] = (velocity[i] + (spring + neighbours) * steps) * 0.86 ** steps
      }
      for (let i = 0; i < POINTS; i += 1) offset[i] += velocity[i] * steps

      // The whole orb drifts a little towards the cursor
      const near = pointer.here && !reduce
      driftX = toward(driftX, near ? clamp(pointer.x / box, -1, 1) * box * 0.035 : 0, 2, dt)
      driftY = toward(driftY, near ? clamp(pointer.y / box, -1, 1) * box * 0.035 : 0, 2, dt)

      const middle = size / 2
      const cx = middle + driftX
      const cy = middle + driftY
      const [first, second, third] = colours

      // Clear every device pixel. Clearing in CSS pixels misses part of the last row and
      // column when the screen is scaled (125%, 150%), and the shadow builds up there.
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(canvas.width / size, 0, 0, canvas.height / size, 0, 0)

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, Math.min(radius * 1.75, middle - 2))
      glow.addColorStop(0, rgba(first, 0.32))
      glow.addColorStop(1, rgba(first, 0))
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      // Arrival: a thin ring swept once a second, like the countdown before a film
      if (ring > 0.01) {
        const around = unit * 1.4
        ctx.lineWidth = 1
        ctx.strokeStyle = `rgba(70,89,66,${0.14 * ring})`
        ctx.beginPath()
        ctx.arc(middle, middle, around, 0, TAU)
        ctx.stroke()
        if (arriving) {
          const end = -Math.PI / 2 + (clock.elapsed % 1) * TAU
          ctx.lineWidth = 1.5
          ctx.strokeStyle = `rgba(70,89,66,${0.6 * ring})`
          ctx.beginPath()
          ctx.arc(middle, middle, around, -Math.PI / 2, end)
          ctx.stroke()
          ctx.fillStyle = `rgba(70,89,66,${0.8 * ring})`
          ctx.beginPath()
          ctx.arc(middle + Math.cos(end) * around, middle + Math.sin(end) * around, 2.5, 0, TAU)
          ctx.fill()
        }
      }

      // Two faint echoes of the edge, trailing behind it like ripples
      if (echoes > 0.01) {
        const line = first.map((value) => value * 0.62)
        ctx.lineWidth = 1
        outline(echo, cx, cy, radius * 1.14, phase - 0.9, 0.6)
        trace(echo)
        ctx.strokeStyle = rgba(line, 0.26 * echoes)
        ctx.stroke()
        outline(echo, cx, cy, radius * 1.3, phase - 1.8, 0.3)
        trace(echo)
        ctx.strokeStyle = rgba(line, 0.12 * echoes)
        ctx.stroke()
      }

      // Body, with a soft shadow that follows its shape
      outline(body, cx, cy, radius, phase, 1)
      trace(body)
      const base = ctx.createRadialGradient(cx, cy - radius * 0.15, 0, cx, cy, radius * 1.1)
      base.addColorStop(0, rgba(PAPER, 1))
      base.addColorStop(1, rgba(third.map((value, k) => value * 0.6 + PAPER[k] * 0.4), 1))
      ctx.save()
      ctx.shadowColor = rgba(first.map((value) => value * 0.55), 0.35)
      ctx.shadowBlur = box * 0.11 * dpr
      ctx.shadowOffsetY = box * 0.045 * dpr
      ctx.fillStyle = base
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.clip()
      // Three colours swirl inside, leaning a little towards the cursor
      const leanX = Math.cos(aim) * radius * (pull / unit) * 1.4
      const leanY = Math.sin(aim) * radius * (pull / unit) * 1.4
      ;[first, second, third].forEach((colour, j) => {
        const spin = phase * (0.55 + j * 0.2) * (j % 2 ? -1 : 1) + j * 2.1
        const bx = cx + Math.cos(spin) * radius * 0.4 + leanX
        const by = cy + Math.sin(spin * 1.3 + j) * radius * 0.36 + leanY
        const reach = radius * (0.95 - j * 0.12)
        const swirl = ctx.createRadialGradient(bx, by, 0, bx, by, reach)
        swirl.addColorStop(0, rgba(colour, 0.9))
        swirl.addColorStop(0.55, rgba(colour, 0.45))
        swirl.addColorStop(1, rgba(colour, 0))
        ctx.fillStyle = swirl
        ctx.fillRect(cx - radius * 1.6, cy - radius * 1.6, radius * 3.2, radius * 3.2)
      })
      // A clear centre so the words stay easy to read
      const clear = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.62)
      clear.addColorStop(0, rgba(PAPER, 0.86))
      clear.addColorStop(0.45, rgba(PAPER, 0.52))
      clear.addColorStop(1, rgba(PAPER, 0))
      ctx.fillStyle = clear
      ctx.fillRect(0, 0, size, size)
      // Glassy highlight
      const hx = cx - radius * 0.38
      const hy = cy - radius * 0.46
      const shine = ctx.createRadialGradient(hx, hy, 0, hx, hy, radius * 0.6)
      shine.addColorStop(0, 'rgba(255,255,255,0.7)')
      shine.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = shine
      ctx.fillRect(0, 0, size, size)
      ctx.restore()

      // Rim
      ctx.lineWidth = 1.25
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'
      ctx.stroke()

      // The words float with the orb and grow and shrink with its breath
      if (textRef.current) {
        const float = reduce ? 0 : Math.sin(phase * 1.7) * 3
        const grow = 0.92 + (scale - 0.72) * 0.32
        textRef.current.style.transform = `translate3d(${driftX * 1.6}px, ${driftY * 1.6 + float}px, 0) scale(${grow})`
      }

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', locate)
      window.removeEventListener('pointerdown', poke)
      window.removeEventListener('pointerup', lift)
      window.removeEventListener('blur', leave)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [clockRef, stages, reduce])

  return (
    <div ref={wrapRef} className="relative aspect-square w-[max(16rem,min(32rem,88vw,60svh))]">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[min(160%,100vw)] -translate-x-1/2 -translate-y-1/2"
      />
      <div ref={textRef} className="absolute inset-0 flex items-center justify-center text-center will-change-transform">
        {children}
      </div>
    </div>
  )
}
