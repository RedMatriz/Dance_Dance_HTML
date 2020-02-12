var timecount = 0;
var score = 0;
var blocks = [[], [], [], [], [], [], [], []];
var pressed = [false, false, false, false, false, false];
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
            }
        });
        document.addEventListener("keyup", function (event) {
            if (event.key === keydata[i].key) {
                pressed[i] = false;
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
    const timer = setInterval(uGame, 20);
}

function uGame() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000"
    ctx.fillText("Score: " + score, 10, 50, window.innerWidth / 8);
    timecount += 1;
    if ((Math.random() * 10).toFixed(0) * 1 === 3) {
        let loc = (Math.random() * 5).toFixed(0);
        blocks[loc].push(new Block(
            window.innerWidth / 8 * loc + window.innerWidth / 8,
            0,
            0,
            5,
            window.innerWidth / 8 - 50,
            Math.random() * 100 + 50,
            true
        ));
    }
    for (let i = 0; i < 6; i++) {
        try {
            uColumn(blocks[i], ctx);
        } catch (e) {

        }
        if (pressed[i]) {
            ctx.fillStyle = "#34ff34";

        } else {
            ctx.fillStyle = "rgba(0,0,0,0)";
        }
        ctx.fillRect(window.innerWidth / 8 * (i + 1), canvas.height - 50, window.innerWidth / 8, 50);
        ctx.strokeRect(window.innerWidth / 8 * (i + 1), canvas.height - 50, window.innerWidth / 8, 50);
    }
}

function uColumn(arr, ctx) {
    if (arr[0].y > window.innerHeight) {
        arr.splice(0, 1);
    }
    for (let j = 0; j < arr.length; j++) {
        arr[j].y += arr[j].ychange;
        arr[j].x += arr[j].xchange;
        if (arr[j].enabled)
            ctx.fillStyle = "#3957f0";
        else
            ctx.fillStyle = "#71aff0";
        ctx.fillRect(arr[j].x + window.innerWidth / 16 - arr[j].width / 2, arr[j].y, arr[j].width, arr[j].height);
        ctx.strokeRect(arr[j].x + window.innerWidth / 16 - arr[j].width / 2, arr[j].y, arr[j].width, arr[j].height);
        ctx.fillStyle = "#000000";
    }
}