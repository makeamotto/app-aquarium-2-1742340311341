```javascript
// scripts/fish.js

class Fish {
  constructor(name, size, speed, position, color) {
    this.name = name;
    this.size = size;
    this.speed = speed;
    this.position = { ...position };
    this.color = color;
    this.alive = true;
  }

  move() {
    if (!this.alive) return;
    this.position.x += (Math.random() - 0.5) * this.speed;
    this.position.y += (Math.random() - 0.5) * this.speed;
    this.position.z += (Math.random() - 0.5) * this.speed;
  }

  eat(otherFish) {
    if (!this.alive || !otherFish.alive) return;
    const distance = Math.hypot(
      this.position.x - otherFish.position.x,
      this.position.y - otherFish.position.y,
      this.position.z - otherFish.position.z
    );

    if (distance < this.size && this.size > otherFish.size) {
      otherFish.alive = false;
      this.size += otherFish.size * 0.1; // Grow by 10% of the eaten fish's size
    }
  }

  isAlive() {
    return this.alive;
  }
}

class Aquarium {
  constructor() {
    this.fishList = [];
  }

  addFish(fish) {
    if (fish instanceof Fish) {
      this.fishList.push(fish);
    }
  }

  update() {
    this.fishList.forEach((fish, i) => {
      if (!fish.isAlive()) return;
      fish.move();
      this.fishList.forEach((otherFish, j) => {
        if (i !== j) {
          fish.eat(otherFish);
        }
      });
    });
  }

  getLivingFish() {
    return this.fishList.filter(fish => fish.isAlive());
  }
}

export { Fish, Aquarium };
```