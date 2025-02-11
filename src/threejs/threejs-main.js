import * as THREE from "three";
import {createGround, createScene, resize} from './scene/scene.js';
import {characterMovement, initCharacter, isMoving} from './scene/character.js';
import { gameState } from './utils/state.js';
import {setupInputHandlers} from './utils/input.js';
import {initAudio} from './scene/audio.js';
import {initPhysicalBodies, setupCharacterPhysics, setupPhysicsWorld, updatePhysics, createBorders} from './scene/physics.js';
import { loadWorldObjects } from "./scene/objects.js";
import { updateCamera } from "./scene/camera.js";
import { InteractionManager } from 'three.interactive';

const exit = document.getElementById('exit');
const gloveinfo = document.querySelector('.glove_info');
exit.addEventListener('click', () => {
  gloveinfo.style.display = 'none';
});



gameState.keys.t = 2;


async function init() {

  const { world, groundBody, groundMat } = setupPhysicsWorld();


  const { characterBody, hitboxMesh } = setupCharacterPhysics(world, groundMat);
  gameState.characterBody = characterBody;
  
  const { scene, renderer, camera, listener, controls} = await createScene();
  gameState.camera = camera;
  gameState.renderer = renderer;
  gameState.scene = scene;
  gameState.listener = listener;
  gameState.controls = controls;

  await Promise.all([
    initCharacter(scene),
    initAudio(listener),
    loadWorldObjects(scene),
    initPhysicalBodies(scene, world),
    createBorders(world)
  ]);

  
  window.addEventListener('resize', () => resize(gameState.renderer, gameState.camera));
  
  const ground = createGround();
  scene.add(ground);

  const clock = new THREE.Clock();
  const fps = 60;
  const interval = 1000 / fps;
  let lastTime = 0;

  const time = performance.now();
  if (time - lastTime >= interval) {
    lastTime = time;
    controls.update();
    renderer.render(scene, camera);
  }


  setupInputHandlers();

  const interactionManager = new InteractionManager(renderer, camera, renderer.domElement);
  interactionManager.add(gameState.glove);

  async function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    const deltaTime = clock.getDelta();
    renderer.render(scene, camera);

    if (gameState.mixer) {
      gameState.mixer.update(deltaTime);
    }

    if (gameState.glove) {
      gameState.glove.rotation.y += 0.01;
    }

    interactionManager.update();

    if (gameState.character) {
      characterMovement(deltaTime);
      updatePhysics(deltaTime, ground, groundBody);
      updateCamera(camera, controls, gameState.characterBody, gameState.character);
    }
  }
  animate();
}

init();