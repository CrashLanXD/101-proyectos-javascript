// The game board!
class Board {
  // Initialize properties
  constructor() {
    this.cols = BOARD_COLS;
    this.rows = BOARD_ROWS;
    this.cellSize = CELL_SIZE;
    this.width = BOARD_WIDTH;
    this.height = BOARD_HEIGHT;
    this.grid = this.init();
  }

  // Crete the grid
  init() {
    return Array.from({ length: this.cols }, () => Array(this.rows).fill(0));
  }

  // Draw the solidified blocks
  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const shape = this.grid[i][j];
        if (shape > 0) {
          drawBlock(i * CELL_SIZE, j * CELL_SIZE, shape);
        }
      }
    }
  }

  // debug
  drawGrid() {
    for (let i = 0; i <= this.cols; i++) {
      fill(i * this.cellSize + offset, 0, 1, this.height, "red");
    }
    for (let i = 0; i <= this.rows; i++) {
      fill(0 + offset, i * this.cellSize, this.width, 1, "rgb(0, 0, 255)");
    }
  }

  removeRows() {
    let rowsDestroyed = 0;
    // Iterate from the lowest to the highest row
    for (let j = this.rows - 1; j >= 0; j--) {
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
        lines++;
        rowsDestroyed++;
        if (lines % 10 === 0) level++;
        if (level > maxLevel) maxLevel = level;
        j++;
      }
    }
    calculateScore(rowsDestroyed);
  }
}

function calculateScore(linesCompleted) {
  switch (linesCompleted) {
    case 1:
      score += 40 * level;
      break;
    case 2:
      score += 100 * level;
      break;
    case 3:
      score += 300 * level;
      break;
    case 4:
      score += 1200 * level;
      break;
    default:
      break;
  }
}
