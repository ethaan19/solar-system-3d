import { useEffect, useRef, useState } from 'react'

// Lightweight dev-only FPS / frame-time readout. Rendered outside the Canvas
// so it has zero impact on the WebGL render loop.
export default function PerfMonitor() {
  const [fps, setFps] = useState(0)
  const [ms, setMs] = useState(0)
  const frames = useRef(0)
  const last = useRef(performance.now())
  const lastFrame = useRef(performance.now())

  useEffect(() => {
    let raf
    const loop = () => {
      const now = performance.now()
      setMs(+(now - lastFrame.current).toFixed(1))
      lastFrame.current = now
      frames.current++
      if (now - last.current >= 1000) {
        setFps(frames.current)
        frames.current = 0
        last.current = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const color = fps >= 50 ? '#7CFFB0' : fps >= 30 ? '#FFD060' : '#FF6A6A'

  return (
    <div
      style={{
        position: 'fixed',
        top: '14px',
        left: '14px',
        zIndex: 200,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        lineHeight: 1.5,
        padding: '6px 10px',
        borderRadius: '8px',
        background: 'rgba(6, 6, 16, 0.7)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <span style={{ color }}>{fps} FPS</span>
      <span style={{ color: 'var(--text-dim)' }}> · {ms} ms</span>
    </div>
  )
}
