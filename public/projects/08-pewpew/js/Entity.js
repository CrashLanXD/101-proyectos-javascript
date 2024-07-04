class Entity {
  constructor(x, y, radius, size, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.size = size;
    this.color = color;
    this.dx = 0;
    this.dy = 0;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    this.wallCollision();
  }

  wallCollision() {
    if (this.x - this.radius < 0) {
      this.x = this.radius;
    } else if (this.x + this.radius > game.level.mapWidth) {
      this.x = game.level.mapWidth - this.radius;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
    } else if (this.y + this.radius > game.level.mapHeight) {
      this.y = game.level.mapHeight - this.radius;
    }
  }

  setDirection(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  draw(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, this.size, START_ANGLE, END_ANGLE);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  hitbox(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#f00";

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, START_ANGLE, END_ANGLE);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}
