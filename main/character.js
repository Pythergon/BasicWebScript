const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Let's render it our way - Bottom Right and World Coords

function mapCanvasToWorldX(x){
    return x/10;
}

class Game {
    constructor(drawCanvas, player, background) {
        this.drawCanvas = drawCanvas;
        this.background = background;
        this.objects = [];
        this.player = player;
        this.running = true;
    }

    handleInput() {
        // Check for jumping. Spacebar is ' '
        if (keyState[' '] && !this.player.isJumping) {
            this.player.isJumping = true;
            this.player.playerYVelocity = this.player.jumpStrength;
            this.player.airborneXVelocity = this.player.playerXVelocity;
        } else if (keyState['d']) { // Update the X velocity change
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

    update(deltaTime) {
        this.player.update(deltaTime);
    }

}

class player {
    constructor(worldX, worldY) {
        // world coords range (X:0-80, Y:0-60)
        this.worldX = worldX;
        this.worldY = worldY;
        // draw necessities
        this.width = 100;
        this.height = 100;
        this.worldW = 10;
        this.worldH = 10;
        // canvas coords range (X:0-800, Y:600-0)
        this.canvasX = worldX * 10;
        this.canvasY = (600 - worldY * 10) - this.height; // -height needed because it renders from the top of the square
        // velocities
        this.playerXVelocity = 0;
        this.playerYVelocity = 0;
        // jumping?... physics?!
        this.isJumping = false; // Tells if character is airborne
        this.jumpStrength = 3.5;
        this.gravity = 0.2;
        this.airborneXVelocity = 0;
        // Border Detection
        this.touching = '';
    }

    update(deltaTime) {
        // Y velocity and Y position updates
        this.playerYVelocity -= this.gravity;
        this.worldY += this.playerYVelocity;

        // Moving Stufffff (Y-Axis)
        if (this.worldY < 0) {
            this.isJumping = false;
            this.playerYVelocity = 0;
            this.worldY = 0;
        }

        // Player movement (X-Axis)
        let newWorldX;

        if (this.isJumping) {
            newWorldX = this.worldX + this.airborneXVelocity;
        } else {
            newWorldX = this.worldX + this.playerXVelocity;
        }

        // Border Detection (X-Axis)
        const rightBorder = 60 + mapCanvasToWorldX(this.width);
        const leftBorder = 0;

        if (newWorldX > rightBorder) {
            this.worldX = rightBorder; // Snap player to the wall.
            this.airborneXVelocity = -this.airborneXVelocity; // Reverse velocity.
            this.playerXVelocity = -this.playerXVelocity;
        } else if (newWorldX < leftBorder) {
            this.worldX = leftBorder; // Snap player to the wall.
            this.airborneXVelocity = -this.airborneXVelocity; // Reverse velocity.
            this.playerXVelocity = -this.playerXVelocity;
        } else {
            this.worldX = newWorldX;
        }

        this.canvasX = this.worldX * 10;
        this.canvasY = (600 - this.worldY * 10) - this.height;

    }



    // We'll see if we need this later
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
var myPlayer = new player(10, 0);
myPlayer.draw(ctx);
var game = new Game(ctx, myPlayer, img);

// Let's be completly honest - I stole this from stack overflow and I barely understand how it works HAHA
let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    game.handleInput();
    game.update(deltaTime);
    game.render();

    // Re-queue the game loop
    requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);
