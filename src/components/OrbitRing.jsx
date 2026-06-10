import { useMemo, memo } from 'react'
import * as THREE from 'three'

function OrbitRing({ distance, selected = false, color = '#ffffff' }) {
  const points = useMemo(() => {
    const pts = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance))
    }
    return pts
  }, [distance])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={selected ? color : '#ffffff'}
        transparent
        opacity={selected ? 0.08 : 0.003}
        depthWrite={false}
        toneMapped={false}
      />
    </line>
  )
}

// Static unless its own props change — avoids re-render on unrelated state.
export default memo(OrbitRing)
