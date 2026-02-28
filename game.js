const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameRunning = false;
let musicStarted = false;

// Player settings
let player = {
    x: 200,
    y: canvas.height / 2,
    size: 40,
    yVel: 0,
    gravity: 0.6,
    jumpStrength: -12,
    mode: "cube"
};

let scrollSpeed = 6; // normal GD speed
let blocks = [];
let spikes = [];
let portals = [];

// Reset player to start
function resetPlayer() {
    player.x = 200;
    player.y = canvas.height / 2;
    player.yVel = 0;
}

// Jump function
function jump() {
    if (!musicStarted) {
        // startMusic();  // (placeholder for later)
        musicStarted = true;
        gameRunning = true;
    }
    player.yVel = player.jumpStrength;
}

// Update player physics
function updatePlayer() {
    player.yVel += player.gravity;
    player.y += player.yVel;

    // Floor collision
    if (player.y + player.size > canvas.height) {
        player.y = canvas.height - player.size;
        player.yVel = 0;
    }
}

// Draw player cube
function drawPlayer() {
    ctx.fillStyle = "#00eaff";
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 20;
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.shadowBlur = 0;
}

// Spike collision detection
function checkCollisions() {
    for (let s of spikes) {
        if (
            player.x < s.x + s.size &&
            player.x + player.size > s.x &&
            player.y < s.y + s.size &&
            player.y + player.size > s.y
        ) {
            resetPlayer();
        }
    }
}

// Background animation
let bgShift = 0;

function drawBackground() {
    bgShift += 0.5;

    // Dark neon gradient
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#000010");
    gradient.addColorStop(1, "#000020");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Neon circles
    ctx.fillStyle = "rgba(0, 200, 255, 0.15)";
    for (let i = 0; i < 10; i++) {
        let x = (i * 300 + bgShift * (i % 3 + 1)) % (canvas.width + 300) - 300;
        let y = (i * 150) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 80, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    if (gameRunning) {
        updatePlayer();
        checkCollisions();
    }

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Input listener
window.addEventListener("mousedown", jump);
window.addEventListener("touchstart", jump);
