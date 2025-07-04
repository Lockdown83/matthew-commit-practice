// Game constants
const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 620;
const CELL_SIZE = 20;
const GRID_WIDTH = CANVAS_WIDTH / CELL_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / CELL_SIZE;

// Game state
let gameState = {
    score: 0,
    lives: 3,
    gameOver: false,
    dots: [],
    powerPellets: [],
    ghosts: [],
    pacman: null,
    keys: {}
};

// Canvas setup
let canvas, ctx;

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Start the game
    initGame();
    gameLoop();
});

// Game map (0 = wall, 1 = dot, 2 = power pellet, 3 = empty)
const gameMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
    [3,3,3,3,3,3,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,3,3,3,3,3,3],
    [0,0,0,0,0,0,1,0,0,3,0,3,3,3,3,3,3,0,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,3,0,3,3,3,3,3,3,0,3,0,0,1,0,0,0,0,0,0],
    [3,3,3,3,3,3,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,3,3,3,3,3,3],
    [0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,2,1,1,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,0,0,1,1,2,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Pacman class
class Pacman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = 0; // 0: right, 1: down, 2: left, 3: up
        this.nextDirection = 0;
        this.speed = 0.15;
        this.mouthAngle = 0;
        this.mouthSpeed = 0.3;
        this.radius = CELL_SIZE / 2 - 2;
    }

    update() {
        // Handle direction changes
        if (this.canMove(this.nextDirection)) {
            this.direction = this.nextDirection;
        }

        // Move Pacman
        if (this.canMove(this.direction)) {
            switch (this.direction) {
                case 0: this.x += this.speed; break; // Right
                case 1: this.y += this.speed; break; // Down
                case 2: this.x -= this.speed; break; // Left
                case 3: this.y -= this.speed; break; // Up
            }
        }

        // Wrap around tunnel
        if (this.x < 0) this.x = GRID_WIDTH;
        if (this.x > GRID_WIDTH) this.x = 0;

        // Update mouth animation
        this.mouthAngle += this.mouthSpeed;
        if (this.mouthAngle > 0.5) {
            this.mouthAngle = 0;
        }

        // Check for dot collection
        this.checkDotCollision();
    }

    canMove(direction) {
        let nextX = this.x;
        let nextY = this.y;

        switch (direction) {
            case 0: nextX += this.speed; break; // Right
            case 1: nextY += this.speed; break; // Down
            case 2: nextX -= this.speed; break; // Left
            case 3: nextY -= this.speed; break; // Up
        }

        const gridX = Math.floor(nextX);
        const gridY = Math.floor(nextY);

        if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) {
            return false;
        }

        return gameMap[gridY][gridX] !== 0;
    }

    checkDotCollision() {
        const gridX = Math.floor(this.x);
        const gridY = Math.floor(this.y);

        if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT) {
            if (gameMap[gridY][gridX] === 1) {
                gameMap[gridY][gridX] = 3; // Remove dot
                gameState.score += 10;
                updateUI();
            } else if (gameMap[gridY][gridX] === 2) {
                gameMap[gridY][gridX] = 3; // Remove power pellet
                gameState.score += 50;
                // Make ghosts vulnerable
                gameState.ghosts.forEach(ghost => ghost.makeVulnerable());
                updateUI();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x * CELL_SIZE + CELL_SIZE / 2, this.y * CELL_SIZE + CELL_SIZE / 2);
        
        // Rotate based on direction
        const rotations = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
        ctx.rotate(rotations[this.direction]);

        // Draw Pacman
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, this.mouthAngle, 2 * Math.PI - this.mouthAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = '#ffff00';
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }
}

