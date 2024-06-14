class Piece {
  constructor() {
    this.keys = Object.keys(PIECES);
    this.shape = this.randPiece();
    this.position = {
      x: ~~((COLS - this.shape[0].length) / 2),
      y: 1,
    };
    this.nextPieces = [this.randPiece()];
  }

  randPiece() {
    const randomKey = this.keys[~~(Math.random() * this.keys.length)];
    return PIECES[randomKey];
  }

  move(dx = 0, dy = 1) {
    if (isGamePaused) return;
    if (piece.checkCollision(0, 0)) {
      isGamePaused = true;
      console.log("DEAD");
      
      deathEffect();
      board.restart();
      piece.spawn();
      setScore(0);
      setLevel(0);
      setLines(0);
      drawDynamicUI();
      setTimeout(() => (isGamePaused = false), 1700);
      return;
    }

    if (!this.checkCollision(dx, dy)) {
      this.position.x += dx;
      this.position.y += dy;
      return;
    }
    // collision width floor | piece
    if (piece.checkCollision(0, 1)) piece.lock();
  }

  rotate({ clockwise = true }) {
    if (isGamePaused) return;
    const transposed = this.shape[0].map((_, colIndex) =>
      this.shape.map((row) => row[colIndex])
    );
    const rotated = clockwise
      ? transposed.map((row) => row.reverse())
      : transposed.reverse();
    if (!this.checkCollision(0, 0, rotated)) this.shape = rotated;
  }

  draw() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        const block = this.shape[y][x];
        if (block == 0) continue;
        drawBlock(
          OFFSET_X + this.position.x * BLOCK_SIZE + x * BLOCK_SIZE,
          this.position.y * BLOCK_SIZE + y * BLOCK_SIZE,
          BLOCK_TYPES[block]
        );
      }
    }
  }

  drawNextPiece() {
    clear(ui.x + 14, 103, 34, 34);
    for (let y = 0; y < this.nextPieces[0].length; y++) {
      for (let x = 0; x < this.nextPieces[0][y].length; x++) {
        const block = this.nextPieces[0][y][x];
        if (block == 0) continue;
        drawBlock(
          ui.x + 15 + x * BLOCK_SIZE, 112 + y * BLOCK_SIZE,
          BLOCK_TYPES[block]
        );
      }
    }
  }

  spawn() {
    this.shape = this.nextPieces.shift();
    this.nextPieces.push(this.randPiece());
    this.position.y = 1;
    this.position.x = ~~((COLS - this.shape[0].length) / 2);
    this.drawNextPiece();
  }

  checkCollision(dx, dy, shape = this.shape) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] == 0) continue;

        const newX = this.position.x + x + dx;
        const newY = this.position.y + y + dy;

        // Collision detected! => WALL
        if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) return true;

        // Collision detected! => PIECE
        if (board.grid[newX][newY] !== 0) return true;
      }
    }
    return false;
  }

  lock() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        const block = this.shape[y][x];
        if (block == 0) continue;
        const newY = this.position.y + y;
        const newX = this.position.x + x;
        board.set(newX, newY, block);
      }
    }
    board.removeRows();
    piece.spawn();
  }
}
