# WebGL Globe

![WebGL Globe](https://raw.githubusercontent.com/galactic-plane/webgl-globe/master/infographic.png)

---

## Static Version
> Now runs as static HTML assets only - no server required!

[Live Demo](https://galactic-plane.github.io/webgl-globe/wwwroot/index.html)

## Learn More
WebGL Globe is a mobile-ready, earth-powered HTML5/THREE.JS app featuring interactive 3D globe visualization with particle effects.

### Built With
- jQuery
- three.js
- HTML5
- Materialize-CSS

---

## Getting Started

### For Static Hosting (Recommended)
The project now works as a static website. No server setup required!

1. **GitHub Pages**: Enable GitHub Pages to serve from root directory
2. **Local Development**: Use any static file server:
   ```bash
   # Using Python
   cd wwwroot
   python -m http.server 8000
   
   # Using live-server (with auto-reload)
   npm install
   npm run dev
   ```

### For Node.js Development (Optional)
If you want to run the Express server locally:

#### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

#### Clone the Repository
Use git to clone the repository:
```bash
git clone https://github.com/galactic-plane/webgl-globe.git
cd webgl-globe
```

## Quick Start

### Static Deployment (Recommended)
1. **GitHub Pages**: 
   - Push to GitHub and enable Pages in repository settings
   - Your site will be available at `https://yourusername.github.io/webgl-globe/wwwroot/`

2. **Local Static Server**:
   ```bash
   # Using live-server (with auto-reload)
   npm install
   npm run dev
   
   # Or using Python
   cd wwwroot
   python -m http.server 8000
   ```

### Node.js Development Server (Optional)
```bash
npm install
npm start
```

Visit: `http://localhost:3000/index.html` or `http://localhost:3000/node.html`

---

## File Structure
- `wwwroot/` - Static website files (GitHub Pages ready)
- `wwwroot/index.html` - Main globe visualization
- `wwwroot/node.html` - Interactive hero vs villain battle
- `app.js` - Optional Express server for local development

## Recent Changes
- ✅ Removed Heroku dependencies (Procfile, etc.)
- ✅ Made project GitHub Pages compatible
- ✅ Created static version of interactive features
- ✅ Simplified deployment process
---

## Usage

```javascript
let container = document.getElementById('globe');
let globeObj = new DAT.Globe(container);

// Random line color
let color = new THREE.Color(0xffffff);
color.setHex(Math.random() * 0xffffff);
globeObj.lineColor(color);

// Set particle color
globeObj.particleColor(0x01001f);

// Starting point
let originate = [];
originate.push(35.1380556);
originate.push(-79.0075);

// Ending points
let marks = [];
marks[0] = [];
marks[0][0] = 39.445723;
marks[0][1] = -123.8052935;
```
---

## Contributing
Pull requests are welcome. My journey for learning never ends, so I look forward to your insights.  For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)