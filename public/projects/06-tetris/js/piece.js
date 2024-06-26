class Piece {
  constructor() {
    this.keys = Object.keys(PIECES);
    this.shape = this.getRandomPiece();
    this.position = {
      x: ~~((COLS - this.shape[0].length) / 2),
      y: 1,
    };
    this.nextPieces = [this.getRandomPiece()];
  }

  getRandomPiece() {
    const randomKey = this.keys[~~(Math.random() * this.keys.length)];
    return PIECES[randomKey];
  }

  move(dx = 0, dy = 1) {
    if (isGamePaused) return;
    if (piece.checkCollision(0, 0)) {
      isGamePaused = true;
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
    // collision with floor | piece
    if (piece.checkCollision(0, 1)) piece.lock();
  }

  rotate({ clockwise = true }) {
    if (isGamePaused) return;

    const isTetrominoI = this.shape.length === 1 || this.shape.length === 4;
    if (!isTetrominoI) {
      const transposed = this.shape[0].map((_, colIndex) =>
        this.shape.map((row) => row[colIndex])
      );
      const rotated = clockwise
        ? transposed.map((row) => row.reverse())
        : transposed.reverse();
      if (!this.checkCollision(0, 0, rotated)) {
        this.shape = rotated;
      }
      return;
    }

    this.rotateIPiece();
  }

  rotateIPiece() {
    const isVertical = this.shape[0].length === 1;
    const rotated = I_ROTATIONS[isVertical ? 0 : 1];

    if (isVertical) {
      this.position.x -= 1;
      this.position.y += 2;
      if (this.checkCollision(0, 0, rotated)) {
        this.position.x += 1;
        this.position.y -= 2;
      } else {
        this.shape = rotated;
      }
    } else {
      this.position.x += 1;
      this.position.y -= 2;
      if (this.checkCollision(0, 0, rotated)) {
        this.position.x -= 1;
        this.position.y += 2;
      } else {
        this.shape = rotated;
      }
    }
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
          ui.x + 15 + x * BLOCK_SIZE,
          112 + y * BLOCK_SIZE,
          BLOCK_TYPES[block]
        );
      }
    }
  }

  spawn() {
    this.shape = this.nextPieces.shift();
    this.nextPieces.push(this.getRandomPiece());
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
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true;

        // Collision detected! => PIECE (ignoring undefined cells)
        const block = board.grid[newX][newY];
        if (block !== 0 && block !== undefined) return true;
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
