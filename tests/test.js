const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function worldVelocity(velocity, direction) {
    if (direction === 'x'){
        return velocity*10;
    } else if (direction === 'y'){
        return -velocity*10;
    }
}

function canvasCoordinate(coordinate, direction) {
    if (direction === 'x'){
        return coordinate/10
    } else if (direction === 'y'){
        alert(`Initial Val: ${coordinate} - New Val: ${((600 - coordinate))}`);
        return ((600 - coordinate))
    }
}

function worldCoordinate(coordinate, direction) {
    if (direction === 'x'){
        return coordinate*10
    } else if (direction === 'y'){
        return -1*((coordinate*10)-600)
    }
}

class Game{
    constructor(drawCanvas) {
        this.drawCanvas = drawCanvas;
        this.gridLines = [];
    }
}

class Rectangle{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.velocity = [0, 0];
        this.width = width;
        this.height = height;
    }

    update(input) {
        this.velocity[0] = 0;
        this.velocity[1] = 0;
        if (input === 'w') {
            this.velocity[1] = worldVelocity(1, 'y');
        } else if (input === 's') {
            this.velocity[1] = worldVelocity(-1, 'y');
        } else if (input === 'a') {
            this.velocity[0] = worldVelocity(-1, 'x');
        } else if (input === 'd') {
            this.velocity[0] = worldVelocity(1, 'x');
        }

        this.x += this.velocity[0]
        this.y += this.velocity[1]
        // console.log(`X-World: ${this.x/10}, Y-World: ${(600 - this.y)/10}`);
        // console.log(`X-Velocity: ${this.velocity[0]}, Y-Velocity: ${this.velocity[1]}`);
    }

    draw(drawCanvas) {
        drawCanvas.fillStyle = 'blue';
        drawCanvas.fillRect(this.x, this.y, this.width, this.height);
        drawCanvas.fillStyle = 'black';
    }
}

class line{
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    draw(drawCanvas) {
        drawCanvas.beginPath();
        drawCanvas.moveTo(this.startX, this.startY);
        drawCanvas.lineTo(this.endX, this.endY);
        drawCanvas.stroke();
        drawCanvas.closePath();
    }
}


var myRect = new Rectangle(canvasCoordinate(0, 'x'), canvasCoordinate(0, 'y'), 100, 100);

var game = new Game(ctx);

document.addEventListener('keydown', function(event) {
    const pressedKey = event.key;
    console.log("Key pressed:", pressedKey);
    myRect.update(pressedKey);
    // alert(`${canvasCoordinate(myRect.x, 'x')}, ${canvasCoordinate(myRect.y, 'y')}`);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    myRect.draw(ctx);
    for (let C_line of game.gridLines) {
        C_line.draw(ctx);
    }

    if (pressedKey === 'Enter') {
        alert("Enter key was pressed!");
    }
});

// Setup!
if (ctx) {
    myRect.draw(ctx);

    for (let x = 0; x <= 800; x += 10) {
        let verticalGridLines = new line(x, 0, x, canvas.height)
        verticalGridLines.draw(ctx)
        game.gridLines.push(verticalGridLines);
    }

    for (let y = 0; y < 600; y += 10) {
        let horizontalGridLines = new line(0, y, canvas.width, y);
        horizontalGridLines.draw(ctx);
        game.gridLines.push(horizontalGridLines);
    }

}


