function initiate() {
    addListeners();
}

var file;
var times = [];
var start = true;
(function () {
    var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {
                type: 'text/plain'
            });

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };

    document.addEventListener("keyup", function (event) {
        if (event.key === "f") {
            var link = document.getElementById("output");
            link.href = makeTextFile(times.toString());
            link.style.display = 'block';
        }
    });
})();

function addTime(time) {
    times.push(time);
}

function addListeners() {
    document.addEventListener("keyup", function (event) {
        if (event.key === "b" && start) {
            start = false;
            setTimeout(function () {
                document.getElementById("player").play();
            }, 3000);
        }
    });
    // document.addEventListener("keyup", function (event) {
    //     if (event.key === "f" && !start) {
    //         file = createText(times.toString());
    //         document.getElementById("output").href = file;
    //     }
    // });
    document.addEventListener("keydown", function (event) {
        if (event.key === "t") {
            addTime(document.getElementById("player").currentTime);
        }
    });
}

// function createText(text) {
//     const data = new Blob([text], {
//         type: 'text/plain'
//     });
//     // If we are replacing a previously generated file we need to
//     // manually revoke the object URL to avoid memory leaks.
//     return window.URL.createObjectURL(data);
// }