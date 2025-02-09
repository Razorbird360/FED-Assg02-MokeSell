import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { BASE_PATH } from "@/threejs/utils/utils.js";
import { gameState } from "@/threejs/utils/state.js";
import { castShadow } from "@/threejs/scene/scene.js";
import { setCharacterOpacity } from './camera.js';

const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

export async function loadWorldObjects(scene) {
    await loadGameStore(scene);
    await loadGrass(scene);
}
async function loadGameStore(scene) {
  const store = await loadGLBModel(`house.glb`);
  store.position.set(0, 2.22, 0);
  store.scale.set(0.12, 0.12, 0.12);
  castShadow(store);
//   setCharacterOpacity(store, 0.5);
  gameState.store = store;
  scene.add(gameState.store);
}

function loadGLBModel(fileName) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            `${BASE_PATH}models/${fileName}`,
            (gltf) => {
                const model = gltf.scene || gltf;
                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
}

function loadFBXModel(fileName) {
    return new Promise((resolve, reject) => {
        fbxLoader.load(
            `${BASE_PATH}models/${fileName}`,
            (object) => {
                const model = object.scene || object;
                resolve(model);
            },
            undefined,
            (error) => reject(error)
        );
    });
}

async function loadGrass(scene) {
    try {
        const grassModel = await loadGLBModel("grass.glb");
        grassModel.scale.set(0.02, 0.02, 0.02);
        const grassCount = 200;
        const groundSize = 100;
        const exclusionSize = 14; 

        let spawnedGrass = 0;

        while (spawnedGrass < grassCount) {
            const x = Math.random() * groundSize - groundSize / 2;
            const z = Math.random() * groundSize - groundSize / 2;
            if (Math.abs(x) < exclusionSize / 2 && Math.abs(z) < exclusionSize / 2) {
                continue;
            }

            const clone = grassModel.clone();
            clone.position.set(x, 0.1, z);
            clone.rotation.y = Math.random() * Math.PI * 2;
            scene.add(clone);

            spawnedGrass++;
        }
    } catch (error) {
        console.error("Error loading grass:", error);
    }
}