class InvaderBullet {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 5;
    this.height = 25;

    this.color = COLORS.defense;
  }

  draw() {
    CTX.fillRect(this.position.x, this.position.y, -this.width, -this.height);
  }

  move() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const invaderBullets = [];

function updateInvaderBullets() {
  for (let i = 0; i < invaderBullets.length; i++) {
    const BULLET = invaderBullets[i];

    if (BULLET.position.y + BULLET.height >= HEIGHT) {
      invaderBullets.splice(i, 1);
    }
    BULLET.move();
    BULLET.draw();
  }
}

function createInvaderBullet(posX, posY) {
  invaderBullets.push(
    new InvaderBullet({
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

function checkInvaderCollision(invader) {
  bullets.forEach((bullet, bulletIndex) => {
    if (
      bullet.position.y <= invader.position.y + INVADER_HEIGHT &&
      bullet.position.y + bullet.height >= invader.position.y &&
      bullet.position.x <= invader.position.x + INVADER_WIDTH &&
      bullet.position.x + bullet.width >= invader.position.x
    ) {
      
    }
  });
}
