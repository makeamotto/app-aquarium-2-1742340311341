```javascript
// scripts/chase.js

// Fish constructor function
function Fish(id, x, y, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.element = document.getElementById(id);
}

// Method to update fish position
Fish.prototype.updatePosition = function(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
    }

    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
};

// Function to initialize fish
function initializeFish() {
    const fishElements = document.querySelectorAll('.fish');
    return Array.from(fishElements).map(fishElement => {
        const x = parseFloat(fishElement.style.left) || Math.random() * window.innerWidth;
        const y = parseFloat(fishElement.style.top) || Math.random() * window.innerHeight;
        const speed = Math.random() * 2 + 1; // Random speed between 1 and 3
        return new Fish(fishElement.id, x, y, speed);
    });
}

// Function to make fish chase each other
function chaseFish(fishArray) {
    fishArray.forEach((fish, index) => {
        const targetFish = fishArray[(index + 1) % fishArray.length]; // Next fish in the array
        fish.updatePosition(targetFish.x, targetFish.y);
    });
}

// Main function to start the fish chasing logic
function startChasing() {
    const fishArray = initializeFish();

    function animate() {
        chaseFish(fishArray);
        requestAnimationFrame(animate);
    }

    animate();
}

// Start the fish chasing when the window loads
window.addEventListener('load', startChasing);
```