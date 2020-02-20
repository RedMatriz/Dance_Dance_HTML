var timecount = 0;
var score = 0;
var timer;
var start = true;
var blocks = [[], [], [], [], [], [], [], []];
var pressed = [false, false, false, false, false, false];
var updated = [false, false, false, false, false, false];
var keydata = [{
    key: "s",
    keyId: "key1",
    col: 1
}, {
    key: "d",
    keyId: "key2",
    col: 2
}, {
    key: "f",
    keyId: "key3",
    col: 3
}, {
    key: "j",
    keyId: "key4",
    col: 4
}, {
    key: "k",
    keyId: "key5",
    col: 5
}, {
    key: "l",
    keyId: "key6",
    col: 6
}];


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


function addListeners() {
    document.addEventListener("keyup", function (event) {
        if (event.key === "q" && start) {
            document.getElementById("TheBois").play();
            startGame();
            start = false;
        }
    });
    for (let i = 0; i < keydata.length; i++) {
        document.addEventListener("keydown", function (event) {
            if (event.key === keydata[i].key) {
                pressed[i] = true;
                score -= 10;
                if (score < 0)
                    score = 0;
            }
        });
        document.addEventListener("keyup", function (event) {
            if (event.key === keydata[i].key) {
                pressed[i] = false;
                updated[i] = false;
            }
        });
    }
}

function startGame() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.font = "30px Ariel";
    timer = setInterval(uGame, 5);
}

function uGame() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#adadad";
    ctx.fillText("Score: " + score, 10, 50, window.innerWidth / 8);
    timecount += 1;
    if ((timecount - 9200) % 79 === 0 && (timecount - 9200) > 0) {
        let loc = (Math.random() * 5).toFixed(0);
        let multiplier = (canvas.height - 50) / 2 + 1;
        blocks[loc].push(new Block(
            window.innerWidth / 8 * loc + window.innerWidth / 8,
            canvas.height - 50 - multiplier * 2,
            0,
            2,
            window.innerWidth / 8 - 50,
            50,
            true,
            false
        ));
    }
    for (let i = 0; i < 6; i++) {
        if (i === 0 || i === 5) {
            ctx.fillStyle = "#4fbfff";
        } else if (i === 2 || i === 3) {
            ctx.fillStyle = "#ff6c5e";
        } else {
            ctx.fillStyle = "#55ff71";
        }
        for (let j = 0; j < blocks[i].length; j++) {
            if (pressed[i]) {
                if (!updated[i]) {
                    updated[i] = true;
                    if ((blocks[i][j].y + blocks[i][j].height) > canvas.height - 50) {
                        if (!blocks[i][j].ishold) {
                            score += 40;
                            blocks[i][j].enabled = false;
                        }
                    }
                }
                if ((blocks[i][j].y + blocks[i][j].height) > canvas.height - 50) {
                    if (blocks[i][j].ishold) {
                        score += 1;
                        blocks[i][j].enabled = false;
                    }
                    if (!updated[i]) {
                        updated[i] = true;
                        score += 10;
                    }
                }
            }
        }
        try {
            uColumn(blocks[i], ctx);
        } catch (e) {

        }
        if (pressed[i]) {
            ctx.strokeStyle = "#34ff34";
        } else {
            ctx.strokeStyle = "rgba(200,200,200,1)";
        }
        ctx.lineWidth = 3;
        ctx.strokeRect(window.innerWidth / 8 * (i + 1) + 1, canvas.height - 50, window.innerWidth / 8 - 2, 30);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(200,200,200,1)";
        ctx.fillStyle = "#000000";
    }
}

function uColumn(arr, ctx) {
    if (arr[0].y > window.innerHeight) {
        arr.splice(0, 1);
    }
    var temp = ctx.fillStyle;
    for (let j = 0; j < arr.length; j++) {
        arr[j].y += arr[j].ychange;
        arr[j].x += arr[j].xchange;
        if (!arr[j].enabled)
            ctx.fillStyle = "#505050";
        else
            ctx.strokeStyle = "#71aff0";
        ctx.fillRect(arr[j].x + window.innerWidth / 16 - arr[j].width / 2, arr[j].y, arr[j].width, arr[j].height);
        ctx.strokeRect(arr[j].x + window.innerWidth / 16 - arr[j].width / 2, arr[j].y, arr[j].width, arr[j].height);
        ctx.fillStyle = temp;
    }
}