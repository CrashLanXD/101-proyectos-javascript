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
            COLORS.block,
            3,
            COLORS.blockBorder
          );
        }
      });
    });
  }

  checkCollision(dx, dy) {
    for (let x = 0; x < this.shape.length; x++) {
      for (let y = 0; y < this.shape[0].length; y++) {
        if (
          this.position.x + x + dx < 0 ||
          this.position.x + x + dx >= BOARD_COLS ||
          this.position.y + y + dy < 0 ||
          this.position.y + y + dy >= BOARD_ROWS
        )
          return true;

        if (
          this.shape[x][y] !== 0 &&
          board.grid[this.position.x + x + dx][this.position.y + y + dy] !== 0
        )
          return true;
      }
    }
    return false;
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
  }
}

function updatePiecePos(dx, dy) {
  if (!piece.checkCollision(dx, dy)) {
    piece.position.x += dx;
    piece.position.y += dy;
  } else {
    if (dy > 0 && !piece.checkCollision(0, 1)) {
      piece.position.y++;
    } else if (!piece.locked) {
      piece.lock();
      piece.spawn();
    }
  }
}

let board;
let piece;
function init() {
  board = new Board();
  piece = new Piece();

  for (let i = 0; i < board.cols - 2; i++) {
    board.grid[i][board.rows - 1] = 1;
  }
  size(board.width + 1, board.height + 1);

  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
      updatePiecePos(-1, 0);
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
      updatePiecePos(1, 0);
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s")
      updatePiecePos(0, 1);

    // ! DELETE ME!
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w")
      updatePiecePos(0, -1);
  });
}

function draw() {
  fill(COLORS.bgGrid);
  board.draw();
  board.drawGrid();
  piece.draw();
}

init();
repeat(draw, f);
