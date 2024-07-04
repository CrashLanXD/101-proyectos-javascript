class Item extends Entity {
  constructor(x, y, radius = 10, size = 12, color = "#f00") {
    super(x, y, radius, size, color);
    this.collected = false;
  }

  update(player) {}

  hasCollidedWithPlayer(player) {
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + player.radius;
  }

  draw(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, START_ANGLE, END_ANGLE);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}

class ScoreArea extends Item {
  constructor(x, y, score = 3000) {
    super(x, y, 45, 30, "#82f76f");
    this.score = score;
    this.beatSize = 24;
    this.beatFrequency = 0.1;
    this.time = 0;
  }

  update(player) {
    this.score -= 5;
    if (this.score <= 0) this.collected = true;
    this.time += this.beatFrequency;

    this.beatFrequency = Math.random();

    this.size = this.beatSize + Math.sin(this.time) * 6;

    if (this.hasCollidedWithPlayer(player)) {
      if (this.collected) return;
      player.score += this.score;
      this.collected = true;
    }
  }

  draw(ctx, offsetX, offsetY) {
    const s = this.size;
    const hexagonsCount = 4;
    const spacing = 5;

    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.shadowBlur = 3;
    ctx.shadowColor = "#0f0";

    for (let j = 0; j < hexagonsCount; j++) {
      const size = s + j * spacing;

      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = j === 0 ? 3 : 1;

      ctx.moveTo(-size, -size / 2);
      ctx.lineTo(0, -size);
      ctx.lineTo(size, -size / 2);
      ctx.lineTo(size, size / 2);
      ctx.lineTo(0, size);
      ctx.lineTo(-size, size / 2);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    ctx.font =
      "25px 'Monaspace Krypton', 'Bahnschrift light', Consolas, monospace";
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.score}`, -30, 70);

    ctx.restore();
  }
}

class UtilityItem extends Item {
  constructor(x, y) {
    super(x, y, 35, 20, "#fa0");
    this.time = 0;
    this.rotation = 0;
    this.alpha = 1;
    this.maxLifeTime = 60;
  }

  update(player) {
    this.time++;
    this.rotation += 0.01;

    if (this.time > this.maxLifeTime) {
      this.alpha -= 0.001;
      if (this.alpha <= 0) this.collected = true;
    }
    if (this.hasCollidedWithPlayer(player)) {
      if (this.collected) return;
      this.collect();
      this.collected = true;
    }
  }

  collect() {}

  draw(ctx, offsetX, offsetY) {
    const s = this.size;

    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.globalAlpha = this.alpha;
    ctx.lineWidth = 4;

    for (let i = 1; i <= 3; i++) {
      const size = s + i * 3;
      const rotation =
        i % 2 === 0 ? this.rotation * (i / 8) : -this.rotation * (i / 3);
      this.linesColor(ctx, i);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(-size, -size / 2);
      ctx.lineTo(0, -size - 3);
      ctx.lineTo(size, -size / 2);
      ctx.lineTo(size, size / 2);
      ctx.lineTo(0, size + 3);
      ctx.lineTo(-size, size / 2);
      ctx.closePath();
      ctx.stroke();
    }

    this.innerDraw(ctx);

    ctx.restore();
  }

  linesColor(ctx, i) {
    ctx.strokeStyle = this.color;
  }

  innerDraw(ctx) {
    ctx.font =
      "45px 'Monaspace Krypton', 'Bahnschrift light', Consolas, monospace";
    ctx.fillStyle = this.color;
    ctx.fillText(`-`, -14, 14);
  }
}

class WeaponItem extends UtilityItem {
  constructor(x, y) {
    super(x, y, 35, 20);
    this.color = "#0fa";
  }

  collect() {
    game.player.activeMachineGun();
  }

  linesColor(ctx, i) {
    if (i !== 2) ctx.strokeStyle = "#fff";
    else ctx.strokeStyle = this.color;
  }

  innerDraw(ctx) {
    ctx.font =
      "25px 'Monaspace Krypton', 'Bahnschrift light', Consolas, monospace";
    ctx.fillStyle = this.color;
    ctx.fillText(`*`, -19, 10);
    ctx.fillText(`*`, -5, 20);
    ctx.fillText(`*`, -1, 3);
  }
}

class ShieldItem extends UtilityItem {
  constructor(x, y) {
    super(x, y, 35, 20);
    this.color = "#ff0";
  }

  collect() {
    game.player.hp++;
  }

  innerDraw(ctx) {
    ctx.font =
      "45px 'Monaspace Krypton', 'Bahnschrift light', Consolas, monospace";
    ctx.fillStyle = this.color;
    ctx.fillText(`+`, -14, 14);
  }
}
