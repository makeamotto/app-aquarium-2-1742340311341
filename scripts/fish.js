```javascript
// scripts/fish.js

class Fish {
    constructor(id, x, y, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 10 + 5; // Random size between 5 and 15
        this.speed = Math.random() * 2 + 1; // Random speed between 1 and 3
        this.direction = Math.random() * 2 * Math.PI; // Random direction in radians
    }

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.ellipse(this.x, this.y, this.size, this.size / 2, this.direction, 0, 2 * Math.PI);
        context.fill();
    }

    updatePosition(fishes) {
        const alignment = this.align(fishes);
        const cohesion = this.cohere(fishes);
        const separation = this.separate(fishes);

        this.direction += alignment + cohesion + separation;
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;

        // Keep fish within bounds
        this.x = (this.x + window.innerWidth) % window.innerWidth;
        this.y = (this.y + window.innerHeight) % window.innerHeight;
    }

    align(fishes) {
        let avgDirection = 0;
        let count = 0;
        for (const fish of fishes) {
            if (fish.id !== this.id) {
                avgDirection += fish.direction;
                count++;
            }
        }
        if (count > 0) {
            avgDirection /= count;
            return (avgDirection - this.direction) * 0.05;
        }
        return 0;
    }

    cohere(fishes) {
        let avgX = 0;
        let avgY = 0;
        let count = 0;
        for (const fish of fishes) {
            if (fish.id !== this.id) {
                avgX += fish.x;
                avgY += fish.y;
                count++;
            }
        }
        if (count > 0) {
            avgX /= count;
            avgY /= count;
            const angleToCenter = Math.atan2(avgY - this.y, avgX - this.x);
            return (angleToCenter - this.direction) * 0.01;
        }
        return 0;
    }

    separate(fishes) {
        let moveX = 0;
        let moveY = 0;
        for (const fish of fishes) {
            if (fish.id !== this.id) {
                const distance = Math.hypot(fish.x - this.x, fish.y - this.y);
                if (distance < 20) {
                    moveX += this.x - fish.x;
                    moveY += this.y - fish.y;
                }
            }
        }
        const angleAway = Math.atan2(moveY, moveX);
        return (angleAway - this.direction) * 0.1;
    }
}

export function createFishes(numFishes) {
    const fishes = [];
    for (let i = 0; i < numFishes; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        fishes.push(new Fish(i, x, y, color));
    }
    return fishes;
}

export function updateFishes(fishes, context) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const fish of fishes) {
        fish.updatePosition(fishes);
        fish.draw(context);
    }
}
```