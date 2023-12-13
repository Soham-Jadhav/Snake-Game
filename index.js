// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Variables & constants for the game
const gridSize = 20;
let snake = [
    {
        x: 10,
        y: 10
    }
];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

// Draw map, snake & food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = createGameElement('div', 'snake');

        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create snake or food cube (div)
function createGameElement(htmlTag, className) {
    const element = document.createElement(htmlTag);
    element.className = className;

    return element;
}

// Set the position of the snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food particle
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);

        board.appendChild(foodElement)
    }
}

// Generate food
function generateFood() {
    const x = 1 + Math.floor(Math.random() * gridSize);
    const y = 1 + Math.floor(Math.random() * gridSize);

    return { x, y };
}

// Move the snake
function move() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y--;

            break;

        case 'down':
            head.y++;

            break;

        case 'left':
            head.x--;

            break;

        case 'right':
            head.x++;

            break;

        default:
            break;
    }

    snake.unshift(head);

    if (
        head.x === food.x &&
        head.y === food.y
    ) {
        food = generateFood();
        increaseSpeed();

        // Clear past interval
        clearInterval(gameInterval);

        gameInterval = setInterval(() => {
            move();
            checkCollusion();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }
}

// Function to start the game
function startGame() {
    // Keep track of a running game
    gameStarted = true;

    instructionText.style.display = 'none';
    logo.style.display = 'none';

    gameInterval = setInterval(() => {
        move();
        checkCollusion();
        draw();
    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    if (!gameStarted &&
        (
            event.code === 'Space' ||
            event.key === ' '
        )
    ) {
        startGame();
    }
    else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';

                break;

            case 'ArrowDown':
                direction = 'down';

                break;

            case 'ArrowLeft':
                direction = 'left';

                break;

            case 'ArrowRight':
                direction = 'right';

                break;

            case 'w':
                direction = 'up';

                break;

            case 's':
                direction = 'down';

                break;

            case 'a':
                direction = 'left';

                break;

            case 'd':
                direction = 'right';

                break;

            default:
                break;
        }
    }
}

// Event listener (keydown)
document.addEventListener('keydown', (event) => {
    handleKeyPress(event);
});

// Increase the speed of the game
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

// Check for snake collusion
function checkCollusion() {
    const head = snake[0];

    if (
        head.x < 1 ||
        head.x > gridSize ||
        head.y < 1 ||
        head.y > gridSize
    ) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            resetGame();
            break;
        }
    }
}

// Reset the game
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [
        {
            x: 10,
            y: 10
        }
    ];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

// Update the score
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Stop the game on collusion
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

// Update the high score
function updateHighScore() {
    const currentScore = snake.length - 1;

    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }

    highScoreText.style.display = 'block';
}
