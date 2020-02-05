document.addEventListener("keypress", function (event) {
    // if (event.key === 'a')
    //     document.getElementById("changable").innerText = "something has changed " + event.keyCode;
    if (event.key === 'a') {
        document.getElementById("key0").style = "color:red;";
        document.getElementById("keyh0").style = "background-color:grey;";
        document.getElementById("key0").innerText = "A";
    }
    if (event.key === 's') {
        document.getElementById("key1").style = "color:red;";
        document.getElementById("keyh1").style = "background-color:grey;";
        document.getElementById("key1").innerText = "S";
    }
    if (event.key === 'd') {
        document.getElementById("key2").style = "color:red;";
        document.getElementById("keyh2").style = "background-color:grey;";
        document.getElementById("key2").innerText = "D";
    }
    if (event.key === 'f') {
        document.getElementById("key3").style = "color:red;";
        document.getElementById("keyh3").style = "background-color:grey;";
        document.getElementById("key3").innerText = "F";
    }
    if (event.key === 'j') {
        document.getElementById("key4").style = "color:red;";
        document.getElementById("keyh4").style = "background-color:grey;";
        document.getElementById("key4").innerText = "J";
    }
    if (event.key === 'k') {
        document.getElementById("key5").style = "color:red;";
        document.getElementById("keyh5").style = "background-color:grey;";
        document.getElementById("key5").innerText = "K";
    }
    if (event.key === 'l') {
        document.getElementById("key6").style = "color:red;";
        document.getElementById("keyh6").style = "background-color:grey;";
        document.getElementById("key6").innerText = "L";
    }
    if (event.key === ';') {
        document.getElementById("key7").style = "color:red;";
        document.getElementById("keyh7").style = "background-color:grey;";
        document.getElementById("key7").innerText = ";";
    }
});
document.addEventListener("keyup", function (event) {
    if (event.key === 'a') {
        document.getElementById("key0").style = "";
        document.getElementById("keyh0").style = "";
        document.getElementById("key0").innerText = "A";
    }
    if (event.key === 's') {
        document.getElementById("key1").style = "";
        document.getElementById("keyh1").style = "";
        document.getElementById("key1").innerText = "S";
    }
    if (event.key === 'd') {
        document.getElementById("key2").style = "";
        document.getElementById("keyh2").style = "";
        document.getElementById("key2").innerText = "D";
    }
    if (event.key === 'f') {
        document.getElementById("key3").style = "";
        document.getElementById("keyh3").style = "";
        document.getElementById("key3").innerText = "F";
    }
    if (event.key === 'j') {
        document.getElementById("key4").style = "";
        document.getElementById("keyh4").style = "";
        document.getElementById("key4").innerText = "J";
    }
    if (event.key === 'k') {
        document.getElementById("key5").style = "";
        document.getElementById("keyh5").style = "";
        document.getElementById("key5").innerText = "K";
    }
    if (event.key === 'l') {
        document.getElementById("key6").style = "";
        document.getElementById("keyh6").style = "";
        document.getElementById("key6").innerText = "L";
    }
    if (event.key === ';') {
        document.getElementById("key7").style = "";
        document.getElementById("keyh7").style = "";
        document.getElementById("key7").innerText = ";";
    }
});

function startGame() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 20;
    var timer = setInterval(uGame, 20);
}

var x = screen.width / 8, y = 0;
var xchange = 0, ychange = 20;
var timecount = 0;
var blocks = [
    {
        x: screen.width / 8,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: true
    },
    {
        x: screen.width / 8 + screen.width * .09375,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: false
    },
    {
        x: screen.width / 8 + screen.width * .09375 * 2,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: false
    },
    {
        x: screen.width / 8 + screen.width * .09375 * 3,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: false
    },
    {
        x: screen.width / 8 + screen.width * .09375 * 4,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: false
    },
    {
        x: screen.width / 8 + screen.width * .09375 * 5,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: false
    },
    {
        x: screen.width / 8 + screen.width * .09375 * 6,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: false
    },
    {
        x: screen.width / 8 + screen.width * .09375 * 7,
        y: 0,
        xchange: 0,
        ychange: 20,
        enabled: false
    },
];

function uGame() {
    const ctx = document.getElementById("game").getContext("2d");
    timecount += 1;
    for (let i = 0; i < blocks.length; i++) {
        if(timecount%(Math.random()*9+2).toFixed(0) === 0)
            blocks[i].enabled = true;
        if (blocks[i].enabled === true) {
            ctx.clearRect(blocks[i].x, blocks[i].y, screen.width * .09375, 50);
            blocks[i].y += ychange;
            blocks[i].x += xchange;
            ctx.fillRect(blocks[i].x, blocks[i].y, screen.width * .09375, 50);
        }
        if (blocks[i].y > window.innerHeight){
            blocks[i].enabled = false;
            blocks[i].y = 0;
        }
    }

}