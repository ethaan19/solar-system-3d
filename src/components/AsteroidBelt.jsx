import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AsteroidBelt() {
  const pointsRef = useRef()

  const geometry = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 20.5 + Math.random() * 3.0          // 20.5 – 23.5
      const y = (Math.random() - 0.5) * 1.0         // -0.5 – 0.5
      positions[i * 3]     = Math.cos(angle) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#888888"
        size={0.07}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Belt geometry never changes — memo prevents re-renders from parent state.
export default memo(AsteroidBelt)
