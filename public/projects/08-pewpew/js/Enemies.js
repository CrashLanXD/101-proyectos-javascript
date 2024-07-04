class Enemy extends Entity {
  constructor(x, y, radius = 10, size = 12, color = "#f00") {
    super(x, y, radius, size, color);
    this.speed = 5;
    this.angle = 0;
    this.hp = 10;
  }

  update(player) {
    this.move(player);
    super.update();
  }

  move(player) {
    let angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.setDirection(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }

  hasCollidedWithPlayer(player) {
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + player.radius + 1;
  }

  draw(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.rotate(this.angle);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, START_ANGLE, END_ANGLE);
    ctx.stroke();
    ctx.restore();
  }

  damage(damage = 1) {
    this.hp -= damage;
  }

  follow(player) {
    let angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.setDirection(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }

  setRandomDirection() {
    const angle = Math.random() * 2 * PI;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }
}

class Follower extends Enemy {
  constructor(x, y) {
    super(x, y, 22, 52);
    this.speed = 7;
    this.hp = 60;
    this.originalColors = {
      primary: "rgba(255, 190, 0, 0.9)",
      secondary: "rgba(255, 0, 0, 0.7)",
    };
    this.color = this.originalColors.primary;
    this.secondaryColor = this.originalColors.secondary;

    this.lineWidth = 3.5;
    this.rotationSpeed = 0.04;
    this.innerRotationSpeed = 0.09;
    this.rotation = 0;
    this.innerRotation = 0;
    this.lifeTime = 0;
  }

  update(player) {
    if (this.lifeTime < 100) this.lifeTime++;
    else this.move(player);
    
    this.rotation += this.rotationSpeed;
    this.innerRotation += this.innerRotationSpeed;
  }

  move(player) {
    this.speed = Math.min(this.speed + 0.1, player.speed - 1);
    this.follow(player);

    this.x += this.dx;
    this.y += this.dy;

    if (this.hasCollidedWithPlayer(player)) {
      this.damage(this.hp);
      player.damage();
    }
  }

  damage(damage = 1) {
    super.damage(damage);

    this.color = "rgba(0, 255, 255, 0.7)";
    this.secondaryColor = "rgba(0, 65, 255, 0.9)";

    this.speed = Math.max(this.speed - 0.5, 2);

    setTimeout(() => {
      this.color = this.originalColors.primary;
      this.secondaryColor = this.originalColors.secondary;
    }, 150);
  }

  draw(ctx, offsetX, offsetY) {
    const s = this.size;
    const s2 = s / 2;
    const s3 = s / 3;
    const s8 = s / 8;
    const s13 = s / 13;
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.globalAlpha = this.lifeTime / 100;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.arc(0, 0, s2, START_ANGLE, END_ANGLE);
    ctx.stroke();

    // inner pentagon
    ctx.strokeStyle = this.secondaryColor;
    ctx.beginPath();
    ctx.rotate(this.rotation);
    for (let i = 0; i < 5; i++) {
      const angle = (i * END_ANGLE) / 5;
      const x = s3 * Math.cos(angle);
      const y = s3 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // inner ovals
    ctx.rotate(0);
    for (let i = 0; i < 3; i++) {
      ctx.rotate(-(this.innerRotation + i * (PI / 3)));
      ctx.beginPath();
      ctx.ellipse(0, 0, s3, s13, 0, START_ANGLE, END_ANGLE);
      ctx.stroke();
    }

    // ovals
    ctx.strokeStyle = this.color;
    for (let i = 0; i < 3; i++) {
      ctx.rotate(this.rotation + i * (PI / 3));
      ctx.beginPath();
      ctx.ellipse(0, 0, s8, s2, 0, START_ANGLE, END_ANGLE);
      ctx.stroke();
    }

    ctx.restore();
  }
}

class Shooter extends Enemy {
  constructor(x, y) {
    super(x, y, 22, 52);
    this.speed = 1;
    this.hp = 25;
    this.originalColors = {
      primary: "#a0f",
      secondary: "#00f",
    };
    this.color = this.originalColors.primary;
    this.secondaryColor = this.originalColors.secondary;
    this.lineWidth = 3.5;
    this.rotationSpeed = 0.02;
    this.lifeTime = 0;
    this.rotation = Math.random();
    this.shootCooldown = 0;
    this.setRandomDirection();
  }

  update(player) {
    if (this.lifeTime < 100) {
      this.lifeTime += 2;
      return;
    }

    this.rotation += this.rotationSpeed;
    this.move(player);

    this.shoot();
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
  }

  move(player) {
    this.x += this.dx;
    this.y += this.dy;

    if (
      this.x - this.radius < 0 ||
      this.x + this.radius > game.level.mapWidth
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y - this.radius < 0 ||
      this.y + this.radius > game.level.mapHeight
    ) {
      this.dy = -this.dy;
    }

    if (this.hasCollidedWithPlayer(player)) {
      player.damage();
    }
  }

  damage(damage = 1) {
    super.damage(damage);

    this.color = "#800";
    this.secondaryColor = "#204";

    setTimeout(() => {
      this.color = this.originalColors.primary;
      this.secondaryColor = this.originalColors.secondary;
    }, 150);
  }

  shoot() {
    if (this.shootCooldown > 0) return;
    game.bullets.push(
      new HeavySeeker(this.x, this.y, 0, 5, this.originalColors.primary, 9)
    );
    this.shootCooldown = 150;
  }

  draw(ctx, offsetX, offsetY) {
    const s2 = this.size / 2;
    const s3 = this.size / 3;
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.rotate(this.rotation);

    ctx.globalAlpha = this.lifeTime / 100;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * END_ANGLE) / 6;
      const x = s2 * Math.cos(angle);
      const y = s2 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = this.secondaryColor;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * END_ANGLE) / 6;
      const x = s3 * Math.cos(angle);
      const y = s3 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.fillRect(-2, -2, 4, 4);

    ctx.restore();
  }
}

