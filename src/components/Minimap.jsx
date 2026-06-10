import { useEffect, useRef } from 'react'
import { PLANETS } from '../data/planets.js'

const SIZE = 180
const CENTER = SIZE / 2
// Map the largest orbit (Neptune, distance 45) to most of the radius.
const MAX_ORBIT = 48
const USABLE_RADIUS = SIZE / 2 - 14
const SCALE = USABLE_RADIUS / MAX_ORBIT

// Bird's-eye 2D radar of the solar system. Reads live positions from
// `positionsRef` (written by <Planet>) and `cameraRef` (camera x/z) each frame.
export default function Minimap({ positionsRef, cameraRef, selectedName, onSelectPlanet, onSelectSun, visible }) {
  const canvasRef = useRef()
  const hitsRef = useRef([]) // [{name, sx, sy, r}] for click hit-testing

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.scale(dpr, dpr)

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // Faint orbit rings
      ctx.strokeStyle = 'rgba(120, 160, 255, 0.10)'
      ctx.lineWidth = 1
      PLANETS.forEach((p) => {
        ctx.beginPath()
        ctx.arc(CENTER, CENTER, p.distance * SCALE, 0, Math.PI * 2)
        ctx.stroke()
      })

      const hits = []

      // Sun
      ctx.beginPath()
      ctx.arc(CENTER, CENTER, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#FFD060'
      ctx.shadowColor = '#FFD060'
      ctx.shadowBlur = 8
      ctx.fill()
      ctx.shadowBlur = 0
      hits.push({ name: 'Sol', sx: CENTER, sy: CENTER, r: 7 })

      // Planets
      PLANETS.forEach((p) => {
        const pos = positionsRef.current[p.name]
        if (!pos) return
        const sx = CENTER + pos.x * SCALE
        const sy = CENTER + pos.z * SCALE
        const selected = p.name === selectedName
        const r = selected ? 4 : 2.6

        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        if (selected) {
          ctx.shadowColor = p.color
          ctx.shadowBlur = 8
        }
        ctx.fill()
        ctx.shadowBlur = 0

        if (selected) {
          ctx.beginPath()
          ctx.arc(sx, sy, r + 3, 0, Math.PI * 2)
          ctx.strokeStyle = p.color
          ctx.lineWidth = 1
          ctx.stroke()
        }

        hits.push({ name: p.name, sx, sy, r: 7 })
      })

      hitsRef.current = hits

      // Camera / viewport marker
      const cam = cameraRef.current
      if (cam) {
        const cx = CENTER + cam.x * SCALE
        const cy = CENTER + cam.z * SCALE
        // Clamp into the disc so it stays visible when far out.
        const dx = cx - CENTER
        const dy = cy - CENTER
        const dist = Math.hypot(dx, dy)
        const maxR = SIZE / 2 - 6
        let mx = cx, my = cy
        if (dist > maxR) {
          mx = CENTER + (dx / dist) * maxR
          my = CENTER + (dy / dist) * maxR
        }
        ctx.beginPath()
        ctx.arc(mx, my, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.beginPath()
        ctx.arc(mx, my, 6, 0, Math.PI * 2)
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [visible, selectedName, positionsRef, cameraRef])

  if (!visible) return null

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    // Nearest hit within radius wins.
    let best = null
    let bestD = Infinity
    for (const h of hitsRef.current) {
      const d = Math.hypot(mx - h.sx, my - h.sy)
      if (d <= h.r && d < bestD) { best = h; bestD = d }
    }
    if (!best) return
    if (best.name === 'Sol') onSelectSun()
    else onSelectPlanet(PLANETS.find((p) => p.name === best.name))
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        borderRadius: '14px',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        zIndex: 90,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '12px',
          fontFamily: 'var(--font-body)',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        Radar
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: `${SIZE}px`, height: `${SIZE}px`, cursor: 'pointer', display: 'block' }}
      />
    </div>
  )
}
