// board
let board;
let boardWidth = 1024;
let boardHeight = 768;
let context;

// bug
let bugWidth = 64;
let bugHeight = 38;
let bugX;
let bugY = (6 * boardHeight) / 8;

let wires = [
    { x: boardWidth / 5 },
    { x: (2 * boardWidth) / 5 },
    { x: (3 * boardWidth) / 5 },
    { x: (4 * boardWidth) / 5 }
];

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Initialize bug position to the middle wire
    bugX = wires[Math.floor(wires.length / 2)].x;

    // Draw initial state
    draw();

    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowRight":
                moveBug(1); // Move the bug to the right
                break;
            case "ArrowLeft":
                moveBug(-1); // Move the bug to the left
                break;
        }
    });
}

function moveBug(direction) {
    // Determine the current wire index
    let wireIndex = wires.findIndex(wire => Math.abs(bugX - wire.x) < 3);

    // Move the bug to the next or previous wire
    wireIndex += direction;
    wireIndex = Math.max(0, Math.min(wires.length - 1, wireIndex)); // Ensure it stays within bounds

    // Update bug position based on the selected wire
    bugX = wires[wireIndex].x;

    // Redraw the canvas
    draw();
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);

    // Draw wires
    context.fillStyle = "#000";
    for (let wire of wires) {
        context.fillRect(wire.x - 1.5, 0, 3, board.height);
    }

    // Draw bug
    context.fillStyle = "green";
    context.fillRect(bugX - (bugWidth / 2), bugY - (bugHeight / 2), bugWidth, bugHeight);
}
