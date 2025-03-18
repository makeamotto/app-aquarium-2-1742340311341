import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Aquarium {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.fish = [];
    this.loader = new GLTFLoader();
    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    this.loadFishModel();

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.animate();
  }

  loadFishModel() {
    this.loader.load('models/fish.glb', (gltf) => {
      for (let i = 0; i < 10; i++) {
        const fish = gltf.scene.clone();
        fish.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        fish.scale.set(0.1, 0.1, 0.1);
        this.scene.add(fish);
        this.fish.push({ mesh: fish, size: 0.1 });
      }
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    for (let i = this.fish.length - 1; i >= 0; i--) {
      const fish = this.fish[i];
      fish.mesh.rotation.y += delta * 0.5;
      fish.mesh.position.x += (Math.random() - 0.5) * delta;
      fish.mesh.position.y += (Math.random() - 0.5) * delta;
      fish.mesh.position.z += (Math.random() - 0.5) * delta;

      for (let j = this.fish.length - 1; j >= 0; j--) {
        if (i !== j) {
          const otherFish = this.fish[j];
          if (this.checkCollision(fish.mesh, otherFish.mesh)) {
            if (fish.size > otherFish.size) {
              fish.size += 0.01;
              fish.mesh.scale.set(fish.size, fish.size, fish.size);
              this.scene.remove(otherFish.mesh);
              this.fish.splice(j, 1);
              if (j < i) i--; // Adjust index if a fish is removed before the current fish
            }
          }
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  checkCollision(fish1, fish2) {
    const distance = fish1.position.distanceTo(fish2.position);
    return distance < (fish1.scale.x + fish2.scale.x) / 2;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Aquarium;