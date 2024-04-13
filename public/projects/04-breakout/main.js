const $CANVAS = document.querySelector("canvas");
const CTX = $CANVAS.getContext("2d");

$CANVAS.width = 600;
$CANVAS.height = 350;
const BORDER = $CANVAS.style.border;

const COLORS = [
  "rgb(200, 72, 72)", // red
  "rgb(198, 108, 58)", // orange
  "rgb(180, 122, 48)", // amber
  "rgb(162, 162, 42)", // yellow
  "rgb(71, 160, 72)", // green
  "rgb(66, 73, 201)", // blue
];

const STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};

const MAX_LIVES = 5;
let lives = MAX_LIVES;
let waitingForRestart = false;

// ! PADDLE
//#region PADDLE
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_SENSITIVITY = 17;
const MAX_BOUNCE_ANGLE = 75;

let paddleX = ($CANVAS.width - PADDLE_WIDTH) / 2;
let paddleY = $CANVAS.height - 20;

function paddleMovement() {
  if (rightPressed && paddleX < $CANVAS.width - PADDLE_WIDTH)
    paddleX += PADDLE_SENSITIVITY;
  else if (leftPressed && paddleX > 0) paddleX -= PADDLE_SENSITIVITY;
}

function drawPaddle() {
  CTX.fillStyle = COLORS[0];
  CTX.fillRect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
}
//#endregion

// ? BALL
//#region BALL
const BALL_SIZE = 9;
let ballX = $CANVAS.width - 100;
let ballY = $CANVAS.height - 140;

let ballResetPosition = { x: $CANVAS.width - 100, y: $CANVAS.height - 140 };
let ballResetVelocity = { x: -4, y: 2 };

let velocityX = -4;
let velocityY = 2;

let ballMaxSpeed = 6;

function ballMovement() {
  ballX += velocityX;
  ballY += velocityY;

  // DETECT COLLISIONS WITH:
  //horizontal walls
  if (ballX + BALL_SIZE > $CANVAS.width || ballX < 0) {
    velocityX = -velocityX;
    playSound(900, 200);
  }
  //vertical walls
  if (ballY < 0) {
    velocityY = -velocityY;
    playSound(900, 200);
  }
  // paddle
  if (
    ballY + BALL_SIZE > paddleY &&
    ballX + BALL_SIZE > paddleX &&
    ballY < paddleY + PADDLE_HEIGHT &&
    ballX < paddleX + PADDLE_WIDTH
  ) {
    velocityY = -velocityY;
    const paddleCenterX = paddleX + PADDLE_WIDTH / 2;
    const ballCenterX = ballX + BALL_SIZE / 2;
    // MAX ANGLE = 75
    const angle =
      ((ballCenterX - paddleCenterX) / (PADDLE_WIDTH / 2)) * (Math.PI / 3);
    velocityX = ballMaxSpeed * Math.sin(angle);
    velocityY = -ballMaxSpeed * Math.cos(angle);
    playSound(650, 200);
  }

  if (ballY + BALL_SIZE > $CANVAS.height && !waitingForRestart) {
    lives--;
    waitingForRestart = true;

    setTimeout(() => {
      ballX = ballResetPosition.x;
      ballY = ballResetPosition.y;
      velocityX = ballResetVelocity.x;
      velocityY = ballResetVelocity.y;
      waitingForRestart = false;
    }, 1500);
  }
}

function drawBall() {
  CTX.fillStyle = COLORS[0];
  CTX.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}
//#endregion

// * BRICKS
//#region BRICKS
const BRICK_COL_COUNT = 17;
const BRICK_ROW_COUNT = COLORS.length;
const BRICK_WIDTH = $CANVAS.width / BRICK_COL_COUNT;
const BRICK_HEIGHT = 20;
const BRICK_OFFSET_TOP = 50;
const BRICKS = [];

const INITIALIZE_BRICKS = () => {
  for (let i = 0; i < BRICK_COL_COUNT; i++) {
    BRICKS[i] = [];
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
      const BRICK_X = i * BRICK_WIDTH;
      const BRICK_Y = j * BRICK_HEIGHT + BRICK_OFFSET_TOP;

      BRICKS[i][j] = {
        x: BRICK_X,
        y: BRICK_Y,
        status: STATUS.ACTIVE,
        color: COLORS[j],
      };
    }
  }
};

function checkBricksCollisions() {
  for (let i = 0; i < BRICK_COL_COUNT; i++) {
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
      const BRICK = BRICKS[i][j];

      if (BRICK.status === STATUS.DESTROYED) continue;

      if (
        ballX > BRICK.x &&
        ballX < BRICK.x + BRICK_WIDTH &&
        ballY > BRICK.y &&
        ballY < BRICK.y + BRICK_HEIGHT
      ) {
        velocityY = -velocityY;
        BRICK.status = STATUS.DESTROYED;
        playSound(500, 200);
      }
    }
  }
}
//#endregion

