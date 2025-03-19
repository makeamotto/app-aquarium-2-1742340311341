```javascript
// scripts/fish.js

// Fish constructor function
function Fish(id, x, y, color, size) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.speed = Math.random() * 2 + 1; // Random speed between 1 and 3
    this.direction = Math.random() * 2 * Math.PI; // Random direction in radians
}

// Method to update fish position
Fish.prototype.updatePosition = function() {
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
    this.wrapAround();
};

// Method to wrap fish around the screen
Fish.prototype.wrapAround = function() {
    const canvasWidth = 800; // Assuming canvas width
    const canvasHeight = 600; // Assuming canvas height

    if (this.x < 0) this.x += canvasWidth;
    if (this.x > canvasWidth) this.x -= canvasWidth;
    if (this.y < 0) this.y += canvasHeight;
    if (this.y > canvasHeight) this.y -= canvasHeight;
};

// Method to draw fish on canvas
Fish.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.ellipse(this.x, this.y, this.size, this.size / 2, 0, 0, 2 * Math.PI);
    context.fill();
};

// Method to chase another fish
Fish.prototype.chase = function(targetFish) {
    const dx = targetFish.x - this.x;
    const dy = targetFish.y - this.y;
    const angleToTarget = Math.atan2(dy, dx);
    this.direction += (angleToTarget - this.direction) * 0.1; // Smoothly adjust direction
};

// Function to create multiple fish
function createFishArray(numFish) {
    const fishArray = [];
    for (let i = 0; i < numFish; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const size = Math.random() * 20 + 10;
        fishArray.push(new Fish(i, x, y, color, size));
    }
    return fishArray;
}

// Function to update all fish
function updateFish(fishArray) {
    for (let i = 0; i < fishArray.length; i++) {
        const fish = fishArray[i];
        if (i > 0) {
            fish.chase(fishArray[i - 1]); // Each fish chases the previous one
        }
        fish.updatePosition();
    }
}

// Function to draw all fish
function drawFish(context, fishArray) {
    context.clearRect(0, 0, 800, 600); // Clear the canvas
    fishArray.forEach(fish => fish.draw(context));
}

// Exporting functions for use in other modules
export { Fish, createFishArray, updateFish, drawFish };
```