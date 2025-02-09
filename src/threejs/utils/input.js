import { gameState } from "@/threejs/utils/state.js";

export function setupInputHandlers() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

function onKeyDown(event) {
  if (!gameState.character || !gameState.mixer) return;

  const keyActions = {
    w: () => { gameState.keys.w = true; },
    a: () => { gameState.keys.a = true; },
    s: () => { gameState.keys.s = true; },
    d: () => { gameState.keys.d = true; },
    shift: () => { gameState.keys.shift = true; },
    t: () => {
      gameState.keys.t = gameState.keys.t === 1 ? 2 : 1;
    },
    space: () => { gameState.keys.space = true; }
  };

  const action = keyActions[event.key.toLowerCase()];
  if (action) action();
}

function onKeyUp(event) {
  if (!gameState.character || !gameState.mixer) return;

  const keyActions = {
    w: () => gameState.keys.w = false,
    a: () => gameState.keys.a = false,
    s: () => gameState.keys.s = false,
    d: () => gameState.keys.d = false,
    shift: () => gameState.keys.shift = false,
    space: () => gameState.keys.space = true
  };

  const action = keyActions[event.key.toLowerCase()];
  if (action) action();
}

function onMouseDown(event) {
  if (gameState.keys.t === 2) {
    gameState.isDraggingCamera = true;
    gameState.lastMouseY = event.clientY;
  }
}

function onMouseMove(event) {
  if (gameState.isDraggingCamera && gameState.keys.t === 2) {
    const deltaY = event.clientY - gameState.lastMouseY;
    gameState.lastMouseY = event.clientY;

    const sensitivity = 0.002;
    gameState.cameraVerticalAngle -= deltaY * sensitivity;
    
    const maxAngle = Math.PI/2 - 0.1; // ~85 degrees
    gameState.cameraVerticalAngle = Math.max(-maxAngle, 
      Math.min(gameState.cameraVerticalAngle, maxAngle));
  }
}

function onMouseUp() {
  gameState.isDraggingCamera = false;
}