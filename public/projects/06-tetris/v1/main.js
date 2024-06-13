// ! UPDATE !
/**
 * This code is not recommended for use.
 * It will be updated very soon.
 */

// VARIABLES
let score = 0; // Player's score
let lines = 0; // Destroyed lines
let level = 1; // each 10 lines destroyed ++
let maxLevel = 1;
let isGameOver = false; // Flag to indicate game over
let board; // Game board
let piece; // Current falling piece
let nextPiece; // Next piece to appear
let offset = CELL_SIZE * 2; // Offset for rendering

function restartGame() {
  isGameOver = true;

  setTimeout(() => {
    deadEffect(() => {
      clear(() => {
        board = new Board();
        piece.spawn();
        score = 0;
        level = 1;
        lines = 0;
        isGameOver = false;
        draw();
      });
    });
  }, 10);

  function deadEffect(callback) {
    for (let j = BOARD_ROWS; j > 0; j--) {
      setTimeout(() => {
        for (let i = 0; i < BOARD_COLS; i++) {
          setTimeout(() => {
            drawBlock(i * CELL_SIZE, j * CELL_SIZE - CELL_SIZE, 8);
          }, 20);
        }
      }, (BOARD_ROWS - j) * 20);
    }

    setTimeout(callback, 1100);
  }

  function clear(callback) {
    for (let j = BOARD_ROWS; j > 0; j--) {
      setTimeout(() => {
        for (let i = 0; i < BOARD_COLS; i++) {
          setTimeout(() => {
            fill(
              offset + i * CELL_SIZE,
              j * CELL_SIZE - CELL_SIZE,
              CELL_SIZE,
              CELL_SIZE,
              COLORS.lightGreen
            );
          }, 20);
        }
      }, (BOARD_ROWS - j) * 20);
    }

    setTimeout(callback, 1000);
  }
}

// Function to initialize the game
function init() {
  // Initialize board, piece and next piece
  board = new Board();
  piece = new Piece();
  nextPiece = new Piece();

  // Set canvas size
  size(board.width + offset * 5, board.height + 1);

  // Spawn the piece
  piece.spawn();

  // Draw the background
  fill(0, 0, $canvas.width, $canvas.height, COLORS.darkGreen);

  // Draw the static ui
  drawStaticUI();

  // Initialize the keyboard listener
  addEventListener("keydown", (e) => {
    if ((e.key === "ArrowLeft" || e.key.toLowerCase() === "a") && !isGameOver)
      updatePiecePos(-1, 0);
    if ((e.key === "ArrowRight" || e.key.toLowerCase() === "d") && !isGameOver)
      updatePiecePos(1, 0);
    if ((e.key === "ArrowDown" || e.key.toLowerCase() === "s") && !isGameOver)
      updatePiecePos(0, 1);

    if ((e.key === "ArrowUp" || e.key.toLowerCase() === "w") && !isGameOver)
      piece.rotate();
  });

  // FOR MOBILE DEVICES
  if (isMobileDevice()) addTouchControls();
}

//#region MOBILE DEVICES

// Function to check if the device is mobile
function isMobileDevice() {
  // Check if the user agent indicates a mobile device
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Function to add touch controls for mobile devices
function addTouchControls() {
  // Get the buttons from the DOM
  // Make them visible
  const $left = document.querySelector(".left");
  $left.style.opacity = "100%";
  const $right = document.querySelector(".right");
  $right.style.opacity = "100%";
  const $down = document.querySelector(".down");
  $down.style.opacity = "100%";
  const $rotate = document.querySelector(".rotate");
  $rotate.style.opacity = "100%";

  let leftInterval, rightInterval, downInterval;
  // Add the listeners for left and right buttons
  $left.addEventListener("touchstart", () => {
    if (!isGameOver) {
      updatePiecePos(-1, 0);
      leftInterval = setInterval(() => {
        updatePiecePos(-1, 0);
      }, 100);
    }
  });
  $left.addEventListener("touchend", () => clearInterval(leftInterval));

  $right.addEventListener("touchstart", () => {
    if (!isGameOver) {
      updatePiecePos(1, 0);
      rightInterval = setInterval(() => {
        updatePiecePos(1, 0);
      }, 100);
    }
  });
  $right.addEventListener("touchend", () => clearInterval(rightInterval));

  // Add the listener for down button
  $down.addEventListener("touchstart", () => {
    if (!isGameOver) {
      updatePiecePos(0, 1);
      downInterval = setInterval(() => {
        updatePiecePos(0, 1);
      }, 100);
    }
  });
  $down.addEventListener("touchend", () => clearInterval(downInterval));

  // Add the listener for the rotate piece button
  $rotate.addEventListener("touchstart", () => {
    if (!isGameOver) piece.rotate();
  });
}

//#endregion

// Game loop function
let dropCounter = 0;
let lastTime = 0;
function draw(time = 0) {
  if (!isGameOver) window.requestAnimationFrame(draw);
  const deltaTime = time - lastTime;
  lastTime = time;

  const dropInterval = 1000 * (0.8 - (level - 1) * 0.007);

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    updatePiecePos(0, 1);
    dropCounter = 0;
  }

  // Draw the dynamic ui
  drawDynamicUI();

  // Draw the solidified pieces
  board.draw();
  // Draw the player piece
  piece.draw();
}

