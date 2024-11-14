// Import the Express framework to create the web server.
import express from "express";
const app = express(); // Initialize an Express application instance.

// Import the Body Parser middleware to parse incoming JSON requests.
import bodyParser from "body-parser";
app.use(bodyParser.json()); // Use body-parser middleware to parse request bodies into JSON format.

// Uncomment below to use Mongoose to connect to a MongoDB database.
/*
import mongoose from "mongoose";
const connection = process.env.MongoAtlasConnection || "mongodb://localhost:27017/globewardb";

// Connect to MongoDB using the provided connection string.
mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define the schema for the 'GlobeWar' collection, representing a battle.
const globeWarSchema = new mongoose.Schema({
  winner: { type: String, required: true }, // The name of the winner.
  spikes: { type: Number, required: true, min: 0 }, // The number of spikes (an indicator).
  loser: { type: String, required: true }, // The name of the loser.
  date: { type: Date, required: true }, // Date of the event.
  type: { type: String, required: true }, // Type/category of the battle.
});

// Create a model to interact with the 'GlobeWar' collection.
const GlobeWar = mongoose.model("GlobeWar", globeWarSchema);
*/

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

// API endpoint to add a battle stat.
app.post("/api/addstat", function (req, res) {
  /*
  // Create a new instance of the 'GlobeWar' model with data from the request body.
  const globewar = new GlobeWar({
    winner: req.body.winner, // Winner of the battle.
    spikes: req.body.spikes, // Number of spikes associated with the battle.
    loser: req.body.loser, // Loser of the battle.
    date: req.body.date, // Date of the battle.
    type: req.body.type, // Type/category of the battle.
  });
  
  // Save the new battle record to MongoDB.
  globewar.save();
  
  // Group the battles by winner and type, and sort them by spikes in descending order.
  GlobeWar.aggregate(
    [
      {
        $group: {
          _id: {
            winner: "$winner",
            type: "$type",
          },
          spikes: {
            $sum: "$spikes",
          },
        },
      },
      {
        $sort: {
          spikes: -1, // Sort by spikes in descending order.
        },
      },
    ],
    function (err, data) {
      // Close the database connection.
      mongoose.connection.close();
      // Send the result back to the client.
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(data); // Respond with the aggregated data.
      }
    }
  ).limit(1000); // Limit the result to 1000 entries.
  */
});

// Start the server, listening on the specified port (use Heroku's port or default to 3000 for local development).
app.listen(process.env.PORT || 3000, function () {
  console.log("started `node ./app.js");
  console.log("listening at: http://localhost:3000/node.html"); // Log the server listening URL.
});