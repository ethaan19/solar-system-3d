import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Html, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { createEarthCloudsTexture } from '../utils/textureGenerator.js'

const TEXTURE_FILES = {
  'Mercurio': 'mercury.jpg',
  'Venus':    'venus.jpg',
  'Tierra':   'earth.jpg',
  'Marte':    'mars.jpg',
  'Júpiter':  'jupiter.jpg',
  'Saturno':  'saturn.jpg',
  'Urano':    'uranus.jpg',
  'Neptuno':  'neptune.jpg'
}

function PlanetMesh({ data }) {
  const texture = useTexture(`/textures/${TEXTURE_FILES[data.name]}`)
  texture.wrapS = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <meshStandardMaterial
      map={texture}
      roughness={data.name === 'Tierra' ? 0.35 : 0.8}
      metalness={data.name === 'Tierra' ? 0.1 : 0.05}
    />
  )
}

function SaturnRings({ data }) {
  const ringTexture = useTexture('/textures/saturn_ring.png')
  ringTexture.colorSpace = THREE.SRGBColorSpace

  const geometry = useMemo(() => {
    return new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.5, 64)
  }, [data.radius])

  return (
    <mesh
      geometry={geometry}
      rotation={[Math.PI / 2.8, 0, 0]}
    >
      <meshStandardMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
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

// A single moon revolving around its parent planet on a tilted orbit.
function Moon({ moon, paused, speedMultiplier, onSelect, isSelected }) {
  const pivotRef = useRef()
  const angleRef = useRef(useMemo(() => Math.random() * Math.PI * 2, []))
  // Slight orbital inclination so moons don't all sit in one flat plane.
  const tilt = useMemo(() => (Math.random() - 0.5) * 0.6, [])

  useFrame((_, delta) => {
    if (!paused) {
      angleRef.current += delta * moon.speed * speedMultiplier * 0.6
    }
    if (pivotRef.current) {
      pivotRef.current.position.x = Math.cos(angleRef.current) * moon.distance
      pivotRef.current.position.z = Math.sin(angleRef.current) * moon.distance
      pivotRef.current.position.y = Math.sin(angleRef.current) * moon.distance * tilt
    }
  })

  return (
    <mesh
      ref={pivotRef}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(moon)
      }}
      name={`planet-${moon.name}`}
    >
      <sphereGeometry args={[moon.radius, 16, 16]} />
      <meshStandardMaterial color={moon.color} roughness={0.85} metalness={0.05} />
      {isSelected && <SelectionCircle radius={moon.radius} />}
    </mesh>
  )
}

function Moons({ moons, paused, speedMultiplier, onSelect, selectedName }) {
  if (!moons || moons.length === 0) return null
  return (
    <group>
      {moons.map((moon) => (
        <Moon
          key={moon.name}
          moon={moon}
          paused={paused}
          speedMultiplier={speedMultiplier}
          onSelect={onSelect}
          isSelected={selectedName === moon.name}
        />
      ))}
    </group>
  )
}

export default function Planet({ data, onSelect, selectedPlanet, isSelected, speedMultiplier, paused, positionsRef }) {
  const groupRef = useRef()
  const meshRef  = useRef()
  const ringRef  = useRef()
  const cloudsRef = useRef()

  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, [])
  const angleRef = useRef(initialAngle)

  // Simple LOD: distant orbits use a lower-poly sphere.
  const segments = data.distance > 40 ? 32 : 64

  // Earth cloud layer texture (still procedural for dynamic look)
  const cloudTexture = useMemo(() => {
    if (data.name !== 'Tierra') return null
    const canvas = createEarthCloudsTexture()
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [data.name])

  useFrame((_, delta) => {
    if (!paused) {
      angleRef.current += delta * data.speed * speedMultiplier * 0.15
    }

    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * data.distance
      groupRef.current.position.z = Math.sin(angleRef.current) * data.distance
      // Publish position so the 2D minimap can mirror the scene.
      if (positionsRef) {
        positionsRef.current[data.name] = {
          x: groupRef.current.position.x,
          z: groupRef.current.position.z,
        }
      }
    }

    if (meshRef.current && !paused) {
      meshRef.current.rotation.y += delta * 0.4
    }

    if (cloudsRef.current && !paused) {
      cloudsRef.current.rotation.y += delta * 0.48
    }

    if (ringRef.current && !paused) {
      ringRef.current.rotation.z += delta * 0.05
    }
  })

  return (
    <group ref={groupRef} name={`planet-${data.name}`}>
      {/* Planet mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(data) }}
      >
        <sphereGeometry args={[data.radius, segments, segments]} />
        <Suspense fallback={
          <meshStandardMaterial
            color={data.color}
            roughness={0.8}
            metalness={0.1}
          />
        }>
          <PlanetMesh data={data} />
        </Suspense>
      </mesh>

      {/* Floating planet name */}
      <Html
        position={[0, data.radius + 0.8, 0]}
        center
        distanceFactor={42}
        occlude
        style={{
          fontSize: '15px',
          fontWeight: '600',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-display)',
          color: 'white',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 1px 6px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)',
        }}
      >
        {data.name}
      </Html>

      {/* Earth cloud layer */}
      {data.name === 'Tierra' && cloudTexture && (
        <mesh ref={cloudsRef} scale={1.02} raycast={() => null}>
          <sphereGeometry args={[data.radius, segments, segments]} />
          <meshStandardMaterial
            map={cloudTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}

      {/* Saturn rings */}
      {data.rings && (
        <group
          ref={ringRef}
          onClick={(e) => { e.stopPropagation(); onSelect(data) }}
        >
          <Suspense fallback={null}>
            <SaturnRings data={data} />
          </Suspense>
        </group>
      )}

      {/* Atmospheric glow for planets with atmospheres */}
      {['Tierra', 'Venus', 'Marte', 'Urano', 'Neptuno'].includes(data.name) && (
        <mesh scale={1.035} raycast={() => null}>
          <sphereGeometry args={[data.radius, segments, segments]} />
          <meshBasicMaterial
            color={
              data.name === 'Tierra' ? '#7ebcff' :
              data.name === 'Venus' ? '#ffd778' :
              data.name === 'Marte' ? '#ff6a3c' :
              data.name === 'Urano' ? '#a3ffff' :
              '#5a76ff'
            }
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Moons */}
      <Moons
        moons={data.moons}
        paused={paused}
        speedMultiplier={speedMultiplier}
        onSelect={onSelect}
        selectedName={selectedPlanet?.isMoon ? selectedPlanet.name : null}
      />

      {/* Selection target ring (very fine white ring) */}
      {isSelected && (
        <SelectionCircle radius={data.radius} />
      )}
    </group>
  )
}




