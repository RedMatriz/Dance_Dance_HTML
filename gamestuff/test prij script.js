function addListeners(arr) {
    for (let i = 0; i < arr.length; i++) {
        document.addEventListener("keypress", function (event) {
            if (event.key === arr[i].key)
                document.getElementById(arr[i].keyId).style = "background-color:grey;color:red;";
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

var timecount = 0;
var blocks = [];

function uGame() {
    const ctx = document.getElementById("game").getContext("2d");
    timecount += 1;
    if ((Math.random() * 50).toFixed(0) * 1 === 27) {
        blocks.push({
            x: screen.width / 8 + screen.width * .09375 * (Math.random() * 7).toFixed(0),
            y: 0,
            xchange: 0,
            ychange: 10,
            enabled: true
        });
    }
    for (let i = 0; i < blocks.length; i++) {
        ctx.clearRect(blocks[i].x, blocks[i].y, screen.width * .09375, 50);
        blocks[i].y += blocks[i].ychange;
        blocks[i].x += blocks[i].xchange;
        ctx.fillRect(blocks[i].x, blocks[i].y, screen.width * .09375, 50);
        if (blocks[i].y > window.innerHeight) {
            blocks.splice(i, 1);
            i--;
        }
    }

}