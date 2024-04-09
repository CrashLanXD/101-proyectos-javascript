const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions to the screen dimension
canvas.width = Math.round(innerWidth / 100) * 100 - 40;
canvas.height = Math.round(innerHeight / 100) * 100 - 50;

let deltaTime = 1000 / 20; // Time between frames
let w = 5; // Width of each cell
let grid; // Grid to hold cell states
let cols, rows; // Number of columns n rows in the grid
let size = canvas.width / w; // Size of the grid

function newGeneration() {
  let newCells = make2DArray(cols, rows);
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      let neighbors = countNeighbors(grid, x, y);
      if (grid[y][x] === 0 && neighbors === 3) {
        newCells[y][x] = 1;
      }
      else if (grid[y][x] === 1 && (neighbors === 2 || neighbors === 3)) {
        newCells[y][x] = 1;
      }
    }
  }
  grid = newCells;
}

function countNeighbors(grid, x, y) {
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let neighborX = (x + j + size) % size;
      let neighborY = (y + i + size) % size;

      count += grid[neighborY][neighborX];
    }
  }
  return count - grid[y][x];
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to draw the grid lines
function drawGrid() {
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  let w2 = w;
  for (let i = 0; i < cols; i++) {
    ctx.fillRect(0, w2, canvas.width, 1);
    ctx.fillRect(w2, 0, 1, canvas.height);
    w2 += w;
  }
  ctx.closePath();
}

// Function to draw the pixels (cells)
// let num = Math.random() * 360;
function drawPixel() {
  //ctx.fillStyle = `hsl(${num}, 50%, 50%)`;
  ctx.fillStyle = '#000';
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        ctx.fillRect(i * w, j * w, w, w);
      }
    }
  }
}

function draw() {
  clearCanvas();
  drawPixel();
  newGeneration();
  setTimeout(() => {
    window.requestAnimationFrame(draw);
  }, deltaTime);
}

function setup() {
  cols = canvas.width / w;
  rows = canvas.height / w;
  grid = make2DArray(cols, rows);
  drawGrid(cols, rows);
}

// Function to initialize the grid with some initial lived cells
let rand = size;
function init() {
  for (var i = 0; i < Math.floor(rand * rand * 0.3); i++) {
    var x, y;
    do {
      x = Math.floor(Math.random() * rand);
      y = Math.floor(Math.random() * rand);
      if (grid[y][x] === 0) {
        grid[y][x] = 1;
        break;
      }
    } while (true);
  }
}

setup();
init();
draw();