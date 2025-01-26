import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { BASE_PATH } from '@/threejs/utils/utils.js'

const scene = new THREE.Scene();
const canvas = document.querySelector('#canvas');
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
let snowflake = null;

const snowflakeClones = [];
let lastSpawnTime = Date.now();
const spawnInterval = 300; 

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    precision: "highp",
    logarithmicDepthBuffer: true
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const influenceRadius = 1;
const mouseForce = 0.1;


function setSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', () => {
    setSize();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

setSize();

async function loadSnowflake() {
    const materials = await mtlLoader.loadAsync(`${BASE_PATH}models/snowflake.mtl`);
        materials.preload();
    objLoader.setMaterials(materials);
    
    const model = await objLoader.loadAsync(`${BASE_PATH}models/snowflake.obj`);
    
    model.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.material = child.material.clone();
            child.material.transparent = true;
            child.material.side = THREE.DoubleSide;
        }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.scale.set(0.001, 0.001, 0.001);
    
    return model;
}

function createSnowflakeClone() {
    if (!snowflake) return;

    const clone = snowflake.clone();
    let scale;
    if (window.innerWidth < 800) {
        scale = Math.random() * 0.0005 + 0.0001;
    } else {
        scale = Math.random() * 0.001 + 0.0001;
    }    
    clone.scale.set(scale, scale, scale);

    const speed = Math.random() * 0.04 + 0.02;
    const velocity = new THREE.Vector3(0, -speed, 0);

    const verticalView = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const horizontalView = verticalView * camera.aspect;
    
    clone.position.set(
        (Math.random() - 0.5) * horizontalView,
        verticalView / 2 + 1,
        0
    );

    scene.add(clone);
    snowflakeClones.push({ mesh: clone, velocity });
}

function updateClones() {
    for (let i = snowflakeClones.length - 1; i >= 0; i--) {
        const clone = snowflakeClones[i];
        clone.mesh.position.add(clone.velocity);
        clone.mesh.rotation.x += 0.01;
        clone.mesh.rotation.y += 0.005;

        if (clone.mesh.position.y < -camera.position.z) {
            scene.remove(clone.mesh);
            snowflakeClones.splice(i, 1);
        }
    }
}

async function init() {
    snowflake = await loadSnowflake();
    snowflake.scale.set(0.001, 0.001, 0.001);
    animate();
  }
  
init().catch(console.error);
  
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);



function handleMouseInfluence() {
    // Convert mouse position to 3D space
    raycaster.setFromCamera(mouse, camera);
    const mouseDirection = new THREE.Vector3();
    raycaster.ray.direction.clone(mouseDirection);
    
    // Find where mouse ray intersects Z=0 plane (where snowflakes are)
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mousePosition = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, mousePosition);

    snowflakeClones.forEach(clone => {
        // Calculate distance from mouse
        const distance = clone.mesh.position.distanceTo(mousePosition);
        
        if (distance < influenceRadius) {
            // Calculate direction away from mouse
            const direction = clone.mesh.position.clone()
                .sub(mousePosition)
                .normalize();

            // Apply force proportional to distance
            const strength = (1 - distance / influenceRadius) * mouseForce;
            clone.velocity.x += direction.x * strength;
            clone.velocity.y += direction.y * strength;
            
            // Add slight rotation effect
            clone.mesh.rotation.z += strength * 0.1;
        }
    });
}



window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    
    handleMouseInfluence();

    if (Date.now() - lastSpawnTime > spawnInterval) {
        createSnowflakeClone();
        lastSpawnTime = Date.now();
    }

    updateClones();
    
    if (snowflake) {
        snowflake.rotation.x += 0.01;
        snowflake.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

animate();