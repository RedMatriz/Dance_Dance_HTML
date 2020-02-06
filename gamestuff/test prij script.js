var timecount = 0;
var score = 0;
var blocks = [];
var keydata;


function addListeners(arr) {
    keydata = arr;
    for (let i = 0; i < arr.length; i++) {
        document.addEventListener("keypress", function (event) {
            if (event.key === arr[i].key) {
                document.getElementById(arr[i].keyId).style = "background-color:grey;color:red;";
                for (let j = 0; j < blocks.length; j++) {
                    if (blocks[j].y + blocks[j].height >= window.innerHeight - document.getElementById(arr[i].keyId).clientHeight
                        && Math.abs(blocks[j].x - (screen.width / 8 + screen.width * .09375 * arr[i].col)) <= 5) {
                            if (blocks[j].enabled === true) {
                                score += 1;
                                blocks[j].enabled = false;
                            }
                    }
                }
            }
        });
        document.addEventListener("keyup", function (event) {
            if (event.key === arr[i].key)
                document.getElementById(arr[i].keyId).style = "";
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
    if ((Math.random() * 50).toFixed(0) * 1 === 27) {
        blocks.push({
            x: screen.width / 8 + screen.width * .09375 * (Math.random() * 7).toFixed(0),
            y: 0,
            xchange: 0,
            ychange: 5,
            width: screen.width * .09375 - 50,
            height: Math.random() * 100 + 50,
            enabled: true
        });
    }
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].y += blocks[i].ychange;
        blocks[i].x += blocks[i].xchange;
        if (blocks[i].enabled)
            ctx.fillStyle = "#3957f0";
        else
            ctx.fillStyle = "#71aff0";

        ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
        ctx.strokeRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
        if (blocks[i].y > window.innerHeight) {
            blocks.splice(i, 1);
            i--;
        }
        ctx.fillStyle = "#000000";
    }
    ctx.font = "30px Ariel";
    ctx.fillText("Score: " + score, 10, 50, screen.width / 8);

}