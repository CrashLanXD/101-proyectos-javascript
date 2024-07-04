class QuickPause {
  constructor(ctx) {
    this.count = 0;
    this.limit = 5;
    this.timeout = 15000; // 15 sec
    this.intervalThreshold = 200; // 200 ms
    this.lastTime = 0;
    this.abuseDetected = false;
    this.ctx = ctx;
  }

  start() {
    const currentTime = Date.now();
    const gameKeys = this.isAnyKeyActive();

    if (game.isPlayerBeaten) return;
    game.isPaused = !gameKeys;

    if (this.limit <= 0) {
      game.isPaused = false;
      return;
    }

    if (gameKeys) return;

    if (currentTime - this.lastTime < this.intervalThreshold) {
      this.count++;
      if (this.count >= 15) {
        this.abuseDetected = true;
      }
    } else {
      this._resetCount();
    }

    if (this.abuseDetected) this.limit--;

    this.lastTime = currentTime;
    this._render(this.ctx);

    setTimeout(() => {
      this._reset();
    }, this.timeout);
  }

  isAnyKeyActive() {
    return (
      game.keys["w"] ||
      game.keys["a"] ||
      game.keys["s"] ||
      game.keys["d"] ||
      game.keys["ArrowUp"] ||
      game.keys["ArrowLeft"] ||
      game.keys["ArrowDown"] ||
      game.keys["ArrowRight"]
    );
  }

  _resetCount() {
    this.count = 0;
  }

  _reset() {
    this.isActive = false;
    this.lastTime = 0;
    this.abuseDetected = false;
  }

  _render(ctx) {
    const y = game.canvas.height / 2;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, y - 50, game.canvas.width, 100);
    ctx.fillStyle = "#f00";
    ctx.fillRect(0, y - 50, game.canvas.width, 5);
    ctx.fillRect(0, y + 50 - 5, game.canvas.width, 5);
    ctx.fillStyle = "#fff";
    ctx.font =
      "30px 'Monaspace Krypton', 'Bahnschrift light', Consolas, monospace";
    if (!this.abuseDetected) {
      ctx.fillText("QuickPause();", game.canvas.width / 2 - 100, y + 10, 200);
    } else {
      ctx.fillText(
        `QuickPause = ( ${this.limit} )`,
        game.canvas.width / 2 - 120,
        y + 10,
        240
      );
    }
    ctx.restore();
  }
}
