```javascript
// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Create a pixelated fish using a simple box geometry
function createFish() {
    const fishGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
    const fishMaterial = new THREE.MeshLambertMaterial({ color: 0xffa500 });
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);
    fish.position.set(Math.random() * 10 - 5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
    return fish;
}

// Add multiple fish to the scene
const fishCount = 20;
const fishes = Array.from({ length: fishCount }, createFish);
fishes.forEach(fish => scene.add(fish));

// Set camera position
camera.position.z = 10;

// Function to update fish positions
function updateFishPositions() {
    fishes.forEach(fish => {
        fish.position.x += Math.random() * 0.1 - 0.05;
        fish.position.y += Math.random() * 0.1 - 0.05;
        fish.position.z += Math.random() * 0.1 - 0.05;

        // Wrap fish around if they leave the view
        fish.position.x = (fish.position.x + 5) % 10 - 5;
        fish.position.y = (fish.position.y + 2.5) % 5 - 2.5;
        fish.position.z = (fish.position.z + 2.5) % 5 - 2.5;
    });
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    updateFishPositions();
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

// Start the animation
animate();
```