// ? LOGIC
//#region LOGIC
let leftPressed = false;
let rightPressed = false;
function initializeEvents() {
  INITIALIZE_BRICKS();

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d")
      rightPressed = true;
    else if (key === "Left" || key === "ArrowLeft" || key.toLowerCase() === "a")
      leftPressed = true;
  }

  function keyUpHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d")
      rightPressed = false;
    else if (key === "Left" || key === "ArrowLeft" || key.toLowerCase() === "a")
      leftPressed = false;
  }

  if (isMobileDevice()) {
    addTouchControls();
    document.body.style.zoom = 0.8;
  }
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function addTouchControls() {
  const leftButton = document.querySelector("#l");
  leftButton.style.opacity = '100%';
  leftButton.addEventListener("touchstart", () => {
    leftPressed = true;
    paddleMovement("left");
  });
  leftButton.addEventListener("touchend", () => {
    leftPressed = false;
  });
  
  const rightButton = document.querySelector("#r");
  rightButton.style.opacity = '100%';
  rightButton.addEventListener("touchstart", () => {
    rightPressed = true;
    paddleMovement("right");
  });
  rightButton.addEventListener("touchend", () => {
    rightPressed = false;
  });
}

function isGameOver() {
  if (lives <= 0) {
    $CANVAS.style.borderTop = `25px solid ${COLORS[0]}`;
    $CANVAS.style.borderRight = `25px solid ${COLORS[0]}`;
    $CANVAS.style.borderLeft = `25px solid ${COLORS[0]}`;
    $CANVAS.style.borderBottom = "transparent";

    ballX = ballResetPosition.x;
    ballY = ballResetPosition.y;
    velocityX = ballResetVelocity.x;
    velocityY = ballResetVelocity.y;

    setTimeout(() => {
      $CANVAS.style.border = BORDER;
      lives = MAX_LIVES;
      INITIALIZE_BRICKS();
    }, 2000);
  }
}

function handleWin() {
  let count = 0;
  for (let i = 0; i < BRICK_COL_COUNT; i++) {
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
      const BRICK = BRICKS[i][j];
      if (BRICK.status === STATUS.DESTROYED) {
        count++;

        if (count === BRICK_COL_COUNT * BRICK_ROW_COUNT) {
          $CANVAS.style.borderTop = `25px solid ${COLORS[3]}`;
          $CANVAS.style.borderRight = `25px solid ${COLORS[3]}`;
          $CANVAS.style.borderLeft = `25px solid ${COLORS[3]}`;
          $CANVAS.style.borderBottom = "transparent";

          ballX = ballResetPosition.x;
          ballY = ballResetPosition.y;
          velocityX = ballResetVelocity.x;
          velocityY = ballResetVelocity.y;

          setTimeout(() => {
            $CANVAS.style.border = BORDER;
            lives = MAX_LIVES;
            INITIALIZE_BRICKS();
          }, 3000);
        } else if (count > (BRICK_COL_COUNT * BRICK_ROW_COUNT) / 2)
          ballMaxSpeed = 8;
      }
    }
  }
}
//#endregion

// ! DRAW
//#region DRAW
const FPS = 60;
const MS_PER_FRAME = 1000 / FPS;

let msPrev = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
let frames = 0;
let framesPerSec = FPS;

function checkFPS() {
  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  if (msPassed < MS_PER_FRAME) return;

  const excessTime = msPassed % MS_PER_FRAME;
  msPrev = msNow - excessTime;

  frames++;

  if (msFPSPrev < msNow) {
    msFPSPrev = window.performance.now() + 1000;
    framesPerSec = frames;
    frames = 0;
  }
}

function drawFPS() {
  CTX.font = "12px system-ui";
  CTX.fillStyle = "white";
  CTX.fillText(`FPS: ${framesPerSec}`, 5, 14);
}

function drawLives() {
  CTX.font = "12px system-ui";
  CTX.fillStyle = "white";
  CTX.fillText(`LIVES: ${lives}`, $CANVAS.width - 55, 14);
}

const clearCanvas = () => CTX.clearRect(0, 0, $CANVAS.width, $CANVAS.height);

function drawBricks() {
  for (let i = 0; i < BRICK_COL_COUNT; i++) {
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
      const BRICK = BRICKS[i][j];
      if (BRICK.status === STATUS.DESTROYED) continue;
      CTX.fillStyle = BRICK.color;
      CTX.fillRect(BRICK.x, BRICK.y, BRICK_WIDTH + 1, BRICK_HEIGHT);
    }
  }
}

function draw() {
  window.requestAnimationFrame(draw);
  checkFPS();
  clearCanvas();
  drawFPS();

  // !DRAW
  drawBricks();
  drawPaddle();
  drawBall();
  drawLives();

  // ?LOGIC
  paddleMovement();
  ballMovement();
  checkBricksCollisions();

  isGameOver();
  handleWin();
}
//#endregion

initializeEvents();
draw();
