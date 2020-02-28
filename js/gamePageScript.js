var score = 0;
var combo = 0,
    combobroken = false;
var timer, starter;
var hasstart = true,
    paused = false,
    ignorepress = false,
    nodelay = true;
var canvas;
var ctx;
var starttime;
var mapName;
var diff = 0;
var delay = 0;
const fallrate = 5;
const blockwidth = 200;
const hitterheight = 30;
const hitteroffset = 10;
const timeout = 10;
const blockoffset = -hitterheight - hitteroffset;
const fade = 0.5;
const delayoffset = 0;
const combomultiplier = .0001;
var levelarray = [];
const blocks = [];
var hitters = [];
var keydata = [];
var timings = [];
var sound;


class Block {
    constructor(x, y, xchange, ychange, width, height, enabled, type, time) {
        this.x = x;
        this.y = y;
        this.xchange = xchange;
        this.ychange = ychange;
        this.width = width;
        this.height = height;
        this.enabled = enabled;
        this.ishold = type;
        this.time = time;
    }
}

class Hitter {
    constructor(x, y, width, height, active, updated) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = active;
        this.updated = updated;
    }
}

function initiate(keys, mapIndex, difficulty) {
    mapName = levelarray[mapIndex][1];
    diff = difficulty;
    document.getElementById("title").innerText = "Dance Dance HTML: " + mapName;
    document.getElementById("bgdecor").src = "../resources/" + levelarray[mapIndex][3][difficulty];
    sound = new Audio("../musicdata/" + mapName + ".wav");
    sound.load();
    let temparr = readTextFile("../timingdata/" + mapName + "_Timings" + difficulty + ".btm").split(",");
    for (let i = 0; i < temparr.length; i++) {
        let tempdob = temparr[i].split(":");
        timings[i] = [parseInt(tempdob[0]), parseFloat(tempdob[1])];
    }
    keydata = keys;
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    for (let i = 0; i < keydata.length; i++) {
        hitters.push(new Hitter(
            ctx.canvas.width / (keydata.length + 2) * (i + 1) + 1,
            ctx.canvas.height - (hitterheight + hitteroffset),
            window.innerWidth / (keydata.length + 2) - 2,
            hitterheight,
            false,
            false));
        blocks.push([]);
    }
    if (nodelay && 0 < ctx.canvas.height + blockoffset - timings[0][1] * 1000 / timeout * fallrate) {
        nodelay = false;
        delay = (ctx.canvas.height + blockoffset - timings[0][1] * 1000 / timeout * fallrate) / fallrate + delayoffset;
    }
    for (let i = 0; i < timings.length; i++) {
        blocks[timings[i][0]].push(new Block(
            window.innerWidth / (keydata.length + 2) * (timings[i][0] + 1) + (window.innerWidth / (keydata.length + 2) / 2 - blockwidth / 2),
            ctx.canvas.height + blockoffset - (timings[i][1] * 1000 / timeout + delay) * fallrate,
            0,
            fallrate,
            blockwidth,
            -50,
            true,
            false,
            timings[i][1]
        ));
    }
    addListeners();
    //background
    uGame();
    //foreground
    ctx.font = "30px Ariel";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    var textString = "Press B to begin";
    ctx.strokeText(textString, ctx.canvas.width / 2 - ctx.measureText(textString).width / 2, ctx.canvas.height / 2);
    document.getElementById("levelselectcontainer").addEventListener("webkitAnimationEnd", function a() {
        document.getElementById("levelselectcontainer").hidden = true;
        document.getElementById("levelselectcontainer").classList.remove("fadeout");
        document.getElementById("levelselectcontainer").classList.add("fadeinfull");
        document.getElementById("gamecontainer").hidden = false;
        document.getElementById("levelselectcontainer").removeEventListener("webkitAnimationEnd", a);
    });
    document.getElementById("levelselectcontainer").classList.add("fadeout");
}

function kd(event) {
    if (event.key === "b" && hasstart) {
        startGame();
        hasstart = false;
    }
    if (event.key === "Escape") {
        pause();
    }
    for (let i = 0; i < keydata.length; i++) {
        if (event.key === keydata[i].key && !ignorepress) {
            hitters[i].active = true;
        }
    }
}

