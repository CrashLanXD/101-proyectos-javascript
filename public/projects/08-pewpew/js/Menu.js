class Menu {
  constructor(ctx) {
    this.ctx = ctx;
    this.buttons = [];
  }

  addButton(text, x, y, width, height, onClick) {
    this.buttons.push({ text, x, y, width, height, onClick });
  }

  draw() {
    this.ctx.font = "30px 'Monaspace Krypton', 'Bahnschrift light', Consolas, monospace";
    this.ctx.lineWidth = 4;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 100, game.canvas.width, 100);

    this.ctx.strokeStyle = "#f00";
    this.ctx.strokeRect(-10, 100, game.canvas.width + 20, 100);

    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(
      "Game.Over = true",
      game.canvas.width / 2 - 120,
      160,
      250
    );

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, game.canvas.height - 120, game.canvas.width, 100);
    
    this.ctx.strokeStyle = "#f00";
    this.ctx.strokeRect(
      -10,
      game.canvas.height - 120,
      game.canvas.width + 20,
      100
    );

    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(
      `levelTry.ScoreTotal = ${game.player.score}`,
      game.canvas.width / 2 - 170,
      game.canvas.height - 60,
      350
    );

    for (let button of this.buttons) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(button.x, button.y, button.width, button.height);
      this.ctx.strokeStyle = "#f00";
      this.ctx.lineWidth = 4;

      this.ctx.strokeStyle = "#f00";
      this.ctx.beginPath();
      this.ctx.moveTo(button.x + 30, button.y);
      this.ctx.lineTo(button.x + button.width, button.y);
      this.ctx.lineTo(button.x + button.width, button.y + button.height - 30);
      this.ctx.lineTo(button.x + button.width - 30, button.y + button.height);
      this.ctx.lineTo(button.x, button.y + button.height);
      this.ctx.lineTo(button.x, button.y + button.height - 40);
      this.ctx.closePath();
      this.ctx.stroke();

      this.ctx.fillStyle = "#fff";
      this.ctx.fillText(
        button.text,
        button.x + 60,
        button.y + button.height / 2 + 10,
        230
      );
    }
  }

  handleMouseClick(event) {
    const rect = game.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let button of this.buttons) {
      if (
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height
      ) {
        button.onClick();
      }
    }
  }
}
