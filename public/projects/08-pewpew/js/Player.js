class Player extends Entity {
  constructor(x, y) {
    super(x, y, 12, 50, "#ff0");
    this.speed = 10;
    this.secondaryColor = "#fa0";
    this.lineWidth = 3.5;
    this.rotation = PI / 2;
    this.targetRotation = this.rotation;
    this.symbols = ["+", "x"/*, "-", "☐", "♦"*/];
    this.particles = [];
    this.bullets = [];
    this.shootCooldown = 0;
    this.hp = 3;
    this.score = 0;
    this.isInvulnerable = false;

    this.activeBulletType = PlayerBullet;
    this.bulletTypeDuration = 0;
  }

  shoot() {
    if (this.shootCooldown > 0) return;

    let dx = 0;
    let dy = 0;
    if (game.keys["ArrowLeft"] ) dx--;
    if (game.keys["ArrowUp"]   ) dy--;
    if (game.keys["ArrowRight"]) dx++;
    if (game.keys["ArrowDown"] ) dy++;

    if (dx !== 0 || dy !== 0) {
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      dx /= magnitude;
      dy /= magnitude;

      let angle = Math.atan2(dy, dx);

      const numBullets = this.activeBulletType.numBullets;
      const angleOffset = this.activeBulletType.angleOffset;

      for (let i = 0; i < this.activeBulletType.numBullets; i++) {
        const offset = (i - Math.floor(numBullets / 2)) * angleOffset;
        this.bullets.push(
          new this.activeBulletType(
            this.x + dx,
            this.y + dy,
            angle + offset,
            this.speed + 7
          )
        );
      }

      this.shootCooldown = 5;
    }
  }

  activeMachineGun() {
    this.activeBulletType = MachineGunBullet;
    this.bulletTypeDuration = 150;
  }

  move() {
    let dx = 0;
    let dy = 0;
    let speed = game.keys[" "] ? this.speed * 2 : this.speed;

    if (game.keys["w"]) dy--;
    if (game.keys["a"]) dx--;
    if (game.keys["s"]) dy++;
    if (game.keys["d"]) dx++;

    if (dx !== 0 || dy !== 0) {
      let angle = Math.atan2(dy, dx);
      this.setDirection(Math.cos(angle) * speed, Math.sin(angle) * speed);
      this.targetRotation = Math.atan2(dx, -dy);
      this.dropParticles(dx, dy);
    } else {
      this.setDirection(0, 0);
    }
    this.rotation = lerp(this.rotation, this.targetRotation, 0.5);
  }

  update() {
    super.update();

    if (this.bulletTypeDuration > 0) {
      this.bulletTypeDuration--;
      if (this.bulletTypeDuration === 0) {
        this.activeBulletType = PlayerBullet;
      }
    }

    this.shoot();

    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    this.updateBullets();
    this.updateParticles();
  }

  damage(damage = 1) {
    if (this.isInvulnerable) return;

    this.hp -= damage;

    if (this.hp < 0) {
      game.isPlayerBeaten = true;
      this.hp = 0;
    }
    this.isInvulnerable = true;

    setTimeout(() => {
      this.isInvulnerable = false;
    }, 250);
  }

  dropParticles(dx, dy) {
    const symbol =
      this.symbols[Math.floor(Math.random() * this.symbols.length)];
    const color = this.color;
    const size = Math.random() * 10 + 5;
    const lifetime = 150;

    const x = this.x - size - dx * 13 + Math.random() * size;
    const y = this.y + size - dy * 13 - Math.random() * size;
    const particle = new Particle(x, y, symbol, color, size, lifetime);
    this.particles.push(particle);
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];
      if (!bullet) continue;

      bullet.update();

      if (bullet.lifetime <= 0 || bullet.isOutOfBounds()) {
        this.bullets.splice(i, 1);
        continue;
      }

      for (let j = game.enemies.length - 1; j >= 0; j--) {
        let enemy = game.enemies[j];
        if (bullet.hasCollidedWith(enemy)) {
          this.bullets.splice(i, 1);
          enemy.damage(this.activeBulletType.damageDealt);
          break;
        }
      }

      for (let k = 0; k < game.bullets.length; k++) {
        const enemyBullet = game.bullets[k];
        if (!(enemyBullet instanceof HeavySeeker)) continue;
        if (bullet.hasCollidedWith(enemyBullet)) {
          this.bullets.splice(i, 1);
          game.bullets.splice(k, 1);
          break;
        }
      }
    }
  }

  updateParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.update();
      if (p.lifetime < 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawUi(ctx) {
    ctx.font =
      "30px 'Monaspace Krypton', 'Bahnschrift light', Consolas, monospace";
    ctx.fillStyle = "#0f0";
    if (this.hp === 1) {
      ctx.fillStyle = "#ff0";
    } else if (this.hp < 1) {
      ctx.fillStyle = "#f00";
    }
    ctx.fillText(`Player.shlds = ${this.hp}`, 90, 70);

    ctx.fillStyle = "#fff";
    ctx.fillText(`Player: ${this.score}`, game.canvas.width - 350, 70);
  }

  draw(ctx, offsetX, offsetY) {
    this.drawParticles(ctx, offsetX, offsetY);

    const s = this.size;
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.rotate(this.rotation);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;

    // body
    ctx.beginPath();
    ctx.moveTo(0, -s / 2 + 3);
    ctx.lineTo(-9, 7);
    ctx.lineTo(0, 15);
    ctx.lineTo(9, 7);
    ctx.lineTo(0, -s / 2 + 3);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = this.secondaryColor;

    // left
    ctx.beginPath();
    ctx.moveTo(-10, -s / 2 + 2);
    ctx.lineTo(-s / 2, 3);
    ctx.lineTo(-10, s / 2 - 5);
    ctx.lineTo(-17, 3);
    ctx.lineTo(-10, -s / 2 + 2);
    ctx.closePath();
    ctx.stroke();

    // right
    ctx.beginPath();
    ctx.moveTo(10, -s / 2 + 2);
    ctx.lineTo(s / 2, 3);
    ctx.lineTo(10, s / 2 - 5);
    ctx.lineTo(17, 3);
    ctx.lineTo(10, -s / 2 + 2);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  drawParticles(ctx, offsetX, offsetY) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx, offsetX, offsetY);
    }
  }

  drawBullets(ctx, offsetX, offsetY) {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(ctx, offsetX, offsetY);
    }
  }
}
