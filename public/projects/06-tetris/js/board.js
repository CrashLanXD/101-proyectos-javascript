class Board {
  constructor() {
    this.cols = COLS;
    this.rows = ROWS;
    this.blockSize = BLOCK_SIZE;
    this.w = this.cols * this.blockSize;
    this.h = this.rows * this.blockSize;
    this.grid = this.init();
    this.points = [40, 100, 300, 1200];
  }

  init() {
    return Array.from({ length: this.cols }, () => Array(this.rows).fill(0));
  }

  restart() {
    this.grid = Array.from({ length: this.cols }, () =>
      Array(this.rows).fill(0)
    );
  }

  get(x, y) {
    return this.grid[x][y];
  }

  set(x, y, blockType) {
    this.grid[x][y] = BLOCK_TYPES[blockType];
  }

  removeRows() {
    let rowsRemoved = 0;

    for (let y = this.rows - 1; y >= 0; y--) {
      if (this.isRowCompleted(y)) {
        isGamePaused = true;
        this.removeRow(y);
        rowsRemoved++;
        y++; // Check the same again as rows above have moved
      }
    }

    if (rowsRemoved > 0) {
      const newScore = rowsRemoved * this.points[rowsRemoved - 1] * (level + 1);
      setScore(score + newScore);
      setLines(lines + rowsRemoved);
      isGamePaused = false;
    }
  }

  isRowCompleted(y) {
    for (let x = 0; x < this.cols; x++) if (this.grid[x][y] == 0) return false;
    return true;
  }

  removeRow(y) {
    for (let j = y; j > 0; j--) {
      for (let x = 0; x < this.cols; x++) {
        this.grid[x][j] = this.grid[x][j - 1];
      }
    }

    // Clear the top row
    for (let x = 0; x < this.cols; x++) {
      this.grid[x][0] = 0;
    }
  }

  update() {
    this.drawAllBlocks();
  }

  drawRow(y) {
    for (let x = 0; x < this.cols; x++) {
      drawBlock(OFFSET_X + x * BLOCK_SIZE, y * this.blockSize, this.grid[x][y]);
    }
  }

  drawAllBlocks() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const block = this.grid[i][j];
        if (block)
          drawBlock(OFFSET_X + i * BLOCK_SIZE, j * this.blockSize, block);
      }
    }
  }
}
