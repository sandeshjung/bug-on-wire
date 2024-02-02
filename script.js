// board
let board;
let boardWidth = 1024; // canvas width
let boardHeight = 768; // canvas height
let context;

// bug
let bugWidth = 64; // bug width
let bugHeight = 38; // bug height
let bugX; // position of bug in x-axis
let bugY = (6 * boardHeight) / 8; // fixed position of bug in y-axis

// wires
// list of wires position in x-axis
let wires = [
    { x: boardWidth / 5 }, // first wire position
    { x: (2 * boardWidth) / 5 }, // second wire position
    { x: (3 * boardWidth) / 5 }, // third wire position
    { x: (4 * boardWidth) / 5 } // fourth wire position
];

// obstacles
let obstacleWidth = 64; // width of obstacles
let obstacleHeight = 38; // height of obstacles
let obstacleSpeed = 3; // movement of obstacle
let obstacles = []; 

// Jumping variables
let isJumping = false; // initially the bug is not jumping 
let jumpHeight = 100; // when the arrowup key is pressed the bug jumps to this height
let jumpStartY;
let jumpZoom = 1.5; 
let isJumpingOverObstacle = false; // initially the bug is not jumping over obstacle

// timer and score
let startTime;
let elapsedTime = 0;
let score = 1;


let distanceTraveled = 0;
let poleWidth = boardWidth; // Adjust the pole width as needed
let poleHeight = 30; // Extend the pole through all wires

let speed =1;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Initialize bug position to the middle wire
    bugX = wires[Math.floor(wires.length / 2)].x;

    // New obstacle is created using setInterval for every x ms
    setInterval(function () {
        obstacles.push(createNewObstacle());
    }, 1000);

    // Draw initial state
    startGame();
    update();

    // keyboard functionalities
    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowRight":
                if (!isJumping){
                    moveBug(1); // Move the bug to the right
                }
                break;
            case "ArrowLeft":
                if (!isJumping){
                    moveBug(-1); // Move the bug to the left
                }
                break;
            case "ArrowUp":
                if (!isJumping) { // 
                    startJump();
                }
                break;
        }
    });
}


function startGame() {
    startTime = Date.now();
    initializeGame();
    setInterval(updateTimerAndScore, 1000);
}

function updateTimerAndScore() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Update elapsed time in seconds
    // Adjust score based on your game logic
    // You can add more sophisticated scoring mechanisms based on the game's requirements
}


function startJump(){
    isJumping = true; // assert the isJumping flag
    isJumpingOverObstacle = false; // initially the bug is not jumping over an obstacle
    jumpStartY = bugY; // jump starts from the y position of bug
    jump(); // call the jump function for junmping functionality
}

function jump(){
    if (isJumping){ // check if the isJumping flag is true 
        bugY -= 3; // Adjust the jump speed
        if (bugY <= jumpStartY - jumpHeight) { // check if the jumping distance is over or not 
            isJumping = false;// off the isJumping flag
        }
        requestAnimationFrame(jump); // jumping animation
    } else {
        // if isJumping is false then the bug needs to fall back to the wire
        fall();
    }
}

function fall() {
    if (bugY < (6 * boardHeight) / 8) { // check if the bug is in air or not ( the speed is decremented when in air)
        bugY += 5; // Adjust the fall speed
        if (bugY >= (6 * boardHeight) / 8) {  
            isJumpingOverObstacle = false;
        }
        requestAnimationFrame(fall);
    } else { // if the bug gets out of bound set it back to the wire
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


// Function to check collision between two rectangles
function isCollision(rect1, rect2) {
    return (
        rect1.x - rect1.width / 2 < rect2.x + rect2.width / 2 &&
        rect1.x + rect1.width / 2 > rect2.x - rect2.width / 2 &&
        rect1.y - rect1.height / 2 < rect2.y + rect2.height / 2 &&
        rect1.y + rect1.height / 2 > rect2.y - rect2.height / 2
        );
    }

// function to  create a new obstacle 
function createNewObstacle() {
    let randomWireIndex = Math.floor(Math.random() * wires.length);
    let obstacleX = wires[randomWireIndex].x;
    let obstacleY = obstacleHeight; 
    return {x: obstacleX, y: obstacleY}
}

// function to update obstacle position
function updateObstacles() {
    for (let obstacle of obstacles) {
        if (score == 10) {
            speed = speed * 1.01;
        } else if (score == 30) {
            speed = speed * 1.02;
        }
        obstacle.y += speed*obstacleSpeed;
        distanceTraveled += speed*obstacleSpeed;

        // check collision
        if (!isJumpingOverObstacle &&
            isCollision(
                { x: bugX, y: bugY, width: bugWidth, height: bugHeight },
                { x: obstacle.x, y: obstacle.y, width: obstacleWidth, height: obstacleHeight }
            )
        ) {
            // Handle collision (e.g., game over logic)
            if (isJumping && jumpStartY - obstacle.y > 0) {
                isJumpingOverObstacle = true;
                break;
            } else {
                alert("Game Over!");
                // alert(`Score: ${elapsedTime}`)
                initializeGame(); // Reset the game or perform other actions
            }
        }

        if (obstacle.y > boardHeight) {
            obstacles.splice(obstacles.indexOf(obstacle), 1);
        }
    }
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



function initializeGame() {
    // Clear obstacles
    obstacles = [];
    score = 1;
    elapsedTime = 0;
    distanceTraveled = 0;
    speed = 1;

    // Reset bug position to the middle wire
    bugX = wires[Math.floor(wires.length / 2)].x;
    bugY = (6 * boardHeight) / 8;

    // Reset any other game-related variables or flags
    isJumping = false;
    isJumpingOverObstacle = false;
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

    score =Math.floor(distanceTraveled/100);

    // Draw bug
    context.fillStyle = "green";
    context.fillRect(bugX - (bugWidth / 2), bugY - (bugHeight / 2), bugWidth, bugHeight);

    context.fillStyle = "#000";
    context.font = "20px Arial";
    context.fillText("Time: " + elapsedTime + "s", 10, 30);
    context.fillText("Score: " + score, 10, 60);
    context.fillText("Distance: " + distanceTraveled, 10, 90);

    requestAnimationFrame(update);

}
