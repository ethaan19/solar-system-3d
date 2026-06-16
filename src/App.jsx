import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

import Sun from './components/Sun.jsx'
import Planet from './components/Planet.jsx'
import OrbitRing from './components/OrbitRing.jsx'
import AsteroidBelt from './components/AsteroidBelt.jsx'
import InfoPanel from './components/InfoPanel.jsx'
import SpeedControl from './components/SpeedControl.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import Header from './components/Header.jsx'
import Minimap from './components/Minimap.jsx'
import ShortcutsHUD from './components/ShortcutsHUD.jsx'
import PerfMonitor from './components/PerfMonitor.jsx'
import { useTexturePreloader } from './hooks/useTexturePreloader.js'
import { PLANETS } from './data/planets.js'

const SUN_DATA = {
  name: 'Sun',
  radius: 2.5,
  color: '#FF8C00',
  tipo: 'Star · Yellow Dwarf',
  info: {
    diametro: '1,392,700 km',
    distancia: '0 km (Center)',
    dia: '609 hours',
    año: 'N/A',
    temperatura: '5,500 °C (surface)',
    lunas: 'N/A',
  }
}

// Publishes the live camera x/z into a ref so the 2D minimap can mirror it.
function CameraTracker({ cameraRef }) {
  useFrame((state) => {
    cameraRef.current = { x: state.camera.position.x, z: state.camera.position.z }
  })
  return null
}

// Cubic ease-in-out
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const INTRO_DURATION = 3.5 // seconds
const INTRO_START = new THREE.Vector3(0, 80, 400)
const INTRO_END = new THREE.Vector3(0, 35, 65)

