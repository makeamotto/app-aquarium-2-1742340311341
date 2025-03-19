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
    context.ellipse(this.x, this.y, this.size * 2, this.size, 0, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x - this.size, this.y - this.size / 2);
    context.lineTo(this.x - this.size, this.y + this.size / 2);
    context.closePath();
    context.fill();
};

// Method to chase another fish
Fish.prototype.chase = function(targetFish) {
    const dx = targetFish.x - this.x;
    const dy = targetFish.y - this.y;
    this.direction = Math.atan2(dy, dx);
};

// Function to update all fish
function updateFish(fishArray, context) {
    for (let i = 0; i < fishArray.length; i++) {
        const fish = fishArray[i];
        const targetFish = fishArray[(i + 1) % fishArray.length];
        fish.chase(targetFish);
        fish.updatePosition();
        fish.draw(context);
    }
}

// Export the Fish constructor and update function
export { Fish, updateFish };
```