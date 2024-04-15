const INVADER_WIDTH = 35;
const INVADER_HEIGHT = 25;
const INVADERS_ROWS = 6;
const INVADERS_IMAGE = [
  "./img/invader_1.png",
  "./img/invader_2.png",
  "./img/invader_3.png",
  "./img/invader_4.png",
  "./img/invader_5.png",
  "./img/invader_6.png",
];
const INVADERS_COLS = INVADERS_IMAGE.length;

const IMAGES = INVADERS_IMAGE.map((src) => {
  return new Promise((resolve, reject) => {
    const IMG = new Image();
    IMG.onload = () => resolve(IMG);
    IMG.onerror = reject;
    IMG.src = src;
  });
});

let count = 0;

class Invader {
  constructor({ position }, img) {
    this.width = INVADER_WIDTH;
    this.height = INVADER_HEIGHT;
    this.velocity = { x: 10 };
    this.position = {
      x: position.x,
      y: position.y,
    };

    this.img = img;
    this.draw();
  }

  draw() {
    if (this.img) {
      CTX.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    } else {
      CTX.fillStyle = COLORS.aliens;
      CTX.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }

  move({ velocity }) {
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }

  shoot() {
    createInvaderBullet(
      this.position.x + this.width / 2,
      this.position.y + this.height
    );
  }
}
