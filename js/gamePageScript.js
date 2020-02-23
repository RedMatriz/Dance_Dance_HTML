// var timecount = 0,
//     timekeeper = 0;
var score = 0;
var combo = 0,
    combobroken = false;
var timer;
var start = true,
    paused = false,
    ignorepress = false;
var canvas;
var ctx;
var starttime;

const fallrate = 5;
const blockwidth = 200;
const hitterheight = 30;
const hitteroffset = 10;
const timeout = 10;
const blockoffset = 20;
var blocks = [];
var hitters = [];
var keydata = [];
var timings = [];


class Block {
    constructor(x, y, xchange, ychange, width, height, enabled, type) {
        this.x = x;
        this.y = y;
        this.xchange = xchange;
        this.ychange = ychange;
        this.width = width;
        this.height = height;
        this.enabled = enabled;
        this.ishold = type;
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

function initiate(keys, map, difficulty) {
    document.getElementById("player").src = "../musicdata/" + map + ".wav";
    let temparr = readTextFile("../timingdata/" + map + "_Timings" + difficulty + ".btm").split(",");
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
    for (let i = 0; i < timings.length; i++) {
        blocks[timings[i][0]].push(new Block(
            window.innerWidth / (keydata.length + 2) * (timings[i][0] + 1) + (window.innerWidth / (keydata.length + 2) / 2 - blockwidth / 2),
            -blockoffset - fallrate - timings[i][1] * 1000 / timeout * fallrate,
            0,
            fallrate,
            blockwidth,
            -50,
            true,
            false
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
}

function addListeners() {
    document.addEventListener("keyup", function (event) {
        if (event.key === "b" && start) {
            startGame();
            start = false;
        }
        if (event.key === "Escape") {
            paused = !paused;
            document.getElementById("pausemenu").hidden = !paused;
            document.getElementById("pausemenubg").hidden = !paused;
            ignorepress = paused;
            if (paused) {
                document.getElementById("player").pause();
                clearInterval(timer);
            } else {
                document.getElementById("player").play();
                timer = setInterval(uGame, timeout);
            }
        }
    });
    for (let i = 0; i < keydata.length; i++) {
        document.addEventListener("keydown", function (event) {
            if (event.key === keydata[i].key && !ignorepress) {
                hitters[i].active = true;
            }
        });
        document.addEventListener("keyup", function (event) {
            if (event.key === keydata[i].key && !ignorepress) {
                hitters[i].active = false;
                hitters[i].updated = false;
            }
        });
    }
}

function startGame() {
    starttime = Date.now();
    timer = setInterval(uGame, timeout);
    var multiplier = (ctx.canvas.height - hitteroffset - hitterheight) / fallrate;
    setTimeout(function () {
        document.getElementById("player").play();
    }, multiplier * timeout);
}

function uGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
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
    for (let i = 0; i < keydata.length; i++) {
        for (let j = 0; j < blocks[i].length; j++) {
            if (hitters[i].active) {
                if (!hitters[i].updated) {
                    hitters[i].updated = true;
                    if (blocks[i][j].y > canvas.height - 50 && blocks[i][j].enabled) {
                        if (!blocks[i][j].ishold) {
                            score += 30 + Math.round(score * combo / 1000);
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
    //timing related stuff
    // timecount += 1;
    // timekeeper += 1;
    // if (timekeeper === 10) {
    //     timekeeper = 0;
    //     timecount += 1;
    // }
}

function drawColumn(arr, ctx) {
    if (arr[0].y + arr[0].height > window.innerHeight) {
        if (arr[0].enabled)
            combobroken = true;
        arr.splice(0, 1);
    }
    var temp = ctx.fillStyle;
    for (let j = 0; j < arr.length; j++) {
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