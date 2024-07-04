class Particle {
  constructor(x, y, symbol, color, size, lifetime) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
    this.size = size;
    this.lifetime = lifetime;
    this.alpha = 1;
  }

  update() {
    this.lifetime -= 10;
    this.alpha = this.lifetime / 100;
  }

  draw(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.font = `${this.size}px Monospace`;
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}
