// Snake object
const Snake = {
  position: { x: 2, y: ~~(ROWS / 2) },
  velocity: { x: 0, y: 0 },
  length: 1,
  readyToMove: false,
  tiles: [],
  score: 0,
  maxScore: 0,
  win: COLUMNS * ROWS,

  // Draw snake with a gradient
  draw(ctx, headColor, tailColor) {
    const tailLength = this.tiles.length;

    const colorIncrement = tailColor.map(
      (color, i) => (color - headColor[i]) / tailLength
    );

    this.tiles.forEach((tile, idx) => {
      const color = headColor.map(
        (color, i) => ~~(color + colorIncrement[i] * idx)
      );

      ctx.fillStyle = `rgb(${color.join(", ")})`;
      ctx.fillRect(
        tile.x * CELL_SIZE,
        tile.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });

    setScore(this.score, this.maxScore);
  },

  // Update snake position
  update() {
    this.readyToMove = true;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.tiles.unshift({ x: this.position.x, y: this.position.y });

    if (this.tiles.length > this.length) this.tiles.pop();

    this.checkCollisions();
  },

  // Check collisions
  checkCollisions() {
    // Check collisions with walls
    if (
      this.position.x < 0 || // Left edge
      this.position.x > COLUMNS - 1 || // Right edge
      this.position.y < 0 || // Top edge
      this.position.y > ROWS - 1 // Bottom edge
    )
      GAME.gameOver = true;

    // Check collision with snake itself
    this.tiles.forEach((tail, idx) => {
      if (idx > 0 && tail.x === this.position.x && tail.y === this.position.y)
        GAME.gameOver = true;
    });

    // Check collision with food
    if (this.position.x === Food.x && this.position.y === Food.y) Food.reset();
  },

  // Reset snake position and length
  reset() {
    this.score = 0;
    this.length = 2;
    this.tiles = [];
    this.position = { x: 0, y: ~~(ROWS / 2) };
    this.velocity = { x: 1, y: 0 };
    for (let i = 0; i < this.length; i++) {
      if (i > 0) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
      this.tiles.unshift({ x: this.position.x, y: this.position.y });
    }
  },

  // Movement functions
  moveUp() {
    if (this.velocity.y === 1 || !this.readyToMove) return;
    this.velocity.x = 0;
    this.velocity.y = -1;
    this.readyToMove = false;
  },
  moveDown() {
    if (this.velocity.y === -1 || !this.readyToMove) return;
    this.velocity.x = 0;
    this.velocity.y = 1;
    this.readyToMove = false;
  },
  moveLeft() {
    if (this.velocity.x === 1 || !this.readyToMove) return;
    this.velocity.x = -1;
    this.velocity.y = 0;
    this.readyToMove = false;
  },
  moveRight() {
    if (this.velocity.x === -1 || !this.readyToMove) return;
    this.velocity.x = 1;
    this.velocity.y = 0;
    this.readyToMove = false;
  },
};

// Event listener for keyboard input
addEventListener("keydown", (e) => {
  const { key } = e;

  if (key === "ArrowUp" || key.toLocaleLowerCase() === "w") Snake.moveUp();
  else if (key === "ArrowDown" || key.toLocaleLowerCase() === "s")
    Snake.moveDown();
  else if (key === "ArrowLeft" || key.toLocaleLowerCase() === "a")
    Snake.moveLeft();
  else if (key === "ArrowRight" || key.toLocaleLowerCase() === "d")
    Snake.moveRight();
  else if (key === "r" || key.toLocaleLowerCase() === "r") resetGame();
});
