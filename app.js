// Import the Express framework to create the web server.
import express from "express";
const app = express(); // Initialize an Express application instance.

// Import the 'path' module to handle file and directory paths.
import path from "path";
const __dirname = path.resolve(); // Get the root directory of the current module.

// Serve static files from the 'wwwroot' directory.
app.use(express.static(path.join(__dirname, "wwwroot")));

// Serve the HTML file 'node.html' when requested by the client.
app.get("/node.html", function (req, res, next) {
  var options = {
    root: path.join(__dirname, "wwwroot"), // Set the root directory for the file.
    dotfiles: "deny", // Prevent access to hidden files.
    headers: {
      "x-timestamp": Date.now(), // Include a timestamp header.
      "x-sent": true, // Indicate the file has been sent.
    },
  };

  var fileName = req.params.name; // Get the requested file name from parameters.
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err); // If there's an error, pass it to the next middleware.
    } else {
      console.log("Sent:", fileName); // Log the name of the sent file.
    }
  });
});

// Simple test route to check server availability.
app.get("/api/ping", function (req, res) {
  res.send(true); // Respond with true, indicating server is reachable.
});

// Arrays representing different heroes and villains.
const heroes = [
  "Superman",
  "Batman",
  "Wonder Woman",
  "Spider-Man",
  "Iron Man",
  "Thor",
  "Hulk",
  "Captain America",
  "Black Panther",
  "Doctor Strange",
  "Flash",
  "Green Lantern",
  "Aquaman",
  "Cyborg",
  "Green Arrow",
];

const villains = [
  "Joker",
  "Thanos",
  "Lex Luthor",
  "Green Goblin",
  "Doctor Doom",
  "Loki",
  "Ultron",
  "Red Skull",
  "Magneto",
  "Darkseid",
  "Reverse-Flash",
  "Sinestro",
  "Black Manta",
  "Deathstroke",
  "Brainiac",
];

// API endpoint to retrieve a random hero from the list.
app.get("/api/gethero", function (req, res) {
  const randomHero = heroes[Math.floor(Math.random() * heroes.length)]; // Select a random hero.
  res.send(randomHero); // Respond with the randomly selected hero.
});

// API endpoint to retrieve a random villain from the list.
app.get("/api/getvillain", function (req, res) {
  const randomVillain = villains[Math.floor(Math.random() * villains.length)]; // Select a random villain.
  res.send(randomVillain); // Respond with the randomly selected villain.
});

// API endpoint to add a battle stat (simplified for local development).
app.post("/api/addstat", function (req, res) {
  // For static deployment, this endpoint returns empty array
  // In local development, you could add local storage or file-based storage
  console.log("Battle stat received (not persisted in static mode)");
  res.send([]); // Return empty array since we're not persisting data
});

// Start the server for local development.
const PORT = 3000;
app.listen(PORT, function () {
  console.log(`WebGL Globe server started on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/index.html`);
  console.log(`Or: http://localhost:${PORT}/node.html`);
});