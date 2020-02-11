var timecount = 0;
var score = 0;
var blocks = [[], [], [], [], [], [], [], [], []];
var pressed = [false, false, false, false, false, false, false, false];
var keydata = [{
    key: "a",
    keyId: "key0",
    col: 0
}, {
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
}, {
    key: ";",
    keyId: "key7",
    col: 7
}];

class Block {
    constructor(x, y, xchange, ychange, width, height, enabled) {
        this.x = x;
        this.y = y;
        this.xchange = xchange;
        this.ychange = ychange;
        this.width = width;
        this.height = height;
        this.enabled = enabled;
    }

}


function addListeners() {
    for (let i = 0; i < keydata.length; i++) {
        document.addEventListener("keydown", function (event) {
            if (event.key === keydata[i].key) {
                pressed[i] = true;
                document.getElementById(keydata[i].keyId).style = "background-color:grey;color:red;";
                for (let j = 0; j < blocks[keydata[i].col].length; j++) {
                    if (blocks[j].y + blocks[j].height >= window.innerHeight - document.getElementById(keydata[i].keyId).clientHeight - 50) {
                        if (blocks[keydata[i].col][j].enabled === true) {
                            score += 1;
                            blocks[keydata[i].col].enabled = false;
                        }
                    }
                }
            }
        });
        document.addEventListener("keyup", function (event) {
            if (event.key === keydata[i].key) {
                pressed[i] = false;
                document.getElementById(keydata[i].keyId).style = null;
            }
        });
    }
}

function startGame() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 20;
    var timer = setInterval(uGame, 20);
}

function uGame() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timecount += 1;
    if ((Math.random() * 50).toFixed(0) * 1 <= 10) {
        let loc = (Math.random() * 5).toFixed(0);
        blocks[loc].push(new Block(
            screen.width / 8 + screen.width * .09375 * loc,
            0,
            0,
            5,
            screen.width * .09375 - 50,
            Math.random() * 100 + 50,
            true
        ));
    }
    for (let i = 0; i < blocks.length; i++) {
        uColumn(blocks[i], ctx);
        if (pressed[i]) {
            ctx.fillRect(screen.width / 8 + screen.width * .09375 * i, canvas.height - 50, screen.width * .09375, 50)
        } else {

        }
    }
    ctx.font = "30px Ariel";
    ctx.fillText("Score: " + score, 10, 50, screen.width / 8);

}

function uColumn(arr, ctx) {
    for (let j = 0; j < arr.length; j++) {
        arr[j].y += arr[j].ychange;
        arr[j].x += arr[j].xchange;
        if (arr[j].y > window.innerHeight) {
            arr.splice(j, 1);
            i--;
        }
        if (arr[j].enabled)
            ctx.fillStyle = "#3957f0";
        else
            ctx.fillStyle = "#71aff0";
        ctx.fillRect(arr[j].x, arr[j].y, arr[j].width, arr[j].height);
        ctx.strokeRect(arr[j].x, arr[j].y, arr[j].width, arr[j].height);
        ctx.fillStyle = "#000000";
    }
}