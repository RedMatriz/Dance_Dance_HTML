//file and output related stuff
let times = [],
    start = true,
    textFile = null;
//key related stuff
let keydata = [];
const hitters = [],
    blocks = [];
//canvas related stuff
let canvas = null,
    ctx = null;
const hitteroffset = 10,
    hitterheight = 30,
    fallrate = 2;
//audio related stuff
let sound = null;


//classes
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

//functions
function initiate(kdata, map) {
    sound = new Audio("../musicdata/" + map + ".wav");
    sound.load();
    document.getElementById("player").src = "../musicdata/" + map + ".wav";
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

    document.addEventListener("keydown", function (event) {
        for (let i = 0; i < keydata.length; i++) {
            if (event.key === keydata[i].key) {
                hitters[i].active = true;
                if (!start) {
                    let time = sound.currentTime;
                    let block = new BlockTime(time, i);
                    times.push(block);
                    document.getElementById("display").innerText = block.toString();
                    blocks[i].push(new Block(hitters[i].x, hitters[i].y + hitterheight, 0, fallrate, hitters[i].width, -hitters[i].height));
                }
            }
        }
    });
    document.addEventListener("keyup", function (event) {
        for (let i = 0; i < keydata.length; i++) {
            if (event.key === keydata[i].key) {
                hitters[i].active = false;
            }
        }
    });
}

function addControlListeners() {
    document.addEventListener("keyup", function (event) {
        if (event.key === "b" && start) {
            start = false;
            startRefresh();
            sound.play();
        }
    });
    document.addEventListener("keyup", function (event) {
        if (event.key === "e") {
            var link = document.getElementById("output");
            sound.pause();
            link.href = makeTextFile(times);
            link.style.display = 'block';
        }
    });
    document.addEventListener("keyup", function (event) {
        if (event.key === "r") {
            start = true;
            times = [];
            sound.currentTime = 0;
            sound.pause();
        }
    });
}

function startRefresh() {
    const timer = setInterval(uFrame, 5);
}

function uFrame() {
    document.getElementById("player").currentTime = sound.currentTime;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < keydata.length; i++) {
        drawHitter(hitters[i]);
        try {
            ctx.fillStyle = keydata[i].color;
            drawColumn(blocks[i]);
        } catch (e) {
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