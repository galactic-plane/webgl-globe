/**
 * @author Daniel Penrod (Iturea) / https://github.com/Iturea
 * 
 * released under MIT License (MIT)
 */

(function (globals) {
  "use strict";

  let global_EarthMaterialURL = "img/4k/sceneType/earth.png";
  let global_BumpMapMaterialURL = "img/4k/normal/elev_bump.jpg";
  let global_SpecularMapMaterialURL = "img/4k/frozen/water.png";
  let global_CloudMaterialURL = "img/4k/normal/fair_clouds.png";
  let global_StarFieldURL = "img/4k/sceneType/galaxy_starfield.png";
  let global_ParticleURL = "img/particle4u.png";

  // Set up namespace
  let DAT = (globals.DAT = {
    _namespace: true,
  });

  // Main Globe object
  DAT.Globe = function (container, opts) {
    global_EarthMaterialURL = global_EarthMaterialURL.replace(/sceneType/g, opts.sceneType);
    global_StarFieldURL = global_StarFieldURL.replace(/sceneType/g, opts.sceneType);

    // Define stats
    let _overhead = 0,
      _duration = 0;

    // Define scene objects
    let scene, camera, renderer, controls, sphere, clouds, stars;

    // Define Sphere
    let radius = 0.5,
      segments = 52,
      rotation = 6;

    // Flag to determine if orbit is occurring
    let _isFlying = false;

    // Define particle objects
    let particleMesh,
      _particleSpeed = 0.9,
      _particleSize = 0.03,
      _particleColor = 0x01001f,
      particlesGeo = new THREE.Geometry(),
      particleColors = [];

    // Define line objects
    let lines = [],
      points = [],
      endpoints = [],
      _lineColor = null,
      lineColors = [],
      tweens = [];

    // Define point objects
    let point,
      pointData = [],
      baseGeometry;

    // Define color options
    opts = opts || {};
    let colorFn =
      opts.colorFn ||
      function (x) {
        let c = new THREE.Color();
        c.setHSL(0.441 + x / 2, 0.6, 0.75);
        return c;
      };

    // Ensure browser is compliant
    if (!Detector.webgl) {
      Detector.addGetWebGLMessage(container);
      return;
    }

    setupScene();
    render();

    function setupScene() {
      let width = window.innerWidth,
        height = window.innerHeight;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(48, width / height, 0.01, 1000);
      camera.position.z = 1.5;
      camera.position.x = 1.5;
      camera.position.y = 0;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
      });

      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      let light = new THREE.DirectionalLight(0xffffff, 0.5);
      light.position.set(10, 3, 5);
      scene.add(light);

      sphere = createSphere(radius, segments);
      sphere.rotation.y = rotation;
      scene.add(sphere);

      clouds = createClouds(radius, segments);
      clouds.rotation.y = rotation;
      scene.add(clouds);

      stars = createStars(2, 64);
      stars.scale.set(1, 1, 1);
      scene.add(stars);

      controls = new THREE.OrbitControls(camera, renderer.domElement);

      controls.dollyIn(1.2);

      container.appendChild(renderer.domElement);
    }

    function render() {
      tweenPoint();
      controls.update();

      sphere.rotation.y += 0;
      clouds.rotation.y += 0.00009;
      scene.rotation.y += 0.00009;

      if (_isFlying && scene.position.x > 0 && scene.position.x < 0.5) {
        scene.position.x += 0.0005;
        scene.rotation.y += 0.0005;
      }

      if (!_isFlying) {
        if (scene.position.x > 0) {
          scene.position.x -= 0.0005;
        } else {
          scene.position.x = 0;
          scene.position.y = 0;
          scene.position.z = 0;
        }
      }

      requestAnimationFrame(render);
      renderer.autoClear = false;
      renderer.clear();
      renderer.render(scene, camera);

      UpdateParticles();
    }

    function createSphere(radius, segments) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load(global_EarthMaterialURL),
          bumpMap: new THREE.TextureLoader().load(global_BumpMapMaterialURL),
          bumpScale: 0.005,
          specularMap: new THREE.TextureLoader().load(
            global_SpecularMapMaterialURL
          ),
          specular: new THREE.Color("#444444"),
          transparent: false,
        })
      );
    }

    function createClouds(radius, segments) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius + 0.003, segments, segments),
        new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load(global_CloudMaterialURL),
          transparent: true,
        })
      );
    }

    function createStars(radius, segments) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(global_StarFieldURL),
          side: THREE.BackSide,
        })
      );
    }

    /* Tween Methods */

    // Linear
    function tweenFnLinear(elapsed) {
      return elapsed;
    }

    // Ease In
    function tweenFnEaseIn(elapsed) {
      return elapsed * elapsed * elapsed * elapsed;
    }

    // Ease Out
    function tweenFnEaseOut(elapsed) {
      return 1 - (--elapsed * elapsed * elapsed * elapsed);
    }

    // Stores a list of current line tweens
    function tweenPoints(geometry, points, duration, tweenFn) {
      let tween = {
        n: 0,
        points: points,
        geometry: geometry,
        time: Date.now(),
        duration: duration,
        tweenFn: tweenFn,
        line: null,
      };
      tweens.push(tween);
      return tween;
    }

    // Steps the animations forward
    function tweenPoint() {
      let i = tweens.length,
        now = Date.now();

      while (i--) {
        let tween = tweens[i],
          point = tween.points[tween.n],
          geometry = tween.geometry,
          geo_length = geometry.vertices.length,
          elapsed = (now - tween.time) / tween.duration,
          value = tween.tweenFn(elapsed > 1 ? 1 : elapsed),
          next_n = Math.floor(geo_length * value);

        if (next_n > tween.n) {
          for (let j = tween.n; j < geo_length; j++) {
            if (j < next_n) {
              point = tween.points[j];
            }
            geometry.vertices[j].set(point.x, point.y, point.z);
          }
          tween.n = next_n;
          geometry.verticesNeedUpdate = true;
        }
      }
    }

    // Calculate a Vector3 from given lat/lng
    function latLonToVector3(lat, lng) {
      let point = new THREE.Vector3(0, 0, 0);

      lng = lng - 5;
      lat = lat - 2;

      let phi = Math.PI / 2 - (lat * Math.PI) / 180 - Math.PI * 0.01;
      let theta = 2 * Math.PI - (lng * Math.PI) / 180 + Math.PI * 0.06;
      let rad = radius;

      point.x = Math.sin(phi) * Math.cos(theta) * rad;
      point.y = Math.cos(phi) * rad;
      point.z = Math.sin(phi) * Math.sin(theta) * rad;

      return point;
    }

    // Takes two points on the globe and turns them into a bezier curve point array
    function bezierCurveBetween(startVec3, endVec3) {
      let distanceBetweenPoints = startVec3.clone().sub(endVec3).length();

      let anchorHeight = radius + distanceBetweenPoints * 1.5;

      let mid = startVec3.clone().lerp(endVec3, 0.5);
      let midLength = mid.length();
      mid.normalize();
      mid.multiplyScalar(midLength + distanceBetweenPoints * 0.4);

      let normal = new THREE.Vector3().subVectors(startVec3, endVec3);
      normal.normalize();

      let anchorScalar = distanceBetweenPoints * 0.4;

      let startAnchor = startVec3;
      let midStartAnchor = mid
        .clone()
        .add(normal.clone().multiplyScalar(anchorScalar));
      let midEndAnchor = mid
        .clone()
        .add(normal.clone().multiplyScalar(-anchorScalar));
      let endAnchor = endVec3;

      // Make a bezier curve
      let splineCurveA = new THREE.CubicBezierCurve3(
        startVec3,
        startAnchor,
        midStartAnchor,
        mid
      );
      let splineCurveB = new THREE.CubicBezierCurve3(
        mid,
        midEndAnchor,
        endAnchor,
        endVec3
      );

      let vertexCountDesired = Math.floor(distanceBetweenPoints * 0.02 + 30);

      let points = splineCurveA.getPoints(vertexCountDesired);
      points = points.splice(0, points.length - 1);
      points = points.concat(splineCurveB.getPoints(vertexCountDesired));

      return points;
    }

    function getGeom(points) {
      let geometry,
        i = 0;

      geometry = new THREE.Geometry();

      for (i = 0; i < points.length; i++) {
        geometry.vertices.push(new THREE.Vector3());
        let rIndex = constrain(10, 0, points.length - 1);
        let particle = points[rIndex].clone();
        particle.moveIndex = rIndex;
        particle.nextIndex = rIndex + 1;
        if (particle.nextIndex >= points.length) {
          particle.nextIndex = 0;
        }
        particle.lerpN = 0;
        particle.path = points;
        particle.size = _particleSize;
        let c = new THREE.Color();
        let x = Math.random();
        c.setHSL(0.6 - x * 0.5, 1.0, 0.5);
        particleColors.push(c);
        particle.color = _particleColor;
        particlesGeo.vertices.push(particle);
      }

      return geometry;
    }

    function constrain(v, min, max) {
      if (v < min) {
        v = min;
      } else if (v > max) {
        v = max;
      } else {
        return v;
      }
      return v;
    }

    function createPointGeometry() {
      let geometry = new THREE.BoxGeometry(1, 1, 1);
      geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
      point = new THREE.Mesh(geometry);
    }

    function addDataPoint(data) {
      let lat, lng, size, color, i, step, colorFnWrapper;

      step = 3;
      colorFnWrapper = function (data, i) {
        return colorFn(date[i + 2]);
      };

      let subgeo = new THREE.Geometry();

      for (i = 0; i < data.length; i += step) {
        lat = data[i];
        lng = data[i + 1];
        color = colorFnWrapper(date, i);
        size = data[i + 2];
        size = size * 200;
        addPoint(lat, lng, size, color, subgeo);
      }

      baseGeometry = subgeo;
    }

    function addPoint(lat, lng, size, color, subgeo) {
      let cord = latLonToVector3(lat, lng);

      point.position.x = cord.x;
      point.position.y = cord.y;
      point.position.z = cord.z;

      point.lookAt(sphere.position);

      point.scale.z = Math.max(size, 0.1);
      point.updateMatrix();

      for (let i = 0; i < point.geometry.faces.length; i++) {
        point.geometry.faces[i].color = color;
      }

      if (point.matrixAutoUpdate) {
        point.updateMatrix();
      }

      subgeo.merge(point.geometry, point.matrix);
    }

    function getProjectedPosition(width, height, position) {
      /*
  Using the coordinates of a country in the 3D space, this function will
  return the 2D coordinates using the camera projection method
  */

      position = position.clone();
      let projected = position.project(camera.object);

      return {
        x: projected.x * width + width,
        y: -(projected.y * height) + height,
      };
    }

    // Generate a set of colors to use
    (function () {
      for (let i = 0; i < 10; i++) {
        let c = new THREE.Color();
        let x = Math.random();
        c.setHSL(0.6 - x * 0.5, 1.0, 0.5);

        lineColors.push(
          new THREE.LineBasicMaterial({
            color: c,
            linewidth: 5,
          })
        );
      }
    })();

    function UpdateParticles() {
      if (particleMesh) {
        for (let i = 0; i < particleMesh.geometry.vertices.length; i++) {
          let particle = particleMesh.geometry.vertices[i];
          let path = particle.path;
          particle.lerpN += _particleSpeed;
          if (particle.lerpN > 1) {
            particle.lerpN = 0;
            particle.moveIndex = particle.nextIndex;
            particle.nextIndex++;
            if (particle.nextIndex >= path.length) {
              particle.moveIndex = 0;
              particle.nextIndex = 1;
            }
          }

          let currentPoint = path[particle.moveIndex];
          let nextPoint = path[particle.nextIndex];

          particle.copy(currentPoint);
          particle.lerp(nextPoint, particle.lerpN);
        }
        particleMesh.geometry.verticesNeedUpdate = true;
      }
    }

    function createSpikesAtVertor3(vector3, hexColor) {
      let spikeGeometry = new THREE.Geometry();
      let vertex = vector3;
      vertex.normalize();
      vertex.multiplyScalar(0.5);
      spikeGeometry.vertices.push(vertex);
      let vertex2 = vertex.clone();
      vertex2.multiplyScalar(1.05);
      spikeGeometry.vertices.push(vertex2);
      return new THREE.Line(
        spikeGeometry,
        new THREE.LineBasicMaterial({
          color: hexColor,
          opacity: Math.random(),
        })
      );
    }

    // Inject into Global
    this.BaseGeometryObject = baseGeometry;
    this.ParticleMeshObject = particleMesh;
    this.ParticlesGeoObject = particlesGeo;
    this.StarsObject = stars;
    this.CloudsObject = clouds;
    this.SphereObject = sphere;
    this.SceneOjbect = scene;

    this.DestroyObject = function () {
      delete this.BaseGeometryObject;
      delete this.ParticleMeshObject;
      delete this.ParticlesGeoObject;
      delete this.StarsObject;
      delete this.CloudsObject;
      delete this.SphereObject;
      delete this.SceneOjbect;
    };

    this.startFlying = function () {
      if (!_isFlying) {
        _isFlying = true;
        controls.autoRotate = true;
        scene.position.x = 0.0005;
      }
    };

    this.stopFlying = function () {
      controls.autoRotate = false;
      _isFlying = false;
    };

    this.isFlying = function () {
      return _isFlying;
    };

    this.particleSpeed = function (value) {
      if (value) {
        _particleSpeed = value;
      }
      return _particleSpeed;
    };

    this.particleSize = function (value) {
      if (value) {
        _particleSize = value;
      }
      return _particleSize;
    };

    this.particleColor = function (value) {
      if (value) {
        _particleColor = value;
      }
      return _particleColor;
    };

    this.lineColor = function (value) {
      if (value) {
        _lineColor = new THREE.LineBasicMaterial({
          color: value,
          linewidth: 5,
        });
      } else {
        _lineColor = null;
      }
      return _lineColor;
    };

    this.removeTweenLines = function () {
      let i = tweens.length,
        now = Date.now();
      while (i--) {
        let tween = tweens[i];
        let line = tween.line;
        scene.remove(line);
        lines.splice(lines.indexOf(line), 1);
        tweens.splice(i, 1);
      }
      scene.remove(particleMesh);
      particleMesh = null;
      particlesGeo = new THREE.Geometry();
    };

    this.overhead = function () {
      return _overhead;
    };

    this.duration = function () {
      return _duration;
    };

    this.addData = function (originate, marks) {
      const addDataStartMarker = "add-data-start-marker";
      const addDataEndMarker = "add-data-end-marker";

      if (performance && performance.measure) {
        // Start Marker
        performance.mark(addDataStartMarker);
      }

      // Stop drawing points that have been around too long
      let i = points.length;
      while (i--) {
        if (Date.now() - points[i].time > 1000) {
          points.splice(i, 1);
        }
      }

      //Convert lat/lng into 3d bezier curve and 2d texture point for drawing
      let pubLatLon = {
        lat: originate[0],
        lng: originate[1],
      };

      let pubVec3 = latLonToVector3(pubLatLon.lat, pubLatLon.lng);
      let materialIndex = Math.floor(Math.random() * 10);

      let pub_x = (1024 / 360.0) * (180 + pubLatLon.lng);
      let pub_y = (512 / 180.0) * (90 - pubLatLon.lat);

      points.push({
        x: pub_x,
        y: pub_y,
        time: Date.now(),
      });

      for (i = 0; i < marks.length; i++) {
        let subLatLon = {
          lat: marks[i][0],
          lng: marks[i][1],
        };

        if (subLatLon.lat === 0 && subLatLon.lng === 0) {
          this.particleColor(0x1f0000);
          this.lineColor(0xf10000);
        } else {
          if (
            _lineColor !== null &&
            _lineColor.color.r === 0.9450980392156862
          ) {
            // Reset
            this.particleColor(0x01001f);
            this.lineColor(null);
          }
        }

        let endpub_x = (1024 / 360.0) * (180 + subLatLon.lng);
        let endpub_y = (512 / 180.0) * (90 - subLatLon.lat);

        endpoints.push({
          x: endpub_x,
          y: endpub_y,
          time: Date.now(),
        });

        let subVec3 = latLonToVector3(subLatLon.lat, subLatLon.lng);

        let linePoints = null;
        if (i % 2 === 0) {
          linePoints = bezierCurveBetween(pubVec3, subVec3);
        } else {
          linePoints = bezierCurveBetween(subVec3, pubVec3);
        }

        let linesGeo = getGeom(linePoints);

        let tween = tweenPoints(linesGeo, linePoints, 8000, tweenFnEaseOut);

        let selectedLineColor =
          _lineColor === null ? lineColors[materialIndex] : _lineColor;

        let line = new THREE.Line(linesGeo, selectedLineColor);
        lines.push(line);
        tween.line = line;
        scene.add(line);
        scene.add(createSpikesAtVertor3(subVec3, 0xffffff));
      }

      let particleGraphic = new THREE.TextureLoader().load(global_ParticleURL);
      let particleMat = new THREE.PointsMaterial({
        map: particleGraphic,
        size: _particleSize,
        color: _particleColor,
        blending: THREE.AdditiveBlending,
        transparent: true,
        vertexColors: true,
        sizeAttenuation: true,
      });

      particlesGeo.colors = particleColors;
      particleMesh = new THREE.Points(particlesGeo, particleMat);
      particleMesh.sortParticles = false;
      particleMesh.sortParticles = false;
      particleMesh.dynamic = false;
      scene.add(particleMesh);

      if (performance && performance.measure) {
        // End Marker
        performance.mark(addDataEndMarker);

        // Create a variety of measurements.
        performance.measure(
          "measure add-data-start-marker to add-data-end-marker",
          addDataStartMarker,
          addDataEndMarker
        );
        performance.measure(
          "measure add-data-start-marker to now",
          addDataStartMarker
        );
        performance.measure(
          "measure from navigation start to add-data-end-marker",
          undefined,
          addDataEndMarker
        );
        performance.measure("measure from the start of navigation to now");

        // Pull out all of the measurements.
        _overhead = performance.getEntriesByType("measure")[0].duration;
        _duration = performance.getEntriesByType("measure")[2].duration;

        // Finally, clean up the entries.
        performance.clearMarks();
        performance.clearMeasures();
      }

      return 0;
    };
  };
})(this);