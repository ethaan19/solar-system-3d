// ---------------------------------------------------------------------------
// Perlin noise — proper gradient noise, tileable on X axis
// ---------------------------------------------------------------------------
function buildPermutation() {
  const p = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]]
  }
  return [...p, ...p] // 512 length
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(a, b, t) { return a + t * (b - a) }
function grad(hash, x, y) {
  const h = hash & 7
  const u = h < 4 ? x : y
  const v = h < 4 ? y : x
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
}

class Perlin {
  constructor() { this.perm = buildPermutation() }

  noise(x, y) {
    const p = this.perm
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const u = fade(xf), v = fade(yf)
    const aa = p[p[X] + Y], ab = p[p[X] + Y + 1]
    const ba = p[p[X + 1] + Y], bb = p[p[X + 1] + Y + 1]
    return lerp(
      lerp(grad(aa, xf, yf),     grad(ba, xf - 1, yf),     u),
      lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
      v
    )
  }

  // Fractal Brownian Motion
  fbm(x, y, octaves = 6, lacunarity = 2.0, gain = 0.5) {
    let val = 0, amp = 0.5, freq = 1, max = 0
    for (let i = 0; i < octaves; i++) {
      val += this.noise(x * freq, y * freq) * amp
      max += amp
      amp *= gain
      freq *= lacunarity
    }
    return val / max // [-1, 1] approx
  }

  // Turbulence — absolute value of octaves for "folded" look
  turbulence(x, y, octaves = 6, lacunarity = 2.0, gain = 0.5) {
    let val = 0, amp = 0.5, freq = 1, max = 0
    for (let i = 0; i < octaves; i++) {
      val += Math.abs(this.noise(x * freq, y * freq)) * amp
      max += amp
      amp *= gain
      freq *= lacunarity
    }
    return val / max // [0, ~1]
  }
}

// Clamp helper
function clamp(v, lo = 0, hi = 255) { return Math.max(lo, Math.min(hi, Math.round(v))) }

// Linearly interpolate two RGB triples
function lerpRGB(c0, c1, t) {
  return [
    c0[0] + (c1[0] - c0[0]) * t,
    c0[1] + (c1[1] - c0[1]) * t,
    c0[2] + (c1[2] - c0[2]) * t,
  ]
}

// Sample a colour ramp (array of {t, rgb} sorted by t)
function ramp(stops, t) {
  if (t <= stops[0].t) return stops[0].rgb
  if (t >= stops[stops.length - 1].t) return stops[stops.length - 1].rgb
  for (let i = 0; i < stops.length - 1; i++) {
    if (t <= stops[i + 1].t) {
      const f = (t - stops[i].t) / (stops[i + 1].t - stops[i].t)
      return lerpRGB(stops[i].rgb, stops[i + 1].rgb, f)
    }
  }
  return stops[stops.length - 1].rgb
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  return canvas
}

