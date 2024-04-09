const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.style.cursor = "pointer";

let cols;
let rows;
let grid, velocityGrid;
let freezeGrid;

let matrixSize = 10; // Size of the matrix used for spawning sand
let hueValue = 20; // Initial hue value for sand color
let gravity = 0.1; // Gravity value affecting sand falling speed
let cellSize; // Size of each grid cell
const maxVelocity = 10; // Maximum velocity of falling sand particles
const frameInterval = 1000 / 60; // Frame interval for animation

// Adjust canvas dimensions based on screen size
canvas.width = Math.round(innerWidth / 100) * 100;
canvas.height = Math.round(innerHeight / 100) * 100 - 50;

if (window.innerWidth > 1200 || window.innerHeight > 900) {
  // For desktop
  cellSize = 10;
  canvas.width -= 50;
} else {
  // For mobile devices
  cellSize = 2;
  canvas.height -= 10;
}

function setFreeze(x, y) {
  freezeGrid[x][y] = 1;
}

function isFrozen(x, y) {
  return freezeGrid[x][y] !== 0;
}

function setup() {
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  grid = make2DArray(cols, rows);
  velocityGrid = make2DArray(cols, rows);
  freezeGrid = make2DArray(cols, rows);
}

function fall() {
  let nextGrid = make2DArray(cols, rows);
  let nextVelocityGrid = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let velocity = velocityGrid[i][j];
      let moved = false;
      if (state > 0 && !isFrozen(i, j)) {
        let newPos = Math.floor(j + velocity);
        for (let y = newPos; y > j; y--) {
          let below = grid[i][y];
          let dir = 1;
          if (Math.random() < 0.5) {
            dir *= -1;
          }
          let belowA = -1;
          let belowB = -1;
          if (withinCols(i + dir)) belowA = grid[i + dir][y];
          if (withinCols(i - dir)) belowB = grid[i - dir][y];

          if (below === 0) {
            nextGrid[i][y] = state;
            nextVelocityGrid[i][y] = Math.min(velocity + gravity, maxVelocity);
            moved = true;
            break;
          } else if (belowA === 0) {
            nextGrid[i + dir][y] = state;
            nextVelocityGrid[i + dir][y] = Math.min(
              velocity + gravity,
              maxVelocity
            );
            moved = true;
            break;
          } else if (belowB === 0) {
            nextGrid[i - dir][y] = state;
            nextVelocityGrid[i - dir][y] = Math.min(
              velocity + gravity,
              maxVelocity
            );
            moved = true;
            break;
          }
        }
      }

      if (state > 0 && !moved) {
        nextGrid[i][j] = grid[i][j];
        nextVelocityGrid[i][j] = Math.min(
          velocityGrid[i][j] + gravity,
          maxVelocity
        );
        if (velocityGrid[i][j] === maxVelocity) {
          setFreeze(i, j);
        }
      }
    }
  }
  grid = nextGrid;
  velocityGrid = nextVelocityGrid;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clear2DArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0;
    }
  }
}

function drawSand() {
  let batchStartX = -1;
  let batchStartY = -1;
  let batchEndX = -1;
  let batchEndY = -1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] > 0) {
        // If it's the start of a new batch
        if (batchStartX === -1 && batchStartY === -1) {
          batchStartX = i;
          batchStartY = j;
          batchEndX = i;
          batchEndY = j;
        } else {
          // If the current cell can be added to the current batch
          if (grid[i][j] === grid[batchStartX][batchStartY]) {
            batchEndX = i;
            batchEndY = j;
          } else {
            // Draw the current batch
            ctx.fillStyle = `hsl(${grid[batchStartX][batchStartY]}, 100%, 50%)`;
            ctx.fillRect(
              batchStartX * cellSize,
              batchStartY * cellSize,
              (batchEndX - batchStartX + 1) * cellSize,
              (batchEndY - batchStartY + 1) * cellSize
            );

            // Update the start of a new batch
            batchStartX = i;
            batchStartY = j;
            batchEndX = i;
            batchEndY = j;
          }
        }
      } else {
        // If there's a pending batch, draw it
        if (batchStartX !== -1 && batchStartY !== -1) {
          ctx.fillStyle = `hsl(${grid[batchStartX][batchStartY]}, 100%, 50%)`;
          ctx.fillRect(
            batchStartX * cellSize,
            batchStartY * cellSize,
            (batchEndX - batchStartX + 1) * cellSize,
            (batchEndY - batchStartY + 1) * cellSize
          );
          batchStartX = -1;
          batchStartY = -1;
          batchEndX = -1;
          batchEndY = -1;
        }
      }
    }
  }

  // If there's a pending batch at the end of the loop, draw it
  if (batchStartX !== -1 && batchStartY !== -1) {
    ctx.fillStyle = `hsl(${grid[batchStartX][batchStartY]}, 100%, 50%)`;
    ctx.fillRect(
      batchStartX * cellSize,
      batchStartY * cellSize,
      (batchEndX - batchStartX + 1) * cellSize,
      (batchEndY - batchStartY + 1) * cellSize
    );
  }
}

let lastFrameTime = 0;

function draw() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastFrameTime;

  if (elapsedTime > frameInterval) {
    lastFrameTime = currentTime - (elapsedTime % frameInterval);

    clearCanvas();
    drawSand();
    fall();
  }

  window.requestAnimationFrame(draw);

  if (isMousePressed) {
    spawnSand();
  }
}

function withinCols(i) {
  return i >= 0 && i <= cols - 1;
}

function withinRows(j) {
  return j >= 0 && j <= rows - 1;
}

function spawnSand(event) {
  let mouseCol = Math.floor(mouseX / cellSize);
  let mouseRow = Math.floor(mouseY / cellSize);

  let extent = Math.floor(matrixSize / 2);
  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      if (Math.random() < 0.3) {
        let col = mouseCol + i;
        let row = mouseRow + j;
        if (withinCols(col) && withinRows(row)) {
          grid[col][row] = hueValue;
          velocityGrid[col][row] = 1;
        }
      }
    }
  }
  hueValue += Math.random() < 0.5 ? 0.5 : 0;

  if (hueValue >= 360) {
    hueValue = 1;
  }
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

// Mouse Movement:
let mouseX;
let mouseY;
let isMousePressed = false;
let rect = canvas.getBoundingClientRect();
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("touchstart", handleMouseDown);
canvas.addEventListener("touchend", handleMouseUp);
canvas.addEventListener("touchmove", handleTouchMove);

function handleMouseDown(event) {
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  isMousePressed = true;
  canvas.style.cursor = "grab";
}

function handleMouseUp(event) {
  isMousePressed = false;
  canvas.style.cursor = "pointer";
}

function handleMouseMove(event) {
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

function handleTouchMove(event) {
  event.preventDefault();
  mouseX = event.touches[0].clientX - rect.left;
  mouseY = event.touches[0].clientY - rect.top;
  spawnSand();
}

window.addEventListener("orientationchange", function () {
  location.reload();
});

setup();
draw();
