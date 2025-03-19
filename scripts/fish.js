// scripts/fish.js

class Fish {
    constructor(id, x, y, speed, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.element = this.createFishElement();
        this.target = null;
    }

    createFishElement() {
        const fishElement = document.createElement('div');
        fishElement.className = 'fish';
        fishElement.style.backgroundColor = this.color;
        fishElement.style.position = 'absolute';
        fishElement.style.width = '20px';
        fishElement.style.height = '10px';
        fishElement.style.borderRadius = '50%';
        fishElement.style.transform = 'rotate(0deg)';
        document.body.appendChild(fishElement);
        return fishElement;
    }

    updatePosition() {
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                this.element.style.transform = `rotate(${angle}deg)`;
            }
        }

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    setTarget(targetFish) {
        this.target = targetFish;
    }
}

class FishTank {
    constructor() {
        this.fishes = [];
    }

    addFish(fish) {
        this.fishes.push(fish);
    }

    update() {
        this.fishes.forEach(fish => {
            const otherFishes = this.fishes.filter(f => f !== fish);
            if (otherFishes.length > 0) {
                const closestFish = this.findClosestFish(fish, otherFishes);
                fish.setTarget(closestFish);
            }
            fish.updatePosition();
        });
    }

    findClosestFish(fish, otherFishes) {
        let closestFish = null;
        let minDistance = Infinity;

        otherFishes.forEach(otherFish => {
            const dx = otherFish.x - fish.x;
            const dy = otherFish.y - fish.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                closestFish = otherFish;
            }
        });

        return closestFish;
    }
}

// Example usage
const fishTank = new FishTank();
fishTank.addFish(new Fish(1, 100, 100, 2, 'red'));
fishTank.addFish(new Fish(2, 200, 200, 2, 'blue'));

function animate() {
    fishTank.update();
    requestAnimationFrame(animate);
}

animate();