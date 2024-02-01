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

// wires
let wires = [
    { x: boardWidth / 5 },
    { x: (2 * boardWidth) / 5 },
    { x: (3 * boardWidth) / 5 },
    { x: (4 * boardWidth) / 5 }
];

// obstacles
let obstacleWidth = 30;
let obstacleHeight = 30;
let obstacleSpeed = 3;
let obstacles = [];

// Jumping variables
let isJumping = false;
let jumpHeight = 100;
let jumpStartY;
let jumpZoom = 1.5;
let isJumpingOverObstacle = false;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Initialize bug position to the middle wire
    bugX = wires[Math.floor(wires.length / 2)].x;

    // New obstacle 
    setInterval(function () {
        obstacles.push(createNewObstacle());
    }, 1000);

    // Draw initial state
    update();

    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowRight":
                moveBug(1); // Move the bug to the right
                break;
            case "ArrowLeft":
                moveBug(-1); // Move the bug to the left
                break;
            case "ArrowUp":
                if (!isJumping) {
                    startJump();
                }
                break;
        }
    });
}

function startJump(){
    isJumping = true;
    isJumpingOverObstacle = false;
    jumpStartY = bugY;
    jump();
}

function jump(){
    if (isJumping){
        bugY -= 3; // Adjust the jump speed
        // bugHeight *= jumpZoom; // Zoom effect
        if (bugY <= jumpStartY - jumpHeight) {
            isJumping = false;
        }
        if (!isJumping && bugY <= jumpStartY - jumpHeight + 5) {
            isJumpingOverObstacle = true;
        }
        requestAnimationFrame(jump);
    } else {
        fall();
    }
}

function fall() {
    if (bugY < (6 * boardHeight) / 8) {
        bugY += 5; // Adjust the fall speed
        bugHeight /= jumpZoom;

        if (bugY >= (6 * boardHeight) / 8) {
            isJumpingOverObstacle = false;
        }
        requestAnimationFrame(fall);
    } else {
        bugY = (6 * boardHeight) / 8;
        bugHeight = 38;
    }
}

function moveBug(direction) {
    // Determine the current wire index
    let wireIndex = wires.findIndex(wire => Math.abs(bugX - wire.x) < 3);

    // Move the bug to the next or previous wire
    wireIndex += direction;
    wireIndex = Math.max(0, Math.min(wires.length - 1, wireIndex)); // Ensure it stays within bounds

    // Update bug position based on the selected wire
    bugX = wires[wireIndex].x;
}

// function to  create a new obstacle 
function createNewObstacle() {
    let randomWireIndex = Math.floor(Math.random() * wires.length);
    let obstacleX = wires[randomWireIndex].x;
    let obstacleY = 0 - obstacleHeight; 
    return {x: obstacleX, y: obstacleY}
}

// Function to check collision between two rectangles
function isCollision(rect1, rect2) {
    return (
        rect1.x - rect1.width / 2 < rect2.x + rect2.width / 2 &&
        rect1.x + rect1.width / 2 > rect2.x - rect2.width / 2 &&
        rect1.y - rect1.height / 2 < rect2.y + rect2.height / 2 &&
        rect1.y + rect1.height / 2 > rect2.y - rect2.height / 2
    );
}

// function to update obstacle position
function updateObstacles() {
    for (let obstacle of obstacles) {
        obstacle.y += obstacleSpeed;
        // check collision
        if (!isJumpingOverObstacle &&
            isCollision(
                { x: bugX, y: bugY, width: bugWidth, height: bugHeight },
                { x: obstacle.x, y: obstacle.y, width: obstacleWidth, height: obstacleHeight }
            )
        ) {
            // Handle collision (e.g., game over logic)
            alert("Game Over!");
            initializeGame(); // Reset the game or perform other actions
        }

        if (obstacle.y > boardHeight) {
            obstacles.splice(obstacles.indexOf(obstacle), 1);
        }
    }
}

function initializeGame() {
    // Clear obstacles
    obstacles = [];

    // Reset bug position to the middle wire
    bugX = wires[Math.floor(wires.length / 2)].x;
    bugY = (6 * boardHeight) / 8;

    // Reset any other game-related variables or flags
    isJumping = false;
    isJumpingOverObstacle = false;
}



// function to draw obstacles
function drawObstacles() {
    context.fillStyle = "red";
    for (let obstacle of obstacles) {
        context.fillRect(
            obstacle.x - obstacleWidth / 2,
            obstacle.y - obstacleHeight / 2,
            obstacleWidth,
            obstacleHeight
        )
    }
}

function update() {
    context.clearRect(0, 0, board.width, board.height);

    // Draw wires
    context.fillStyle = "#000";
    for (let wire of wires) {
        context.fillRect(wire.x - 1.5, 0, 3, board.height);
    }

    updateObstacles();
    drawObstacles();

    // Draw bug
    context.fillStyle = "green";
    context.fillRect(bugX - (bugWidth / 2), bugY - (bugHeight / 2), bugWidth, bugHeight);

    requestAnimationFrame(update);

}
