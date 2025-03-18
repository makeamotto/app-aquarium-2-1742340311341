```javascript
// scripts/aquarium.js

import * as THREE from 'three';

class Fish {
    constructor(scene, size, position) {
        this.size = size;
        this.position = position;
        this.geometry = new THREE.SphereGeometry(size, 16, 16);
        this.material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(position);
        scene.add(this.mesh);
    }

    move() {
        this.mesh.position.add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        ));
    }

    grow() {
        this.size += 0.1;
        this.mesh.scale.setScalar(this.size);
    }

    checkCollision(otherFish) {
        return this.mesh.position.distanceTo(otherFish.mesh.position) < this.size + otherFish.size;
    }
}

class Aquarium {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.fishArray = [];
        this.init();
    }

    init() {
        this.camera.position.z = 5;
        for (let i = 0; i < 10; i++) {
            const size = Math.random() * 0.5 + 0.1;
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
            );
            const fish = new Fish(this.scene, size, position);
            this.fishArray.push(fish);
        }
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        for (let i = 0; i < this.fishArray.length; i++) {
            const fish = this.fishArray[i];
            fish.move();
            for (let j = i + 1; j < this.fishArray.length; j++) {
                const otherFish = this.fishArray[j];
                if (fish.checkCollision(otherFish)) {
                    if (fish.size > otherFish.size) {
                        fish.grow();
                        this.scene.remove(otherFish.mesh);
                        this.fishArray.splice(j, 1);
                        j--;
                    } else if (fish.size < otherFish.size) {
                        otherFish.grow();
                        this.scene.remove(fish.mesh);
                        this.fishArray.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('load', () => {
    new Aquarium();
});
```