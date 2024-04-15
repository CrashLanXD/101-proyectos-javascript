const MARGIN_X = 40;
const MARGIN_Y = 15;
const INVADERS_VELOCITY_Y = 13;
// let gridVelocityX = 0.4;
let gridVelocityX = 2.1;

class Grid {
  constructor() {
    this.initialPosition = {
      x: 130,
      y: 40,
    };

    this.position = {
      x: 130,
      y: 40,
    };


    this.velocity = {
      x: gridVelocityX,
      y: 0,
    };

    this.lifeReduced = false;

    this.invaders = [];

    this.width = INVADERS_ROWS * (INVADER_WIDTH + MARGIN_X) - MARGIN_X;
    this.height =
      INVADER_HEIGHT * INVADERS_IMAGE.length +
      (INVADERS_IMAGE.length - 1) * MARGIN_Y;

    Promise.all(IMAGES).then((loadedImages) => {
      for (let i = 0; i < INVADERS_ROWS; i++) {
        for (let j = 0; j < INVADERS_IMAGE.length; j++) {
          this.invaders.push(
            new Invader(
              {
                position: {
                  x: j * (INVADER_WIDTH + MARGIN_X) + this.position.x,
                  y: i * (INVADER_HEIGHT + MARGIN_Y) + this.position.y,
                },
              },
              loadedImages[i % loadedImages.length]
            )
          );
        }
      }
    });
  }

  move() {
    /*if (count === 4) {
      this.velocity.x = 1;
      console.log("hard");
    } else if (count === 20) {
      this.velocity.x = 1.5;
      console.log("harder!");
    } else if (count === 33) {
      this.velocity.x = 3;
      console.log("EXTREME!");
    }
    */
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;

    // check collision (player - invader)
    this.invaders.forEach((invader) => {
      if (invader.position.y + INVADER_HEIGHT >= player.position.y) {
        this.playerLoses();
      }
    });

    if (
      this.position.x + this.width >= WIDTH - OFFSET + 55 ||
      this.position.x <= OFFSET - 55
    ) {
      SOUNDS.invmov.play();
      this.velocity.x = -this.velocity.x;
      this.velocity.y = INVADERS_VELOCITY_Y;
    }

    this.moveInvaders();
    // invader shot
  }

  draw() {
    this.invaders.forEach((invader) => {
      invader.draw();
    });
  }

  drawBorder() {
    CTX.strokeStyle = "red";
    CTX.lineWith = 2;

    CTX.strokeRect(this.position.x, this.position.y, this.width, this.height);
  }

  moveInvaders() {
    this.invaders.forEach((invader, invaderIndex) => {
      invader.position.x += this.velocity.x;
      invader.position.y += this.velocity.y;

      //#region  CHECK INVADERS COLLISION
      bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.position.y <= invader.position.y + INVADER_HEIGHT &&
          bullet.position.y + bullet.width >= invader.position.y &&
          bullet.position.x <= invader.position.x + INVADER_WIDTH &&
          bullet.position.x + bullet.width >= invader.position.x
        ) {
          const currentGrid = this;

          setTimeout(() => {
            const invaderFoundIndex = currentGrid.invaders.indexOf(invader);
            if (invaderFoundIndex !== -1) {
              count++;
              SOUNDS.saucer.play();

              bullets.splice(bulletIndex, 1);
              if (count >= INVADERS_ROWS * INVADERS_COLS) {
                resetGrid();
              }
              currentGrid.invaders.splice(invaderFoundIndex, 1);

              if (currentGrid.invaders.length > 0) {
                let firstInvaderX = Infinity;
                let lastInvaderX = -Infinity;
                currentGrid.invaders.forEach((invader) => {
                  if (invader.position.x < firstInvaderX) {
                    firstInvaderX = invader.position.x;
                  }

                  if (invader.position.x > lastInvaderX) {
                    lastInvaderX = invader.position.x;
                  }
                });
                currentGrid.width =
                  lastInvaderX - firstInvaderX + INVADER_WIDTH;
                currentGrid.position.x = firstInvaderX;
              }
            }
          }, 0);
        }
      });
      //#endregion
    });
  }

  resetInvadersPosition() {
    this.invaders.forEach((invader, index) => {
      const i = Math.floor(index / INVADERS_IMAGE.length);
      const j = index % INVADERS_IMAGE.length;
      invader.position.x = j * (INVADER_WIDTH + MARGIN_X) + this.initialPosition.x;
      invader.position.y = i * (INVADER_HEIGHT + MARGIN_Y) + this.initialPosition.y;
    })
  }

  playerLoses() {
    if (!this.lifeReduced) {
      resetGrid();
      SOUNDS.death.play();
      console.log(lives);
      lives--;
      if (lives === 0) {
        resetGrid();
        lives = MAX_LIVES;
      }
      this.lifeReduced = true;
    }
  }
}

function resetGrid() {
  grid = new Grid();
  count = 0;
  grid.lifeReduced = false
}

function resetGridPosition() {
  grid.position.x = grid.initialPosition.x;
  grid.position.y = grid.initialPosition.y;
}

let grid = new Grid();
