import * as THREE from 'three';
import { BASE_PATH } from "@/threejs/utils/utils.js";
import { gameState } from "@/threejs/utils/state.js";


export async function initAudio(listener) {
  const audioLoader = new THREE.AudioLoader();

  gameState.sounds.walking = new THREE.Audio(listener);
  const walkBuffer = await audioLoader.loadAsync(`${BASE_PATH}Sounds/walkingSound.mp3`);
  gameState.sounds.walking.setBuffer(walkBuffer);
  gameState.sounds.walking.setLoop(true);
  gameState.sounds.walking.setVolume(0.1);

  gameState.sounds.running = new THREE.Audio(listener);
  const runBuffer = await audioLoader.loadAsync(`${BASE_PATH}Sounds/runningSound.mp3`);
  gameState.sounds.running.setBuffer(runBuffer);
  gameState.sounds.running.setLoop(true);
  gameState.sounds.running.setVolume(2);

  gameState.sounds.dance = new THREE.Audio(listener);
  const danceBuffer = await audioLoader.loadAsync(`${BASE_PATH}Sounds/dancemusic.mp3`);
  gameState.sounds.dance.setBuffer(danceBuffer);
  gameState.sounds.dance.setLoop(true);
  gameState.sounds.dance.setVolume(0.2);



}

export function fadeAudio(audio, fromVolume, toVolume, duration) {
  let startTime = null;

  function animateFade(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const newVolume = fromVolume + (toVolume - fromVolume) * progress;
    audio.setVolume(newVolume);

    if (progress < 1) {
      requestAnimationFrame(animateFade);
    } else {
      if (toVolume === 0) {
        audio.stop();
      }
    }
  }

  requestAnimationFrame(animateFade);
}

export function fadeInDance(audio, targetVolume = 0.2, duration = 1000) {
  if (!audio.isPlaying) {
    audio.setVolume(0);
    audio.play();
  }
  fadeAudio(audio, 0, targetVolume, duration);
}

export function fadeOutDance(audio, duration = 1000) {
  fadeAudio(audio, 0.2, 0, duration);
}
