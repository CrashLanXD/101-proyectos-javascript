const MAX_LIVES = 3;
let lives = MAX_LIVES;

class Player {
  constructor() {
    this.width = 33;
    this.height = 30;
    this.velocity = { x: 3 };
    this.position = { x: OFFSET - 20, y: HEIGHT - this.height - 60 };

    let img = new Image();
    img.src = "./img/player.png";
    img.onload = () => {
      this.img = img;
      this.draw();
    };
  }

  draw() {
    if (this.img)
      CTX.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  spawnBullet() {
    if (upPressed)
      createBullet(this.position.x + this.width / 2 + 3, this.position.y);
  }

  move() {
    if (rightPressed && this.position.x < (WIDTH - this.width) - OFFSET) {
      this.position.x += this.velocity.x;
    } else if (leftPressed && this.position.x > OFFSET - 20) {
      this.position.x -= this.velocity.x;
    }
  }
}

const player = new Player();
