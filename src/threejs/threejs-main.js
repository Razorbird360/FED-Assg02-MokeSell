import * as THREE from "three";
import { createScene, resize } from "./scene/scene.js";

const { scene, renderer, camera, listener, controls } = createScene();


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  resize(renderer, camera);
}
animate();