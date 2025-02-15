document.querySelector(".play-btn").addEventListener("click", () => {
    location.reload(); // Restarts the game
});

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Retrieve high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `HS: ${highScore}`;

// Function to change food position
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    
    // Ensure food does not spawn inside the snake
    for (let part of snakeBody) {
        if (part[0] === foodX && part[1] === foodY) {
            return changeFoodPosition();
        }
    }
};

// Function to handle game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to restart.");
    location.reload();
};

// Function to change direction
const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Main game function
const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Check if snake eats food
    // Check if snake eats food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([snakeX, snakeY]); // Add the last known position of the head
        score++;

        highScore = Math.max(score, highScore);
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Move snake body correctly
    if (snakeBody.length) {
        snakeBody.unshift([snakeX, snakeY]); // Insert current head position at the start
        snakeBody.pop(); // Remove the last element to maintain length
    }

    // Move snake head
    snakeX += velocityX;
    snakeY += velocityY;


    // Check for collision with walls
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // Draw snake body first
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="snake-body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        // Check for self-collision
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            gameOver = true;
        }
    }

    // Draw the snake head separately
    htmlMarkup += `<div class="snake-head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;

    playBoard.innerHTML = htmlMarkup;
};



// Initialize game
changeFoodPosition();
setIntervalId = setInterval(initGame, 128);
document.addEventListener("keydown", changeDirection);
