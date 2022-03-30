// Express Service
const express = require('express');
const app = express();

// Character Service
const superheroes = require('superheroes');
const supervillains = require('supervillains');

// Body Parser Service
let bodyParser = require('body-parser');
app.use(bodyParser.json());

// Mongoose Database Service
const mongoose = require('mongoose');
const connection = (process.env.MongoAtlasConnection || 'mongodb://localhost:27017/globewardb');

// GlobeWar Schema
const globeWarSchema = new mongoose.Schema({
    winner: String,
    spikes: Number,
    loser: String,
    date: Date,
    type: String
});

// GlobeWar Model
const GlobeWar = mongoose.model('GlobeWar', globeWarSchema);

// Routes
let path = require('path');
app.use(express.static(path.join(__dirname, 'wwwroot')));

// Get Index
app.get('/index.html', function (req, res, next) {
    var options = {
        root: path.join(__dirname, 'wwwroot'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

// Test Route
app.get('/api/ping', function (req, res) {
    res.send(true);
});

// Get New Hero
app.get('/api/gethero', function (req, res) {
    res.send(superheroes.random());
});

// Get New Villain
app.get('/api/getvillain', function (req, res) {
    res.send(supervillains.random());
});

// Add Winner/Loser Stat
app.post('/api/addstat', function (req, res) {
    // connect
    mongoose.connect(connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // build model
    const globewar = new GlobeWar({
        winner: req.body.winner,
        spikes: req.body.spikes,
        loser: req.body.loser,
        date: req.body.date,
        type: req.body.type
    });
    // save to mongo
    globewar.save();
    // group and sort
    GlobeWar.aggregate([{
                $group: {
                    _id: {
                        winner: "$winner",
                        type: "$type"
                    },
                    spikes: {
                        $sum: "$spikes"
                    }
                }
            },
            {
                $sort: {
                    spikes: -1
                }
            }
        ],
        function (err, data) {
            // close connection
            mongoose.connection.close();
            // return to client
            if (err) {
                console.log(err);
                res.send('error');
            } else {
                res.send(data);
            }
        }).limit(1000);
});

// Add port for Heroku with 3000 for local
app.listen(process.env.PORT || 3000, function () {
    console.log('started `node ./app.js');
    console.log('listening at: http://localhost:3000');
});