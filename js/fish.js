```javascript
// js/fish.js

import * as THREE from 'three';

class Fish {
    constructor(scene, position, size, color) {
        this.scene = scene;
        this.size = size;
        this.color = color;
        this.speed = Math.random() * 0.02 + 0.01;
        this.direction = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
        
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        
        this.scene.add(this.mesh);
    }

    move() {
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed));
        this.bounce();
    }

    bounce() {
        const bounds = 50;
        if (Math.abs(this.mesh.position.x) > bounds) {
            this.direction.x = -this.direction.x;
        }
        if (Math.abs(this.mesh.position.y) > bounds) {
            this.direction.y = -this.direction.y;
        }
        if (Math.abs(this.mesh.position.z) > bounds) {
            this.direction.z = -this.direction.z;
        }
    }

    grow() {
        this.size += 0.1;
        this.mesh.scale.setScalar(this.size);
    }

    checkCollision(otherFish) {
        return this.mesh.position.distanceTo(otherFish.mesh.position) < this.size + otherFish.size;
    }

    eat(otherFish) {
        if (this.size > otherFish.size) {
            this.grow();
            this.scene.remove(otherFish.mesh);
            return true;
        }
        return false;
    }
}

class Aquarium {
    constructor(scene) {
        this.scene = scene;
        this.fishes = [];
    }

    addFish(position, size, color) {
        const fish = new Fish(this.scene, position, size, color);
        this.fishes.push(fish);
    }

    update() {
        for (let i = 0; i < this.fishes.length; i++) {
            const fish = this.fishes[i];
            fish.move();
            for (let j = i + 1; j < this.fishes.length; j++) {
                const otherFish = this.fishes[j];
                if (fish.checkCollision(otherFish)) {
                    if (fish.eat(otherFish)) {
                        this.fishes.splice(j, 1);
                        j--;
                    } else if (otherFish.eat(fish)) {
                        this.fishes.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }
    }
}

export { Fish, Aquarium };
```