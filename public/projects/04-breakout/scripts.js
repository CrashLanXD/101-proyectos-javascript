// > Constants
// Size of each pixel for numbers
const PIXEL_SIZE = 5;
const NUM_WIDTH = 4 * PIXEL_SIZE;
const NUM_HEIGHT = 5 * PIXEL_SIZE;
const NUMBERS = [
  [[1, 1, 1, 1],[1, 0, 0, 1],[1, 0, 0, 1],[1, 0, 0, 1],[1, 1, 1, 1],], // 0
  [[0, 0, 0, 1],[0, 0, 0, 1],[0, 0, 0, 1],[0, 0, 0, 1],[0, 0, 0, 1],], // 1
  [[1, 1, 1, 1],[0, 0, 0, 1],[1, 1, 1, 1],[1, 0, 0, 0],[1, 1, 1, 1],], // 2
  [[1, 1, 1, 1],[0, 0, 0, 1],[1, 1, 1, 1],[0, 0, 0, 1],[1, 1, 1, 1],], // 3
  [[1, 0, 0, 1],[1, 0, 0, 1],[1, 1, 1, 1],[0, 0, 0, 1],[0, 0, 0, 1],], // 4
  [[1, 1, 1, 1],[1, 0, 0, 0],[1, 1, 1, 1],[0, 0, 0, 1],[1, 1, 1, 1],], // 5
  [[1, 1, 1, 1],[1, 0, 0, 0],[1, 1, 1, 1],[1, 0, 0, 1],[1, 1, 1, 1],], // 6
  [[1, 1, 1, 1],[0, 0, 0, 1],[0, 0, 0, 1],[0, 0, 0, 1],[0, 0, 0, 1],], // 7
  [[1, 1, 1, 1],[1, 0, 0, 1],[1, 1, 1, 1],[1, 0, 0, 1],[1, 1, 1, 1],], // 8
  [[1, 1, 1, 1],[1, 0, 0, 1],[1, 1, 1, 1],[0, 0, 0, 1],[1, 1, 1, 1],], // 9
];

const MAX_LIVES = 5;
const DEFAULT_PADDLE_SENSITIVITY = 17;
const DEFAULT_PADDLE_WIDTH = 100;
const DEFAULT_BALL_SPEED = 6;
const OFFSET = 25; // for normal borders
const OFFSET_TOP = OFFSET * 1.25; // for score and lives
const W = 600 + OFFSET;
const H = 350 + OFFSET_TOP;

// | 0 => red | 1 => orange | 2 => amber | 3 => yellow | 4 => green | 5 => blue |
const COLORS = [ "#c44540", "#c76a3a", "#a87929", "#9ba129", "#409e40", "#4145c3" ];
const BRICK_STATUS = { ACTIVE: 1, DESTROYED: 0 };

// > Variables
let score = 0;
let lives = MAX_LIVES;
let bricksDestroyed = 0;
let isRightPressed = false;
let isLeftPressed = false;

// Canvas setup
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.style["imageRendering"] = "pixelated";
canvas.width = W;
canvas.height = H;

//#region ClASSES
class Ball {
  constructor(x, y, size) {
    this.defaultPositions = { x: x, y: y };
    this.x = this.defaultPositions.x;
    this.y = this.defaultPositions.y;
    this.size = size;
    this.defaultVelocities = { dx: -4, dy: 3 };
    this.dx = this.defaultVelocities.dx;
    this.dy = this.defaultVelocities.dy;
    this.angle = Math.PI / 3;
    this.maxSpeed = DEFAULT_BALL_SPEED;
  }

  setSpeed(newSpeed) {
    this.maxSpeed = newSpeed;
  }