// Function to draw the dynamic ui elements
function drawDynamicUI() {
  // Clear the grid
  fill(CELL_SIZE * 2, 0, BOARD_WIDTH, BOARD_HEIGHT, COLORS.lightGreen);

  // Draw the score
  fill(BOARD_WIDTH + offset + 33, 81, 210, 27, COLORS.lightGreen);
  text(score, BOARD_WIDTH + offset * 2 - 17, 107, COLORS.darkGreen, 32);

  // Draw the level
  fill(BOARD_WIDTH + offset * 2 + 7, 200, 137, 29, COLORS.lightGreen);
  text(maxLevel, BOARD_WIDTH + offset * 2 + 12, 227, COLORS.darkGreen, 32);

  // Draw the lines
  fill(BOARD_WIDTH + offset * 2 + 7, 285, 137, 29, COLORS.lightGreen);
  text(lines, BOARD_WIDTH + offset * 2 + 12, 312, COLORS.darkGreen, 32);

  // Draw the next piece preview
  fill(BOARD_WIDTH + 139, BOARD_HEIGHT - 168, 132, 135, COLORS.lightGreen);
  piece.drawNextPiece();
}

// Function to draw static ui elements
function drawStaticUI() {
  // GRID
  fill(
    CELL_SIZE - 3,
    0,
    BOARD_WIDTH + offset + 6,
    BOARD_HEIGHT,
    COLORS.lightGreen
  );

  // Draw the walls
  // left
  for (let i = 0; i < 21; i++) {
    drawWalls(CELL_SIZE, i * 26.4);
  }
  // right
  for (let i = 0; i < 21; i++) {
    drawWalls(BOARD_WIDTH + offset, i * 26.4);
  }

  // Draw the score background
  fill(BOARD_WIDTH + offset + 33, 45, 210, 70, COLORS.lightGreen);

  fill(BOARD_WIDTH + offset + 33, 50, 210, 30, COLORS.green);

  fill(BOARD_WIDTH + offset + 33, 73, 210, 4, COLORS.lightGreen);

  fill(BOARD_WIDTH + offset + 33, 109, 210, 3, COLORS.green);

  // SCORE AREA
  textArea(20, 45);

  // LEVEL AREA
  textArea(160, 80);

  // LINES AREA
  textArea(245, 80);

  // NEXT PIECE AREA
  fill(BOARD_WIDTH + 130, BOARD_HEIGHT - 180, 150, 160, COLORS.lightGreen);
  fill(BOARD_WIDTH + 124, BOARD_HEIGHT - 175, 161, 150, COLORS.lightGreen);

  fill(BOARD_WIDTH + 132, BOARD_HEIGHT - 170, 145, 140, COLORS.darkGreen);
  fill(BOARD_WIDTH + 136, BOARD_HEIGHT - 173, 138, 146, COLORS.darkGreen);

  fill(BOARD_WIDTH + 139, BOARD_HEIGHT - 168, 132, 135, COLORS.lightGreen);

  // TEXT
  text("SCORE", BOARD_WIDTH + offset * 2 + 27, 54.2, COLORS.darkGreen);
  text("LEVEL", BOARD_WIDTH + offset + 84, 199, COLORS.darkGreen, 32);
  text("LINES", BOARD_WIDTH + offset + 83, 284, COLORS.darkGreen, 32);
}

function textArea(y, h) {
  fill(BOARD_WIDTH + offset * 2, y, 150, h, COLORS.lightGreen);
  fill(BOARD_WIDTH + offset * 2 - 4, y + 4, 158, h - 8, COLORS.lightGreen);

  fill(BOARD_WIDTH + offset * 2 + 2, y + 6, 146, h - 12, COLORS.green);
  fill(BOARD_WIDTH + offset * 2 + 6, y + 4, 139, h - 8, COLORS.green);

  fill(BOARD_WIDTH + offset * 2 + 11, y + 7.5, 129, h - 15, COLORS.lightGreen);
  fill(BOARD_WIDTH + offset * 2 + 6, y + 10, 139, h - 21, COLORS.lightGreen);
}

// Initialize the game
init();
// Start the game loop
draw();
// :D
