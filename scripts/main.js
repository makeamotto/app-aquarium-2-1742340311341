import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

class Fish {
    constructor() {
        const fishGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);
        const fishMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
        this.mesh = new THREE.Mesh(fishGeometry, fishMaterial);
        this.mesh.rotation.x = Math.PI / 2;
        this.velocity = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
        scene.add(this.mesh);
    }

    update(fishes) {
        this.flock(fishes);
        this.mesh.position.add(this.velocity);
        this.mesh.lookAt(this.mesh.position.clone().add(this.velocity));
    }

    flock(fishes) {
        const alignment = this.align(fishes);
        const cohesion = this.cohere(fishes);
        const separation = this.separate(fishes);

        this.velocity.add(alignment).add(cohesion).add(separation).normalize();
    }

    align(fishes) {
        const perceptionRadius = 2;
        let steering = new THREE.Vector3();
        let total = 0;
        fishes.forEach(fish => {
            if (fish !== this && this.mesh.position.distanceTo(fish.mesh.position) < perceptionRadius) {
                steering.add(fish.velocity);
                total++;
            }
        });
        if (total > 0) {
            steering.divideScalar(total);
            steering.sub(this.velocity).clampLength(0, 0.05);
        }
        return steering;
    }

    cohere(fishes) {
        const perceptionRadius = 2;
        let steering = new THREE.Vector3();
        let total = 0;
        fishes.forEach(fish => {
            if (fish !== this && this.mesh.position.distanceTo(fish.mesh.position) < perceptionRadius) {
                steering.add(fish.mesh.position);
                total++;
            }
        });
        if (total > 0) {
            steering.divideScalar(total);
            steering.sub(this.mesh.position);
            steering.sub(this.velocity).clampLength(0, 0.05);
        }
        return steering;
    }

    separate(fishes) {
        const perceptionRadius = 1;
        let steering = new THREE.Vector3();
        let total = 0;
        fishes.forEach(fish => {
            const distance = this.mesh.position.distanceTo(fish.mesh.position);
            if (fish !== this && distance < perceptionRadius) {
                let diff = new THREE.Vector3().subVectors(this.mesh.position, fish.mesh.position);
                diff.divideScalar(distance);
                steering.add(diff);
                total++;
            }
        });
        if (total > 0) {
            steering.divideScalar(total);
            steering.sub(this.velocity).clampLength(0, 0.05);
        }
        return steering;
    }
}

const fishCount = 50;
const fishes = Array.from({ length: fishCount }, () => {
    const fish = new Fish();
    fish.mesh.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    return fish;
});

function animate() {
    requestAnimationFrame(animate);
    fishes.forEach(fish => fish.update(fishes));
    renderer.render(scene, camera);
}

camera.position.z = 10;

animate();