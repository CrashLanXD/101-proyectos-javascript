class Bullet {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 5;
    this.height = 25;

    this.color = COLORS.bullet;
  }

  draw() {
    CTX.fillStyle = COLORS.bullet
    CTX.fillRect(this.position.x, this.position.y, -this.width, -this.height);
  }

  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const bullets = [];

function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    const BULLET = bullets[i];

    if (BULLET.position.y + BULLET.height <= 0) {
      bullets.splice(i, 1);
      continue;
    }
    BULLET.move();
    BULLET.draw();
  }
}

function createBullet(posX, posY) {
  if (bullets.length >= 1) return
  SOUNDS.shoot.play();
  bullets.push(
    new Bullet({
      position: {
        x: posX,
        y: posY,
      },
      velocity: {
        x: 0,
        y: -8,
      },
    })
  );
}

