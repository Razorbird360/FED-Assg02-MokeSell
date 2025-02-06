import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { BASE_PATH } from "@/threejs/utils/utils.js";
import { gameState } from "@/threejs/utils/state.js";
import { castShadow } from "@/threejs/scene/scene.js";

const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

export async function loadWorldObjects(scene) {
    await loadGameStore(scene);
}
async function loadGameStore(scene) {
  const store = await loadGLBModel(`house.glb`);
  store.position.set(0, 2.22, 0);
  store.scale.set(0.12, 0.12, 0.12);
  castShadow(store);
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