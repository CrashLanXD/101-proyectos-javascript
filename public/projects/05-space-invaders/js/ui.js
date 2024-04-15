//#region FPS
const FPS = 60;
const MS_PER_FRAME = 1000 / FPS;

let msPrev = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
let frames = 0;
let framesPerSec = FPS;

function checkFPS() {
  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  if (msPassed < MS_PER_FRAME) return false;

  const excessTime = msPassed % MS_PER_FRAME;
  msPrev = msNow - excessTime;

  frames++;

  if (msFPSPrev < msNow) {
    msFPSPrev = window.performance.now() + 1000;
    framesPerSec = frames;
    frames = 0;
  }
}

function drawFPS() {
  CTX.font = "17px system-ui";
  CTX.fillStyle = "white";
  CTX.fillText(`FPS: ${framesPerSec}`, 5, 18);
}

function drawLives() {
  for (let i = 0; i < lives; i++) {
    CTX.fillStyle = COLORS.player;
    CTX.fillRect((OFFSET - 20) + (i * 14), player.position.y + 35, 8, 18)
  }
}
//#endregion
