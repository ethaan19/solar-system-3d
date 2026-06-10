import { useEffect, useRef, useState, useMemo } from 'react'

// Pre-canvas cinematic loading screen.
// `progress` is the real texture-load fraction (0..1).
// `exiting` triggers the fade-out + zoom transition into the scene.
export default function LoadingScreen({ progress, exiting }) {
  // Smoothly animated display value that eases toward the real progress.
  const [display, setDisplay] = useState(0)
  const displayRef = useRef(0)
  const targetRef = useRef(0)

  targetRef.current = Math.min(100, progress * 100)

  useEffect(() => {
    let raf
    const tick = () => {
      const cur = displayRef.current
      const target = exiting ? 100 : targetRef.current
      // Ease toward target; never overshoot, always creep forward a little.
      const next = cur + (target - cur) * 0.08 + (target > cur ? 0.05 : 0)
      displayRef.current = Math.min(target, next)
      setDisplay(displayRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [exiting])

  // Random CSS starfield particles (computed once).
  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.6,
        duration: Math.random() * 14 + 10,
        delay: -Math.random() * 24,
        opacity: Math.random() * 0.5 + 0.2,
      })),
    []
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 40%, #0a0a18 0%, #050508 70%, #000 100%)',
        overflow: 'hidden',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.18)' : 'scale(1)',
        filter: exiting ? 'blur(6px)' : 'blur(0)',
        transition: 'opacity 1.4s ease-out, transform 1.6s cubic-bezier(0.5, 0, 0.2, 1), filter 1.4s ease-out',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* Animated CSS particles (pre-canvas, not Three.js) */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: '#cfe0ff',
              opacity: p.opacity,
              boxShadow: '0 0 6px rgba(160, 190, 255, 0.8)',
              animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(34px, 7vw, 64px)',
            letterSpacing: '0.32em',
            color: 'var(--text-primary)',
            textShadow:
              '0 0 24px rgba(74, 143, 255, 0.55), 0 0 60px rgba(74, 143, 255, 0.25)',
            paddingLeft: '0.32em', // optical compensation for letter-spacing
          }}
        >
          UNIVERSO 3D
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginTop: '14px',
            paddingLeft: '0.42em',
          }}
        >
          Sistema Solar Interactivo
        </p>
      </div>


    </div>
  )
}
