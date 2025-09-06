// Get a reference to the canvas element
const canvas = document.getElementById('myCanvas');
// Get the 2D rendering context
const ctx = canvas.getContext('2d');

class object{
    constructor(canvas, x, y, width, height){
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        this.canvas.fillRect(this.x, this.y, this.width, this.height);
    }
}

const mySquare = new object(ctx, 300, 50, 100, 100);

if (ctx) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 150, 100);

    // OOP Square
    mySquare.draw();

    // Draw a circle
    ctx.beginPath();
    ctx.arc(400, 300, 75, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    // ctx.lineWidth = 5;
    // ctx.strokeStyle = 'darkgreen';
    // ctx.stroke();

    // Draw text
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Hello Canvas!', 50, 400);
} else {
    alert('Your browser does not support the HTML5 Canvas.');
}

document.addEventListener('keydown', function(event) {
    const pressedKey = event.key;
    console.log("Key pressed:", pressedKey);

    // Example: Perform an action if the 'Enter' key is pressed
    if (pressedKey === 'Enter') {
        alert("Enter key was pressed!");
    }

    if (pressedKey === 'w') {
        mySquare.y++;
    }
});
