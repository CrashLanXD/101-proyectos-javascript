// hitbox
// ctx.beginPath(); ctx.lineWidth = 1; ctx.strokeStyle = "red"; ctx.arc(0, 0, this.radius, START_ANGLE, END_ANGLE); ctx.closePath(); ctx.stroke();
class Bullet {
  constructor(x, y, angle, speed = 5, color = "#ff0", radius = 5) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.angle = angle;
    this.speed = speed;
    this.color = color;
    this.radius = radius;
    this.lifetime = 1000;
  }

  update() {
    this.move();
    this.lifetime--;
  }

  move() {
    this.dx = Math.cos(this.angle) * this.speed;
    this.dy = Math.sin(this.angle) * this.speed;
    this.x += this.dx;
    this.y += this.dy;
  }

  draw(ctx, offsetX, offsetY) {
    ctx.save();

    ctx.translate(this.x + offsetX, this.y + offsetY);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, START_ANGLE, END_ANGLE);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  isOutOfBounds() {
    return (
      this.x < 0 ||
      this.x > game.level.mapWidth ||
      this.y < 0 ||
      this.y > game.level.mapHeight
    );
  }

  hasCollidedWith(entity) {
    let dx = this.x - entity.x;
    let dy = this.y - entity.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + entity.radius;
  }
}

class PlayerBullet extends Bullet {
  constructor(x, y, angle, speed = 5, color = "#ff0", radius = 8) {
    super(x, y, angle, speed, color, radius);
    this.numBullet = 3;
  }
  static numBullets = 3;
  static angleOffset = 0.12;
  static damageDealt = 1;

  draw(ctx, offsetX, offsetY) {
    const s = this.radius;
    const s2 = s / 2;
    ctx.save();

    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.rotate(Math.atan2(this.dx, -this.dy));

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.moveTo(-s2 - 2, s2 + 7);
    ctx.lineTo(0, -s2 - 12);
    ctx.lineTo(s2 + 6, s2 + 6);
    ctx.moveTo(s2 + 2, s2 + 7);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}

class MachineGunBullet extends PlayerBullet {
  constructor(x, y, angle, speed = 5, color = "#ff0", radius = 8) {
    super(x, y, angle, speed, color, radius);
    this.numBullet = 5;
    this.color = `rgb(0, 255, ${~~(Math.random() * 236) + 20})`;
  }
  static numBullets = 5;
  static angleOffset = 0.1;
  static damageDealt = 2;

  draw(ctx, offsetX, offsetY) {
    const s = this.radius;
    ctx.save();

    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.rotate(Math.atan2(this.dx, -this.dy));

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s - 3, 0);
    ctx.lineTo(s + 3, 0);
    ctx.stroke();
    ctx.moveTo(0, -s - 3);
    ctx.lineTo(0, s + 3);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }
}

class EnemyBullet extends Bullet {
  constructor(x, y, angle, speed = 5, color = "#f00", radius = 5) {
    super(x, y, angle, speed, color, radius);
    this.rotation = 0;
  }

  update() {
    super.update();
    this.rotation += 0.1;
  }

  draw(ctx, offsetX, offsetY) {
    const s = this.radius;
    ctx.save();

    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.rotate(this.rotation);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s - 2, 0);
    ctx.lineTo(s + 2, 0);
    ctx.stroke();
    ctx.moveTo(0, -s - 2);
    ctx.lineTo(0, s + 2);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }
}

class SeekerBullet extends EnemyBullet {
  constructor(x, y, angle, speed = 5, color = "#f00", radius = 5) {
    super(x, y, angle, speed, color, radius);
    this.lifetime = 500;
  }

  update(player = game.player) {
    if (this.lifetime < 470) {
      this.angle = Math.atan2(player.y - this.y, player.x - this.x);
    }
    this.move();
    this.lifetime--;
  }
}

class HeavySeeker extends SeekerBullet {
  constructor(x, y, angle, speed = 5, color = "#f08", radius = 8) {
    super(x, y, angle, speed, color, radius);
    this.lifetime = 1000;
  }

  update(player = game.player) {
    this.angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.move();

    if (this.hasCollidedWith(player)) {
      player.damage();
    }
  }

  draw(ctx, offsetX, offsetY) {
    const s = this.radius;

    ctx.save();
    ctx.translate(this.x + offsetX, this.y + offsetY);
    ctx.rotate(Math.atan2(this.dx, -this.dy));

    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -s - 4);
    ctx.lineTo(s + 1, s + 4);
    ctx.lineTo(0, s + 1);
    ctx.lineTo(-s - 1, s + 4);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00f";
    ctx.beginPath();
    ctx.moveTo(0, -s + 5);
    ctx.lineTo(s - 4.5, s - 2);
    ctx.lineTo(0, s - 4);
    ctx.lineTo(-s + 4.5, s - 2);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}