  draw() {
    ctx.fillStyle = COLORS[0];
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  move() {
    this.handleWallCollisions();
    this.handlePaddleCollisions();
    this.handleBrickCollisions();
    this.handleFall();

    this.x += this.dx;
    this.y += this.dy;
  }

  handleWallCollisions() {
    let nextX = this.x + this.dx;
    let nextY = this.y + this.dy;

    if (nextX + this.size > W - OFFSET || nextX < OFFSET) {
      this.dx = -this.dx;
      audio.playSound(SOUND_TYPES.ball_h_walls);
    }

    if (nextY < OFFSET_TOP + OFFSET) {
      this.dy = -this.dy;
      audio.playSound(SOUND_TYPES.ball_v_walls);
    }
  }

  handlePaddleCollisions() {
    if (
      this.y + this.size > paddle.y &&
      this.y < paddle.y + paddle.height &&
      this.x + this.size > paddle.x &&
      this.x < paddle.x + paddle.width
    ) {
      this.dy = -this.dy;
      const paddleCenterX = paddle.x + paddle.width / 2;
      const ballCenterX = this.x + this.size / 2;
      const angle =
        ((ballCenterX - paddleCenterX) / (paddle.width / 2)) * this.angle;

      this.dx = this.maxSpeed * Math.sin(angle);
      this.dy = -this.maxSpeed * Math.cos(angle);
      audio.playSound(SOUND_TYPES.ball_paddle);
    }
  }

  handleBrickCollisions() {
    for (let i = 0; i < bricksBoard.cols; i++) {
      for (let j = 0; j < bricksBoard.rows; j++) {
        const brick = bricksBoard.bricks[i][j];

        if (brick.status === BRICK_STATUS.DESTROYED) continue;

        if (
          this.x + this.size >= brick.x &&
          this.x < brick.x + bricksBoard.width &&
          this.y + this.size >= brick.y &&
          this.y < brick.y + bricksBoard.height
        ) {
          this.dy = -this.dy;
          brick.status = BRICK_STATUS.DESTROYED;
          score += 6 - j;
          bricksDestroyed++;
          updateUI();
          handleScore();
          audio.playSound(SOUND_TYPES.ball_bricks);
        }
      }
    }
  }

  handleFall() {
    if (this.y + this.size > H) {
      this.dy = 0;
      this.dx = 0;
      this.x = this.defaultPositions.x;
      this.y = this.defaultPositions.y;
      setTimeout(() => {
        this.dx = this.defaultVelocities.dx;
        this.dy = this.defaultVelocities.dy;
        audio.playSound(SOUND_TYPES.ball_fall);
        lives--;
        updateUI();
        if (lives <= 0) {
          lives = MAX_LIVES;
          restartGame();
          restartBrick();
        }
      }, 1500);
    }
  }

  update() {
    this.move();
    this.draw();
  }
}

class Bricks {
  constructor(cols, rows, width, height, offsetTop) {
    this.cols = cols;
    this.rows = rows;
    this.width = width;
    this.height = height;
    this.offsetTop = offsetTop;
    this.bricks = [];
    this.length = cols * rows;
    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.cols; i++) {
      this.bricks[i] = [];
      for (let j = 0; j < this.rows; j++) {
        const x = i * this.width + OFFSET;
        const y = j * this.height + this.offsetTop + OFFSET_TOP;
        this.bricks[i][j] = { x: x, y: y, status: BRICK_STATUS.ACTIVE };
      }
    }
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const brick = this.bricks[i][j];
        if (brick.status === BRICK_STATUS.DESTROYED) continue;
        ctx.fillStyle = COLORS[j];
        ctx.fillRect(~~brick.x, ~~brick.y, ~~this.width + 1, ~~this.height + 1);
      }
    }
  }
}

class Paddle {
  constructor(x, y, width, height, sensitivity) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sensitivity = sensitivity;
  }

  draw() {
    ctx.fillStyle = COLORS[0];
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (isRightPressed && this.x + this.width < W - OFFSET) {
      this.x += this.sensitivity;
      if (this.x + this.width > W - OFFSET) this.x = W - OFFSET - this.width;
    } else if (isLeftPressed && this.x > OFFSET) {
      this.x -= this.sensitivity;
      if (this.x < OFFSET) this.x = OFFSET;
    }
  }

  update() {
    this.move();
    this.draw();
  }

  setWidth(width) {
    this.width = width;
  }

  setSensitivity(sensitivity) {
    this.sensitivity = sensitivity;
  }
}
//#endregion

