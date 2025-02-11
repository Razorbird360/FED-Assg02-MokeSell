// objects.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { BASE_PATH } from "@/threejs/utils/utils.js";
import { gameState } from "@/threejs/utils/state.js";
import { castShadow } from "@/threejs/scene/scene.js";



const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

export async function loadWorldObjects(scene) {
  await loadhouse(scene);
  await loadGrass(scene);
  await loadGlove(scene);
}

async function loadhouse(scene) {
  const house = await loadGLBModel(`house.glb`);
  house.position.set(0, 2.22, 0);
  house.scale.set(0.12, 0.12, 0.12);
  castShadow(house);
//   setCharacterOpacity(house, 0.5);
  gameState.house = house;
  scene.add(gameState.house);
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
  const grassModel = await loadGLBModel("grass.glb");
  castShadow(grassModel);
  grassModel.scale.set(0.02, 0.02, 0.02);
  const grassCount = 200;
  const groundSize = 100;
  const exclusionSize = 18; 

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
}

async function loadGlove(scene) {
  const glove = await loadGLBModel("gloves.glb");
  castShadow(glove);
  glove.position.set(3.15, 1, -3.05);
  glove.rotation.x = 0.4;
  gameState.glove = glove;
  scene.add(glove);

  const pointlight = new THREE.PointLight(0xffffff, 2, 100);
  pointlight.position.set(3.15, 2, -3.05);
  scene.add(pointlight);

  const pointlight2 = new THREE.PointLight(0xffffff, 2, 100);
  pointlight2.position.set(3.15, 0, -3.05);
  scene.add(pointlight2);

  glove.cursor = 'pointer';


  glove.addEventListener('click', (event) => {
    const gloveinfo = document.querySelector('.glove_info');
    gloveinfo.style.display = 'flex';
  });


}