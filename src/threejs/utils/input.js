import { gameState } from "@/threejs/utils/state.js";

export function setupInputHandlers() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
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