// ---------------------------------------------------------------------------
// SUN  — bright orange-yellow granulation + sunspot-like dark flecks
// ---------------------------------------------------------------------------
export function createSunTexture() {
  const W = 1024, H = 512
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 8
    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 16
      // Two octave sets: large granulation + fine detail
      const gran = p.fbm(nx, ny, 5, 2.1, 0.52) * 0.5 + 0.5
      const fine = p.turbulence(nx * 3, ny * 3, 4, 2.2, 0.45) * 0.5

      const n = gran * 0.7 + fine * 0.3

      // Colour ramp: dark reddish-orange → pure yellow-white
      const stops = [
        { t: 0.0,  rgb: [180,  55,   0] },
        { t: 0.25, rgb: [220,  90,   5] },
        { t: 0.45, rgb: [255, 140,  10] },
        { t: 0.65, rgb: [255, 195,  40] },
        { t: 0.80, rgb: [255, 230,  90] },
        { t: 1.0,  rgb: [255, 255, 180] },
      ]
      const [r, g, b] = ramp(stops, n)

      const i = (y * W + x) * 4
      d[i]   = clamp(r)
      d[i+1] = clamp(g)
      d[i+2] = clamp(b)
      d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

// ---------------------------------------------------------------------------
// MERCURY  — heavily cratered grey rock with bright/dark albedo patches
// ---------------------------------------------------------------------------
export function createMercuryTexture() {
  const W = 1024, H = 512
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 10
    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 20
      const n = p.fbm(nx, ny, 7, 2.0, 0.5) * 0.5 + 0.5

      const stops = [
        { t: 0.0,  rgb: [ 60,  58,  55] },
        { t: 0.25, rgb: [ 95,  90,  85] },
        { t: 0.50, rgb: [128, 122, 115] },
        { t: 0.70, rgb: [162, 155, 148] },
        { t: 0.85, rgb: [195, 188, 180] },
        { t: 1.0,  rgb: [220, 215, 210] },
      ]
      const [r, g, b] = ramp(stops, n)

      const i = (y * W + x) * 4
      d[i]   = clamp(r)
      d[i+1] = clamp(g)
      d[i+2] = clamp(b)
      d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  // — craters drawn on top ————
  const craterCount = 90
  for (let k = 0; k < craterCount; k++) {
    // Distribute craters via noise-driven pseudo-random positions
    const cx = ((Math.sin(k * 127.1) * 0.5 + 0.5)) * W
    const cy = ((Math.sin(k * 311.7) * 0.5 + 0.5)) * H
    const r  = 3 + Math.abs(Math.sin(k * 73.1)) * 22

    // Dark bowl
    const bowl = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    bowl.addColorStop(0,    'rgba(38,36,34,0.9)')
    bowl.addColorStop(0.55, 'rgba(60,57,53,0.7)')
    bowl.addColorStop(0.80, 'rgba(90,86,80,0.4)')
    bowl.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = bowl
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()

    // Bright ejecta rim
    const rim = ctx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r * 1.15)
    rim.addColorStop(0,   'rgba(215,210,200,0)')
    rim.addColorStop(0.4, 'rgba(215,210,200,0.55)')
    rim.addColorStop(1,   'rgba(215,210,200,0)')
    ctx.fillStyle = rim
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2); ctx.fill()
  }
  return canvas
}

