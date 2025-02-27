export class GameState {
    constructor() {
      this.character = null;
      this.mixer = null;
      this.animations = {};
      this.currentAction = null;
      this.facing = "back";
      this.keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false,
        space: false
      };
      this.loadedObjects = false;
      this.objects = {
      };
      this.world = null;
      this.characterBody = null;
      this.sounds = {
        walking: null,
        running: null,
      };
      this.interactive = null;
      this.cameraVerticalAngle = 0;
      this.isDraggingCamera = false;
      this.lastMouseY = 0;
    }
  }
  
export const gameState = new GameState();
  