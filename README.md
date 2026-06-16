# 🌌 Universe 3D — Interactive Solar System

A real-time interactive Solar System simulation rendered with WebGL and React Three Fiber. Explore all eight planets, their moons and the Sun with NASA photorealistic textures, free camera controls and a detailed astronomical information panel.

[Leer en Español 🇪🇸](docs/README.md)

---

### **APP:** https://solar-system-3d-omega.vercel.app/

---

## ✨ Features

- **Real-time 3D rendering** with [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Photorealistic 2K/1K textures** (NASA) for all planets and the Sun
- **Saturn's rings** with realistic transparency map
- **Orbiting moons** in real time for all major planets
- **Procedural asteroid belt** between Mars and Jupiter
- **Star field** background with depth effect
- **Post-processing bloom** to simulate the Sun's luminous glow
- **Free camera** with zoom, rotation and smooth planet tracking
- **Cinematic intro animation** on load
- **Information panel** with real astronomical data for any selected body
- **2D Minimap/Radar** with top-down system overview
- **Simulation speed control** with pause
- **Keyboard shortcuts** to navigate between planets and control the simulation
- **Custom typography** Chalet (London & Comprimé)
- **Responsive design** with a dark space-themed UI

---

## 🪐 Celestial Bodies

| Planet | Modelled Moons |
|--------|----------------|
| Mercury | — |
| Venus | — |
| Earth | Moon |
| Mars | Phobos, Deimos |
| Jupiter | Io, Europa, Ganymede, Callisto |
| Saturn | Titan, Enceladus, Mimas (+ rings) |
| Uranus | Titania, Oberon |
| Neptune | Triton |

The **Sun** is also selectable and includes its own statistical data panel.

---

## 🎮 Controls

### Mouse / Trackpad
| Action | Result |
|--------|--------|
| **Click** on planet or Sun | Select and focus camera |
| **Drag** | Rotate camera |
| **Scroll wheel** | Zoom in / out |
| **Click** planet name (header) | Select planet |

### Keyboard
| Key | Action |
|-----|--------|
| `←` / `→` | Previous / next celestial body |
| `Space` | Pause / resume simulation |
| `Esc` | Deselect current body |
| `+` / `-` | Increase / decrease speed ±0.5× |
| `M` | Show / hide radar |
| `O` | Show / hide orbits |

### UI Buttons
- **`⊙`** — Toggle planetary orbits
- **`◎`** — Toggle radar / minimap
- **`?`** — Keyboard shortcuts panel
- **`▶ / ❚❚`** — Pause / resume simulation
- **Speed slider** — Adjust simulation speed from 0.1× to 5×

---

## 🚀 Installation & Usage

### Requirements
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
solar-system/
├── public/
│   └── textures/                   # Astronomical textures (NASA)
│       ├── sun.jpg
│       ├── earth.jpg
│       ├── mars.jpg
│       ├── saturn.jpg
│       ├── saturn_ring.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── AsteroidBelt.jsx        # 3D asteroid belt
│   │   ├── Header.jsx              # Header with clickable planet names
│   │   ├── InfoPanel.jsx           # Side panel with selected body data
│   │   ├── LoadingScreen.jsx       # Loading screen with animation
│   │   ├── Minimap.jsx             # Radar / 2D top-down view
│   │   ├── OrbitRing.jsx           # Subtle orbit rings
│   │   ├── Planet.jsx              # Planets, moons, atmospheres & selection
│   │   ├── ShortcutsHUD.jsx        # Shortcuts panel + toggle buttons
│   │   ├── SpeedControl.jsx        # Pause and speed control
│   │   └── Sun.jsx                 # Sun with light emission & selection
│   ├── data/
│   │   └── planets.js              # Scientific data for all celestial bodies
│   ├── hooks/
│   │   └── useTexturePreloader.js  # Texture preloader with progress
│   ├── utils/
│   │   └── textureGenerator.js     # Procedural fallback textures
│   ├── fonts/
│   │   ├── ChaletLondonNineteenSixty.ttf
│   │   └── ChaletComprime-CologneSixty.ttf
│   ├── App.jsx                     # Root: 3D Canvas, camera, global state
│   ├── index.css                   # Design system and custom fonts
│   └── main.jsx                    # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ Tech Stack

| Technology | Version | Usage |
|---|---|---|
| [React](https://react.dev/) | 18 | UI Framework |
| [Three.js](https://threejs.org/) | 0.167 | WebGL 3D Engine |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 8 | Three.js + React integration |
| [@react-three/drei](https://github.com/pmndrs/drei) | 9 | 3D Helpers (Stars, OrbitControls…) |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | 2 | Post-processing effects (Bloom) |
| [Vite](https://vitejs.dev/) | 5 | Bundler and dev server |

---

## 🌍 Astronomical Data

All data shown in the information panel (diameter, distance from the Sun, day length, average temperature, number of moons…) is based on real values published by **NASA** and the **IAU** (International Astronomical Union).

Textures are from the [Solar System Scope Texture Pack](https://www.solarsystemscope.com/textures/) at 2K resolution.

---

## 👤 Author

**Ethan Macias**

- 🌐 LinkedIn: [https://www.linkedin.com/in/ethan-macias-termenon-b99a79338/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BHyTNUHDhTkWj4qNTEeU%2BOg%3D%3D](https://linkedin.com)
- 💻 GitHub: [@ethaan19](https://github.com)

---

## 📄 License

Educational project, free to use. Astronomical textures are the property of their respective authors (NASA / Solar System Scope).