class PolygonEnemy extends Enemy {
  constructor(x, y, radius = 50, size = 100) {
    super(x, y, radius, size, "#fa0");
    this.speed = 1;
    this.hp = 20;
    this.lineWidth = 3;
    this.lifeTime = 0;
    this.rotationSpeed = 0.01;
    this.rotation = Math.random();
    this.innerSize = 5;
    this.time = 0;
    this.sideCount = 6;
    this.originalColor = this.color;
    this.setRandomDirection();
  }

  update(player) {
    this.time += 0.04;
    this.innerSize = 3 + (20 * (1 + Math.sin(this.time))) / 2;
    if (this.lifeTime < 150) {
      this.lifeTime += 2;
      return;
    }
    this.rotation += this.rotationSpeed;
    this.move(player);
  }

  move(player) {
    this.x += this.dx;
    this.y += this.dy;

    if (
      this.x - this.radius < 0 ||
      this.x + this.radius > game.level.mapWidth
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y - this.radius < 0 ||
      this.y + this.radius > game.level.mapHeight
    ) {
      this.dy = -this.dy;
    }

    if (this.hasCollidedWithPlayer(player)) {
      this.damage(this.hp);
      player.damage(2);
    }
  }

  damage(damage = 1) {
    super.damage(damage);
    this.color = "#fff";

    if (this.hp <= 0) {
      this.shootOnDeath();
    }

    setTimeout(() => {
      this.color = this.originalColor;
    }, 200);
  }

  shootOnDeath(player = game.player) {
    const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
    const numberOfBullets = 9;
    const halfCircle = PI;
    const startAngle = angleToPlayer - halfCircle / 2;
    const angleIncrement = halfCircle / (numberOfBullets - 1);

    for (let i = 0; i < numberOfBullets; i++) {
      const angle = startAngle + i * angleIncrement;
      game.bullets.push(
        new EnemyBullet(this.x, this.y, angle, 1, this.originalColor, 6)
      );
    }
  }

  draw(ctx, offsetX, offsetY) {
    const s = this.size;
    const s2 = s / 2;
    const s3 = s / this.innerSize;
    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.globalAlpha = this.lifeTime / 100;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.rotate(this.rotation);

    ctx.beginPath();
    for (let i = 0; i < this.sideCount; i++) {
      const angle = (i * END_ANGLE) / this.sideCount;
      const x = s2 * Math.cos(angle);
      const y = s2 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < this.sideCount; i++) {
      const angle = (i * END_ANGLE) / this.sideCount;
      const x = s3 * Math.cos(angle);
      const y = s3 * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < this.sideCount; i++) {
      const angle = (i * END_ANGLE) / this.sideCount;
      const x = s2 * Math.cos(angle);
      const y = s2 * Math.sin(angle);
      const x2 = s3 * Math.cos(angle);
      const y2 = s3 * Math.sin(angle);
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}

class GuidedSquare extends PolygonEnemy {
  constructor(x, y) {
    super(x, y, 40);
    this.color = "#f00";
    this.originalColor = this.color;
    this.sideCount = 4;
  }

  shootOnDeath() {
    for (let i = 0; i < 9; i++) {
      const angle = (i * END_ANGLE) / 9;
      game.bullets.push(
        new SeekerBullet(this.x, this.y, angle, 3, this.originalColor, 6)
      );
    }
  }
}

class WaveShooter extends PolygonEnemy {
  constructor(x, y) {
    super(x, y);
    this.color = "#0fc";
    this.originalColor = this.color;
    this.sideCount = 7;
  }
}
