var timecount = 0;
var score = 0;
var timer;
var start = true;
var canvas;
var ctx;
var starttime;
const fallrate = 5;
const blockwidth = 200;
const hitterheight = 30;
const hitteroffset = 10;
var blocks = [];
var hitters = [];
var updated = [];
var keydata = [];


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

function initiate(keys) {
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
    });
    for (let i = 0; i < keydata.length; i++) {
        document.addEventListener("keydown", function (event) {
            if (event.key === keydata[i].key) {
                hitters[i].active = true;
            }
        });
        document.addEventListener("keyup", function (event) {
            if (event.key === keydata[i].key) {
                hitters[i].active = false;
                hitters[i].updated = false;
            }
        });
    }
}

function startGame() {
    starttime = Date.now();
    timer = setInterval(uGame, 10);
    var multiplier = (ctx.canvas.height - hitteroffset - hitterheight) / fallrate;
    setTimeout(function () {
        document.getElementById("player").play();
    }, multiplier * 10);
}

var timekeeper = 0;

function uGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#adadad";
    ctx.font = "30px Ariel";
    ctx.fillText("Score: " + score, 10, 50, window.innerWidth / 8);
    timecount += 1;
    timekeeper += 1;
    const currenttime = Date.now() - starttime;
    if (timecount % 46 <= 0) {
        const loc = (Math.random() * (keydata.length - 1)).toFixed(0);
        blocks[loc].push(new Block(
            window.innerWidth / (keydata.length + 2) * loc + window.innerWidth / (keydata.length + 2) + (window.innerWidth / (keydata.length + 2) / 2 - blockwidth / 2),
            0,
            0,
            fallrate,
            blockwidth,
            -50,
            true,
            false
        ));
    }
    if (timekeeper === 10) {
        timekeeper = 0;
        timecount += 1;
    }
    for (let i = 0; i < keydata.length; i++) {
        for (let j = 0; j < blocks[i].length; j++) {
            if (hitters[i].active) {
                if (!hitters[i].updated) {
                    hitters[i].updated = true;
                    if (blocks[i][j].y > canvas.height - 50) {
                        if (!blocks[i][j].ishold) {
                            score += 30;
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