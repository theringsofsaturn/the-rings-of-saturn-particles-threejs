import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Canvas
const canvas = document.querySelector('canvas');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // FOV - Field of view
  window.innerHeight / window.innerHeight, // Aspect Ratio
  0.1, // Near
  1000 // Far
);
camera.position.z = 3; // Pull the camera back a bit, if not you cannot see
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Set to true is used to give a sense of weight to the controls

// Particles
const particlesGeometry = new THREE.BufferGeometry(); // Geometry for the stars
const particlesCount = 15000; // number of particles to be created

const vertices = new Float32Array(particlesCount); // Float32Array is an array of 32-bit floats. This is used to represent an array of vertices. (we have 3 values for each vertex - coordinates x, y, z)

// Loop through all the vertices and set their random position
for (let i = 0; i < particlesCount; i++) {
  vertices[i] = (Math.random() - 0.5) * 100; // -0.5 to get the range from -0.5 to 0.5 than * 100 to get a range from -50 to 50
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(vertices, 3) // 3 values for each vertex (x, y, z)
  // Check the documentation for more info about this.
);

// Texture
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/star.png'); // Add a texture to the particles

// Material
const particlesMaterial = new THREE.PointsMaterial({
  map: particleTexture, // Texture
  size: 0.5, // Size of the particles
  sizeAttenuation: true, // size of the particle will be smaller as it gets further away from the camera, and if it's closer to the camera, it will be bigger
});

const stars = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(stars);

// Import the planet Saturn 3D model
const gltfLoader = new GLTFLoader(); // Create a loader
gltfLoader.load('/scene.gltf', (gltf) => {
  console.log('success');
  console.log('SATURN HERE', gltf);

  const saturn = gltf.scene;
  saturn.position.set(0, 0, 0);
  saturn.scale.set(0.0014, 0.0014, 0.0014);

  scene.add(saturn);
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, // canvas is the canvas element from the html
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // to avoid picelation on high resolution screenss

// Animate
const animate = () => {
  // Update the controls
  controls.update();

  // Rotate a bit the stars
  stars.rotation.y += -0.0001;

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
