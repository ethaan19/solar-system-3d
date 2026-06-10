import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// The 9 JPG textures tracked during the loading screen.
export const PRELOAD_TEXTURES = [
  '/textures/sun.jpg',
  '/textures/mercury.jpg',
  '/textures/venus.jpg',
  '/textures/earth.jpg',
  '/textures/mars.jpg',
  '/textures/jupiter.jpg',
  '/textures/saturn.jpg',
  '/textures/uranus.jpg',
  '/textures/neptune.jpg',
]

// Loads all 9 textures via THREE.TextureLoader and tracks real progress.
// On completion (or error on any single file) marks done so the loading
// screen can transition. drei's useTexture reuses the THREE cache automatically.
export function useTexturePreloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const total = PRELOAD_TEXTURES.length
    let loaded = 0

    const finish = () => {
      setProgress(1)
      setDone(true)
    }

    const onOne = () => {
      loaded++
      setProgress(loaded / total)
      if (loaded >= total) finish()
    }

    const loader = new THREE.TextureLoader()
    PRELOAD_TEXTURES.forEach((url) => {
      loader.load(url, onOne, undefined, () => {
        console.warn('Textura no cargada:', url)
        onOne() // count errors as loaded so we never stall
      })
    })

    // Hard fallback in case the browser stalls completely.
    const timeout = setTimeout(finish, 15000)
    return () => clearTimeout(timeout)
  }, [])

  return { progress, done }
}
