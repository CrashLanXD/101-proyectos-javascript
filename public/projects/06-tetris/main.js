let score = 0;
let isGameOver = false;
let board;
let piece;
let offset = CELL_SIZE * 2;

function drawBlock(x, y, fillColor, strokeWidth, strokeColor) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x + offset, y, CELL_SIZE, CELL_SIZE);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.strokeRect(x + offset, y, CELL_SIZE, CELL_SIZE);
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
          drawBlock(
            i * CELL_SIZE,
            j * CELL_SIZE,
            COLORS.green,
            3,
            COLORS.darkGreen
          );
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

        // Increment j to recheck the same row after deleting it
        j++;
        score += 10;
      }
    }
  }
}

class Piece {
  constructor() {
    this.shape = [
      [1, 0],
      [1, 1],
      [1, 0],
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
            COLORS.green,
            3,
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
    piece.shape = PIECES[random(0, PIECES.length - 1)];
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
    isGameOver = false;
    draw();
  }, 1500);
}

function init() {
  board = new Board();
  piece = new Piece();

  size(board.width + offset * 5, board.height + 1);

  // DRAW
  // BACKGROUND
  fill(0, 0, $canvas.width, $canvas.height, COLORS.darkGreen);

  // UI
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
  $down.addEventListener("touchstart", () => temp = setInterval(() => updatePiecePos(0, 1), 100));
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

  drawUI();

  // text("SCORE", BOARD_WIDTH + 50, 90, COLORS.darkGreen);
  // text(score, BOARD_WIDTH + 90, 120, COLORS.darkGreen);
  board.draw();
  piece.draw();
}

function drawUI(params) {
  // BACKGROUND
  // fill(0, 0, $canvas.width, $canvas.height, COLORS.darkGreen);

  // GRID
  fill(
    CELL_SIZE - 3,
    0,
    BOARD_WIDTH + offset + 6,
    BOARD_HEIGHT,
    COLORS.lightGreen
  );

  // WALLS
  fill(CELL_SIZE, 0, CELL_SIZE, BOARD_HEIGHT, COLORS.green); // L
  fill(BOARD_WIDTH + offset, 0, CELL_SIZE, BOARD_HEIGHT, COLORS.green); // R

  text("SCORE", BOARD_WIDTH + offset * 2 + 35, 52, COLORS.darkGreen);
  fill(BOARD_WIDTH + offset + 33, 81, 210, 24, COLORS.lightGreen);
  text(score, BOARD_WIDTH + offset * 2, 102.5, COLORS.darkGreen);
}

function drawStaticUI() {
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
    107,
    210,
    4,
    COLORS.green
  );

  // SCORE AREA
  fill(BOARD_WIDTH + offset * 2, 20, 150, 45, COLORS.lightGreen);
  fill(BOARD_WIDTH + offset * 2 - 4, 24, 158, 37, COLORS.lightGreen);

  fill(BOARD_WIDTH + offset * 2 + 2, 26, 146, 33, COLORS.green);
  fill(BOARD_WIDTH + offset * 2 + 6, 24, 139, 37, COLORS.green);

  fill(BOARD_WIDTH + offset * 2 + 11, 27.5, 129, 30, COLORS.lightGreen);
  fill(BOARD_WIDTH + offset * 2 + 6, 30, 139, 24, COLORS.lightGreen);
}
init();
draw();
