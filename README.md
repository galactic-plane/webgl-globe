# WebGL Globe

An interactive 3D Earth visualization built with WebGL and Three.js that demonstrates the behavior of bezier curves connecting points on a sphere, featuring dynamic particle effects and performance monitoring.

[Live Demo](https://galactic-plane.github.io/webgl-globe/wwwroot/index.html)

## What is WebGL Globe?

WebGL Globe is a browser-based 3D Earth visualization that showcases advanced WebGL rendering techniques. The application creates mesmerizing visual effects by:

- **3D Earth Rendering**: A detailed, textured Earth sphere with multiple visual themes including normal, cartoon, and frozen styles
- **Bezier Curve Animation**: Smooth curved paths connecting points on the Earth's surface using mathematical bezier curves
- **Particle Systems**: Dynamic particle effects that travel along the curves, creating flowing animations across the globe
- **Spike Generation**: Visual impact markers that appear at curve endpoints, with customizable intensity
- **Performance Monitoring**: Real-time performance metrics tracking frame rates, render times, and system overhead
- **Interactive Gaming Elements**: A hero vs villain battle system with character selection and damage tracking

The project serves as both an educational tool for understanding 3D graphics programming and a demonstration of modern web technologies working together to create immersive visual experiences.

## Features

### Core Visualization
- **Interactive 3D Globe**: Rotate, zoom, and explore a detailed Earth model
- **Multiple Visual Themes**: Switch between normal, cartoon, and frozen Earth textures
- **Dynamic Lighting**: Realistic lighting effects with bump mapping and specular highlights
- **Starfield Background**: Immersive space environment with galaxy textures
- **Cloud Layer**: Animated atmospheric cloud coverage

### Animation System
- **Bezier Curve Paths**: Mathematically precise curved trajectories between surface points
- **Particle Effects**: Smooth particle animations flowing along the curves
- **Spike Impact System**: Visual markers showing curve endpoints with customizable intensity
- **Real-time Animation**: Smooth 60fps animations with performance optimization

### Interactive Elements
- **Character Battle System**: Hero vs villain gameplay with damage tracking
- **Sound Effects**: Immersive audio feedback for interactions and animations
- **Performance Dashboard**: Live metrics showing spikes, overhead, duration, and charge levels
- **Control Interface**: Play, pause, stop, and refresh controls for the animation system

### Technical Features
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **WebGL Acceleration**: Hardware-accelerated 3D graphics rendering
- **Static File Deployment**: No server required - runs entirely in the browser
- **Cross-browser Compatibility**: Works in all modern web browsers supporting WebGL

## Built With

- **Three.js** - 3D graphics library for WebGL rendering
- **jQuery** - DOM manipulation and event handling
- **Materialize CSS** - Modern responsive UI framework
- **CreateJS SoundJS** - Audio management and sound effects
- **HTML5 Canvas** - WebGL rendering context
- **ES6 Modules** - Modern JavaScript module system

## Getting Started

### Static Hosting (Recommended)
The project runs as a static website with no server requirements:

```bash
# Clone the repository
git clone https://github.com/galactic-plane/webgl-globe.git
cd webgl-globe

# Install dependencies (for development tools)
npm install

# Start local development server
npm run dev
```

### Alternative Static Servers
```bash
# Using Python
cd wwwroot
python -m http.server 8000

# Using any static file server
# Just serve the wwwroot directory
```

### Node.js Development Server (Optional)
```bash
npm install
npm start
```

## Project Structure

```
wwwroot/
├── index.html          # Main globe visualization
├── node.html           # Hero vs villain battle mode
├── css/               
│   ├── materialize.css # UI framework styles
│   └── style.css      # Custom application styles
├── js/
│   ├── globe.js       # Core 3D globe implementation
│   ├── init.js        # Application initialization
│   ├── three.min.js   # Three.js library
│   └── OrbitControls.js # Camera controls
├── img/
│   └── 4k/            # High-resolution Earth textures
│       ├── normal/    # Standard Earth textures
│       ├── cartoon/   # Stylized Earth textures
│       └── frozen/    # Ice age Earth textures
└── sounds/            # Audio effects and background music
```

## Globe API Usage

The globe object provides a simple API for creating animated bezier curves and particle effects:

```javascript
// Initialize the globe
let container = document.getElementById('globe');
let globeObj = new DAT.Globe(container, { sceneType: 'normal' });

// Create animated curves between points
let originate = [35.1380556, -79.0075]; // Starting coordinates (lat, lng)
let destination = [39.445723, -123.8052935]; // Ending coordinates

// Customize particle appearance
globeObj.particleColor(0x01001f); // Set particle color
globeObj.particleSize(0.03); // Set particle size
globeObj.particleSpeed(0.9); // Set animation speed

// Add dynamic line colors
let color = new THREE.Color(0xffffff);
color.setHex(Math.random() * 0xffffff);
globeObj.lineColor(color);

// Control spike generation
globeObj.enableSpikeOverload(true); // Enable/disable spike effects
```

## Visual Themes

The globe supports multiple visual themes that completely change the appearance:

- **Normal**: Realistic Earth with detailed surface textures, cloud layers, and water
- **Cartoon**: Stylized, colorful representation with enhanced visual appeal  
- **Frozen**: Ice age Earth showing frozen landscapes and glacial coverage

## Performance Monitoring

The application includes comprehensive performance tracking:

- **Spikes**: Number of impact markers generated
- **Overhead**: System resource usage metrics
- **Duration**: Animation rendering times
- **Charge**: Performance efficiency percentage
- **FPS Monitoring**: Real-time frame rate display

## Browser Compatibility

WebGL Globe works in all modern browsers that support:
- WebGL 1.0 or higher
- ES6 JavaScript features
- HTML5 Canvas
- Web Audio API (for sound effects)

Tested and optimized for Chrome, Firefox, Safari, and Edge.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)