function CameraController({ selectedPlanet, introPlaying, onIntroDone }) {
  const { camera, controls } = useThree()
  const wasSelected = useRef(false)
  const lastSelectedName = useRef(null)
  const shouldTransition = useRef(false)
  const transitionFrames = useRef(0)
  const introElapsed = useRef(0)
  const introInit = useRef(false)

  // Place the camera far away the moment the intro begins.
  useEffect(() => {
    if (introPlaying) {
      camera.position.copy(INTRO_START)
      camera.lookAt(0, 0, 0)
      introElapsed.current = 0
      introInit.current = true
    }
  }, [introPlaying, camera])

  useEffect(() => {
    if (selectedPlanet) {
      wasSelected.current = true
      if (lastSelectedName.current !== selectedPlanet.name) {
        lastSelectedName.current = selectedPlanet.name
        shouldTransition.current = true
        transitionFrames.current = 45
      }
    } else {
      lastSelectedName.current = null
      shouldTransition.current = false
    }
  }, [selectedPlanet])

  useFrame((state, delta) => {
    const ctrl = state.controls || controls
    if (!ctrl) return

    // ----- Cinematic intro fly-in -----
    if (introPlaying && introInit.current) {
      introElapsed.current += delta
      const t = Math.min(1, introElapsed.current / INTRO_DURATION)
      const e = easeInOutCubic(t)
      state.camera.position.lerpVectors(INTRO_START, INTRO_END, e)
      ctrl.target.set(0, 0, 0)
      if (ctrl.enabled) ctrl.enabled = false // lock user input during flight
      ctrl.update()
      if (t >= 1) {
        introInit.current = false
        ctrl.enabled = true
        onIntroDone && onIntroDone()
      }
      return
    }

    if (selectedPlanet) {
      const planetGroup = state.scene.getObjectByName(`planet-${selectedPlanet.name}`)
      if (planetGroup) {
        const targetPos = new THREE.Vector3()
        planetGroup.getWorldPosition(targetPos)
        
        // Smoothly follow the planet's position (always update target)
        ctrl.target.lerp(targetPos, 0.08)
        
        // Only override the distance if we are in the initial transition phase
        if (shouldTransition.current) {
          const desiredDistance = selectedPlanet.radius * 4.5 + 4
          const toCamera = new THREE.Vector3().subVectors(state.camera.position, targetPos)
          const currentDistance = toCamera.length()
          
          const newDistance = THREE.MathUtils.lerp(currentDistance, desiredDistance, 0.08)
          toCamera.setLength(newDistance)
          state.camera.position.addVectors(targetPos, toCamera)
          
          transitionFrames.current -= 1
          if (transitionFrames.current <= 0) {
            shouldTransition.current = false
          }
        } else {
          // Just follow the planet without overriding user zoom distance!
          const toCamera = new THREE.Vector3().subVectors(state.camera.position, ctrl.target)
          state.camera.position.addVectors(targetPos, toCamera)
          ctrl.target.copy(targetPos)
        }
        ctrl.update()
      }
    } else if (wasSelected.current) {
      // Return target to the Sun (0, 0, 0)
      const center = new THREE.Vector3(0, 0, 0)
      ctrl.target.lerp(center, 0.08)
      
      const toCamera = new THREE.Vector3().subVectors(state.camera.position, center)
      const currentDistance = toCamera.length()
      const desiredDistance = 75
      
      if (ctrl.target.distanceTo(center) > 0.05 || Math.abs(currentDistance - desiredDistance) > 0.05) {
        const newDistance = THREE.MathUtils.lerp(currentDistance, desiredDistance, 0.08)
        toCamera.setLength(newDistance)
        state.camera.position.addVectors(center, toCamera)
        ctrl.update()
      } else {
        ctrl.target.copy(center)
        toCamera.setLength(desiredDistance)
        state.camera.position.addVectors(center, toCamera)
        ctrl.update()
        wasSelected.current = false
      }
    }
  })

  return null
}

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [speed, setSpeed] = useState(0.1)
  const [paused, setPaused] = useState(false)
  const [orbitsVisible, setOrbitsVisible] = useState(true)

  // ----- Loading / intro state machine -----
  const { progress, done } = useTexturePreloader()
  const [exiting, setExiting]   = useState(false) // loading screen fading out
  const [sceneReady, setSceneReady] = useState(false) // loading screen unmounted
  const [introPlaying, setIntroPlaying] = useState(false) // camera fly-in active
  const [minimapVisible, setMinimapVisible] = useState(true)

  // Live position registry for the 2D minimap (written inside the Canvas).
  const positionsRef = useRef({})
  const cameraRef = useRef({ x: 0, z: 65 })

  // Once textures are ready, begin the fade-out, then unmount + start intro.
  const exitingStarted = useRef(false)
  useEffect(() => {
    if (!done || exitingStarted.current) return
    exitingStarted.current = true
    setExiting(true)
    const t = setTimeout(() => {
      console.log('[loader] sceneReady → true')
      setSceneReady(true)
      setIntroPlaying(true)
    }, 1500)
    return () => clearTimeout(t)
  }, [done])

  const handleSelectPlanet  = useCallback((planet) => setSelectedPlanet(planet), [])
  const handleSelectSun     = useCallback(() => setSelectedPlanet(SUN_DATA), [])
  const handleDeselect      = useCallback(() => setSelectedPlanet(null), [])
  const handleTogglePause   = useCallback(() => setPaused(p => !p), [])
  const handleIntroDone     = useCallback(() => setIntroPlaying(false), [])
  const handleToggleOrbits  = useCallback(() => setOrbitsVisible(v => !v), [])

  // ----- Keyboard controls -----
  useEffect(() => {
    if (!sceneReady) return
    // Ordered list of selectable bodies (Sun first, then planets and their moons).
    const bodies = [SUN_DATA]
    PLANETS.forEach(p => {
      bodies.push(p)
      if (p.moons) {
        p.moons.forEach(m => bodies.push(m))
      }
    })

    const cycle = (dir) => {
      setSelectedPlanet((cur) => {
        const idx = cur ? bodies.findIndex(b => b.name === cur.name) : -1
        const next = (idx + dir + bodies.length) % bodies.length
        return bodies[next]
      })
    }

    const onKey = (e) => {
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); cycle(1); break
        case 'ArrowLeft':  e.preventDefault(); cycle(-1); break
        case ' ':          e.preventDefault(); setPaused(p => !p); break
        case 'Escape':     setSelectedPlanet(null); break
        case '+': case '=': setSpeed(s => Math.min(5, +(s + 0.5).toFixed(1))); break
        case '-': case '_': setSpeed(s => Math.max(0.1, +(s - 0.5).toFixed(1))); break
        case 'm': case 'M': setMinimapVisible(v => !v); break
        case 'o': case 'O': setOrbitsVisible(v => !v); break
        default: break
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sceneReady])

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--space-black)', position: 'relative' }}>

      {!sceneReady && <LoadingScreen progress={progress} exiting={exiting} />}

      {/* Header */}
      {sceneReady && (
        <Header
          planetNames={PLANETS.map(p => p.name)}
          activeName={selectedPlanet?.name}
          onSelectPlanet={(name) => {
            const planet = PLANETS.find(p => p.name === name)
            if (planet) handleSelectPlanet(planet)
          }}
        />
      )}

      {/* 3D Canvas */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ position: [0, 80, 400], fov: 55 }}
        gl={{ antialias: true }}
        onPointerMissed={handleDeselect}
      >
        {/* Ambient light — soft glow to make texture details visible on dark side */}
        <ambientLight intensity={0.3} />

        <Stars radius={300} depth={60} count={6000} factor={4} saturation={0} fade speed={0.3} />

        <Sun
          onSelect={() => handleSelectPlanet(SUN_DATA)}
          isSelected={selectedPlanet?.name === 'Sun'}
        />
        <AsteroidBelt />

        {PLANETS.map((planet) => (
          <group key={planet.name}>
            {orbitsVisible && (
              <OrbitRing
                distance={planet.distance}
                selected={selectedPlanet?.name === planet.name}
                color={planet.color}
              />
            )}
            <Planet
              data={planet}
              onSelect={handleSelectPlanet}
              selectedPlanet={selectedPlanet}
              isSelected={selectedPlanet?.name === planet.name}
              speedMultiplier={speed}
              paused={paused}
              positionsRef={positionsRef}
            />
          </group>
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={150}
          zoomSpeed={0.8}
          rotateSpeed={0.5}
          makeDefault
        />

        <CameraController
          selectedPlanet={selectedPlanet}
          introPlaying={introPlaying}
          onIntroDone={handleIntroDone}
        />
        <CameraTracker cameraRef={cameraRef} />

        <EffectComposer>
          <Bloom
            intensity={2}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            radius={0.9}
          />
        </EffectComposer>
      </Canvas>

      {sceneReady && (
        <>
          <InfoPanel planet={selectedPlanet} onClose={handleDeselect} />
          <SpeedControl
            speed={speed}
            paused={paused}
            onSpeedChange={setSpeed}
            onTogglePause={handleTogglePause}
          />
          <Minimap
            positionsRef={positionsRef}
            cameraRef={cameraRef}
            selectedName={selectedPlanet?.name}
            onSelectPlanet={handleSelectPlanet}
            onSelectSun={handleSelectSun}
            visible={minimapVisible}
          />
          <ShortcutsHUD
            orbitsVisible={orbitsVisible}
            onToggleOrbits={handleToggleOrbits}
            minimapVisible={minimapVisible}
            onToggleMinimap={() => setMinimapVisible(v => !v)}
          />
        </>
      )}
    </div>
  )
}
