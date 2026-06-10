# 🌌 Universo 3D — Sistema Solar Interactivo

Una simulación interactiva del Sistema Solar renderizada en tiempo real con tecnología WebGL y React Three Fiber. Explora los ocho planetas, sus lunas y el Sol con texturas fotorrealistas de la NASA, controles de cámara libres y un panel de información astronómica detallado.

---

## ✨ Características

- **Renderizado 3D en tiempo real** con [Three.js](https://threejs.org/) y [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Texturas fotorrealistas** de resolución 2K/1K (NASA) para todos los planetas y el Sol
- **Anillos de Saturno** con mapa de transparencia realista
- **Lunas orbitando** en tiempo real para los planetas principales
- **Cinturón de asteroides** procedural entre Marte y Júpiter
- **Campo de estrellas** de fondo con efecto de profundidad
- **Bloom postprocesado** para simular el resplandor luminoso del Sol y los planetas
- **Cámara libre** con zoom, rotación y seguimiento suave de planetas seleccionados
- **Animación de intro cinematográfica** al cargar la aplicación
- **Panel de información** con datos astronómicos reales al seleccionar cualquier cuerpo celeste
- **Minimap/Radar 2D** de la vista cenital del sistema
- **Control de velocidad** de la simulación con pausa
- **Atajos de teclado** para navegar entre planetas y controlar la simulación
- **Fuente tipográfica personalizada** Chalet (London & Comprimé)
- **Diseño responsivo** con estética de interfaz espacial oscura

---

## 🪐 Cuerpos Celestes Incluidos

| Planeta | Lunas modeladas |
|---------|----------------|
| Mercurio | — |
| Venus | — |
| Tierra | Luna |
| Marte | Fobos, Deimos |
| Júpiter | Ío, Europa, Ganímedes, Calisto |
| Saturno | Titán, Encélado, Mimas (+ anillos) |
| Urano | Titania, Oberón |
| Neptuno | Tritón |

También incluye el **Sol** como cuerpo seleccionable con sus propios datos estadísticos.

---

## 🎮 Controles

### Ratón / Trackpad
| Acción | Resultado |
|--------|-----------|
| **Clic** en planeta o Sol | Seleccionar y enfocar cámara |
| **Arrastrar** | Rotar la cámara |
| **Rueda** | Zoom in / out |
| **Clic** en nombre del planeta (cabecera) | Seleccionar planeta |

### Teclado
| Tecla | Acción |
|-------|--------|
| `←` / `→` | Cambiar al cuerpo anterior / siguiente |
| `Espacio` | Pausar / reanudar la simulación |
| `Esc` | Deseleccionar el cuerpo actual |
| `+` / `-` | Aumentar / reducir la velocidad ±0.5× |
| `M` | Mostrar / ocultar el radar |
| `O` | Mostrar / ocultar las órbitas |

### Botones de la interfaz
- **`⊙`** — Toggle de órbitas planetarias
- **`◎`** — Toggle del radar / minimap
- **`?`** — Panel de atajos de teclado
- **`▶ / ❚❚`** — Pausa / reanudar simulación
- **Slider de velocidad** — Ajusta la velocidad de 0.1× a 5×

---

## 🚀 Instalación y uso

### Requisitos
- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

### Build de producción

```bash
npm run build
npm run preview
```

---

## 📁 Estructura del Proyecto

```
solar-system/
├── public/
│   └── textures/              # Texturas astronómicas (NASA)
│       ├── sun.jpg
│       ├── earth.jpg
│       ├── mars.jpg
│       ├── saturn.jpg
│       ├── saturn_ring.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── AsteroidBelt.jsx   # Cinturón de asteroides 3D
│   │   ├── Header.jsx         # Cabecera con nombres de planetas clicables
│   │   ├── InfoPanel.jsx      # Panel lateral de datos del cuerpo seleccionado
│   │   ├── LoadingScreen.jsx  # Pantalla de carga con animación
│   │   ├── Minimap.jsx        # Radar / vista cenital 2D
│   │   ├── OrbitRing.jsx      # Anillos de órbita sutiles
│   │   ├── Planet.jsx         # Planetas, lunas, atmósferas y selección
│   │   ├── ShortcutsHUD.jsx   # Panel de atajos + botones de toggle
│   │   ├── SpeedControl.jsx   # Control de pausa y velocidad
│   │   └── Sun.jsx            # El Sol con emisión de luz y selección
│   ├── data/
│   │   └── planets.js         # Datos científicos de todos los cuerpos celestes
│   ├── hooks/
│   │   └── useTexturePreloader.js  # Precarga de texturas con progreso
│   ├── utils/
│   │   └── textureGenerator.js    # Texturas procedurales de respaldo
│   ├── fonts/
│   │   ├── ChaletLondonNineteenSixty.ttf
│   │   └── ChaletComprime-CologneSixty.ttf
│   ├── App.jsx                # Raíz: Canvas 3D, cámara, estado global
│   ├── index.css              # Sistema de diseño y fuentes personalizadas
│   └── main.jsx               # Punto de entrada React
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev/) | 18 | Framework UI |
| [Three.js](https://threejs.org/) | 0.167 | Motor 3D WebGL |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 8 | Integración Three.js + React |
| [@react-three/drei](https://github.com/pmndrs/drei) | 9 | Helpers 3D (Stars, OrbitControls…) |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | 2 | Efectos de postprocesado (Bloom) |
| [Vite](https://vitejs.dev/) | 5 | Bundler y servidor de desarrollo |

---

## 🌍 Datos Astronómicos

Todos los datos mostrados en el panel de información (diámetro, distancia al Sol, duración del día, temperatura media, número de lunas…) están basados en valores reales publicados por la **NASA** y la **IAU** (Unión Astronómica Internacional).

Las texturas provienen del [Solar System Scope Texture Pack](https://www.solarsystemscope.com/textures/) con resolución 2K.

---

## 📄 Licencia

Proyecto educativo de uso libre. Las texturas astronómicas son propiedad de sus respectivos autores (NASA / Solar System Scope).