function ku(event) {
    for (let i = 0; i < keydata.length; i++) {
        if (event.key === keydata[i].key && !ignorepress) {
            hitters[i].active = false;
            hitters[i].updated = false;
        }
    }
}

function addListeners() {
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);
}

function startGame() {
    starttime = Date.now();
    timer = setInterval(uGame, timeout);
    starter = setTimeout(function () {
        sound.play();
        document.getElementById("bgdecor").play();
        nodelay = true;
    }, delay * timeout);
}

function uGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, " + fade + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#adadad";
    ctx.font = "30px Ariel";
    ctx.fillText("Score: " + score, 10, 50, window.innerWidth / 8);
    if (combobroken) {
        combo = 0;
        combobroken = false;
    }
    if (combo !== 0)
        ctx.fillText(combo + "x", 10, 80, window.innerWidth / 8);
    if (nodelay)
        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                blocks[i][j].y = ctx.canvas.height + blockoffset - (blocks[i][j].time - sound.currentTime) * 1000 / timeout * fallrate;
            }
        }
    for (let i = 0; i < keydata.length; i++) {
        for (let j = 0; j < blocks[i].length; j++) {
            if (hitters[i].active) {
                if (!hitters[i].updated) {
                    hitters[i].updated = true;
                    if (blocks[i][j].y > canvas.height - 50 && blocks[i][j].enabled) {
                        if (!blocks[i][j].ishold) {
                            score += 30;
                            score += Math.round(score * combo * combomultiplier);
                            combo += 1;
                            blocks[i][j].enabled = false;
                        }
                    }
                }
                if (blocks[i][j].y > canvas.height - 50) {
                    if (blocks[i][j].ishold) {
                        score += 1;
                        blocks[i][j].enabled = false;
                    }
                }
            }
        }
        try {
            ctx.fillStyle = keydata[i].color;
            ctx.strokeStyle = "#adadad";
            drawColumn(blocks[i], ctx);
        } catch (e) {
        }
        drawHitter(hitters[i], ctx);
        ctx.lineWidth = 1;
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#adadad";
    }
}

function drawColumn(arr, ctx) {
    if (arr[0].y + arr[0].height > window.innerHeight) {
        if (arr[0].enabled)
            combobroken = true;
        arr.splice(0, 1);
    }
    var temp = ctx.fillStyle;
    for (let j = 0; j < arr.length; j++) {
        if (!nodelay)
            arr[j].y += arr[j].ychange;
        arr[j].x += arr[j].xchange;
        if (!arr[j].enabled)
            ctx.fillStyle = "#505050";
        ctx.fillRect(arr[j].x, arr[j].y, arr[j].width, arr[j].height);
        ctx.strokeRect(arr[j].x, arr[j].y, arr[j].width, arr[j].height);
        ctx.fillStyle = temp;
    }
}

function drawHitter(hitter, ctx) {
    if (hitter.active) {
        ctx.strokeStyle = "#34ff34";
    } else {
        ctx.strokeStyle = "rgba(200,200,200,1)";
    }
    ctx.lineWidth = 3;
    ctx.strokeRect(hitter.x, hitter.y, hitter.width, hitter.height);
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var allText = "";
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status === 0) {
                allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return allText;
}

function pause() {
    paused = !paused;
    document.getElementById("pausemenu").hidden = !paused;
    document.getElementById("pausemenubg").hidden = !paused;
    ignorepress = paused;
    if (!hasstart)
        if (paused) {

            sound.pause();
            document.getElementById("bgdecor").pause();
            if (!nodelay) {
                clearInterval(timer);
                clearTimeout(starter)
            }
        } else {
            if (nodelay) {
                sound.play();
                document.getElementById("bgdecor").play();
            } else {
                timer = setInterval(uGame, timeout);
                let largest = 0;
                for (let i = 0; i < keydata.length; i++) {
                    try {
                        if (blocks[i][0].y > largest)
                            largest = blocks[i][0].y;
                    } catch (e) {
                    }
                }
                delay = (canvas.height + blockoffset - largest) / fallrate + delayoffset;
                starter = setTimeout(function () {
                    sound.play();
                    document.getElementById("bgdecor").play();
                    nodelay = true;
                }, delay * timeout);
            }
        }
}

