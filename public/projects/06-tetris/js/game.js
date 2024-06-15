/* <| only in debug mode, not available in real game ;) |>
let isDebugMode = false;
function drawDebugBlocks() {
  if (!isDebugMode) return;
  color([255, 255, 0]);
  rect(0, 0, W, H);
  for (let i = 0; i < ROWS; i++)
    Object.values(BLOCK_TYPES).forEach((block, idx) =>
      drawBlock(i + BLOCK_SIZE * idx, i * BLOCK_SIZE, block)
    );
  for (let i = 0; i < ROWS; i++)
    Object.values(BLOCK_TYPES).forEach((block, idx) =>
      drawBlock(BLOCK_SIZE * idx + 88, i * BLOCK_SIZE, block)
    );
}
<| ;( |> */

function addKeyListener() {
  addEventListener("keydown", (e) => {
    const { key } = e;

    switch (key) {
      // Movement keys
      case "a": // Move left (WASD)
      case "ArrowLeft": // Move left (Arrow key)
        piece.move(-1, 0);
        break;
      case "s": // Move down (WASD)
      case "ArrowDown": // Move down (Arrow key)
        piece.move(0, 1);
        break;
      case "d": // Move right (WASD)
      case "ArrowRight": // Move right (Arrow key)
        piece.move(1, 0);
        break;

      // Rotation keys
      case "w": // Rotate clockwise (WASD)
      case "ArrowUp": // Rotate clockwise (Arrow key)
        piece.rotate({ clockwise: true });
        break;
      case "q": // Rotate counterclockwise (Arrow key)
        piece.rotate({ clockwise: false });
        break;

      // Game keys
      case "p": // switch game over state (game key)
        isGamePaused = !isGamePaused;
        break;

      /* <| only in debug mode, not available in real game ;) |>
      // Debugging keys
      case "r": // Randomize piece shape (debug key)
        piece.shape = piece.randPiece();
        break;
      case "f": // Drop piece instantly (debug key)
        while (!piece.checkCollision(0, 1)) piece.move(0, 1);
        piece.lock();
        break;
      case " ": // Move up (debug key)
        piece.move(0, -1);
        break;
      case ";": // Draw debug blocks (debug key)
        isDebugMode = !isDebugMode;
        break;
      case "g": // Redraw ui (debug key)
        drawStaticUI();
        break;
      case "h": // Play death effect (debug key)
        deathEffect();
        break;
      case "l": // lock piece (debug key)
        piece.lock();
        break;
      <| :D |> */
    }
  });
}

function addTouchControls() {
  const $left = document.getElementById("left");
  const $right = document.getElementById("right");
  const $down = document.getElementById("down");
  const $b = document.getElementById("b");
  const $a = document.getElementById("a");

  let leftInterval, rightInterval, downInterval;

  function startMovingLeft() {
    leftInterval = setInterval(() => piece.move(-1, 0), 130);
  }

  function startMovingRight() {
    rightInterval = setInterval(() => piece.move(1, 0), 130);
  }

  function startMovingDown() {
    downInterval = setInterval(() => piece.move(0, 1), 80);
  }

  function stopMovingLeft() {
    clearInterval(leftInterval);
  }

  function stopMovingRight() {
    clearInterval(rightInterval);
  }

  function stopMovingDown() {
    clearInterval(downInterval);
  }

  $left.addEventListener("touchstart", startMovingLeft);
  $left.addEventListener("touchend", stopMovingLeft);
  $left.addEventListener("touchcancel", stopMovingLeft);
  $left.addEventListener("click", () => piece.move(-1, 0));

  $right.addEventListener("touchstart", startMovingRight);
  $right.addEventListener("touchend", stopMovingRight);
  $right.addEventListener("touchcancel", stopMovingRight);
  $right.addEventListener("click", () => piece.move(1, 0));

  $down.addEventListener("touchstart", startMovingDown);
  $down.addEventListener("touchend", stopMovingDown);
  $down.addEventListener("touchcancel", stopMovingDown);
  $down.addEventListener("click", () => piece.move(0, 1));

  $b.addEventListener("click", () => piece.rotate({ clockwise: false }));
  $a.addEventListener("click", () => piece.rotate({ clockwise: true }));
}

function deathEffect() {
  // fill
  const timeout = 15;
  for (let j = ROWS; j >= 0; j--)
    setTimeout(() => {
      for (let i = 0; i < COLS; i++)
        setTimeout(
          () =>
            drawBlock(
              OFFSET_X + i * BLOCK_SIZE,
              j * BLOCK_SIZE,
              BLOCK_TYPES["death"]
            ),
          timeout
        );
    }, (ROWS - j) * timeout);

  // clear
  setTimeout(() => {
    for (let j = ROWS; j >= 0; j--)
      setTimeout(() => {
        for (let i = 0; i < COLS; i++)
          setTimeout(
            () => clear(OFFSET_X + i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE),
            timeout
          );
      }, (ROWS - j) * timeout);
  }, 800);
}

function setScore(n) {
  score = Math.min(n, MAX_SCORE);
  setNumber(score, "score");
}

function setLevel(n) {
  level = Math.min(n, MAX_LEVEL);
  setNumber(level, "level");
  TASK_INTERVAL = getTaskInterval(level);
}

function setLines(n) {
  lines = Math.min(n, MAX_LINES);
  setNumber(lines, "lines");

  const newLevel = ~~(lines / 10);
  if (newLevel > level) setLevel(newLevel);
}

function getTaskInterval(level) {
  return TASK_INTERVALS[level] ?? 0;
}

function main() {
  const $changePallete = document.getElementById("changePallete");
  $changePallete.addEventListener("change", (e) =>
    setPallete(COLOR_PALLETES[e.target.value])
  );

  const $changeLevel = document.getElementById("changeLevel");
  $changeLevel.addEventListener("change", (e) =>
    setLevel(parseInt(e.target.value))
  );

  const $pauseButton = document.getElementById("pauseButton");
  $pauseButton.addEventListener("click", () => {
    $pauseButton.classList.toggle("paused");
    isGamePaused = !isGamePaused;
  });

  board = new Board();
  piece = new Piece();

  TASK_INTERVAL = getTaskInterval(level);

  setPallete(COLOR_PALLETES[$changePallete.value ?? "color"]);
  drawStaticUI();
  drawDynamicUI();

  addKeyListener();
  addTouchControls();

  tick();
}

function tick(timeStamp) {
  if (timeStamp - lastFrameTime >= FRAME_DURATION) {
    lastFrameTime = timeStamp;

    if (!isGamePaused) {
      clear(0 + OFFSET_X, 0, board.w, board.h);
      board.update();
      piece.draw();

      // <| only in debug mode, not available in real game ;) |>
      // drawDebugBlocks();

      if (timeStamp - lastTaskTime >= TASK_INTERVAL) {
        lastTaskTime = timeStamp;

        piece.move(0, 1);
      }
    }
  }
  requestAnimationFrame(tick);
}

main();
