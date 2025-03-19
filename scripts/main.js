import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.142.0/build/three.module.js';

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
    fish.rotation.y = Math.random() * Math.PI * 2;
    scene.add(fish);
    fishes.push(fish);
}

camera.position.z = 5;

function updateFishBehavior() {
    fishes.forEach((fish, index) => {
        const targetFish = fishes[(index + 1) % fishCount];
        const direction = new THREE.Vector3().subVectors(targetFish.position, fish.position).normalize();
        
        fish.position.add(direction.multiplyScalar(0.02));
        fish.lookAt(targetFish.position);
    });
}

function animate() {
    requestAnimationFrame(animate);
    updateFishBehavior();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});