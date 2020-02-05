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

var x = screen.width/8, y = 0;
var xchange = 0, ychange = 20;
var timecount = 0;
var blocks;

function uGame() {
    const ctx = document.getElementById("game").getContext("2d");
    ctx.clearRect(x, y, screen.width * .09375, 50);
    count +=1;

    y += ychange;
    x += xchange;
    ctx.fillRect(x, y, screen.width * .09375, 50);
}