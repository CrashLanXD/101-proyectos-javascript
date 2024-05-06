const Food = {
  x: 13,
  y: ~~(ROWS / 2),
  image: null,
  imageFound: false,

  init() {
    if (!this.image) {
      this.image = new Image();
      this.image.onload = () => (this.imageFound = true);
      this.image.onerror = () => (this.imageFound = false);
      this.image.src = "px_apple_00.png";
    }
  },

  draw(ctx) {
    if (!this.imageFound) {
      this.drawFallback();
      return;
    }
    ctx.save();
    ctx.filter = "drop-shadow(0px 6px 0px rgba(0, 0, 0, 0.1))";
    ctx.drawImage(
      this.image,
      this.x * CELL_SIZE - 16,
      this.y * CELL_SIZE - 16,
      CELL_SIZE + 32,
      CELL_SIZE + 32
    );
    ctx.restore();
  },

  drawFallback() {
    // Si la carga de la imagen falla, dibuja un píxel :(
    ctx.fillStyle = "#344a1d";
    ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  },

  reset() {
    if (Snake.length === Snake.win) {
      // Handle win
      Snake.maxScore = `${Snake.win}!`;
      GAME.gameOver = true;
      return;
    }
    do {
      this.x = ~~(Math.random() * COLUMNS);
      this.y = ~~(Math.random() * ROWS);
      Snake.length++;
      Snake.score++;
      if (Snake.score > Snake.maxScore) Snake.maxScore = Snake.score;
    } while (this.collidesWithSnake());
  },

  collidesWithSnake() {
    for (let segment of Snake.tiles) {
      if (segment.x === this.x && segment.y === this.y) {
        return true; // La comida colisiona con la serpiente
      }
    }
    return false; // La comida no colisiona con la serpiente
  },
};
