const $CANVAS = document.querySelector("canvas");
const CTX = $CANVAS.getContext("2d");

// Set canvas dimensions
$CANVAS.width = 600;
$CANVAS.height = 350;
const BORDER = $CANVAS.style.border;

// Define colors
const COLORS = [
  "rgb(200, 72, 72)",  // red
  "rgb(198, 108, 58)", // orange
  "rgb(180, 122, 48)", // amber
  "rgb(162, 162, 42)", // yellow
  "rgb(71, 160, 72)",  // green
  "rgb(66, 73, 201)",  // blue
];

// Define status for bricks
const STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};

// Define maximum number of lives
const MAX_LIVES = 5;
let lives = MAX_LIVES;
let waitingForRestart = false;

// ! PADDLE
//#region PADDLE
let paddleWidth = 100; // paddle width changes depend the number of destroyed bricks
const PADDLE_HEIGHT = 9;
const PADDLE_SENSITIVITY = 17;

let paddleX = ($CANVAS.width - paddleWidth) / 2;
let paddleY = $CANVAS.height - 15;

// Function to handle paddle movement
function paddleMovement() {
  if (rightPressed && paddleX + paddleWidth < $CANVAS.width) {
    paddleX += PADDLE_SENSITIVITY;
    if (paddleX + paddleWidth > $CANVAS.width) paddleX = $CANVAS.width - paddleWidth;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY;
    if (paddleX < 0) paddleX = 0;
  }
}

// Function to draw the paddle on the canvas
function drawPaddle() {
  CTX.fillStyle = COLORS[0]; // Set paddle color to red
  CTX.fillRect(paddleX, paddleY, paddleWidth, PADDLE_HEIGHT); // draw paddle rectangle
}
//#endregion

// ? BALL
//#region BALL
const BALL_SIZE = 9;
const BOUNCE_ANGLE = Math.PI / 3; // bounce angle -> 75
let ballX = $CANVAS.width - 100;
let ballY = $CANVAS.height - 140;

let ballResetPosition = { x: $CANVAS.width - 100, y: $CANVAS.height - 140 };
let ballResetVelocity = { x: -4, y: 2 };

// set initial speed slower so that you can react
let velocityX = -4;
let velocityY = 2;

let ballMaxSpeed = 6;
const MEDIUM_SPEED = ballMaxSpeed * 1.3;
const FAST_SPEED = ballMaxSpeed * 1.7;

// Handle ball movement and collisions with walls and paddle
function ballMovement() {
  ballX += velocityX;
  ballY += velocityY;

  // Detect collisions with horizontal walls
  if (ballX + BALL_SIZE > $CANVAS.width || ballX < 0) {
    velocityX = -velocityX;
    playSound(900, 110); // play sound effect
  }
  // Detect collisions with vertical walls
  if (ballY < 0) {
    velocityY = -velocityY;
    playSound(900, 110); // play same sound effect
  }
  // Detect collisions with paddle
  if (
    ballY + BALL_SIZE > paddleY &&
    ballX + BALL_SIZE > paddleX &&
    ballY < paddleY + PADDLE_HEIGHT &&
    ballX < paddleX + paddleWidth
  ) {
    velocityY = -velocityY;
    // Calculate new angle for ball bounce
    const paddleCenterX = paddleX + paddleWidth / 2;
    const ballCenterX = ballX + BALL_SIZE / 2;
    const angle =
      ((ballCenterX - paddleCenterX) / (paddleWidth / 2)) * BOUNCE_ANGLE;
    velocityX = ballMaxSpeed * Math.sin(angle);
    velocityY = -ballMaxSpeed * Math.cos(angle);
    playSound(590, 120); // Play sound effect
  }

  // Check if ball goes below canvas
  if (ballY + BALL_SIZE > $CANVAS.height && !waitingForRestart) {
    lives--; // Decrement lives
    waitingForRestart = true;

    // Reset ball position and velocity after delay
    setTimeout(() => {
      ballX = ballResetPosition.x;
      ballY = ballResetPosition.y;
      velocityX = ballResetVelocity.x;
      velocityY = ballResetVelocity.y;
      waitingForRestart = false;
    }, 1500);
  }
}

// Function to draw the ball on the canvas
function drawBall() {
  CTX.fillStyle = COLORS[0]; // Set ball color to red
  CTX.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE); // Draw ball square
}
//#endregion

// * BRICKS
//#region BRICKS
const BRICK_COL_COUNT = 17;
const BRICK_ROW_COUNT = COLORS.length;
const BRICK_WIDTH = $CANVAS.width / BRICK_COL_COUNT;
const BRICK_HEIGHT = PADDLE_HEIGHT * 1.4;
const BRICK_OFFSET_TOP = BRICK_HEIGHT * 4.4;
const BRICKS = [];

let brickInitialized = false;

// Function to initialize the brick with status ACTIVE
const INITIALIZE_BRICKS = () => {
  if (brickInitialized) return;

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
  brickInitialized = true;
};

// Function to check collision with bricks
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
        brickInitialized = false; // Reset brick initialization flag
        velocityY = -velocityY; // Invert ball velocity
        BRICK.status = STATUS.DESTROYED; // Set brick status to DESTROYED
        playSound(280, 110); // Play sound effect
        handleWin(); // Handle win condition
      }
    }
  }
}
//#endregion

// ? LOGIC
//#region LOGIC
let leftPressed = false;
let rightPressed = false;

const FPS = 60;
const MS_PER_FRAME = 1000 / FPS;

let msPrev = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
let frames = 0;
let framesPerSec = FPS;

