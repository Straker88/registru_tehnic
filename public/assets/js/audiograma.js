function doPrint() {
    window.print();
}

$("textarea").on('keydown keypress keyup', function (e) {
    if (e.keyCode == 8 || e.keyCode == 46) {
        return true;
    }
    var maxRowCount = $(this).attr("rows") || 2;
    var lineCount = $(this).val().split('\n').length;
    if (e.keyCode == 13) {
        if (lineCount == maxRowCount) {
            return false;
        }
    }
    var jsElement = $(this)[0];
    if (jsElement.clientHeight < jsElement.scrollHeight) {
        var text = $(this).val();
        text = text.slice(0, -1);
        $(this).val(text);
        return false;
    }
})




var ry = [[]];

var canvas = document.querySelector("#myCanvas");
var w = (canvas.width = 450);
var h = (canvas.height = 280);

var ctx = canvas.getContext("2d");

var theFunction = "drawCircle";

drawGrid();


function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCross(x, y) {
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 9);
    ctx.lineTo(x + 9, y + 9);

    ctx.moveTo(x + 9, y - 9);
    ctx.lineTo(x - 9, y + 9);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
}


myCanvas.addEventListener("click", e => {
    var offset = canvas.getBoundingClientRect();
    var x = e.clientX - offset.left;
    var y = e.clientY - offset.top;
    ry[ry.length - 1].push({ x: x, y: y, f: theFunction });
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    drawChart();
});

sterge.addEventListener("click", e => {
    if (ry[ry.length - 1].length > 0) {
        ry[ry.length - 1].pop();
    } else {
        ry.pop();
        ry[ry.length - 1].pop();
    }
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    drawChart();
});

dreapta.addEventListener("click", e => {
    theFunction = "drawCircle"
    ry.push([]);
});

stanga.addEventListener("click", e => {
    theFunction = "drawCross"
    ry.push([]);
});

function drawGrid() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.1;
    ctx.beginPath();
    for (x = 15; x <= w; x += 60) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        for (y = 20; y <= h; y += 20) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
    }
    ctx.stroke();
}

function drawChart() {
    ctx.lineWidth = 1;
    for (var index = 0; index < ry.length; index++) {
        for (var i = 0; i < ry[index].length; i++) {
            var l = ry[index][i];
            window[l.f](l.x, l.y)
            if (i > 0) {
                var last = ry[index][i - 1];
                ctx.beginPath();
                ctx.moveTo(last.x, last.y);
                ctx.lineTo(l.x, l.y);
                ctx.strokeStyle = "black";
                ctx.stroke();
            }
        }
    }
}


//------------------------------------------------------------------------------------------------

var ry1 = [[]];

var canvasIte = document.querySelector("#myCanvasIte");
var w1 = (canvasIte.width = 450);
var h1 = (canvasIte.height = 280);

var ctx1 = canvasIte.getContext("2d");

var theFunction1 = "drawCircleIte";

drawGridIte();


function drawCircleIte(x1, y1) {
    ctx1.beginPath();
    ctx1.arc(x1, y1, 9, 0, Math.PI * 2);
    ctx1.strokeStyle = "red";
    ctx1.lineWidth = 2;
    ctx1.stroke();
}

function drawCrossIte(x1, y1) {
    ctx1.beginPath();
    ctx1.moveTo(x1 - 9, y1 - 9);
    ctx1.lineTo(x1 + 9, y1 + 9);

    ctx1.moveTo(x1 + 9, y1 - 9);
    ctx1.lineTo(x1 - 9, y1 + 9);
    ctx1.strokeStyle = "blue";
    ctx1.lineWidth = 2;
    ctx1.stroke();
}


myCanvasIte.addEventListener("click", e => {
    var offset1 = canvasIte.getBoundingClientRect();
    var x1 = e.clientX - offset1.left;
    var y1 = e.clientY - offset1.top;
    ry1[ry1.length - 1].push({ x1: x1, y1: y1, f1: theFunction1 });
    ctx1.clearRect(0, 0, w1, h1);
    drawGridIte();
    drawChartIte();
});

sterge_ite.addEventListener("click", e => {
    if (ry1[ry1.length - 1].length > 0) {
        ry1[ry1.length - 1].pop();
    } else {
        ry1.pop();
        ry1[ry1.length - 1].pop();
    }
    ctx1.clearRect(0, 0, w1, h1);
    drawGridIte();
    drawChartIte();
});

dreapta_ite.addEventListener("click", e => {
    theFunction1 = "drawCircleIte"
    ry1.push([]);
});

stanga_ite.addEventListener("click", e => {
    theFunction1 = "drawCrossIte"
    ry1.push([]);
});

function drawGridIte() {
    ctx1.strokeStyle = "black";
    ctx1.lineWidth = 0.1;
    ctx1.beginPath();
    for (x1 = 15; x1 <= w1; x1 += 60) {
        ctx1.moveTo(x1, 0);
        ctx1.lineTo(x1, h1);
        for (y1 = 20; y1 <= h1; y1 += 20) {
            ctx1.moveTo(0, y1);
            ctx1.lineTo(w1, y1);
        }
    }
    ctx1.stroke();
}

function drawChartIte() {
    ctx1.lineWidth = 1;
    for (var index1 = 0; index1 < ry1.length; index1++) {
        for (var i1 = 0; i1 < ry1[index1].length; i1++) {
            var l1 = ry1[index1][i1];
            window[l1.f1](l1.x1, l1.y1)
            if (i1 > 0) {
                var last1 = ry1[index1][i1 - 1];
                ctx1.beginPath();
                ctx1.moveTo(last1.x1, last1.y1);
                ctx1.lineTo(l1.x1, l1.y1);
                ctx1.strokeStyle = "black";
                ctx1.stroke();
            }
        }
    }
}
