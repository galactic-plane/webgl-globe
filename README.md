# WebGL Globe

![WebGL Globe](https://raw.githubusercontent.com/galactic-plane/webgl-globe/master/infographic.png)

---

## GitHub Version
> Runs static HTML assets only

[Live Demo](https://galactic-plane.github.io/webgl-globe/wwwroot/index.html)

## Learn More
WebGL Globe is a cloud-enabled (via the cloud bump map :P), mobile-ready (if you want), earth-powered HTML5/THREE.JS app.

### Built With
- jQuery
- three.js
- HTML5
- Materialize-CSS

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

### Clone the Repository
Use git to clone the repository:
```bash
git clone https://github.com/galactic-plane/webgl-globe.git
```

## Install
In the webgl-globe directory run:
```bash
$ npm install
```
---
## Run Local 
[Node.js](https://nodejs.org/en/download/) :zap: [Express](https://expressjs.com/en/starter/installing.html) :zap: [Nodemon](https://www.npmjs.com/package/nodemon)
```bash
$ nodemon app.js
```

## Run Local from Docker
> Using the vivaldi browser (replace with your browser of choice)
```bash
$ docker pull dayafter/webgl-globe:latest

$ docker run -dp 3000:3000 dayafter/webgl-globe

$ vivaldi localhost:3000
```
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