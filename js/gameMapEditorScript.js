let mapName = null;
//audio playback related stuff
let sound = null,
    position = 0,
    playbackrate = 1,
    paused = true,
    waveform = null,
    samplemultiplier = 300;
//keypress related stuff
let keydata = null;
//mouseinteraction related stuff
const mousepos = [0, 0],
    downpos = [0, 0],
    uppos = [0, 0];
let mousedown = false,
    scrollmultiplier = 30,
    selectedBlock = null,
    selectedBlockTime = null;
//canvas related stuff
let ctx = null,
    canvas = null,
    hitters = [],
    scale = 1,
    showBG = true,
    fade = 0.3,
    blockrenderindex = [];
const hitterheight = 30,
    hitteroffset = 10;
//timing related stuff
let timer = null,
    autosave = null;
const timeout = 10,
    fallrate = 5;
//file io related stuff
let blocks = [],
    textFile = null;

class Block {
    constructor(x, y, xchange, ychange, width, height, time) {
        this.x = x;
        this.y = y;
        this.xchange = xchange;
        this.ychange = ychange;
        this.width = width;
        this.height = height;
        this.time = time;
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

function initiate(kdata, map, difficulty) {
    //initiate canvas variables
    canvas = document.getElementById("editor-canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    //load in the files
    mapName = map;
    keydata = kdata;
    document.getElementById("bgvideo").src = "../resources/" + map + "_bgdecor.mp4";
    document.getElementById("bgvideo").load();
    sound = new Audio("../musicdata/" + map + ".wav");
    sound.load();
    sound.playbackRate = playbackrate;
    for (let i = 0; i < keydata.length; i++) {
        hitters.push(new Hitter(
            ctx.canvas.width / (keydata.length + 2) * (i + 1) + 1,
            ctx.canvas.height - (hitterheight + hitteroffset),
            ctx.canvas.width / (keydata.length + 2) - 2,
            hitterheight,
            false,
            false));
        blocks.push([]);
    }
    //importing blocks
    let temparr = readTextFile("../timingdata/" + map + "_Timings" + difficulty + ".btm").split(",");
    for (let i = 0; i < temparr.length; i++) {
        let temp = temparr[i].split(":");
        let pos = parseInt(temp[0]),
            time = parseFloat(temp[1]);
        blocks[pos].push(new Block(
            ctx.canvas.width / (keydata.length + 2) * (pos + 1) + (ctx.canvas.width / (keydata.length + 2) / 2 - 100),
            canvas.height - temp[1] * 1000 / timeout * fallrate,
            0,
            fallrate,
            200,
            -50,
            time
        ));
    }
    //creating waveform
    const audioContext = new AudioContext();
    let soundrequest = new Request("../musicdata/" + map + ".wav");
    fetch(soundrequest)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => constructAudioWave(audioBuffer, Math.floor(sound.duration) * samplemultiplier))
        .then(form => waveform = form);
    //add listeners
    addListeners();
    //start editor
    let temp = setInterval(function () {
        if (waveform != null) {
            clearInterval(temp);
            timer = setInterval(update, timeout);
            autosave = setInterval(function () {
                let output = "", indecies = [], indmax = [], notmet = true;
                for (let i = 0; i < keydata.length; i++) {
                    indecies.push(0);
                    indmax.push(blocks[i].length)
                }
                do {
                    notmet = false;
                    let smallest = sound.duration;
                    let smalindex = 0;
                    for (let i = 0; i < blocks.length; i++) {
                        if (indecies[i] < blocks[i].length && parseFloat(blocks[i][indecies[i]].time) <= smallest) {
                            smallest = parseFloat(blocks[i][indecies[i]].time);
                            smalindex = i;
                        }
                        if (!(indecies[i] >= indmax[i]))
                            notmet = true;
                    }
                    if (notmet) {
                        output += smalindex + ":" + blocks[smalindex][indecies[smalindex]].time + ",";
                        indecies[smalindex] += 1;
                    }
                } while (notmet);
                localStorage.setItem("map", makeTextFile(output.substr(0, output.length-1)));
            }, 60000);
        }
    });

}

function addListeners() {
    //add control listeners
    document.addEventListener("keydown", function (event) {
        if (event.key === "p") {
            paused = !paused;
            if (paused) {
                sound.pause();
                document.getElementById("bgvideo").pause();
            } else {
                sound.play();
                document.getElementById("bgvideo").play();
            }
        }
        if (event.key === "o") {
            let output = "";
            let indecies = [];
            let indmax = [];
            let notmet = true;
            for (let i = 0; i < keydata.length; i++) {
                indecies.push(0);
                indmax.push(blocks[i].length)
            }
            do {
                notmet = false;
                let smallest = sound.duration;
                let smalindex = 0;
                for (let i = 0; i < blocks.length; i++) {
                    if (indecies[i] < blocks[i].length && parseFloat(blocks[i][indecies[i]].time) <= smallest) {
                        smallest = parseFloat(blocks[i][indecies[i]].time);
                        smalindex = i;
                    }
                    if (!(indecies[i] >= indmax[i]))
                        notmet = true;
                }
                if (notmet) {
                    output += smalindex + ":" + blocks[smalindex][indecies[smalindex]].time + ",";
                    indecies[smalindex] += 1;
                }
            } while (notmet);
            localStorage.setItem("map", makeTextFile(output.substr(0, output.length-1)));
            window.open("redirect.html", '_blank');
        }
    });
    canvas.addEventListener("mousemove", function (event) {
        mousepos[0] = event.x;
        mousepos[1] = event.y;
    });
    document.addEventListener("mousedown", function (event) {
        downpos[0] = mousepos[0];
        downpos[1] = mousepos[1];
        selectedBlock = getSelectedBlock(downpos);
        if (selectedBlock != null)
            selectedBlockTime = selectedBlock.time;
        mousedown = true;
    });
    document.addEventListener("mouseup", function (event) {
        uppos[0] = mousepos[0];
        uppos[1] = mousepos[1];
        selectedBlock = null;
        selectedBlockTime = null;
        // toggleBG();
        mousedown = false;
    });
    document.addEventListener("wheel", function (event) {
        if (event.deltaY !== 0) {
            position -= event.deltaY / Math.abs(event.deltaY) * scrollmultiplier;
        }
    });

    //add play listeners
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

function constructAudioWave(audio, samples) {
    const rawdata = audio.getChannelData(0);
    const blocksize = Math.floor(rawdata.length / samples);
    let form = [];
    for (let i = 0; i < samples; i++) {
        let blockstart = i * blocksize;
        let sum = 0;
        for (let j = 0; j < blocksize; j++) {
            sum = sum + Math.abs(rawdata[blockstart + j])
        }
        form.push(sum / blocksize);
    }
    const multiplier = Math.pow(Math.max(...form), -1);
    return form.map(n => n * multiplier);
}

function update() {
    if (showBG)
        ctx.fillStyle = "rgba(0,0,0," + fade + ")";
    else
        ctx.fillStyle = "#000000";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //update block locations
    if (!paused) {
        position = sound.currentTime * 1000 / timeout * fallrate;
    } else {
        sound.currentTime = position / 1000 * timeout / fallrate;
        document.getElementById("bgvideo").currentTime = position / 1000 * timeout / fallrate;
    }
    if (mousedown) {
        if (selectedBlock != null) {
            selectedBlock.time = (downpos[1] - mousepos[1]) / 1000 * timeout / fallrate + selectedBlockTime;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, selectedBlock.y, selectedBlock.x + selectedBlock.width, -5);
        }
    }
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks[i].length; j++) {
            blocks[i][j].y = canvas.height - (blocks[i][j].time - sound.currentTime) * 1000 / timeout * fallrate;
        }
    }
    //draw blocks
    for (let i = 0; i < blocks.length; i++) {
        ctx.fillStyle = keydata[i].color;
        ctx.strokeStyle = "#adadad";
        for (let j = 0; j < blocks[i].length; j++) {
            if (!(blocks[i][j].y + blocks[i][j].height > canvas.height || blocks[i][j].y < 0)) {
                ctx.fillRect(blocks[i][j].x, blocks[i][j].y, blocks[i][j].width, blocks[i][j].height);
                ctx.strokeRect(blocks[i][j].x, blocks[i][j].y, blocks[i][j].width, blocks[i][j].height);
            }
        }
        drawHitter(hitters[i], ctx);
    }
    //draw wave
    let waveheight = 1000 / timeout * fallrate / samplemultiplier;
    ctx.beginPath();
    ctx.moveTo(ctx.canvas.width / (keydata.length + 2) / 2, canvas.height);
    let startindex = 0;
    let endindex = waveform.length;
    for (let i = 0; i < waveform.length; i++) {
        if (!(canvas.height - i * waveheight + position > canvas.height || canvas.height - (i - 1) * waveheight + position < 0)) {
            ctx.lineTo(ctx.canvas.width / (keydata.length + 2) / 2 - waveform[i] * ctx.canvas.width / (keydata.length + 2) / 2, canvas.height - i * waveheight + position);
            endindex = i;
        } else if (canvas.height - i * waveheight + position < 0) {
            break;
        } else if (canvas.height - i * waveheight + position > canvas.height) {
            ctx.moveTo(ctx.canvas.width / (keydata.length + 2) / 2 - waveform[i] * ctx.canvas.width / (keydata.length + 2) / 2, canvas.height - i * waveheight + position);
            startindex = i;
        }
    }
    for (let i = endindex; i > startindex - 1; i--) {
        ctx.lineTo(ctx.canvas.width / (keydata.length + 2) / 2 + waveform[i] * ctx.canvas.width / (keydata.length + 2) / 2, canvas.height - i * waveheight + position);
    }
    ctx.closePath();
    ctx.fillStyle = "#6ca3ff";
    ctx.strokeStyle = "#6ca3ff";
    ctx.fill();

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

function makeTextFile(text) {
    var data = new Blob([text], {
        type: 'text/plain'
    });
    if (textFile !== null)
        window.URL.revokeObjectURL(textFile);
    textFile = window.URL.createObjectURL(data);
    return textFile;
}

function toggleBG() {
    document.getElementById("videoholder").hidden = showBG;
    showBG = !showBG;
}

function getSelectedBlock(pos) {
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks[i].length; j++) {
            let cur = blocks[i][j];
            if (cur.x < pos[0] && cur.x + cur.width > pos[0]) {
                if (cur.y > pos[1] && cur.y + cur.height < pos[1]) {
                    return cur;
                }
            }
        }
    }
    return null;
}