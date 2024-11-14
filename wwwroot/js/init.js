/**
 * @author Daniel Penrod (Iturea) / https://github.com/Iturea
 *
 * released under MIT License (MIT)
 */

let globeObj = null,
  winnerModalWindow = null,
  isNodeRunning = false,
  sceneType = "normal";

let createjs = window.createjs || null;
let THREE = window.THREE || null;
let jQuery = window.jQuery || null;
let M = window.M || null;
let DAT = window.DAT || null;

(function ($) {
  $(function () {
    "use strict";

    let interval = null,
      fadeOutInterval = null,
      volume = 1,
      totalSpikes = 0,
      prevOverhead = 0,
      totalOverhead = 0,
      totalDuration = 0,
      totalRuns = 0,
      hero = null,
      villain = null,
      herospikes = 0,
      villainspikes = 0,
      character = null,
      charactertype = "",
      heroDamage = 0,
      villainDamage = 0;

    function initNode(executeCallBack) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          executeCallBack();
        }
      };
      xhttp.open("GET", "/api/ping", true);
      xhttp.send();
    }

    function setHero() {
      $.ajax({
        url: "/api/gethero",
        success: function (data) {
          hero = data;
        },
        fail: function (xhr, status, error) {
          if (error) {
            console.log("process error: " + error.message);
          } else if (xhr && xhr.responseJSON) {
            console.log("process error: " + xhr.responseJSON.message);
          }
        },
        cache: true,
      });
    }

    function setvillain() {
      $.ajax({
        url: "/api/getvillain",
        success: function (data) {
          villain = data;
        },
        fail: function (xhr, status, error) {
          if (error) {
            console.log("process error: " + error.message);
          } else if (xhr && xhr.responseJSON) {
            console.log("process error: " + xhr.responseJSON.message);
          }
        },
        cache: true,
      });
    }

    function handleLoad(event) {
      createjs.Sound.play(event.src);
    }

    function loadSound(file, soundId) {
      createjs.Sound.registerSound("/sounds/" + file, soundId);
    }

    function initbgsound() {
      if (!createjs.Sound.initializeDefaultPlugins()) {
        return;
      }
      var audioPath = "/sounds/";
      var sounds = [
        {
          id: "music",
          src: "M-GameBG.ogg",
        },
        {
          id: "shot",
          src: "shot.ogg",
        },
      ];

      createjs.Sound.alternateExtensions = ["mp3"];
      createjs.Sound.on("fileload", handleLoad);
      createjs.Sound.registerSounds(sounds, audioPath);
    }

    function showDominatorWindow() {
      // Show dominator ladder
      if (winnerModalWindow) {
        winnerModalWindow.open();
      }
    }

    const postStat = (winner, spikes, loser, date, type) => {
      const data = { winner, spikes, loser, date, type };

      loadSound("Game-Death.ogg", "gamedeath");

      $.ajax({
        url: "/api/addstat",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        contentType: "application/json",
        cache: false,
        done: () => {
          console.log("process complete");
        },
        success: (response) => {
          let html = "";
          const data = [];
          $.each(response, (i, item) => {
            data.push([item._id.winner, item._id.type, item.spikes]);
          });

          for (var i = 0; i < data.length; i++) {
            html += "<tr><td>" + data[i][0] + "</td><td>" + data[i][1] + "</td><td>" + data[i][2] + "</td></tr>";
          }

          $("#toptenlist").html(html);

          // Show dominator window
          showDominatorWindow();
        },
        fail: function (xhr, status, error) {
          if (error) {
            console.log("process error: " + error.message);
          } else if (xhr && xhr.responseJSON) {
            console.log("process error: " + xhr.responseJSON.message);
          }
        },
      });
    };

    const stopMainProgress = () => {
      $(".indeterminate").addClass("determinate").removeClass("indeterminate").css("width", "0%");
    };

    const declareWinner = () => {
      $("#play").on("click", handlePlayClick);
      globeObj.stopFlying();
      stopMainProgress();
      stopInterval();

      // Determine winner and loser
      let winner = "";
      let loser = "";
      let spikes = 0;

      if (charactertype === "hero") {
        winner = hero;
        loser = villain;
        spikes = herospikes;
      } else {
        winner = villain;
        loser = hero;
        spikes = villainspikes;
      }

      // Save to database
      const date = new Date().toISOString();
      postStat(winner, spikes, loser, date, charactertype);
    };

    const handlePlayClick = () => {
      window.location.reload(true);
    };

    const characterSet = () => {
      // express running?
      if (isNodeRunning) {
        const lot = getRandomArbitrary(1, 6);
        if (oddEven(lot) === 1) {
          character = villain;
          charactertype = "villain";
        } else {
          character = hero;
          charactertype = "hero";
        }
      }
      return character === null ? false : true;
    };

    function stopInterval() {
      window.clearInterval(interval);
    }

    function getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    function oddEven(num) {
      return num % 2;
    }

    function executeMove() {
      // can get character from express?
      let characterIsSet = characterSet();
      // starting point
      let originate = [];
      if (characterIsSet === true) {
        createjs.Sound.play("shot");
        // battle of north vs south poles
        if (charactertype == "villain") {
          // south pole
          originate.push(-90.0);
          originate.push(0.0);
        } else {
          // north pole
          originate.push(64.751114);
          originate.push(-147.349442);
        }
      } else {
        originate.push(getRandomArbitrary(-90, 90));
        originate.push(getRandomArbitrary(-180, 80));
      }
      // ending points
      let marks = [];
      let isOverLoaded = $("#spikeswitch").prop("checked");
      let offset = 1;
      if (isOverLoaded) {
        offset = 30;
      }
      let spikes = Math.floor(Math.random() * 20 * offset);
      for (let i = 0; i < spikes; i++) {
        marks[i] = [];
        if (characterIsSet === true) {
          // battle of north vs south poles
          if (charactertype == "villain") {
            // north pole
            marks[i][0] = getRandomArbitrary(-90.0, 90);
            marks[i][1] = getRandomArbitrary(-147.349442, -100);
          } else {
            // south pole
            marks[i][0] = getRandomArbitrary(-90.0, 90);
            marks[i][1] = getRandomArbitrary(0.0, 50);
          }
        } else {
          marks[i][0] = getRandomArbitrary(-90, 90);
          marks[i][1] = getRandomArbitrary(-180, 80);
        }
      }
      // random line color
      let color = new THREE.Color(0xffffff);
      if (characterIsSet === true) {
        if (charactertype == "villain") {
          color = new THREE.Color("red");
        } else {
          color = new THREE.Color("blue");
        }
      } else {
        color.setHex(Math.random() * 0xffffff);
      }
      globeObj.lineColor(color);
      // set particle color
      globeObj.particleColor(0x01001f);
      // if there is something to originate
      if (originate.length > 1 && marks.length > 0 && marks[0].length > 1) {
        globeObj.addData(originate, marks);
        let message = characterIsSet === true ? character + " attacked with " + spikes + " spikes!" : "Spikes: " + spikes;
        M.toast({
          html: message,
          classes: "rounded",
        });
        let overhead = globeObj.overhead() - prevOverhead;
        let duration = globeObj.duration();
        let percentCharge = (duration / overhead) * 1000;
        $("#data-rows").append(
          "<tr><td>" +
            spikes +
            "</td><td>" +
            overhead.toFixed(2) +
            "</td><td>" +
            duration.toFixed(2) +
            "</td><td>" +
            percentCharge.toFixed(2) +
            "</td></tr>"
        );
        if (characterIsSet === true) {
          let damage = percentCharge * 5 + spikes;
          $("#heroImage").removeClass("pulse");
          $("#villainImage").removeClass("pulse");
          if (charactertype == "villain") {
            villainspikes += spikes;
            heroDamage += damage;
            let heroHealth = 100 - heroDamage;
            $("#villainImage").addClass("pulse");
            if (heroHealth > 0) {
              $("#heroProgress").css("width", heroHealth + "%");
              $("#heroStats").html(heroHealth.toFixed(0) + "%");
            } else {
              declareWinner();
              $("#heroProgress").css("width", "0%");
              $("#heroStats").html("0%");
            }
          } else {
            herospikes += spikes;
            villainDamage += damage;
            let villainHealth = 100 - villainDamage;
            $("#heroImage").addClass("pulse");
            if (villainHealth > 0) {
              $("#villainProgress").css("width", villainHealth + "%");
              $("#villainStats").html(villainHealth.toFixed(0) + "%");
            } else {
              declareWinner();
              $("#villainProgress").css("width", "0%");
              $("#villainStats").html("0%");
            }
          }
        }
        prevOverhead = globeObj.overhead();
        totalOverhead += overhead;
        totalDuration += duration;
        $("#overhead").html(totalOverhead.toFixed(2));
        $("#duration").html(totalDuration.toFixed(2));
        if (totalDuration <= 15) {
          $("#duration").addClass("green").removeClass("orange").removeClass("red");
        } else if (totalDuration <= 30) {
          $("#duration").addClass("orange").removeClass("green").removeClass("red");
        } else {
          $("#duration").addClass("red").addClass("pulse").removeClass("green").removeClass("orange");
        }
        totalSpikes += spikes;
        $("#spikes").html(totalSpikes);
        if (totalSpikes <= 15) {
          $("#spikes").addClass("green").removeClass("orange").removeClass("red");
        } else if (totalSpikes <= 30) {
          $("#spikes").addClass("orange").removeClass("green").removeClass("red");
        } else {
          $("#spikes").addClass("red").addClass("pulse").removeClass("green").removeClass("orange");
        }
        $("#runs").html(++totalRuns);
        let totalPercentCharge = (totalDuration / totalOverhead) * 1000;
        let charge = parseFloat(totalPercentCharge.toFixed(2));
        $("#charge").html(charge);
        if (charge <= 0.2) {
          $("#charge").addClass("green").removeClass("orange").removeClass("red");
          $("#overhead").addClass("green").removeClass("orange").removeClass("red");
        } else if (charge <= 0.6) {
          $("#charge").addClass("orange").removeClass("green").removeClass("red");
          $("#overhead").addClass("orange").removeClass("green").removeClass("red");
        } else {
          $("#charge").addClass("red").addClass("pulse").removeClass("green").removeClass("orange");
          $("#overhead").addClass("red").addClass("pulse").removeClass("green").removeClass("orange");
        }
      }
    }

    function main() {
      if (villain === null || hero === null) {
        isNodeRunning = false;
        sceneType = "normal";
        villain = "";
        hero = "";
      } else {
        $("#villainname").html(villain);
        $("#heroname").html(hero);
        $(".characterbar").show();
        isNodeRunning = true;
        sceneType = "frozen";
      }
      let container = document.getElementById("globe");
      globeObj = new DAT.Globe(container, {
        sceneType: sceneType,
      });
      globeObj.startFlying();
      let count = 0;
      interval = window.setInterval(function () {
        if (!globeObj.isFlying()) {
          return;
        }
        let test = villain.length || hero.length || 0;
        let rununtil = test > 0 ? 100 : 5;
        if (count > rununtil) {
          stopInterval();
          stopMainProgress();
        } else {
          executeMove();
        }
        count++;
      }, 3000);
    }

    // set
    initNode(setHero);
    initNode(setvillain);
    initbgsound();

    window.setTimeout(function () {
      main();
    }, 1000);

    $("#refresh").on("click", function () {
      window.location.reload(true);
    });

    $("#stop").on("click", function () {
      if (globeObj.isFlying()) {
        globeObj.stopFlying();
      }
    });

    $("#play").on("click", function () {
      if (!globeObj.isFlying()) {
        globeObj.startFlying();
      }
    });

    $("#dominatorWinToggle").on("click", function () {
      showDominatorWindow();
    });

    M.AutoInit();
    $("select").formSelect();

    // set modal window
    winnerModalWindow = M.Modal.getInstance($("#winnerModal")[0]);
  }); // end of document ready
})(jQuery); // end of jQuery name space
