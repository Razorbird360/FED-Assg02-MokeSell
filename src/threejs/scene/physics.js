import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { gameState } from "@/threejs/utils/state.js";

export function setupPhysicsWorld() {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
  });

  gameState.world = world;
  const groundMat = new CANNON.Material();
  const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
    material: groundMat
  });
  gameState.groundBody = groundBody;
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  return { world, groundBody, groundMat };
}

export function setupCharacterPhysics(world, groundMat) {
  const characterMat = new CANNON.Material();
  const characterBody = new CANNON.Body({
    mass: 1000,
    position: new CANNON.Vec3(0, 1.5, 0),
    shape: new CANNON.Cylinder(0.5, 0.5, 1.8, 16),
    material: characterMat
  });

  characterBody.linearDamping = 0.999;
  characterBody.allowSleep = true;
  world.addBody(characterBody);

  const characterGroundContact = new CANNON.ContactMaterial(
    groundMat, characterMat,
    { 
      friction: 0, 
      restitution: 0
    }
  );
  world.addContactMaterial(characterGroundContact);

  // Create hitbox mesh for visualization
  const hitboxGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 16);
  const hitboxMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00, wireframe: true });
  const hitboxMesh = new THREE.Mesh(hitboxGeo, hitboxMat);

  return { characterBody, hitboxMesh };
}


export function clampVelocity(body) {
  if (Math.abs(body.velocity.x) < 0.005) body.velocity.x = 0;
  if (Math.abs(body.velocity.z) < 0.005) body.velocity.z = 0;
  if (Math.abs(body.velocity.y) < 0.005) body.velocity.y = 0;
}

export function updatePhysics(deltaTime, ground, groundBody) {
  if (!gameState.characterBody || !gameState.character) {
    console.log('Character or body not found');
    return;
  }
  ground.position.copy(groundBody.position);
  ground.quaternion.copy(groundBody.quaternion);


  gameState.character.position.copy(gameState.characterBody.position);
  gameState.character.position.y -= 0.9;

  gameState.characterBody.quaternion.setFromEuler(0, 0, 0);
  gameState.characterBody.angularVelocity.set(0, 0, 0);
  clampVelocity(gameState.characterBody);
  gameState.world.step(1 / 60, deltaTime);
}

export function createBorders(world) {
  const leftBorder = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.1, 100, 100)),
  });
  leftBorder.position.set(-50, 50, 0);
  world.addBody(leftBorder);

  const rightBorder = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.1, 100, 100)),
  });
  rightBorder.position.set(50, 50, 0);
  world.addBody(rightBorder);

  const backBorder = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(100, 100, 0.1)),
  });
  backBorder.position.set(0, 50, -50);
  world.addBody(backBorder);
  
  const frontBorder = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(100, 100, 0.1)),
  });
  frontBorder.position.set(0, 50, 50);
  world.addBody(frontBorder);
  
}

export function createWall(width, height, depth, world, scene, x, y, z, rotate90 = false) {
  const wallBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
    position: new CANNON.Vec3(x, y, z),
  });
  if (rotate90) {
    wallBody.quaternion.setFromEuler(0, Math.PI / 2, 0); 
  }
  world.addBody(wallBody);
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  if (rotate90) {
    mesh.rotation.y = Math.PI / 2;
  }
  scene.add(mesh);
  return { wallBody, mesh };
}

export function initPhysicalBodies(scene, world) {

  let walls = [
  createWall(7.5, 5, 0.3, world, scene, 2.6, 2, -0.8),
  createWall(1.2, 5, 0.3, world, scene, -3.2, 2, -0.8),
  createWall(9.3, 5, 0.3 , world, scene, 1.3, 2, 3.7),
  createWall(10, 5, 0.3, world, scene, 1.2, 2, -6.4),
  createWall(2, 5, 0.3, world, scene, -3.7, 2, 2.8, true),
  createWall(3.5, 5, 0.3, world, scene, 0.2, 2, -2.7, true),
  createWall(0.3, 5, 0.3, world, scene, 0.2, 2, -6, true),
  createWall(7, 5, 0.3, world, scene, -3.7, 2, -3.2, true),
  createWall(10, 5, 0.3, world, scene, 6, 2, -1, true)
  ];

  walls.forEach(({ mesh }) => scene.remove(mesh));
}

