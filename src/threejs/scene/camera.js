import { BASE_PATH } from "@/threejs/utils/utils.js";
import { gameState } from "@/threejs/utils/state.js";
import * as THREE from 'three';
export function updateCamera(camera, controls, characterBody, character) {
    // console.log(gameState.keys.t);
    switch (gameState.keys.t) {
        case 1:
            thirdPerson(camera, controls, characterBody, character);
            break;
        case 2:
            firstPerson(camera, controls, characterBody, character);
            break;
    }
}
function thirdPerson(camera, controls, characterBody, character) {
    setCharacterOpacity(character, 1);
    controls.enabled = false;
    let { x, y, z } = characterBody.position;
    camera.position.set(x, y + 1, z + 2);
    controls.target.set(x, y, z);
    camera.updateMatrixWorld();
    controls.update();
}



function firstPerson(camera, controls, characterBody, character) {
  setCharacterOpacity(character, 0);
  controls.enabled = false;
  let { x, y, z } = characterBody.position;
  
  camera.position.set(x, y + 0.65, z);

  const horizontalAngle = gameState.character.rotation.y;
  const verticalAngle = gameState.cameraVerticalAngle;
  
  const direction = new THREE.Vector3(
    Math.sin(horizontalAngle) * Math.cos(verticalAngle),
    Math.sin(verticalAngle),
    Math.cos(horizontalAngle) * Math.cos(verticalAngle)
  ).normalize();

  const cameraOffset = 5;
  const target = new THREE.Vector3(
    x + direction.x * cameraOffset,
    y + 0.65 + direction.y * cameraOffset,
    z + direction.z * cameraOffset
  );

  controls.target.set(target.x, target.y, target.z);
  camera.updateMatrixWorld();
  controls.update();
}

export function setCharacterOpacity(character, opacity) {
    if (!character || typeof opacity !== 'number' || opacity < 0 || opacity > 1) {
      console.error('Invalid input: Character must be a valid object and opacity must be between 0 and 1.');
      return;
    }
  
    // Traverse the character model and update materials
    character.traverse((child) => {
      if (child.isMesh) {
        const material = child.material;
  
        // Ensure the material supports transparency
        if (material) {
          // Handle multi-materials (array of materials)
          if (Array.isArray(material)) {
            material.forEach((mat) => updateMaterial(mat, opacity));
          } else {
            updateMaterial(material, opacity);
          }
        }
      }
    });
  }
  
  /**
   * Updates a single material's opacity while preserving its original properties.
   * @param {THREE.Material} material - The material to update.
   * @param {number} opacity - The desired opacity value (0 to 1).
   */
  function updateMaterial(material, opacity) {
    if (!material.userData.originalState) {
      // Store the original material state
      material.userData.originalState = {
        transparent: material.transparent,
        depthWrite: material.depthWrite,
        opacity: material.opacity,
      };
    }
  
    const originalState = material.userData.originalState;
  
    if (opacity < 1) {
      // Enable transparency and disable depth writing for blending
      material.transparent = true;
      material.depthWrite = false;
      material.opacity = opacity;
    } else {
      // Restore original material properties for fully opaque objects
      material.transparent = originalState.transparent;
      material.depthWrite = originalState.depthWrite;
      material.opacity = originalState.opacity;
    }
  }


