const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function mapCanvasToWorldX(x) {
    return x / 10;
}

class Game {
    constructor(drawCanvas, player, background) {
        this.drawCanvas = drawCanvas;
        this.background = background;
        this.platforms = [];
        this.player = player;
        this.running = true;
    }

    handleInput() {
        if (keyState[' '] && !this.player.isJumping) {
            this.player.isJumping = true;
            this.player.playerYVelocity = this.player.jumpStrength;
            this.player.airborneXVelocity = this.player.playerXVelocity;
        } else if (keyState['d']) {
            this.player.playerXVelocity = -1;
        } else if (keyState['f']) {
            this.player.playerXVelocity = 1;
        } else {
            this.player.playerXVelocity = 0;
        }
    }

    render() {
        this.drawCanvas.clearRect(0, 0, canvas.width, canvas.height);
        this.drawCanvas.drawImage(this.background, 0, 0);
        this.player.draw(this.drawCanvas);
    }

    resolveCollisions() {
        let newWorldX;
        if (this.player.isJumping) {
            newWorldX = this.player.worldX + this.player.airborneXVelocity;
        } else {
            newWorldX = this.player.worldX + this.player.playerXVelocity;
        }

        // Border Detection
        const rightBorder = 60 + mapCanvasToWorldX(this.player.width);
        const leftBorder = 0;
        if (newWorldX > rightBorder) {
            this.player.worldX = rightBorder;
            this.player.airborneXVelocity = -this.player.airborneXVelocity;
            this.player.playerXVelocity = -this.player.playerXVelocity;
        } else if (newWorldX < leftBorder) {
            this.player.worldX = leftBorder;
            this.player.airborneXVelocity = -this.player.airborneXVelocity;
            this.player.playerXVelocity = -this.player.playerXVelocity;
        } else {
            this.player.worldX = newWorldX;
        }
    }

    update() {
        // Player update logic moved here
        this.player.playerYVelocity -= this.player.gravity;
        this.player.worldY += this.player.playerYVelocity;

        if (this.player.worldY < 0) {
            this.player.isJumping = false;
            this.player.playerYVelocity = 0;
            this.player.worldY = 0;
        }

        this.resolveCollisions();
        this.player.canvasX = this.player.worldX * 10;
        this.player.canvasY = (600 - this.player.worldY * 10) - this.player.height;
    }
}

class platform {
    constructor(pixel1X, pixel1Y, pixel2X, pixel2Y) {
        this.pixel1X = pixel1X;
        this.pixel1Y = pixel1Y;
        this.pixel2X = pixel2X;
        this.pixel2Y = pixel2Y;
        this.height = pixel2Y - pixel1Y;
        this.width = pixel2X - pixel1X;
        this.world1X = pixel1X / 10;
        this.world1Y = (600 - pixel1Y) / 10;
        this.world2X = pixel2X / 10;
        this.world2Y = (600 - pixel2Y) / 10;
    }

    DEBUG_ONLY_draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pixel1X, this.pixel1Y, this.width, this.height);
    }
}

class player {
    constructor(worldX, worldY) {
        this.worldX = worldX;
        this.worldY = worldY;
        this.width = 100;
        this.height = 100;
        this.worldW = 10;
        this.worldH = 10;
        this.canvasX = worldX * 10;
        this.canvasY = (600 - worldY * 10) - this.height;
        this.playerXVelocity = 0;
        this.playerYVelocity = 0;
        this.isJumping = false;
        this.jumpStrength = 3.5;
        this.gravity = 0.2;
        this.airborneXVelocity = 0;
        this.isGrounded = false;
    }

    // The update method has been removed from the player class
    draw(drawCanvas) {
        drawCanvas.fillStyle = 'green';
        drawCanvas.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    }
}

const keyState = {};

document.addEventListener('keydown', (event) => {
    keyState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyState[event.key] = false;
});

const img = new Image();
img.src = 'platform.png';
var myPlatform = new platform(500, 500, 700, 550);
var myPlayer = new player(10, 0);
myPlayer.draw(ctx);
var game = new Game(ctx, myPlayer, img);
game.platforms.push(myPlatform);

let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    game.handleInput();
    game.update(); // deltaTime is no longer passed as it's not used in this version
    game.render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);