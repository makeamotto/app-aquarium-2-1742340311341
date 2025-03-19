```javascript
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

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

const fishGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
const fishMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });

const fishCount = 10;
const fishes = [];

for (let i = 0; i < fishCount; i++) {
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);
    fish.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    fish.rotation.x = Math.PI / 2;
    scene.add(fish);
    fishes.push(fish);
}

camera.position.z = 5;

function updateFishBehavior() {
    fishes.forEach((fish, index) => {
        let closestFish = null;
        let minDistance = Infinity;

        fishes.forEach((otherFish, otherIndex) => {
            if (index !== otherIndex) {
                const distance = fish.position.distanceTo(otherFish.position);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestFish = otherFish;
                }
            }
        });

        if (closestFish) {
            const direction = new THREE.Vector3().subVectors(closestFish.position, fish.position).normalize();
            fish.position.add(direction.multiplyScalar(0.02));
            fish.lookAt(closestFish.position);
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    updateFishBehavior();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
```