// Ghost class
class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = Math.floor(Math.random() * 4);
        this.speed = 0.1;
        this.vulnerable = false;
        this.vulnerableTimer = 0;
        this.radius = CELL_SIZE / 2 - 2;
    }

    update() {
        // Change direction randomly
        if (Math.random() < 0.02) {
            this.direction = Math.floor(Math.random() * 4);
        }

        // Try to move in current direction
        if (this.canMove(this.direction)) {
            switch (this.direction) {
                case 0: this.x += this.speed; break; // Right
                case 1: this.y += this.speed; break; // Down
                case 2: this.x -= this.speed; break; // Left
                case 3: this.y -= this.speed; break; // Up
            }
        } else {
            // Try a random direction
            this.direction = Math.floor(Math.random() * 4);
        }

        // Wrap around tunnel
        if (this.x < 0) this.x = GRID_WIDTH;
        if (this.x > GRID_WIDTH) this.x = 0;

        // Update vulnerable timer
        if (this.vulnerable) {
            this.vulnerableTimer--;
            if (this.vulnerableTimer <= 0) {
                this.vulnerable = false;
            }
        }

        // Check collision with Pacman
        this.checkPacmanCollision();
    }

    canMove(direction) {
        let nextX = this.x;
        let nextY = this.y;

        switch (direction) {
            case 0: nextX += this.speed; break; // Right
            case 1: nextY += this.speed; break; // Down
            case 2: nextX -= this.speed; break; // Left
            case 3: nextY -= this.speed; break; // Up
        }

        const gridX = Math.floor(nextX);
        const gridY = Math.floor(nextY);

        if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) {
            return false;
        }

        return gameMap[gridY][gridX] !== 0;
    }

    makeVulnerable() {
        this.vulnerable = true;
        this.vulnerableTimer = 300; // 5 seconds at 60fps
    }

    checkPacmanCollision() {
        const distance = Math.sqrt(
            Math.pow(this.x - gameState.pacman.x, 2) + 
            Math.pow(this.y - gameState.pacman.y, 2)
        );

        if (distance < 1) {
            if (this.vulnerable) {
                // Ghost eaten
                this.x = 14;
                this.y = 11;
                this.vulnerable = false;
                gameState.score += 200;
                updateUI();
            } else {
                // Pacman loses life
                gameState.lives--;
                updateUI();
                
                if (gameState.lives <= 0) {
                    gameOver();
                } else {
                    resetPositions();
                }
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x * CELL_SIZE + CELL_SIZE / 2, this.y * CELL_SIZE + CELL_SIZE / 2);

        // Draw ghost body
        ctx.beginPath();
        ctx.arc(0, -this.radius / 2, this.radius, 0, Math.PI, true);
        ctx.rect(-this.radius, -this.radius / 2, this.radius * 2, this.radius);
        ctx.fillStyle = this.vulnerable ? '#0000ff' : this.color;
        ctx.fill();
        ctx.closePath();

        // Draw eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-this.radius / 3, -this.radius / 3, this.radius / 4, 0, 2 * Math.PI);
        ctx.arc(this.radius / 3, -this.radius / 3, this.radius / 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-this.radius / 3, -this.radius / 3, this.radius / 8, 0, 2 * Math.PI);
        ctx.arc(this.radius / 3, -this.radius / 3, this.radius / 8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }
}

// Initialize game
function initGame() {
    // Create Pacman
    gameState.pacman = new Pacman(14, 23);

    // Create ghosts
    gameState.ghosts = [
        new Ghost(13, 11, '#ff0000'),   // Red
        new Ghost(14, 11, '#ffb8ff'),   // Pink
        new Ghost(15, 11, '#00ffff'),   // Cyan
        new Ghost(16, 11, '#ffb852')    // Orange
    ];

    // Set up keyboard controls
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key] = true;
        
        switch (e.key) {
            case 'ArrowRight':
            case 'd':
            case 'D':
                gameState.pacman.nextDirection = 0;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                gameState.pacman.nextDirection = 1;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                gameState.pacman.nextDirection = 2;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                gameState.pacman.nextDirection = 3;
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;
    });
}

// Game loop
function gameLoop() {
    if (gameState.gameOver) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw maze
    drawMaze();

    // Update and draw game objects
    gameState.pacman.update();
    gameState.pacman.draw();

    gameState.ghosts.forEach(ghost => {
        ghost.update();
        ghost.draw();
    });

    requestAnimationFrame(gameLoop);
}

// Draw maze
function drawMaze() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const cell = gameMap[y][x];
            const pixelX = x * CELL_SIZE;
            const pixelY = y * CELL_SIZE;

            if (cell === 0) {
                // Wall
                ctx.fillStyle = '#2121ff';
                ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
            } else if (cell === 1) {
                // Dot
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(pixelX + CELL_SIZE / 2, pixelY + CELL_SIZE / 2, 2, 0, 2 * Math.PI);
                ctx.fill();
            } else if (cell === 2) {
                // Power pellet
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(pixelX + CELL_SIZE / 2, pixelY + CELL_SIZE / 2, 6, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
}

// Game over
function gameOver() {
    gameState.gameOver = true;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOver').style.display = 'block';
}

// Reset positions
function resetPositions() {
    gameState.pacman.x = 14;
    gameState.pacman.y = 23;
    gameState.pacman.direction = 0;
    gameState.pacman.nextDirection = 0;

    gameState.ghosts.forEach((ghost, index) => {
        ghost.x = 13 + index;
        ghost.y = 11;
        ghost.vulnerable = false;
    });
}

// Restart game
function restartGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.gameOver = false;
    
    // Reset maze
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (gameMap[y][x] === 3) {
                gameMap[y][x] = 1; // Restore dots
            }
        }
    }
    
    // Restore power pellets
    gameMap[3][1] = 2;
    gameMap[3][26] = 2;
    gameMap[23][1] = 2;
    gameMap[23][26] = 2;
    
    resetPositions();
    updateUI();
    document.getElementById('gameOver').style.display = 'none';
    
    // Restart game loop
    gameLoop();
}

// Game will start automatically when DOM is loaded 