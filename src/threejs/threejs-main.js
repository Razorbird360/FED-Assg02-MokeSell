import * as THREE from "three";
import {createGround, createScene, resize} from './scene/scene.js';
import {characterMovement, initCharacter, isMoving} from './scene/character.js';
import { gameState } from '@/threejs/utils/state.js';
import {setupInputHandlers} from '@/threejs/utils/input.js';





async function init() {
  
  const { scene, renderer, camera, listener, controls} = await createScene();
  gameState.camera = camera;
  gameState.renderer = renderer;
  gameState.scene = scene;
  gameState.listener = listener;
  gameState.controls = controls;

  await Promise.all([
    initCharacter(scene),
    // initAudio(listener),
    // loadWorldObjects(scene),
    // initPhysicalBodies(scene, world),
    // createBorders(world)
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

  async function animate() {
    requestAnimationFrame(animate);
    controls.update();  
    const deltaTime = clock.getDelta();
    renderer.render(scene, camera);
  
    if (gameState.mixer) {
      gameState.mixer.update(deltaTime);
    }
  }
  animate();
}

init();