export default function SpeedControl({ speed, paused, onSpeedChange, onTogglePause }) {
  const label = paused
    ? 'SIMULACIÓN EN PAUSA'
    : `VELOCIDAD x${speed.toFixed(1)}`

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-glow)',
        borderRadius: '44px',
        padding: '12px 22px',
        color: 'var(--text-primary)',
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px var(--border-subtle)',
        userSelect: 'none',
      }}
    >
      {/* Play/Pause button — animated icon swap */}
      <button
        onClick={onTogglePause}
        title={paused ? 'Reanudar (Espacio)' : 'Pausar (Espacio)'}
        style={{
          background: paused
            ? 'rgba(255, 208, 96, 0.16)'
            : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${paused ? 'rgba(255,208,96,0.4)' : 'var(--border-subtle)'}`,
          color: paused ? 'var(--accent-gold)' : 'var(--text-primary)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.25s, color 0.25s, border-color 0.25s, transform 0.1s',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.9)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <span style={{ display: 'inline-block', transition: 'transform 0.25s ease' }}>
          {paused ? '▶' : '❚❚'}
        </span>
      </button>

      {/* Status label */}
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          color: paused ? 'var(--accent-gold)' : 'var(--text-secondary)',
          minWidth: '148px',
          transition: 'color 0.25s',
        }}
      >
        {label}
      </span>

      {/* Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'ChaletLondon, var(--font-body)', fontSize: '13px', color: 'var(--text-dim)' }}>
          0.1×
        </span>
        <input
          className="uni-slider"
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={speed}
          onChange={e => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: '140px' }}
        />
        <span style={{ fontFamily: 'ChaletLondon, var(--font-body)', fontSize: '13px', color: 'var(--text-dim)' }}>
          5×
        </span>
      </div>

      {/* Current speed badge */}
      <div
        style={{
          background: 'rgba(255, 208, 96, 0.12)',
          border: '1px solid rgba(255, 208, 96, 0.32)',
          borderRadius: '22px',
          padding: '4px 12px',
          fontFamily: "'ChaletLondon', var(--font-body)",
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent-gold)',
          minWidth: '52px',
          textAlign: 'center',
          letterSpacing: '0.04em',
        }}
      >
        {speed.toFixed(1)}×
      </div>
    </div>
  )
}
