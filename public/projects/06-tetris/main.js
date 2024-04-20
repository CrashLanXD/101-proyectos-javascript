let score = 0;
let isGameOver = false;
let board;
let piece;
let nextPiece;
let offset = CELL_SIZE * 2;

function drawBlock(x, y, strokeWidth, strokeColor) {
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(x + offset, y, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeRect(x + offset + 2, y + 2, CELL_SIZE - 3, CELL_SIZE - 3);

  ctx.lineWidth = 4;
  ctx.strokeRect(x + offset + 9.4, y + 9.4, CELL_SIZE - 18, CELL_SIZE - 18);
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(x + offset + 11, y + 11, CELL_SIZE - 22, CELL_SIZE - 22);
}

class Board {
  constructor() {
    this.cols = BOARD_COLS;
    this.rows = BOARD_ROWS;
    this.cellSize = CELL_SIZE;
    this.width = BOARD_WIDTH;
    this.height = BOARD_HEIGHT;
    this.grid = [];
    this.init();
  }

  init() {
    this.grid = make2DArray(this.cols, this.rows);
  }

  drawGrid() {
    for (let i = 0; i <= this.cols; i++) {
      rect(i * this.cellSize + offset, 0, 1, this.height, "red");
    }
    for (let i = 0; i <= this.rows; i++) {
      rect(offset, i * this.cellSize, this.width, 1, "blue");
    }
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.grid[i][j] > 0) {
          drawBlock(i * CELL_SIZE, j * CELL_SIZE, 5, COLORS.darkGreen);
        }
      }
    }
  }

  removeRows() {
    // Iterate from the lowest to the highest row
    for (let j = this.rows; j >= 0; j--) {
      let rowCompleted = true;
      // Check if the current row all elements are non zero
      for (let i = 0; i < this.cols; i++) {
        if (this.grid[i][j] === 0) {
          // If at least one is zero, the row is not complete
          rowCompleted = false;
          break;
        }
      }

      // If the row is completed, delete it
      if (rowCompleted) {
        // Move the rows down to fill empty space left
        for (let k = j; k > 0; k--) {
          for (let i = 0; i < this.cols; i++) {
            this.grid[i][k] = this.grid[i][k - 1];
          }
        }

        // Fill the top row with zeros
        for (let i = 0; i < this.cols; i++) {
          this.grid[i][0] = 0;
        }

        // Score :D
        score += 100;
      }
    }
  }
}

class Piece {
  constructor() {
    this.shape = [
      [1, 1],
      [0, 1],
      [0, 1],
    ];
    this.position = {
      x: Math.floor((BOARD_COLS - this.shape.length) / 2),
      y: 0,
    };

    this.locked = false;
  }

  draw() {
    this.shape.forEach((col, i) => {
      col.forEach((block, j) => {
        if (block > 0) {
          drawBlock(
            (i + this.position.x) * CELL_SIZE,
            (j + this.position.y) * CELL_SIZE,
            5,
            COLORS.darkGreen
          );
        }
      });
    });
  }

  drawNextPiece() {
    fill(BOARD_WIDTH + 139, BOARD_HEIGHT - 168, 132, 135, COLORS.lightGreen);
    nextPiece.shape.forEach((col, i) => {
      col.forEach((block, j) => {
        if (block > 0) {
          drawBlock(
            i * CELL_SIZE + 400,
            j * CELL_SIZE + 380,
            5,
            COLORS.darkGreen
          );
        }
      });
    });
  }

  checkCollision(dx, dy, shape = this.shape) {
    for (let x = 0; x < shape.length; x++) {
      for (let y = 0; y < shape[0].length; y++) {
        if (
          this.position.x + x + dx < 0 ||
          this.position.x + x + dx >= BOARD_COLS ||
          this.position.y + y + dy < 0 ||
          this.position.y + y + dy >= BOARD_ROWS
        )
          return true;

        if (
          shape[x][y] !== 0 &&
          board.grid[this.position.x + x + dx][this.position.y + y + dy] !== 0
        )
          return true;
      }
    }
    return false; // no collision
  }

  lock() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        if (this.shape[i][j] !== 0) {
          if (
            this.position.y + j + 1 >= BOARD_ROWS ||
            board.grid[this.position.x + i][this.position.y + j + 1] !== 0
          ) {
            for (let i = 0; i < this.shape.length; i++) {
              for (let j = 0; j < this.shape[0].length; j++) {
                if (this.shape[i][j] !== 0) {
                  board.grid[this.position.x + i][this.position.y + j] = 1;
                }
              }
            }
            board.removeRows();
            this.locked = true;
            return;
          }
        }
      }
    }
    this.locked = false;
  }

  spawn() {
    piece = new Piece();
    piece.shape = nextPiece.shape;
    nextPiece = new Piece();
    nextPiece.shape = PIECES[random(0, PIECES.length - 1)];
  }

  rotate() {
    const rotated = [];
    const currentShape = this.shape;

    for (let i = 0; i < this.shape[0].length; i++) {
      const row = [];
      for (let j = this.shape.length - 1; j >= 0; j--) {
        row.push(currentShape[j][i]);
      }

      rotated.push(row);
    }

    if (!this.checkCollision(0, 0, rotated)) {
      this.shape = rotated;
    }
  }
}

function updatePiecePos(dx, dy) {
  if (!piece.checkCollision(dx, dy)) {
    piece.position.x += dx;
    piece.position.y += dy;
  } else {
    if (dy > 0 && piece.checkCollision(0, 1)) {
      piece.lock();
      piece.spawn();

      if (piece.checkCollision(0, 0)) {
        restartGame();
        return;
      }
    }
  }
}

