// ?LOGIC
//#region LOGIC
function gameLoop() {
  player.move();
  player.spawnBullet();
  updateBullets();
}

//#endregion

// !DRAW
//#region DRAW

const clearCanvas = (clearFloor) => {
  if (clearFloor) {
    CTX.clearRect(0, 0, $CANVAS.width, $CANVAS.height)
    return;
  }
  CTX.clearRect(0, 0, $CANVAS.width, $CANVAS.height - 60)
};

function drawFloor() {
  CTX.fillStyle = COLORS.floor;
  CTX.fillRect(0, HEIGHT - 60, WIDTH, HEIGHT)
  CTX.fillStyle = '#000';
  CTX.fillRect(0, HEIGHT - 60, 60, 5)
  CTX.fillRect(0, HEIGHT - 60, 70, 2.5)
}

//#endregion
drawFloor();
function animate() {
  requestAnimationFrame(animate);
  if (checkFPS()) return;

  // !DRAW
  clearCanvas(true);
  player.draw();

  grid.move();
  grid.draw();
  drawFloor();

  // ?LOGIC

  gameLoop();
  // drawFPS();
  drawLives();
}

initializeEvents();
animate();
