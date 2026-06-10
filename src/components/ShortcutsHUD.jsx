import { useState } from 'react'

const SHORTCUTS = [
  { keys: ['←', '→'], desc: 'Cuerpo anterior / siguiente' },
  { keys: ['Espacio'], desc: 'Pausar / reanudar' },
  { keys: ['Esc'], desc: 'Deseleccionar' },
  { keys: ['+', '−'], desc: 'Velocidad: 0.5×' },
  { keys: ['M'], desc: 'Mostrar / ocultar radar' },
  { keys: ['O'], desc: 'Mostrar / ocultar órbitas' },
]

function Key({ children }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        minWidth: '22px',
        padding: '2px 7px',
        textAlign: 'center',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </span>
  )
}

// Collapsible keyboard-shortcuts panel, toggled by a "?" button bottom-right.
export default function ShortcutsHUD({ orbitsVisible = true, onToggleOrbits, minimapVisible = true, onToggleMinimap }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 95, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: 0,
            width: '256px',
            background: 'var(--panel-bg)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid var(--border-glow)',
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            animation: 'fadeUpRight 0.25s ease-out',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: '14px',
            }}
          >
            Atajos de teclado
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {SHORTCUTS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {s.keys.map((k) => <Key key={k}>{k}</Key>)}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    textAlign: 'right',
                  }}
                >
                  {s.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom row: orbit toggle + ? button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Orbit toggle button */}
        <button
          onClick={onToggleOrbits}
          title="Mostrar / ocultar órbitas (O)"
          aria-label="Mostrar / ocultar órbitas"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: orbitsVisible ? 'rgba(74, 143, 255, 0.16)' : 'var(--panel-bg)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: `1px solid ${orbitsVisible ? 'rgba(74,143,255,0.45)' : 'var(--border-glow)'}`,
            color: orbitsVisible ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = orbitsVisible ? 'rgba(74,143,255,0.24)' : 'rgba(255,255,255,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = orbitsVisible ? 'rgba(74, 143, 255, 0.16)' : 'var(--panel-bg)'
          }}
        >
          ⊙
        </button>

        {/* Radar toggle button */}
        <button
          onClick={onToggleMinimap}
          title="Mostrar / ocultar radar (M)"
          aria-label="Mostrar / ocultar radar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: minimapVisible ? 'rgba(74, 143, 255, 0.16)' : 'var(--panel-bg)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: `1px solid ${minimapVisible ? 'rgba(74,143,255,0.45)' : 'var(--border-glow)'}`,
            color: minimapVisible ? 'var(--accent-blue)' : 'var(--text-secondary)',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = minimapVisible ? 'rgba(74,143,255,0.24)' : 'rgba(255,255,255,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = minimapVisible ? 'rgba(74, 143, 255, 0.16)' : 'var(--panel-bg)'
          }}
        >
          ◎
        </button>

        {/* Shortcuts ? button */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Atajos de teclado"
          title="Atajos de teclado"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: open ? 'rgba(255, 208, 96, 0.16)' : 'var(--panel-bg)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: `1px solid ${open ? 'rgba(255,208,96,0.4)' : 'var(--border-glow)'}`,
            color: open ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontFamily: "'ChaletLondon', var(--font-body)",
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
          }}
        >
          ?
        </button>

      </div>
    </div>
  )
}