function restartGame() {
  isGameOver = true;
  setTimeout(() => {
    board = new Board();
    piece = new Piece();
    score = 0;
    isGameOver = false;
    draw();
  }, 1500);
}

function init() {
  board = new Board();
  piece = new Piece();
  nextPiece = new Piece();

  size(board.width + offset * 5, board.height + 1);

  piece.spawn();

  // BACKGROUND
  fill(0, 0, $canvas.width, $canvas.height, COLORS.darkGreen);

  // STATIC UI
  drawStaticUI();

  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
      updatePiecePos(-1, 0);
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
      updatePiecePos(1, 0);
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s")
      updatePiecePos(0, 1);

    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") piece.rotate();
  });

  // !FOR MOBILE DEVICES
  if (isMobileDevice()) addTouchControls();
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function addTouchControls() {
  const $left = document.querySelector(".left");
  $left.style.opacity = "100%";
  const $right = document.querySelector(".right");
  $right.style.opacity = "100%";
  const $down = document.querySelector(".down");
  $down.style.opacity = "100%";
  const $rotate = document.querySelector(".rotate");
  $rotate.style.opacity = "100%";

  $left.addEventListener("click", () => {
    updatePiecePos(-1, 0);
  });
  $right.addEventListener("click", () => {
    updatePiecePos(1, 0);
  });

  let temp;
  $down.addEventListener("click", () => updatePiecePos(0, 1));
  $down.addEventListener(
    "touchstart",
    () => (temp = setInterval(() => updatePiecePos(0, 1), 100))
  );
  $down.addEventListener("touchend", () => clearInterval(temp));
  $down.addEventListener("touchcancel", () => clearInterval(temp));

  $rotate.addEventListener("click", () => {
    piece.rotate();
  });
}

let dropCounter = 0;
let lastTime = 0;

function draw(time = 0) {
  if (!isGameOver) window.requestAnimationFrame(draw);
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    updatePiecePos(0, 1);
    dropCounter = 0;
  }

  drawDynamicUI();

  board.draw();
  piece.draw();
}

function drawDynamicUI() {
  // GRID
  fill(
    CELL_SIZE * 2,
    0,
    BOARD_WIDTH,
    BOARD_HEIGHT,
    COLORS.lightGreen
  );

  text("SCORE", BOARD_WIDTH + offset * 2 + 27, 54.2, COLORS.darkGreen);
  fill(BOARD_WIDTH + offset + 33, 81, 210, 27, COLORS.lightGreen);
  text(score, BOARD_WIDTH + offset * 2, 107, COLORS.darkGreen, 32);

  // NEXT PIECE
  fill(BOARD_WIDTH + 139, BOARD_HEIGHT - 168, 132, 135, COLORS.lightGreen);
  piece.drawNextPiece();
}

function drawWalls(x, y) {
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = COLORS.darkGreen;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 3, CELL_SIZE - 3);

  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(x + 7.4, y + 7.4, CELL_SIZE - 14, 4);
  ctx.fillRect(x + 7.4, y + 7.8, 4, 12);
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(x + 7.4, y + 19.4, CELL_SIZE - 14, 4);
  ctx.fillRect(x + 19.4, y + 10.8, 4, 12);
}

function drawStaticUI() {
  // GRID
  fill(
    CELL_SIZE - 3,
    0,
    BOARD_WIDTH + offset + 6,
    BOARD_HEIGHT,
    COLORS.lightGreen
  );

  // WALLS
  for (let i = 0; i < BOARD_ROWS; i++) {
    drawWalls(CELL_SIZE, i * CELL_SIZE);
  }

  for (let i = 0; i < BOARD_ROWS; i++) {
    drawWalls(BOARD_WIDTH + offset, i * CELL_SIZE);
  }

  // SCORE
  fill(
    BOARD_WIDTH + offset + 33, //
    45,
    210,
    70,
    COLORS.lightGreen
  );

  fill(
    BOARD_WIDTH + offset + 33, //
    50,
    210,
    30,
    COLORS.green
  );

  fill(
    BOARD_WIDTH + offset + 33, //
    73,
    210,
    4,
    COLORS.lightGreen
  );

  fill(
    BOARD_WIDTH + offset + 33, //
    109,
    210,
    3,
    COLORS.green
  );

  // SCORE AREA
  fill(BOARD_WIDTH + offset * 2, 20, 150, 45, COLORS.lightGreen);
  fill(BOARD_WIDTH + offset * 2 - 4, 24, 158, 37, COLORS.lightGreen);

  fill(BOARD_WIDTH + offset * 2 + 2, 26, 146, 33, COLORS.green);
  fill(BOARD_WIDTH + offset * 2 + 6, 24, 139, 37, COLORS.green);

  fill(BOARD_WIDTH + offset * 2 + 11, 27.5, 129, 30, COLORS.lightGreen);
  fill(BOARD_WIDTH + offset * 2 + 6, 30, 139, 24, COLORS.lightGreen);

  // NEXT PIECE AREA
  fill(BOARD_WIDTH + 130, BOARD_HEIGHT - 180, 150, 160, COLORS.lightGreen);
  fill(BOARD_WIDTH + 124, BOARD_HEIGHT - 175, 161, 150, COLORS.lightGreen);

  fill(BOARD_WIDTH + 132, BOARD_HEIGHT - 170, 145, 140, COLORS.darkGreen);
  fill(BOARD_WIDTH + 136, BOARD_HEIGHT - 173, 138, 146, COLORS.darkGreen);

  fill(BOARD_WIDTH + 139, BOARD_HEIGHT - 168, 132, 135, COLORS.lightGreen);
}
init();
draw();
