// CONSTANTS
const BOARD_COLS = 10;
const BOARD_ROWS = 20;
const CELL_SIZE = 30;
const BOARD_WIDTH = BOARD_COLS * CELL_SIZE;
const BOARD_HEIGHT = BOARD_ROWS * CELL_SIZE;

const COLORS = {
  bgGrid: "#c4cfa1",
  blockBorder: "#414141",
  block: "#8b956d",
  bgMenu: "#414141",
  green: "#6b7353 ",
  font: "#414141",
};

const PIECES = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1],
    [1, 1],
    [1, 0],
  ],
  [
    [1, 0],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 0],
  ],
];

let score = 0;

function drawBlock(x, y, fillColor, strokeWidth, strokeColor) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
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
      rect(i * this.cellSize, 0, 1, this.height, COLORS.font);
    }
    for (let i = 0; i <= this.rows; i++) {
      rect(0, i * this.cellSize, this.width, 1, COLORS.font);
    }
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.grid[i][j] > 0) {
          drawBlock(
            i * CELL_SIZE,
            j * CELL_SIZE,
            COLORS.block,
            3,
            COLORS.blockBorder
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
            COLORS.block,
            3,
            COLORS.blockBorder
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

let isGameOver = false;
let board;
let piece;
function init() {
  board = new Board();
  piece = new Piece();

  size(board.width + 200, board.height + 1);

  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
      updatePiecePos(-1, 0);
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
      updatePiecePos(1, 0);
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s")
      updatePiecePos(0, 1);

    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") piece.rotate();
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

  fill(0, 0, BOARD_WIDTH, BOARD_HEIGHT, COLORS.bgGrid);
  fill(BOARD_WIDTH, 0, BOARD_WIDTH, BOARD_HEIGHT, COLORS.bgMenu);
  fill(BOARD_WIDTH + 10, 60, BOARD_WIDTH - 120, 70, COLORS.bgGrid);
  text("SCORE", BOARD_WIDTH + 50, 90, COLORS.blockBorder);
  text(score, BOARD_WIDTH + 90, 120, COLORS.blockBorder);
  board.draw();
  board.drawGrid();
  piece.draw();
}

init();
draw();
