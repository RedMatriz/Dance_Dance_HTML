var canvas, ctx;
var file;
var times = [];
var start = true;
var textFile = null;
var keydata = [];
var hitters = [];
var blocks = [];
const hitteroffset = 10;
const hitterheight = 30;
const fallrate = 4;

class BlockTime {
    constructor(time, col) {
        this.time = time;
        this.column = col;
    }

    toString() {
        return this.column + ":" + this.time;
    }
}

class Block {
    constructor(x, y, xchange, ychange, width, height) {
        this.x = x;
        this.y = y;
        this.xchange = xchange;
        this.ychange = ychange;
        this.width = width;
        this.height = height;
    }
}

class Hitter {
    constructor(x, y, width, height, active) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = active;
    }
}

function initiate(kdata) {
    keydata = kdata;
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight * .8;
    for (let i = 0; i < keydata.length; i++) {
        hitters.push(new Hitter(
            window.innerWidth / (keydata.length + 2) * (i + 1) + 1,
            hitteroffset,
            window.innerWidth / (keydata.length + 2) - 2,
            hitterheight,
            false));
        blocks.push([]);
    }
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    addControlListeners();
    addInputListeners();
    startRefresh();
}

function makeTextFile(text) {
    var data = new Blob([text], {
        type: 'text/plain'
    });
    if (textFile !== null)
        window.URL.revokeObjectURL(textFile);
    textFile = window.URL.createObjectURL(data);
    return textFile;
}

function addInputListeners() {
    for (let i = 0; i < keydata.length; i++) {
        document.addEventListener("keydown", function (event) {
            if (event.key === keydata[i].key) {
                hitters[i].active = true;
                if (!start) {
                    let time = document.getElementById("player").currentTime;
                    let block = new BlockTime(time, i);
                    times.push(block);
                    document.getElementById("display").innerText = block.toString();
                    blocks[i].push(new Block(hitters[i].x, hitters[i].y + hitterheight, 0, fallrate, hitters[i].width, -hitters[i].height));
                }
            }
        });
        document.addEventListener("keyup", function (event) {
            if (event.key === keydata[i].key) {
                hitters[i].active = false;
            }
        });
    }
}

function addControlListeners() {
    document.addEventListener("keyup", function (event) {
        if (event.key === "b" && start) {
            start = false;
            startRefresh();
            document.getElementById("player").play();
        }
    });
    document.addEventListener("keyup", function (event) {
        if (event.key === "e") {
            var link = document.getElementById("output");
            document.getElementById("player").pause();
            link.href = makeTextFile(times);
            link.style.display = 'block';
        }
    });
    document.addEventListener("keyup", function (event) {
        if (event.key === "r") {
            start = true;
            times = [];
            document.getElementById("player").currentTime = 0;
            document.getElementById("player").pause();
        }
    });
}

function startRefresh() {
    const timer = setInterval(uFrame, 10);
}

function uFrame() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < keydata.length; i++) {
        drawHitter(hitters[i]);
        try {
            ctx.fillStyle = keydata[i].color;
            drawColumn(blocks[i]);
        }catch (e) {
        }
    }
}

function drawHitter(hitter) {
    if (hitter.active) {
        ctx.strokeStyle = "#34ff34";
    } else {
        ctx.strokeStyle = "rgba(200,200,200,1)";
    }
    ctx.lineWidth = 3;
    ctx.strokeRect(hitter.x, hitter.y, hitter.width, hitter.height);
}

function drawColumn(arr) {
    if (arr[0].y + arr[0].height > window.innerHeight) {
        arr.splice(0, 1);
    }
    var temp = ctx.fillStyle;
    for (let j = 0; j < arr.length; j++) {
        arr[j].y += arr[j].ychange;
        ctx.fillRect(arr[j].x, arr[j].y, arr[j].width, arr[j].height);
        ctx.strokeRect(arr[j].x, arr[j].y, arr[j].width, arr[j].height);
        ctx.fillStyle = temp;
    }
}