// ---------------------------------------------------------------------------
// VENUS  — thick sulphuric cloud bands, amber/cream palette
// ---------------------------------------------------------------------------
export function createVenusTexture() {
  const W = 1024, H = 512
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 6
    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 12
      // Domain-warped horizontal bands
      const warpX = p.noise(nx * 0.5, ny * 0.5) * 3.0
      const warpY = p.noise(nx * 0.5 + 5.2, ny * 0.5 + 1.3) * 1.5
      const band  = p.fbm(nx + warpX, ny + warpY, 6, 2.0, 0.50) * 0.5 + 0.5
      // Add fine streaks
      const streak = p.turbulence(nx * 2 + warpX, ny * 4, 4, 2.1, 0.45) * 0.3

      const n = Math.min(1, band * 0.75 + streak * 0.25)

      const stops = [
        { t: 0.0,  rgb: [175, 125,  55] },
        { t: 0.20, rgb: [200, 160,  80] },
        { t: 0.40, rgb: [225, 195, 115] },
        { t: 0.60, rgb: [240, 215, 150] },
        { t: 0.75, rgb: [248, 232, 185] },
        { t: 0.88, rgb: [252, 242, 210] },
        { t: 1.0,  rgb: [255, 250, 230] },
      ]
      const [r, g, b] = ramp(stops, n)

      const i = (y * W + x) * 4
      d[i]   = clamp(r)
      d[i+1] = clamp(g)
      d[i+2] = clamp(b)
      d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

// ---------------------------------------------------------------------------
// EARTH  — deep oceans, continents, polar ice, latitude-aware biomes
// ---------------------------------------------------------------------------
export function createEarthTexture() {
  const W = 2048, H = 1024
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data

  // Continent shape noise — large scale
  const pLand = new Perlin()
  // Detail noise — fine terrain
  const pDetail = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 14
    // Latitude 0=equator, 1=pole
    const latFrac = Math.abs((y / H) - 0.5) * 2  // 0..1 pole→eq→pole
    const lat = latFrac  // 0 equator, 1 pole

    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 28

      // Continent mask — domain warped for organic shapes
      const wx = pLand.noise(nx * 0.3, ny * 0.3) * 2.5
      const wy = pLand.noise(nx * 0.3 + 7.1, ny * 0.3 + 3.9) * 2.5
      const continent = pLand.fbm(nx * 0.6 + wx, ny * 0.6 + wy, 7, 2.0, 0.52) * 0.5 + 0.5
      // Fine detail on top
      const detail = pDetail.fbm(nx * 1.5, ny * 1.5, 4, 2.1, 0.48) * 0.5 + 0.5
      const height = continent * 0.80 + detail * 0.20

      let r, g, b

      // Polar ice caps (grow with latitude)
      const iceLine = 0.82 - pDetail.noise(nx * 3, ny * 3) * 0.06
      if (lat > iceLine) {
        const iceBlend = Math.min(1, (lat - iceLine) / 0.12)
        r = clamp(200 + iceBlend * 55)
        g = clamp(215 + iceBlend * 40)
        b = clamp(235 + iceBlend * 20)
      } else if (height > 0.52) {
        // LAND
        const t = (height - 0.52) / 0.48

        if (lat > 0.68) {
          // Tundra / snow
          r = clamp(175 + t * 60); g = clamp(180 + t * 60); b = clamp(170 + t * 70)
        } else if (lat < 0.22) {
          // Tropical — rainforest / savanna
          if (t < 0.4) {
            // Lush jungle
            r = clamp(20 + t * 60); g = clamp(95 + t * 55); b = clamp(15 + t * 20)
          } else {
            // Savanna / sandy
            r = clamp(160 + t * 60); g = clamp(130 + t * 40); b = clamp(60 + t * 20)
          }
        } else {
          // Temperate
          if (t < 0.35) {
            // Forest
            r = clamp(30 + t * 80); g = clamp(80 + t * 70); b = clamp(20 + t * 30)
          } else if (t < 0.65) {
            // Mountain rock
            r = clamp(110 + t * 80); g = clamp(100 + t * 75); b = clamp(90 + t * 70)
          } else {
            // Snow-capped peak
            r = clamp(215 + t * 40); g = clamp(218 + t * 37); b = clamp(225 + t * 30)
          }
        }
      } else {
        // OCEAN — depth-shaded
        const depth = 1 - height / 0.52
        const shallowMix = Math.max(0, 1 - depth * 2.5)
        // Deep: near-black navy → shallow: vivid cyan-blue
        r = clamp(5 + (1 - depth) * 25 + shallowMix * 40)
        g = clamp(20 + (1 - depth) * 55 + shallowMix * 70)
        b = clamp(90 + (1 - depth) * 110 + shallowMix * 40)
      }

      const i = (y * W + x) * 4
      d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

// ---------------------------------------------------------------------------
// EARTH CLOUDS  — realistic wispy cloud systems
// ---------------------------------------------------------------------------
export function createEarthCloudsTexture() {
  const W = 2048, H = 1024
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()
  const p2 = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 12
    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 24
      // Domain warp for swirly storms
      const wx = p2.noise(nx * 0.6, ny * 0.6) * 2.2
      const wy = p2.noise(nx * 0.6 + 4.3, ny * 0.6 + 8.1) * 2.2
      const cloud = p.fbm(nx + wx, ny + wy, 7, 2.05, 0.50) * 0.5 + 0.5

      let alpha = 0
      if (cloud > 0.50) {
        alpha = Math.pow((cloud - 0.50) / 0.50, 1.3) * 255
        alpha = Math.min(230, alpha)
      }

      const i = (y * W + x) * 4
      d[i] = 255; d[i+1] = 255; d[i+2] = 255; d[i+3] = clamp(alpha)
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

// ---------------------------------------------------------------------------
// MARS  — rusty red, Olympus Mons region, Valles Marineris, polar caps
// ---------------------------------------------------------------------------
export function createMarsTexture() {
  const W = 1024, H = 512
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()
  const pFine = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 12
    const lat = Math.abs((y / H) - 0.5) * 2  // 0=equator, 1=pole

    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 24
      const wx = p.noise(nx * 0.4, ny * 0.4) * 2.0
      const wy = p.noise(nx * 0.4 + 3.7, ny * 0.4 + 6.2) * 2.0
      const terrain = p.fbm(nx + wx, ny + wy, 7, 2.0, 0.52) * 0.5 + 0.5
      const fine = pFine.fbm(nx * 2, ny * 2, 4, 2.1, 0.46) * 0.5 + 0.5
      const h = terrain * 0.72 + fine * 0.28

      let r, g, b

      // Polar CO2 ice caps
      const iceLine = 0.84 - pFine.noise(nx * 4, ny * 4) * 0.05
      if (lat > iceLine) {
        const blend = Math.min(1, (lat - iceLine) / 0.10)
        r = clamp(210 + blend * 45); g = clamp(210 + blend * 42); b = clamp(218 + blend * 37)
      } else {
        // Martian surface colour ramp
        const stops = [
          { t: 0.0,  rgb: [ 65,  22,   8] },  // dark basalt
          { t: 0.20, rgb: [115,  42,  18] },  // dark rust
          { t: 0.38, rgb: [165,  68,  28] },  // mid red
          { t: 0.55, rgb: [195,  88,  40] },  // rusty orange
          { t: 0.70, rgb: [215, 120,  60] },  // brighter highland
          { t: 0.85, rgb: [228, 158,  95] },  // dust-covered bright
          { t: 1.0,  rgb: [240, 195, 140] },  // bright dust
        ];
        [r, g, b] = ramp(stops, h)
      }

      const i = (y * W + x) * 4
      d[i] = clamp(r); d[i+1] = clamp(g); d[i+2] = clamp(b); d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  // Valles Marineris — equatorial canyon system (dark gash)
  const vmY = H * 0.47
  const vmCtx = ctx
  const vmGrad = vmCtx.createLinearGradient(0, vmY - 18, 0, vmY + 18)
  vmGrad.addColorStop(0,   'rgba(0,0,0,0)')
  vmGrad.addColorStop(0.3, 'rgba(55,18,8,0.55)')
  vmGrad.addColorStop(0.5, 'rgba(40,12,4,0.75)')
  vmGrad.addColorStop(0.7, 'rgba(55,18,8,0.55)')
  vmGrad.addColorStop(1,   'rgba(0,0,0,0)')
  vmCtx.fillStyle = vmGrad
  vmCtx.fillRect(W * 0.28, vmY - 18, W * 0.40, 36)

  return canvas
}

// ---------------------------------------------------------------------------
// JUPITER  — bands + domain-warped turbulence + Great Red Spot
// ---------------------------------------------------------------------------
export function createJupiterTexture() {
  const W = 2048, H = 1024
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()
  const pWarp = new Perlin()

  // Colour ramp for Jupiter's bands
  const jupiterRamp = [
    { t: 0.0,  rgb: [ 80,  50,  30] },  // very dark belt
    { t: 0.12, rgb: [140,  80,  45] },  // dark ochre belt
    { t: 0.24, rgb: [195, 140,  75] },  // warm mid-band
    { t: 0.36, rgb: [218, 175, 110] },  // bright cream zone
    { t: 0.48, rgb: [235, 200, 145] },  // pale zone
    { t: 0.58, rgb: [220, 170, 100] },  // ochre zone
    { t: 0.68, rgb: [185, 115,  65] },  // medium belt
    { t: 0.78, rgb: [150,  80,  45] },  // dark red-brown belt
    { t: 0.88, rgb: [210, 175, 120] },  // bright polar zone
    { t: 1.0,  rgb: [230, 205, 165] },  // pale polar
  ]

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 10
    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 20

      // Domain warp — makes bands wavy and turbulent
      const wx = pWarp.fbm(nx * 0.8, ny * 0.8, 4, 2.1, 0.50) * 3.5
      const wy = pWarp.fbm(nx * 0.8 + 6.3, ny * 0.8 + 2.8, 4, 2.1, 0.50) * 1.5

      // Band position (0..1 across height) with warp
      const bandY = (y + wy * 18) / H
      // Multiple sine harmonics for realistic band pattern
      const bandVal =
        Math.sin(bandY * Math.PI * 22) * 0.40 +
        Math.sin(bandY * Math.PI * 10) * 0.28 +
        Math.sin(bandY * Math.PI *  5) * 0.18 +
        Math.sin(bandY * Math.PI *  2) * 0.14
      const band = (bandVal + 1) * 0.5  // 0..1

      // Fine turbulence noise mixed in
      const turb = p.turbulence(nx + wx, ny + wy * 0.5, 5, 2.0, 0.48) * 0.38

      const n = Math.min(1, Math.max(0, band * 0.68 + turb * 0.32))

      const [r, g, b] = ramp(jupiterRamp, n)

      const i = (y * W + x) * 4
      d[i] = clamp(r); d[i+1] = clamp(g); d[i+2] = clamp(b); d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  // Great Red Spot — realistic elliptical storm, southern hemisphere
  const grsX = W * 0.62
  const grsY = H * 0.62   // southern hemisphere
  const grsRX = W * 0.055  // horizontal radius
  const grsRY = H * 0.048  // vertical radius

  ctx.save()
  ctx.translate(grsX, grsY)
  ctx.scale(grsRX / grsRY, 1)

  // Multi-stop radial gradient for realistic storm eye + swirl
  const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, grsRY)
  g1.addColorStop(0,    'rgba(130, 40, 18, 1)')   // dark red eye
  g1.addColorStop(0.25, 'rgba(195, 65, 30, 1)')   // vivid red
  g1.addColorStop(0.55, 'rgba(215, 90, 45, 0.95)')
  g1.addColorStop(0.75, 'rgba(190, 70, 35, 0.75)')
  g1.addColorStop(0.90, 'rgba(160, 55, 25, 0.40)')
  g1.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = g1
  ctx.beginPath(); ctx.arc(0, 0, grsRY, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  return canvas
}

// ---------------------------------------------------------------------------
// SATURN  — pale caramel bands, very subtle, hazier than Jupiter
// ---------------------------------------------------------------------------
export function createSaturnTexture() {
  const W = 1024, H = 512
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()
  const pWarp = new Perlin()

  const saturnRamp = [
    { t: 0.0,  rgb: [160, 135,  90] },
    { t: 0.20, rgb: [195, 172, 118] },
    { t: 0.38, rgb: [218, 198, 148] },
    { t: 0.54, rgb: [232, 215, 170] },
    { t: 0.68, rgb: [240, 228, 190] },
    { t: 0.82, rgb: [245, 235, 205] },
    { t: 1.0,  rgb: [250, 242, 220] },
  ]

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 7
    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 14

      const wy = pWarp.fbm(nx * 0.5, ny * 0.5, 3, 2.0, 0.48) * 1.2
      const bandY = (y + wy * 14) / H

      const bandVal =
        Math.sin(bandY * Math.PI * 14) * 0.35 +
        Math.sin(bandY * Math.PI *  6) * 0.25 +
        Math.sin(bandY * Math.PI *  2) * 0.20
      const band = (bandVal + 0.8) / 1.8

      const turb = p.turbulence(nx * 0.7, ny * 1.2, 4, 2.1, 0.45) * 0.15
      const n = Math.min(1, Math.max(0, band * 0.82 + turb))

      const [r, g, b] = ramp(saturnRamp, n)

      const i = (y * W + x) * 4
      d[i] = clamp(r); d[i+1] = clamp(g); d[i+2] = clamp(b); d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

// ---------------------------------------------------------------------------
// SATURN RINGS  — photorealistic 1D gradient with Cassini & Encke divisions
// ---------------------------------------------------------------------------
export function createSaturnRingsTexture() {
  const W = 1024, H = 4
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()

  // Procedural ring profile: returns [r,g,b,a] for position t in [0,1]
  function ringColor(t) {
    // t=0 inner (near planet), t=1 outer
    // Cassini division ≈ t=0.52–0.57, Encke ≈ t=0.76–0.78
    const cassini = (t > 0.52 && t < 0.57)
    const encke   = (t > 0.76 && t < 0.785)
    // Maxwell gap ≈ t=0.60–0.61
    const maxwell = (t > 0.60 && t < 0.615)

    if (t < 0.05 || t > 0.98) return [0, 0, 0, 0]
    if (cassini) return [30, 25, 18, Math.round((0.57 - t) / 0.05 * 18)]
    if (encke)   return [30, 25, 18, 8]
    if (maxwell) return [30, 25, 18, 12]

    // Noise adds micro-structure
    const noise = p.fbm(t * 80, 0, 3, 2.0, 0.5) * 0.5 + 0.5

    // Ring zones:  C ring | B ring (bright) | A ring | F ring hint
    let alpha, stops
    if (t < 0.22) {
      // C ring — faint, translucent
      alpha = Math.round((0.18 + noise * 0.12) * 120)
      stops = [
        { t: 0.0, rgb: [120, 108,  88] },
        { t: 1.0, rgb: [155, 140, 115] },
      ]
    } else if (t < 0.52) {
      // B ring — brightest, most opaque
      alpha = Math.round((0.70 + noise * 0.28) * 255)
      stops = [
        { t: 0.0, rgb: [195, 178, 148] },
        { t: 0.3, rgb: [215, 198, 165] },
        { t: 0.6, rgb: [230, 215, 182] },
        { t: 1.0, rgb: [210, 192, 158] },
      ]
    } else if (t < 0.76) {
      // A ring — moderate, slightly darker than B
      alpha = Math.round((0.48 + noise * 0.32) * 255)
      stops = [
        { t: 0.0, rgb: [180, 162, 130] },
        { t: 0.5, rgb: [195, 178, 148] },
        { t: 1.0, rgb: [172, 155, 125] },
      ]
    } else {
      // Outer A ring / F ring
      alpha = Math.round((0.12 + noise * 0.18) * 200)
      stops = [
        { t: 0.0, rgb: [155, 138, 110] },
        { t: 1.0, rgb: [130, 115,  92] },
      ]
    }

    const localT = Math.min(1, Math.max(0, noise))
    const [r, g, b] = ramp(stops, localT)
    return [r, g, b, Math.min(255, alpha)]
  }

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = x / (W - 1)
      const [r, g, b, a] = ringColor(t)
      const i = (y * W + x) * 4
      d[i] = clamp(r); d[i+1] = clamp(g); d[i+2] = clamp(b); d[i+3] = clamp(a)
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

// ---------------------------------------------------------------------------
// URANUS  — uniform teal-cyan with very faint polar brightening
// ---------------------------------------------------------------------------
export function createUranusTexture() {
  const W = 1024, H = 512
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 6
    const lat = Math.abs((y / H) - 0.5) * 2  // 0=equator, 1=pole

    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 12

      // Very subtle banding — Uranus has nearly featureless appearance
      const wy = p.noise(nx * 0.4, ny * 0.4) * 0.8
      const band = p.fbm(nx * 0.3, (ny + wy) * 0.6, 4, 2.0, 0.44) * 0.5 + 0.5
      const fine = p.turbulence(nx * 1.2, ny * 1.5, 3, 2.0, 0.42) * 0.12

      const n = band * 0.90 + fine

      // Polar brightening
      const polarBright = Math.pow(lat, 3) * 0.15

      const stops = [
        { t: 0.0,  rgb: [100, 185, 195] },
        { t: 0.30, rgb: [115, 200, 210] },
        { t: 0.55, rgb: [125, 210, 218] },
        { t: 0.75, rgb: [138, 218, 225] },
        { t: 1.0,  rgb: [150, 225, 232] },
      ]
      let [r, g, b] = ramp(stops, Math.min(1, n))
      r = clamp(r + polarBright * 30)
      g = clamp(g + polarBright * 20)
      b = clamp(b + polarBright * 15)

      const i = (y * W + x) * 4
      d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

// ---------------------------------------------------------------------------
// NEPTUNE  — deep cobalt blue with bright white methane cloud streaks
// ---------------------------------------------------------------------------
export function createNeptuneTexture() {
  const W = 1024, H = 512
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const d = img.data
  const p = new Perlin()
  const pCloud = new Perlin()

  for (let y = 0; y < H; y++) {
    const ny = (y / H) * 10
    for (let x = 0; x < W; x++) {
      const nx = (x / W) * 20

      // Domain-warped bands
      const wx = p.noise(nx * 0.6, ny * 0.6) * 2.8
      const wy = p.noise(nx * 0.6 + 5.5, ny * 0.6 + 2.2) * 1.8
      const band =
        Math.sin((y / H + wy * 0.04) * Math.PI * 16) * 0.30 +
        Math.sin((y / H + wy * 0.025) * Math.PI * 7) * 0.22 +
        Math.sin((y / H) * Math.PI * 3) * 0.18
      const bandN = (band + 0.7) / 1.4

      const turb = p.turbulence(nx + wx, ny + wy, 5, 2.0, 0.50) * 0.22

      const base = Math.min(1, Math.max(0, bandN * 0.72 + turb * 0.28))

      // Methane cloud streaks — bright patches
      const cloud = pCloud.fbm(nx * 1.8 + wx * 0.5, ny * 1.8 + wy * 0.3, 5, 2.1, 0.50) * 0.5 + 0.5
      const cloudMask = Math.max(0, cloud - 0.64) / 0.36

      const stops = [
        { t: 0.0,  rgb: [ 15,  25,  95] },
        { t: 0.25, rgb: [ 22,  40, 130] },
        { t: 0.45, rgb: [ 35,  62, 168] },
        { t: 0.65, rgb: [ 48,  82, 195] },
        { t: 0.82, rgb: [ 60, 100, 215] },
        { t: 1.0,  rgb: [ 80, 125, 235] },
      ]
      let [r, g, b] = ramp(stops, base)

      // Blend in cloud white
      r = clamp(r + cloudMask * (255 - r) * 0.85)
      g = clamp(g + cloudMask * (255 - g) * 0.85)
      b = clamp(b + cloudMask * (255 - b) * 0.85)

      // Great Dark Spot region hint — southern area
      const gdsX = W * 0.35
      const gdsY = H * 0.58
      const dxg = (x - gdsX) / (W * 0.08)
      const dyg = (y - gdsY) / (H * 0.06)
      const gdsDist = Math.sqrt(dxg * dxg + dyg * dyg)
      if (gdsDist < 1.0) {
        const blend = (1 - gdsDist) * 0.55
        r = clamp(r * (1 - blend) + 8 * blend)
        g = clamp(g * (1 - blend) + 15 * blend)
        b = clamp(b * (1 - blend) + 55 * blend)
      }

      const i = (y * W + x) * 4
      d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}