// Function to check and limit FPS
function checkFPS() {
  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  if (msPassed < MS_PER_FRAME) return false;

  const excessTime = msPassed % MS_PER_FRAME;
  msPrev = msNow - excessTime;

  frames++;

  if (msFPSPrev < msNow) {
    msFPSPrev = window.performance.now() + 1000;
    framesPerSec = frames;
    frames = 0;
  }
}

// Function to initialize game events
function initializeEvents() {
  INITIALIZE_BRICKS(); /// Initialize bricks

  // Add event listener for paddle movement with keyboard
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  // Handle key down events
  function keyDownHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d")
      rightPressed = true;
    else if (key === "Left" || key === "ArrowLeft" || key.toLowerCase() === "a")
      leftPressed = true;
  }

  // Handle key up events
  function keyUpHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d")
      rightPressed = false;
    else if (key === "Left" || key === "ArrowLeft" || key.toLowerCase() === "a")
      leftPressed = false;
  }

  // Add touch control for mobile devices
  if (isMobileDevice()) addTouchControls();
}

// * Main game loop
function gameLoop() {
  // ?LOGIC
  // Update game logic
  paddleMovement();
  ballMovement();
  checkBricksCollisions();

  isGameOver();
}

// Check if the device is a mobile device
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Add buttons for touch control for mobile devices
function addTouchControls() {
  const leftButton = document.querySelector("#l");
  // make the left button visible
  leftButton.style.opacity = "100%";
  // Handle touch start events for left button
  leftButton.addEventListener("touchstart", () => {
    leftPressed = true;
    paddleMovement("left");
  });
  // Handle touch end events for left button
  leftButton.addEventListener("touchend", () => {
    leftPressed = false;
  });

  const rightButton = document.querySelector("#r");
  // make the right button visible
  rightButton.style.opacity = "100%";
  // Handle touch start events for right button
  rightButton.addEventListener("touchstart", () => {
    rightPressed = true;
    paddleMovement("right");
  });
  // Handle touch end events for right button
  rightButton.addEventListener("touchend", () => {
    rightPressed = false;
  });
}

function isGameOver() {
  if (lives <= 0) {
    // Display game over screen
    $CANVAS.style.borderTop = `25px solid ${COLORS[0]}`;
    $CANVAS.style.borderRight = `25px solid ${COLORS[0]}`;
    $CANVAS.style.borderLeft = `25px solid ${COLORS[0]}`;
    $CANVAS.style.borderBottom = "transparent";

    // Reset ball position and velocity
    velocityX = ballResetVelocity.x;
    velocityY = ballResetVelocity.y;
    ballX = ballResetPosition.x;
    ballY = ballResetPosition.y;

    // Reset lives and bricks
    setTimeout(() => {
      $CANVAS.style.border = BORDER;
      lives = MAX_LIVES;
      INITIALIZE_BRICKS();
    }, 2000);
  }
}

// Handle win condition
function handleWin() {
  let count = 0;
  for (let i = 0; i < BRICK_COL_COUNT; i++) {
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
      const BRICK = BRICKS[i][j];
      if (BRICK.status === STATUS.DESTROYED) {
        count++;

        // Check if all the bricks are destroyed
        if (count === BRICK_COL_COUNT * BRICK_ROW_COUNT) {
          // Display win screen
          $CANVAS.style.borderTop = `25px solid ${COLORS[3]}`;
          $CANVAS.style.borderRight = `25px solid ${COLORS[3]}`;
          $CANVAS.style.borderLeft = `25px solid ${COLORS[3]}`;
          $CANVAS.style.borderBottom = "transparent";

          // Reset ball position and velocity
          ballX = ballResetPosition.x;
          ballY = ballResetPosition.y;
          velocityX = ballResetVelocity.x;
          velocityY = ballResetVelocity.y;

          // Reset live and bricks
          setTimeout(() => {
            $CANVAS.style.border = BORDER;
            // lives = MAX_LIVES;
            INITIALIZE_BRICKS();
          }, 3000);
        } else if (count > (BRICK_COL_COUNT * BRICK_ROW_COUNT) / 1.2) { // HARD mode
          // ! The difficulty remains even if you lose
          // Increase ball speed and decrease paddle width after reaching certain brick destruction threshold
          ballMaxSpeed = FAST_SPEED;
          paddleWidth = 80;
        } else if (count > (BRICK_COL_COUNT * BRICK_ROW_COUNT) / 2) { // MEDIUM mode
          // Increase ball speed and decrease paddle width after reaching certain brick destruction threshold
          ballMaxSpeed = MEDIUM_SPEED;
          paddleWidth = 90;
        }
      }
    }
  }
}
//#endregion

// ! DRAW
//#region DRAW
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

// Function to draw bricks in the canvas
function drawBricks() {
  for (let i = 0; i < BRICK_COL_COUNT; i++) {
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
      const BRICK = BRICKS[i][j];
      if (BRICK.status === STATUS.DESTROYED) continue;
      CTX.fillStyle = BRICK.color;
      CTX.fillRect(BRICK.x, BRICK.y, BRICK_WIDTH + 1, BRICK_HEIGHT + 1);
    }
  }
}

// Function to fill a rectangle on the canvas
function fill(
  x = 0,
  y = 0,
  w = $CANVAS.width,
  h = $CANVAS.height,
  color = "#000"
) {
  // Set the fill style to the provided color
  CTX.fillStyle = color;
  // Fill a rectangle with the provided dimensions and position
  CTX.fillRect(x, y, w, h);
}

// * Main draw function
function draw() {
  window.requestAnimationFrame(draw);
  if (checkFPS()) return;
  fill();
  drawFPS();

  // !DRAW
  // draw game elements
  drawBricks();
  drawPaddle();
  drawBall();
  drawLives();

  // ?LOGIC
  gameLoop();
}
//#endregion

// * START
initializeEvents(); // Initialize events
draw(); // Start game
// :D
