import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { WebGLRenderer } from "three";

export async function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const renderer = new WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 6, 7);

  const listener = new THREE.AudioListener();
  camera.add(listener);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  // Add helper axes
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(100, 100, 70);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 1024; 
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.1; 
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.left = -50; 
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(directionalLight);


  const playerPosition = { x: 0, y: 0, z: 0 };


  return { scene, renderer, camera, listener, controls };
}

export function createGround() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );

  gradient.addColorStop(0, "#8B7D5D"); 
  gradient.addColorStop(0.4, "#6D6545");
  gradient.addColorStop(1, "#5A553D");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;

  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const ground = new THREE.Mesh(planeGeometry, planeMaterial);
  ground.receiveShadow = true;
  ground.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

  return ground;
}


export function resize(renderer, camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function castShadow(object) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}


