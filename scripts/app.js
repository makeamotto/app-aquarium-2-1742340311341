// Import necessary Three.js components
import * as THREE from 'three';

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create fish geometry and material
const fishGeometry = new THREE.ConeGeometry(0.5, 1, 32);
const fishMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Create a group of fish
const fishGroup = [];
for (let i = 0; i < 10; i++) {
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);
    fish.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    fish.rotation.x = Math.PI / 2; // Rotate to look more like a fish
    fishGroup.push(fish);
    scene.add(fish);
}

// Position camera
camera.position.z = 10;

// Function to make fish chase each other
function chaseFish() {
    fishGroup.forEach((currentFish, index) => {
        const targetFish = fishGroup[(index + 1) % fishGroup.length];
        const direction = new THREE.Vector3().subVectors(targetFish.position, currentFish.position).normalize();
        currentFish.position.add(direction.multiplyScalar(0.02));
        currentFish.lookAt(targetFish.position); // Make fish face the target
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update fish positions
    chaseFish();

    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Start animation
animate();