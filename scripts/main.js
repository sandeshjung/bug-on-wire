import Bug from './bug.js';
import {boardHeight, boardWidth, wires, jumpHeight} from './constant.js';
import canvasSetup from './canvasSetup.js';
import Wire from './wire.js';

let board;
let context;

let bugX;
let wireIndex;
let bugY;

let isJumping = false;
let isJumpingOverObstacle = false;
let jumpStartY;

({ board, context } = canvasSetup(boardHeight, boardWidth));

let wire = new Wire(context,board);
bugX = wires[Math.floor(wires.length / 2)].x;
wireIndex = wires.findIndex(wire => Math.abs(bugX - wire.x) < 3);
let bug = new Bug(context, bugX, wireIndex);

window.onload = function () {
    update()
    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowRight":
                if (!isJumping){
                    bug.moveBug(1); // Move the bug to the right
                }
                break;
            case "ArrowLeft":
                if (!isJumping){
                    bug.moveBug(-1); // Move the bug to the left
                }
                break;
            case "ArrowUp":
                    bug.startJump();
                break;
        }
    });


}

function update() {
    context.clearRect(0, 0, board.width, board.height);
    requestAnimationFrame(update);

    wire.drawWires();
    bug.drawBug();

}