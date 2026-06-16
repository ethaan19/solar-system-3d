import { useState } from 'react'

const SHORTCUTS = [
  { keys: ['←', '→'], desc: 'Previous / next body' },
  { keys: ['Space'], desc: 'Pause / resume' },
  { keys: ['Esc'], desc: 'Deselect' },
  { keys: ['+', '−'], desc: 'Speed: ±0.5×' },
  { keys: ['M'], desc: 'Show / hide radar' },
  { keys: ['O'], desc: 'Show / hide orbits' },
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
            Keyboard shortcuts
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
          title="Show / hide orbits (O)"
          aria-label="Show / hide orbits"
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
          title="Show / hide radar (M)"
          aria-label="Show / hide radar"
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
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: open ? 'rgba(255, 208, 96, 0.16)' : 'var(--panel-bg)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: `1px solid ${open ? 'rgba(255,208,96,0.4)' : 'var(--border-glow)'}`,
            color: open ? 'var(--accent-gold)' : 'var(--text-secondary)',
            fontFamily: "var(--font-body)",
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
