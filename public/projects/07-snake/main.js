// Game loop variables
let loopCounter = 0;
let lastTime = 0;

// Main loop
function draw(time = 0) {
  requestAnimationFrame(draw);
  if (GAME.gameOver) return;
  const deltaTime = time - lastTime;
  lastTime = time;
  loopCounter += deltaTime;

  // Loop interval
  if (loopCounter > 120) {
    clear();
    fill("#000");
    Snake.update();

    drawGrid();
    Snake.draw(ctx, COLOR_TYPES[SNAKE_IDX][0], COLOR_TYPES[SNAKE_IDX][1]);
    Food.draw(ctx);

    if (GAME.gameOver) {
      $menu.style.display = "block";
      $menuScoreSpan.textContent = Snake.score;
      $menuMaxScoreSpan.textContent = Snake.maxScore;
    }
    loopCounter = 0;
  }
}

// Update score functions
function setScore(n, n2) {
  if ($scoreSpan) {
    $scoreSpan.textContent = n;
    setMaxScore(n2);
  }
}
function setMaxScore(n) {
  if ($maxScoreSpan) $maxScoreSpan.textContent = n;
}

// Draw background grid
function drawGrid() {
  for (let i = 0; i < COLUMNS; i++) {
    for (let j = 0; j < ROWS; j++) {
      ctx.fillStyle =
        (i + j) % 2 === 0
          ? COLOR_BACKGROUND[BG_IDX][0]
          : COLOR_BACKGROUND[BG_IDX][1];
      ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

// Setup function
function setup() {
  size(GAME.width, GAME.height);
  Food.init();
  draw();
}

addEventListener("DOMContentLoaded", () => {
  const $menuStartButton = document.getElementById("start");
  $menuStartButton.addEventListener("click", () => {
    resetGame();
    Food.x = 13;
    Food.y = ~~(ROWS / 2);
    $menu.style.display = "none";
  });
  setup();
});