function restart() {
    clearTimeout(timer);
    clearTimeout(starter);
    blocks.splice(0, blocks.length);
    for (let i = 0; i < keydata.length; i++) {
        blocks.push([]);
    }
    for (let i = 0; i < timings.length; i++) {
        blocks[timings[i][0]].push(new Block(
            window.innerWidth / (keydata.length + 2) * (timings[i][0] + 1) + (window.innerWidth / (keydata.length + 2) / 2 - blockwidth / 2),
            ctx.canvas.height + blockoffset - (timings[i][1] * 1000 / timeout + delay) * fallrate,
            0,
            fallrate,
            blockwidth,
            -50,
            true,
            false,
            timings[i][1]
        ));
    }
    pause();
    sound.pause();
    sound.currentTime = 0;
    document.getElementById("bgdecor").pause();
    document.getElementById("bgdecor").currentTime = 0;
    score = 0;
    combo = 0;
    uGame();
    //foreground
    ctx.font = "30px Ariel";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    var textString = "Press B to begin";
    ctx.strokeText(textString, ctx.canvas.width / 2 - ctx.measureText(textString).width / 2, ctx.canvas.height / 2);
    hasstart = true;
}

function clearInstance() {
    restart();
    document.removeEventListener("keydown", kd);
    document.removeEventListener("keyup", ku);
    score = 0;
    combo = 0;
    combobroken = false;
    clearInterval(timer);
    clearInterval(starter);
    hasstart = true;
    paused = false;
    ignorepress = false;
    nodelay = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("gamecontainer").addEventListener("webkitAnimationEnd", function a() {
        document.getElementById("gamecontainer").hidden = true;
        document.getElementById("gamecontainer").classList.remove("fadeout");
        document.getElementById("gamecontainer").classList.add("fadeinfull");
        document.getElementById("levelselectcontainer").hidden = false;
        document.getElementById("gamecontainer").removeEventListener("webkitAnimationEnd", a);
    });
    document.getElementById("gamecontainer").classList.add("fadeout");
    canvas = null;
    ctx = null;
    starttime = null;
    mapName = "";
    diff = 0;
    delay = 0;
    blocks.splice(0, blocks.length)
    hitters = [];
    keydata = [];
    timings = [];
    sound = null;
}

function loadMaps(datafile) {
    let data = readTextFile(datafile);
    let levelchunks = data.split(",");
    let lvlarr = [];
    for (let i = 0; i < levelchunks.length; i++) {
        let lvldatchunks = levelchunks[i].split(":");
        let lvlname = lvldatchunks[0];
        let lvlid = lvldatchunks[1];
        let difficulties = lvldatchunks[2].split("|");
        let backgrounds = lvldatchunks[3].split("|");
        lvlarr.push([lvlname, lvlid, difficulties, backgrounds]);
    }
    levelarray = lvlarr;
    let listparent = document.getElementById("listparent");
    let innerelement = "";
    for (let i = 0; i < levelarray.length; i++) {
        innerelement += "<li class='levelbanner' id='lvlid_" + i + "' onmouseup='start(" + i + "," + levelarray[i][2][0] + ")'><h1>" + levelarray[i][0] + "</h1></li>";
        //loadLevelInfo(" + i + ")
    }
    listparent.innerHTML = innerelement;
    alert(listparent.innerHTML)
}

function start(index, diff) {
    keydata = [{
        key: "s",
        color: "#4fbfff",
    }, {
        key: "d",
        color: "#55ff71",
    }, {
        key: "f",
        color: "#ff6c5e",
    }, {
        key: " ",
        color: "#fbff71",
    }, {
        key: "j",
        color: "#ff6c5e",
    }, {
        key: "k",
        color: "#55ff71",
    }, {
        key: "l",
        color: "#4fbfff",
    }];
    initiate(keydata, index, diff);
}

function loadLevelInfo(index) {
    let innerelement = "";
    for (let j = 0; j < levelarray[index][1].length; j++) {
        innerelement += "<h1>" + levelarray[index][1][j] + "</h1>";
    }
}