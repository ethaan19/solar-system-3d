import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Billboard } from '@react-three/drei'
import * as THREE from 'three'

function SunMesh() {
  const sunTexture = useTexture('/textures/sun.jpg')
  sunTexture.wrapS = THREE.RepeatWrapping
  sunTexture.colorSpace = THREE.SRGBColorSpace

  return (
    <meshStandardMaterial
      map={sunTexture}
      emissiveMap={sunTexture}
      emissive="#FF8C00"
      emissiveIntensity={3.5}
      roughness={0.4}
      metalness={0.1}
      toneMapped={false}
    />
  )
}

function SelectionCircle({ radius }) {
  return (
    <Billboard>
      <mesh raycast={() => null}>
        <ringGeometry args={[radius * 1.03, radius * 1.045, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  )
}

export default function Sun({ onSelect, isSelected }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12
    }
  })

  return (
    <group>
      {/* Core light source */}
      <pointLight
        position={[0, 0, 0]}
        intensity={15}
        distance={250}
        decay={0.8}
        color="#FFF5E0"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={6}
        distance={120}
        decay={0.6}
        color="#FFD700"
      />

      {/* Sun mesh */}
      <mesh
        ref={meshRef}
        name="planet-Sol"
        onClick={(e) => {
          e.stopPropagation()
          if (onSelect) onSelect()
        }}
      >
        <sphereGeometry args={[2.5, 64, 64]} />
        <Suspense fallback={
          <meshStandardMaterial
            color="#FFA500"
            emissive="#FF6000"
            emissiveIntensity={3.0}
            roughness={0.8}
            metalness={0}
            toneMapped={false}
          />
        }>
          <SunMesh />
        </Suspense>
      </mesh>

      {/* Selection target ring (very fine white ring) */}
      {isSelected && (
        <SelectionCircle radius={2.5} />
      )}
    </group>
  )
}




