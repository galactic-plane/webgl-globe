// Express Service
import express from "express";
const app = express();

// Body Parser Service
import bodyParser from "body-parser";
app.use(bodyParser.json());

// Mongoose Database Service
/*
import mongoose from "mongoose";
const connection = process.env.MongoAtlasConnection || "mongodb://localhost:27017/globewardb";

mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// GlobeWar Schema
const globeWarSchema = new mongoose.Schema({
  winner: { type: String, required: true },
  spikes: { type: Number, required: true, min: 0 },
  loser: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
});

// GlobeWar Model
const GlobeWar = mongoose.model("GlobeWar", globeWarSchema);
*/

// Routes
import path from "path";
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "wwwroot")));

// Get Index
app.get("/index.html", function (req, res, next) {
  var options = {
    root: path.join(__dirname, "wwwroot"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

// Test Route
app.get("/api/ping", function (req, res) {
  res.send(true);
});

// Array of heroes and villains
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

// Get New Hero
app.get("/api/gethero", function (req, res) {
  const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
  res.send(randomHero);
});

// Get New Villain
app.get("/api/getvillain", function (req, res) {
  const randomVillain = villains[Math.floor(Math.random() * villains.length)];
  res.send(randomVillain);
});

// Add Winner/Loser Stat
app.post("/api/addstat", function (req, res) {
  /*
  // build model
  const globewar = new GlobeWar({
    winner: req.body.winner,
    spikes: req.body.spikes,
    loser: req.body.loser,
    date: req.body.date,
    type: req.body.type,
  });
  
  // save to mongo
  globewar.save();
  // group and sort
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
          spikes: -1,
        },
      },
    ],
    function (err, data) {
      // close connection
      mongoose.connection.close();
      // return to client
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(data);
      }
    }
  ).limit(1000);
  */
});

// Add port for Heroku with 3000 for local
app.listen(process.env.PORT || 3000, function () {
  console.log("started `node ./app.js");
  console.log("listening at: http://localhost:3000");
});