// Initialize game elements
const paddle = new Paddle((W - 100) / 2, H - 15, DEFAULT_PADDLE_WIDTH, 9, DEFAULT_PADDLE_SENSITIVITY);
const bricksBoard = new Bricks(17, COLORS.length, (W - OFFSET * 2) / 17, 12.5, 80.5);
const ball = new Ball(W - 125, H - 165, 9);

// Initial config and events
function setup() {
  drawCanvasBorder();

  addEventListener("keydown", (e) => {
    const { key } = e;
    switch (key) {
      case "ArrowLeft":
      case "a":
      case "A":
        isLeftPressed = true;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        isRightPressed = true;
        break;
      default:
        break;
    }
  });

  addEventListener("keyup", (e) => {
    const { key } = e;
    switch (key) {
      case "ArrowLeft":
      case "a":
      case "A":
        isLeftPressed = false;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        isRightPressed = false;
        break;
      default:
        break;
    }
  });

  touchControls();

  tick();
}

function touchControls() {
  const $left = document.getElementById("left");
  const $right = document.getElementById("right");
  $left.addEventListener("touchstart", () => (isLeftPressed = true));
  $left.addEventListener("touchend", () => (isLeftPressed = false));
  $right.addEventListener("touchstart", () => (isRightPressed = true));
  $right.addEventListener("touchend", () => (isRightPressed = false));
}

// Game loop
function tick() {
  requestAnimationFrame(tick);
  clear();
  ball.update();
  paddle.update();
  bricksBoard.draw();
}

// Game | Bricks reset
function restartGame() {
  paddle.setWidth(DEFAULT_PADDLE_WIDTH);
  paddle.setSensitivity(DEFAULT_PADDLE_SENSITIVITY);
  ball.setSpeed(DEFAULT_BALL_SPEED);
  score = 0;
}

function restartBrick() {
  bricksDestroyed = 0;
  bricksBoard.initialize();
}

// Score handler => game difficulty
function handleScore() {
  if (bricksBoard.length === bricksDestroyed) {
    restartBrick();
  } else if (bricksDestroyed === 40) {
    paddle.setSensitivity(19);
    paddle.setWidth(70);
    ball.setSpeed(7);
  } else if (bricksDestroyed === 60) {
    paddle.setSensitivity(20);
    paddle.setWidth(60);
    ball.setSpeed(8.5);
  } else if (bricksDestroyed === 80) {
    paddle.setSensitivity(22);
    paddle.setWidth(45);
    ball.setSpeed(10);
  }
}

// Canvas drawing and elements
function drawCanvasBorder() {
  ctx.fillStyle = "#8a8d87";
  ctx.fillRect(0, OFFSET_TOP, OFFSET, H);
  ctx.fillRect(0, OFFSET_TOP, W, OFFSET);
  ctx.fillRect(W - OFFSET, OFFSET_TOP, OFFSET, H);

  ctx.fillStyle = "#3f9e7a";
  ctx.fillRect(0, H - 15, OFFSET, 15);

  ctx.fillStyle = COLORS[0];
  ctx.fillRect(W - OFFSET, H - 15, OFFSET, 15);
  updateUI();
}

function clear() {
  ctx.fillStyle = "#000";
  ctx.fillRect(OFFSET, OFFSET + OFFSET_TOP, W - OFFSET * 2, H);
}

// UI => score and lives
function updateUI() {
  clearOffsetTop();
  setNumber(score, 220);
  setNumber(lives, W - 230);
}

function drawNumber(number, x, y) {
  const numMatrix = NUMBERS[number];
  ctx.fillStyle = "#8a8d87";

  for (let row = 0; row < numMatrix.length; row++) {
    for (let col = 0; col < numMatrix[row].length; col++) {
      if (numMatrix[row][col] === 1) {
        ctx.fillRect(
          x + col * PIXEL_SIZE,
          y + row * PIXEL_SIZE + 2,
          PIXEL_SIZE,
          PIXEL_SIZE
        );
      }
    }
  }
}

function setNumber(number, startX) {
  const numberStr = number.toString();
  for (let i = 0; i < numberStr.length; i++) {
    const digit = parseInt(numberStr[i]);
    drawNumber(digit, startX + i * 10, 0);
    startX += NUM_WIDTH;
  }
}

function clearOffsetTop() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, OFFSET_TOP);
}

// Init game!
setup();
