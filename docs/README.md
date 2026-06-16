🌐 **[English Version](../README.md)**

# 🌌 Universe 3D — Sistema Solar Interactivo

Una simulación interactiva en tiempo real del Sistema Solar renderizada con WebGL y React Three Fiber. Explora los ocho planetas, sus lunas y el Sol con texturas fotorrealistas de la NASA, controles de cámara libre y un panel de información astronómica detallado.

---

### **APP:** https://solar-system-3d-omega.vercel.app/

---

## ✨ Características

- **Renderizado 3D en tiempo real** con [Three.js](https://threejs.org/) y [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Texturas fotorrealistas 2K/1K** (NASA) para todos los planetas y el Sol
- **Anillos de Saturno** con mapa de transparencia realista
- **Lunas en órbita** en tiempo real para todos los planetas principales
- **Cinturón de asteroides procedimental** entre Marte y Júpiter
- **Fondo de campo de estrellas** con efecto de profundidad
- **Bloom de posprocesamiento** para simular el brillo luminoso del Sol
- **Cámara libre** con zoom, rotación y seguimiento suave de planetas
- **Animación de introducción cinematográfica** al cargar
- **Panel de información** con datos astronómicos reales para cualquier cuerpo seleccionado
- **Minimapa/Radar 2D** con vista general del sistema desde arriba
- **Control de velocidad de simulación** con pausa
- **Atajos de teclado** para navegar entre planetas y controlar la simulación
- **Tipografía personalizada** Chalet (London & Comprimé)
- **Diseño responsivo** con una interfaz de usuario oscura con temática espacial

---

## 🪐 Cuerpos Celestes

| Planeta | Lunas Modeladas |
|--------|----------------|
| Mercurio | — |
| Venus | — |
| Tierra | Luna |
| Marte | Fobos, Deimos |
| Júpiter | Ío, Europa, Ganímedes, Calisto |
| Saturno | Titán, Encélado, Mimas (+ anillos) |
| Urano | Titania, Oberón |
| Neptuno | Tritón |

El **Sol** también se puede seleccionar e incluye su propio panel de datos estadísticos.

---

## 🎮 Controles

### Ratón / Trackpad
| Acción | Resultado |
|--------|--------|
| **Clic** en un planeta o el Sol | Seleccionar y enfocar la cámara |
| **Arrastrar** | Rotar la cámara |
| **Rueda de desplazamiento** | Acercar / alejar (Zoom) |
| **Clic** en el nombre del planeta (cabecera) | Seleccionar planeta |

### Teclado
| Tecla | Acción |
|-----|--------|
| `←` / `→` | Cuerpo celeste anterior / siguiente |
| `Espacio` | Pausar / reanudar simulación |
| `Esc` | Deseleccionar cuerpo actual |
| `+` / `-` | Aumentar / disminuir velocidad ±0.5× |
| `M` | Mostrar / ocultar radar |
| `O` | Mostrar / ocultar órbitas |

### Botones de la Interfaz (UI)
- **`⊙`** — Alternar órbitas planetarias
- **`◎`** — Alternar radar / minimapa
- **`?`** — Panel de atajos de teclado
- **`▶ / ❚❚`** — Pausar / reanudar simulación
- **Deslizador de velocidad** — Ajustar velocidad de simulación desde 0.1× a 5×

---

## 🚀 Instalación y Uso

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

La aplicación estará disponible en `http://localhost:5173`.

### Versión de Producción

```bash
npm run build
npm run preview
```

---

## 📁 Estructura del Proyecto

```
solar-system/
├── public/
│   └── textures/                   # Texturas astronómicas (NASA)
│       ├── sun.jpg
│       ├── earth.jpg
│       ├── mars.jpg
│       ├── saturn.jpg
│       ├── saturn_ring.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── AsteroidBelt.jsx        # Cinturón de asteroides 3D
│   │   ├── Header.jsx              # Cabecera con nombres de planetas clicables
│   │   ├── InfoPanel.jsx           # Panel lateral con datos del cuerpo seleccionado
│   │   ├── LoadingScreen.jsx       # Pantalla de carga con animación
│   │   ├── Minimap.jsx             # Vista general en 2D / Radar
│   │   ├── OrbitRing.jsx           # Anillos orbitales sutiles
│   │   ├── Planet.jsx              # Planetas, lunas, atmósferas y selección
│   │   ├── ShortcutsHUD.jsx        # Panel de atajos + botones de alternancia
│   │   ├── SpeedControl.jsx        # Control de pausa y velocidad
│   │   └── Sun.jsx                 # Sol con emisión de luz y selección
│   ├── data/
│   │   └── planets.js              # Datos científicos de todos los cuerpos celestes
│   ├── hooks/
│   │   └── useTexturePreloader.js  # Precargador de texturas con progreso
│   ├── utils/
│   │   └── textureGenerator.js     # Texturas procedimentales de respaldo
│   ├── fonts/
│   │   ├── ChaletLondonNineteenSixty.ttf
│   │   └── ChaletComprime-CologneSixty.ttf
│   ├── App.jsx                     # Raíz: Lienzo 3D, cámara, estado global
│   ├── index.css                   # Sistema de diseño y fuentes personalizadas
│   └── main.jsx                    # Punto de entrada de React
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev/) | 18 | Framework de UI |
| [Three.js](https://threejs.org/) | 0.167 | Motor 3D WebGL |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 8 | Integración de Three.js + React |
| [@react-three/drei](https://github.com/pmndrs/drei) | 9 | Ayudantes 3D (Stars, OrbitControls…) |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | 2 | Efectos de posprocesamiento (Bloom) |
| [Vite](https://vitejs.dev/) | 5 | Empaquetador y servidor de desarrollo |

---

## 🌍 Datos Astronómicos

Todos los datos mostrados en el panel de información (diámetro, distancia desde el Sol, duración del día, temperatura media, número de lunas…) están basados en valores reales publicados por la **NASA** y la **UAI** (Unión Astronómica Internacional).

Las texturas provienen de [Solar System Scope Texture Pack](https://www.solarsystemscope.com/textures/) a resolución 2K.

---

## 👤 Autor

**Ethan Macias**

- 🌐 LinkedIn: [https://www.linkedin.com/in/ethan-macias-termenon-b99a79338/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BHyTNUHDhTkWj4qNTEeU%2BOg%3D%3D](https://linkedin.com)
- 💻 GitHub: [@ethaan19](https://github.com)

---

## 📄 Licencia

Proyecto educativo, libre de usar. Las texturas astronómicas son propiedad de sus respectivos autores (NASA / Solar System Scope).
