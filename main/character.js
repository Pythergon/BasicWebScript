const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Let's render it our way - Bottom Right and World Coords

function canvasToWorldCoordinatesForXAxis(x){
    return x/10;
}

class Game {
    constructor(drawCanvas, border) {
        this.drawCanvas = drawCanvas;
        // Border - Takes in array of two numbers (world coords)
        this.border = border;
        // Get corners
        this.bottomLeft = [0, 0]; // Origin
        this.topRight = border; // X:MAX Y:MAX
        this.bottomRight = [border[0], 0]; // X:MAX Y:0
        this.topLeft = [0, border[1]]; // X:0 Y:MAX

        this.objects = [];
        this.player = undefined;
        this.running = true;
    }

    render() {
        this.drawCanvas.clearRect(0, 0, canvas.width, canvas.height);
    }

    update(deltaTime) {
        for (let object of this.objects) {
            console.log(object);
        }
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
        if (this.isJumping) {
            this.worldX += this.airborneXVelocity;
        } else {
            this.worldX += this.playerXVelocity;
        }

        // Border Detection (X-Axis)
        if (this.worldX > 60 + canvasToWorldCoordinatesForXAxis(this.width) || this.worldX <= 0) {
            // Add bounce to walls!
            this.airborneXVelocity = -this.airborneXVelocity;
            if (this.worldX > 70){
                this.worldX = 70;
            } else if (this.worldX <= 0){
                this.worldX = 0;
            }
        }

        // Update positions into Canvas coords so I can draw
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

function handleInput(player) {
    // Check for jumping. Spacebar is ' '
    if (keyState[' '] && !player.isJumping) {
        player.isJumping = true;
        player.playerYVelocity = player.jumpStrength;
        player.airborneXVelocity = player.playerXVelocity;
    } else if (keyState['d']) { // Update the X velocity change
        player.playerXVelocity = -1;
    } else if (keyState['f']) {
        player.playerXVelocity = 1;
    } else {
        player.playerXVelocity = 0;
    }
}

var myPlayer = new player(10, 0);
myPlayer.draw(ctx);
var game = new Game(ctx, [60, 80]);

// Let's be completly honest - I stole this from stack overflow and I barely understand how it works HAHA
let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    handleInput(myPlayer);

    game.update(deltaTime);
    myPlayer.update(deltaTime);

    game.render();
    myPlayer.draw(game.drawCanvas);

    // Re-queue the game loop
    requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);
