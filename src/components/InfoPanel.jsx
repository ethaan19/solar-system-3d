export default function InfoPanel({ planet, onClose }) {
  if (!planet) return null

  // Show the real total, and note how many are rendered in the scene.
  const visibleMoons = planet.moons?.length ?? 0
  const totalMoons = planet.info?.lunas ?? 'N/A'
  let moonValue = totalMoons
  if (visibleMoons > 0) {
    moonValue =
      typeof totalMoons === 'number' && totalMoons > visibleMoons
        ? `${visibleMoons} visibles · ${totalMoons}`
        : `${totalMoons}`
  }

  const rows = planet.isMoon
    ? [
        { label: 'Diámetro', value: planet.info?.diametro ?? '—' },
        { label: 'Planeta Progenitor', value: planet.parentPlanet ?? '—' },
        { label: 'Distancia al Planeta', value: planet.info?.distancia ?? '—' },
        { label: 'Período Rotación', value: planet.info?.dia ?? '—' },
        { label: 'Período Orbital', value: planet.info?.año ?? '—' },
        { label: 'Temperatura media', value: planet.info?.temperatura ?? '—' },
      ]
    : [
        { label: 'Diámetro', value: planet.info?.diametro ?? '—' },
        { label: 'Distancia al Sol', value: planet.info?.distancia ?? '—' },
        { label: 'Duración del día', value: planet.info?.dia ?? '—' },
        { label: 'Duración del año', value: planet.info?.año ?? '—' },
        { label: 'Temperatura media', value: planet.info?.temperatura ?? '—' },
        { label: 'Número de lunas', value: moonValue },
      ]

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        right: '24px',
        transform: 'translateY(-50%)',
        width: '320px',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '26px',
        color: 'var(--text-primary)',
        zIndex: 100,
        boxShadow: `0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px var(--border-glow)`,
        animation: 'fadeSlideInRight 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Cerrar"
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.color = 'var(--text-primary)'
          e.currentTarget.style.borderColor = 'var(--border-glow)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.borderColor = 'var(--border-subtle)'
        }}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', paddingRight: '40px', minWidth: 0 }}>
        <span
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: planet.color,
            boxShadow: `0 0 12px ${planet.color}, 0 0 4px ${planet.color}`,
            flexShrink: 0,
            animation: 'pulseGlow 2.4s ease-in-out infinite',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            minWidth: 0,
          }}
        >
          {planet.name}
        </h2>
      </div>

      {/* Subtitle: body type */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginLeft: '24px',
          marginBottom: '18px',
        }}
      >
        {planet.tipo || '—'}
      </p>

      {/* Gradient separator in the planet's colour */}
      <div
        style={{
          height: '2px',
          borderRadius: '2px',
          marginBottom: '18px',
          background: `linear-gradient(90deg, ${planet.color}, ${planet.color}00)`,
        }}
      />

      {/* Data rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rows.map(({ label, value }) => (
          <div
            key={label}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--accent-gold)',
                textAlign: 'right',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
