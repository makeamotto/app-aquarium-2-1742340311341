import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const aquariumSize = 50;
const aquariumGeometry = new THREE.BoxGeometry(aquariumSize, aquariumSize, aquariumSize);
const aquariumMaterial = new THREE.MeshBasicMaterial({ color: 0x1e90ff, wireframe: true });
const aquarium = new THREE.Mesh(aquariumGeometry, aquariumMaterial);
scene.add(aquarium);

class Fish {
    constructor() {
        this.size = Math.random() * 0.5 + 0.5;
        this.geometry = new THREE.SphereGeometry(this.size, 16, 16);
        this.material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(
            (Math.random() - 0.5) * aquariumSize,
            (Math.random() - 0.5) * aquariumSize,
            (Math.random() - 0.5) * aquariumSize
        );
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        );
        scene.add(this.mesh);
    }

    move() {
        this.mesh.position.add(this.velocity);

        if (Math.abs(this.mesh.position.x) > aquariumSize / 2) this.velocity.x *= -1;
        if (Math.abs(this.mesh.position.y) > aquariumSize / 2) this.velocity.y *= -1;
        if (Math.abs(this.mesh.position.z) > aquariumSize / 2) this.velocity.z *= -1;
    }

    grow() {
        this.size += 0.1;
        this.mesh.scale.set(this.size, this.size, this.size);
    }
}

const fishArray = Array.from({ length: 20 }, () => new Fish());

function checkEating() {
    for (let i = fishArray.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
            const fish1 = fishArray[i];
            const fish2 = fishArray[j];
            const distance = fish1.mesh.position.distanceTo(fish2.mesh.position);

            if (distance < (fish1.size + fish2.size) / 2) {
                if (fish1.size > fish2.size) {
                    fish1.grow();
                    scene.remove(fish2.mesh);
                    fishArray.splice(j, 1);
                } else if (fish2.size > fish1.size) {
                    fish2.grow();
                    scene.remove(fish1.mesh);
                    fishArray.splice(i, 1);
                    break;
                }
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    fishArray.forEach(fish => fish.move());
    checkEating();

    controls.update();
    renderer.render(scene, camera);
}

camera.position.z = 100;

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});