document.addEventListener("DOMContentLoaded", function () {
    // board
    let board;
    let boardWidth = 1024; // canvas width
    let boardHeight = 768; // canvas height
    let context;

    // bug
    let bugWidth = 54; // bug width
    let bugHeight = 58; // bug height
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
    let obstacleWidth = 98; // width of obstacles
    let obstacleHeight = 58; // height of obstacles
    let obstacleSpeed = 3; // movement of obstacle
    let obstacles = []; 

    // Jumping variables
    let isJumping = false; // initially the bug is not jumping 
    let jumpHeight = 125; // when the arrowup key is pressed the bug jumps to this height
    let jumpStartY;
    let jumpZoom = 1.5; 
    let isJumpingOverObstacle = false; // initially the bug is not jumping over obstacle

    // timer and score
    let startTime;
    let elapsedTime = 0;
    let score = 1;

    let speed =1;

    let obstacleImage = new Image();
    obstacleImage.src = './assets/crow.png';

    let bugImage = new Image();
    bugImage.src = './assets/bugs.png';

    let distanceTraveled = 0;

    let poleWidth = 40; // Adjust the pole width as needed
    let poleHeight = 10; // Extend the pole through all wires

    let poleY = -poleHeight;
    let poleSpeed = 3;

    let logImage = new Image();
    logImage.src = './assets/log.png'

    let wireImage = new Image();
    wireImage.src = './assets/wire.png'

    let gameOverBool = false;

    let highScore = localStorage.getItem("highScore") || 0;

    let restartButton;

    let obstacleInterval;

    window.onload = function () {
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d");

        // Initialize bug position to the middle wire
        bugX = wires[Math.floor(wires.length / 2)].x;

        // Draw initial state
        startGame();


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

    
    restartButton = document.querySelector(".restart-button");
        
    restartButton.addEventListener("click", () => {
        startGame();
    });

    function startGame() {
        clearInterval(obstacleInterval)
        startTime = Date.now();
        initializeGame();
        obstacleInterval = setInterval(function () {
            obstacles.push(createNewObstacle());
        }, 1000);
        setInterval(updateTimerAndScore, 1000);
        update();        
    }

    function updateTimerAndScore() {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Update elapsed time in seconds
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
            // bugHeight = 38;

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
            if (score == 30) {
                speed = speed * 1.01;
            } else if (score == 50) {
                speed = speed * 1.02;
            }
            obstacle.y += speed*obstacleSpeed;
            distanceTraveled += Math.floor(speed*obstacleSpeed);

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
                    gameOver();
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
            context.drawImage(
                obstacleImage,
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
        startTime = Date.now();
        elapsedTime = 0;
        distanceTraveled = 0;
        speed = 1;
        obstacleSpeed = 3; // movement of obstacle
        // Reset bug position to the middle wire
        bugX = wires[Math.floor(wires.length / 2)].x;
        bugY = (6 * boardHeight) / 8;
        // Reset any other game-related variables or flags
        isJumping = false;
        isJumpingOverObstacle = false;
        gameOverBool = false;
    }

    function drawPole(){
        context.fillStyle= '#00F';
        context.drawImage(logImage, (boardWidth / 5)-20, poleY, poleWidth, 40)
        context.drawImage(logImage, (2*boardWidth / 5)-20, poleY, poleWidth, 40)
        context.drawImage(logImage, (3*boardWidth / 5)-20, poleY, poleWidth, 40)
        context.drawImage(logImage, (4*boardWidth / 5)-20, poleY, poleWidth, 40)
    }

    let scoreElement = document.getElementById("score");
    let timeElement = document.getElementById("time")
    let distanceElement = document.getElementById("distance");

    function gameOver() {
        // Display pop-up with current score and restart button

        gameOverBool = true;

        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, board.width, board.height);

        context.fillStyle = "#fff";
        context.font = "30px Courier";
        context.textAlign = "center";
        context.fillText("Game Over", board.width / 2, board.height / 3);

        context.font = "20px Courier";
        context.fillText("Your Score: " + score, board.width / 2, board.height / 2.3);
        if (score>highScore){
            highScore = score;
            localStorage.setItem("highscore", highScore);
        }
        context.font = "20px Courier";
        context.fillText("Highscore: " + highScore, board.width / 2, board.height / 2);

        restartButton.addEventListener("click", () => {
            startGame();
            gameOverBool = false;
            speed = 1;
        });
    }

    function update() {
        if (gameOverBool) {
            return;
        }

        context.clearRect(0, 0, board.width, board.height);

        // Draw wires
        context.fillStyle = "#000";
        for (let wire of wires) {
            context.drawImage(wireImage, wire.x - 1.5, 0, 5, board.height);
        }

        updateObstacles();
        drawObstacles();

        score =Math.floor(distanceTraveled/500);

        // Draw bug
        context.drawImage(bugImage, bugX - (bugWidth / 2), bugY - (bugHeight / 2), bugWidth, bugHeight);

        drawPole();
        poleY += speed*poleSpeed;

        if (poleY > 2000) {
            poleY = -poleHeight;
        }

        timeElement.textContent = `${elapsedTime}s`;
        scoreElement.textContent = score;
        distanceElement.textContent = `${Math.floor(distanceTraveled/5)} m`;
        
        requestAnimationFrame(update);
        
    }

})
