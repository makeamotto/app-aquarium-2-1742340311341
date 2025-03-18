```
// Import necessary Three.js components
import * as THREE from 'three';

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create aquarium boundaries
const aquariumSize = 50;
const aquariumGeometry = new THREE.BoxGeometry(aquariumSize, aquariumSize, aquariumSize);
const aquariumMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true });
const aquarium = new THREE.Mesh(aquariumGeometry, aquariumMaterial);
scene.add(aquarium);

// Fish class
class Fish {
    constructor(size, color) {
        this.size = size;
        this.color = color;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(
            (Math.random() - 0.5) * aquariumSize,
            (Math.random() - 0.5) * aquariumSize,
            (Math.random() - 0.5) * aquariumSize
        );
        scene.add(this.mesh);
    }

    move() {
        this.mesh.position.x += (Math.random() - 0.5) * 0.1;
        this.mesh.position.y += (Math.random() - 0.5) * 0.1;
        this.mesh.position.z += (Math.random() - 0.5) * 0.1;
    }

    grow() {
        this.size += 0.1;
        this.mesh.scale.set(this.size, this.size, this.size);
    }
}

// Initialize fish
const fishArray = [];
for (let i = 0; i < 20; i++) {
    const size = Math.random() * 0.5 + 0.5;
    const color = Math.random() * 0xffffff;
    fishArray.push(new Fish(size, color));
}

// Check for collisions and eating
function checkCollisions() {
    for (let i = 0; i < fishArray.length; i++) {
        for (let j = i + 1; j < fishArray.length; j++) {
            const fish1 = fishArray[i];
            const fish2 = fishArray[j];
            const distance = fish1.mesh.position.distanceTo(fish2.mesh.position);
            if (distance < fish1.size + fish2.size) {
                if (fish1.size > fish2.size) {
                    fish1.grow();
                    scene.remove(fish2.mesh);
                    fishArray.splice(j, 1);
                    j--; // Adjust index after removal
                } else if (fish2.size > fish1.size) {
                    fish2.grow();
                    scene.remove(fish1.mesh);
                    fishArray.splice(i, 1);
                    i--; // Adjust index after removal
                    break; // Exit inner loop as fish1 is removed
                }
            }
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    fishArray.forEach(fish => fish.move());
    checkCollisions();

    renderer.render(scene, camera);
}

// Set camera position
camera.position.z = 100;

// Start animation
animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
```