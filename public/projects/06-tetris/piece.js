class Piece {
  constructor() {
    this.shape = PIECES[[random(0, PIECES.length - 1)]];
    this.position = {
      x: Math.floor((BOARD_COLS - this.shape.length) / 2),
      y: 0,
    };
  }

  // Draw a piece
  draw() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        const shape = this.shape[i][j];
        if (shape > 0) {
          drawBlock(
            (i + this.position.x) * CELL_SIZE,
            (j + this.position.y) * CELL_SIZE,
            shape
          );
        }
      }
    }
  }

  drawNextPiece() {
    nextPiece.shape.forEach((col, i) => {
      col.forEach((block, j) => {
        if (block > 0) {
          drawBlock(i * CELL_SIZE + 385, j * CELL_SIZE + 420, block);
        }
      });
    });
  }

  // Check for collisions with board or other pieces
  checkCollision(dx, dy, shape = this.shape) {
    // Iterate trough each block of the piece's shape
    for (let x = 0; x < shape.length; x++) {
      for (let y = 0; y < shape[0].length; y++) {
        // Check if the block is outside the board boundaries
        if (
          this.position.x + x + dx < 0 || // Left edge
          this.position.x + x + dx >= BOARD_COLS || // Right edge
          this.position.y + y + dy < 0 || // Top edge
          this.position.y + y + dy >= BOARD_ROWS // Bottom edge
        )
          return true; // Collision detected

        // Check if the block collides with existing blocks on the board
        if (
          shape[x][y] !== 0 &&
          board.grid[this.position.x + x + dx][this.position.y + y + dy] !== 0
        )
          return true; // Collision detected
      }
    }
    return false; // No collision detected
  }

  // Lock the piece in place when it can't move further down
  lock() {
    // D:
    // Iterate trough each block of the piece's shape
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[0].length; j++) {
        // Check if the block is not empty and at the bottom edge
        if (this.shape[i][j] !== 0) {
          if (
            this.position.y + j + 1 >= BOARD_ROWS || // At the bottom edge
            board.grid[this.position.x + i][this.position.y + j + 1] !== 0 // Colliding with another block
          ) {
            // Place the block on the board
            for (let i = 0; i < this.shape.length; i++) {
              for (let j = 0; j < this.shape[0].length; j++) {
                if (this.shape[i][j] !== 0) {
                  board.grid[this.position.x + i][this.position.y + j] =
                    this.shape[i][j];
                }
              }
            }

            // Remove completed rows and update game state
            board.removeRows();

            // Score :D
            score += random(8, 14) * level;
            // Set the piece as locked
            return; // Exit the method
          }
        }
      }
    }
    // Piece is not locked
  }

  // Spawn a new piece
  spawn() {
    piece = new Piece();
    piece.shape = nextPiece.shape;
    nextPiece = new Piece();
    nextPiece.shape = PIECES[[random(0, PIECES.length - 1)]];
  }

  // Rotate the piece clockwise
  rotate(clockwise = false) {
    if (clockwise) {
      // Create a new array to hold the rotated shape
      const rotated = [];
      const currentShape = this.shape;

      // Rotate each block of the shape
      for (let i = 0; i < this.shape[0].length; i++) {
        const row = [];
        for (let j = this.shape.length - 1; j >= 0; j--) {
          row.push(currentShape[j][i]);
        }

        rotated.push(row);
      }

      // Check if rotation results in a collision
      if (!this.checkCollision(0, 0, rotated)) {
        this.shape = rotated; // Update the shape with the rotated one
      }
    } else {
      // Create a new array to hold the rotated shape
      const rotated = [];
      const currentShape = this.shape;

      // Rotate each block of the shape
      for (let i = this.shape[0].length - 1; i >= 0; i--) {
        const row = [];
        for (let j = 0; j < this.shape.length; j++) {
          row.push(currentShape[j][i]);
        }

        rotated.push(row);
      }

      // Check if rotation results in a collision
      if (!this.checkCollision(0, 0, rotated)) {
        this.shape = rotated; // Update the shape with the rotated one
      }
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
