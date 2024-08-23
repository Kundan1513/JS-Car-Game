const gameArea = document.getElementById('gameArea');
const car = document.getElementById('car');
const scoreDisplay = document.getElementById('score');
const carSelection = document.getElementById('carSelection');
const selectableCars = document.querySelectorAll('.selectable-car');
const startGameButton = document.getElementById('startGame');

let carPosition = { left: 175, top: 500 }; // Initial position (left, top)
let obstacles = [];
let gameSpeed = 5;
let obstacleFrequency = 2000; // Every 2 seconds
let score = 0;
let gameInterval;
let obstacleInterval;
let selectedCar = 'images/car1.png'; // Default car

// Handle car selection
selectableCars.forEach(carElement => {
    carElement.addEventListener('click', () => {
        selectableCars.forEach(c => c.classList.remove('selected'));
        carElement.classList.add('selected');
        selectedCar = carElement.getAttribute('data-car');
        console.log("Selected car path:", selectedCar); // Debugging
    });
});

// Start game with selected car
startGameButton.addEventListener('click', () => {
    console.log("Setting car image source to:", selectedCar);
    car.src = selectedCar;

    car.onload = () => {
        console.log("Car image loaded successfully.");
        carSelection.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    };

    car.onerror = () => {
        console.error("Failed to load car image:", selectedCar);
        alert("Error loading car image. Please ensure the image file is correct.");
    };
});

document.addEventListener('keydown', function(e) {
    const step = 50; // Amount to move per key press
    if (e.key === 'ArrowLeft' && carPosition.left > 0) {
        carPosition.left -= step;
    } else if (e.key === 'ArrowRight' && carPosition.left < 350) {
        carPosition.left += step;
    } else if (e.key === 'ArrowUp' && carPosition.top > 0) {
        carPosition.top -= step;
    } else if (e.key === 'ArrowDown' && carPosition.top < 550) {
        carPosition.top += step;
    }
    car.style.left = carPosition.left + 'px';
    car.style.top = carPosition.top + 'px';
});

function createObstacle() {
    const obstacle = document.createElement('img');
    obstacle.src = 'images/obstacle.png'; // Path to the obstacle image
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.floor(Math.random() * 4) * 100 + 'px';
    obstacle.style.top = '0px'; // Start obstacles at the top
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
        obstacle.style.top = (obstacleTop + gameSpeed) + 'px';

        if (obstacleTop > 600) {
            gameArea.removeChild(obstacle);
            obstacles.splice(index, 1);
            score++; // Increase score when an obstacle goes off-screen
            updateScore();
        }

        if (checkCollision(car, obstacle)) {
            endGame();
        }
    });
}

function checkCollision(car, obstacle) {
    const carRect = car.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        carRect.top > obstacleRect.bottom ||
        carRect.bottom < obstacleRect.top ||
        carRect.right < obstacleRect.left ||
        carRect.left > obstacleRect.right
    );
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function gameLoop() {
    moveObstacles();
    gameInterval = requestAnimationFrame(gameLoop);
}

function startGame() {
    score = 0;
    updateScore();
    obstacleInterval = setInterval(createObstacle, obstacleFrequency);
    gameLoop();
}

function endGame() {
    alert("Game Over! Your score: " + score);
    cancelAnimationFrame(gameInterval);
    clearInterval(obstacleInterval);
    obstacles.forEach(obstacle => gameArea.removeChild(obstacle));
    obstacles = [];
    carSelection.style.display = 'block';
    gameArea.style.display = 'none';
}
