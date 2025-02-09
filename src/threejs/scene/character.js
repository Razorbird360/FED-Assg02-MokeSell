import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BASE_PATH } from "@/threejs/utils/utils.js";
import { gameState } from "@/threejs/utils/state.js";


export function playAnimation(event) {
  if (!gameState.mixer) return;

  const animationMap = {
    idle: gameState.animations.idle,
    walk: gameState.animations.walk,
    run: gameState.animations.run,
    bwalk: gameState.animations.bwalk,
    dance: gameState.animations.dance
  };

  const targetAction = animationMap[event];
  if (!targetAction || gameState.currentAction === targetAction) return;

  targetAction.reset();
  targetAction.setEffectiveTimeScale(1.0);
  targetAction.setEffectiveWeight(1.0);
  targetAction.clampWhenFinished = true;

  if (gameState.currentAction) {
    targetAction.crossFadeFrom(gameState.currentAction, 0.5, true);
  }

  targetAction.play();
  gameState.currentAction = targetAction;
}

export function move(speed, deltaTime) {
  const direction = new THREE.Vector3(
    Math.sin(gameState.character.rotation.y),
    0,
    Math.cos(gameState.character.rotation.y)
  ).normalize();

  // Apply direction based on speed sign
  gameState.characterBody.velocity.set(
    direction.x * speed * deltaTime,
    gameState.characterBody.velocity.y,
    direction.z * speed * deltaTime
  );
}

function handleRunningSound() {
  if (gameState.sounds.walking.isPlaying) gameState.sounds.walking.stop();
  if (!gameState.sounds.running.isPlaying) gameState.sounds.running.play();
}

function handleWalkingSound() {
  if (gameState.sounds.running.isPlaying) gameState.sounds.running.stop();
  if (!gameState.sounds.walking.isPlaying) gameState.sounds.walking.play();
}

function stopMovementSounds() {
  if (gameState.sounds.walking.isPlaying) gameState.sounds.walking.stop();
  if (gameState.sounds.running.isPlaying) gameState.sounds.running.stop();
}


export function characterMovement(deltaTime) {
  const walkingSpeed = 150;
  const runningSpeed = 300;
  const backwardSpeed = 75;
  const turnSpeed = 3;

  if (gameState.keys.space) {
    gameState.dancing = true;
    playAnimation("dance");
    stopMovementSounds();
    gameState.characterBody.velocity.x = 0;
    gameState.characterBody.velocity.z = 0;
    return;
  } else {
    gameState.dancing = false;
  }

  if (!gameState.dancing) {
    if (gameState.keys.a) gameState.character.rotation.y += turnSpeed * deltaTime;
    if (gameState.keys.d) gameState.character.rotation.y -= turnSpeed * deltaTime;
  }

  if (gameState.keys.shift && gameState.keys.w) {
    move(runningSpeed, deltaTime);
    playAnimation("run");
    handleRunningSound();
  } else if (gameState.keys.w) {
    move(walkingSpeed, deltaTime);
    playAnimation("walk");
    handleWalkingSound();
  } else if (gameState.keys.s) {
    move(-backwardSpeed, deltaTime);
    playAnimation("bwalk");
    handleWalkingSound();
  } else if (gameState.keys.a || gameState.keys.d) {
    if (gameState.currentAction !== gameState.animations.walk) {
      playAnimation("walk");
    }
    move(0.1, deltaTime);
  } else {
    playAnimation("idle");
    stopMovementSounds();
    gameState.characterBody.velocity.x = 0;
    gameState.characterBody.velocity.z = 0;
  }
}

export async function initCharacter(scene) {
  const gltfloader = new GLTFLoader();
  let character = await gltfloader.loadAsync(`${BASE_PATH}models/adam/adam_animated.glb`);

  gameState.character = character.scene;
  scene.add(gameState.character);
  gameState.character.scale.set(1, 1, 1);
  gameState.character.position.set(0, 0, 0);

  gameState.mixer = new THREE.AnimationMixer(gameState.character);
  const clips = character.animations;

  const animationNames = ['idle', 'run', 'walk', 'bwalk', 'jump', 'dance'];
  animationNames.forEach(name => {
    gameState.animations[name] = gameState.mixer.clipAction(
      THREE.AnimationClip.findByName(clips, name)
    );
  });

  gameState.currentAction = gameState.animations.idle;
  gameState.animations.idle.play();
}

export function isMoving() {
  const velocity = gameState.characterBody.velocity;
  const moving = 
    Math.abs(velocity.x) > 0.02 ||
    Math.abs(velocity.y) > 0.02 ||
    Math.abs(velocity.z) > 0.02;
  return moving;
}
