export default function Header({ planetNames, activeName, onSelectPlanet }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '22px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '0.4em',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          paddingLeft: '0.4em', // optical compensation for letter-spacing
          textShadow: '0 0 20px rgba(74, 143, 255, 0.4)',
        }}
      >
        Universo 3D
      </div>

      <div
        style={{
          marginTop: '8px',
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0',
          pointerEvents: 'auto',
        }}
      >
        {planetNames.map((name, i) => {
          const active = name === activeName
          return (
            <span key={name} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span
                onClick={() => onSelectPlanet && onSelectPlanet(name)}
                style={{
                  color: active ? 'var(--accent-gold)' : 'rgba(200, 215, 255, 0.75)',
                  textShadow: active
                    ? '0 0 10px rgba(255, 208, 96, 0.7), 0 0 22px rgba(255, 208, 96, 0.35)'
                    : '0 0 8px rgba(140, 170, 255, 0.5), 0 0 18px rgba(100, 140, 255, 0.2)',
                  transition: 'color 0.25s, text-shadow 0.25s',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.textShadow = '0 0 12px rgba(200,220,255,0.9), 0 0 28px rgba(120,160,255,0.5)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'rgba(200, 215, 255, 0.75)'
                    e.currentTarget.style.textShadow = '0 0 8px rgba(140, 170, 255, 0.5), 0 0 18px rgba(100, 140, 255, 0.2)'
                  }
                }}
              >
                {name}
              </span>
              {i < planetNames.length - 1 && (
                <span style={{ color: 'var(--text-dim)', margin: '0 7px', opacity: 0.6, pointerEvents: 'none' }}>·</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
