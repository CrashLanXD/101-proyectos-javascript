const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.round(innerWidth / 100) * 100;
canvas.height = Math.round(innerHeight / 100) * 300;

let ruleSet;
let w = 1;
let y = 0;
let cells;
let cols;

function setup() {
  const configForm = document.getElementById("configForm");
  configForm.addEventListener("submit", function (event) {
    event.preventDefault();
    ruleValue = parseInt(document.getElementById("ruleValue").value);
    cellColor = document.getElementById("color").value;
    reset();
    draw();
  });

  ruleSet = ruleValue.toString(2).padStart(8, "0");

  cols = canvas.width / w;
  cells = [1, 0, 0, 1, 0, 1, 0, 1, 1, 0];
  for (let i = 0; i < cols; i++) {
    cells[i] = 0;
  }
  cells[Math.floor(cols / 2)] = 1;
}

function reset() {
  ruleSet = ruleValue.toString(2).padStart(8, "0");

  cols = canvas.width / w;
  cells = [1, 0, 0, 1, 0, 1, 0, 1, 1, 0];
  for (let i = 0; i < cols; i++) {
    cells[i] = 0;
  }
  cells[Math.floor(cols / 2)] = 1;
  y = 0;
}

function drawPixel(x, y, w) {
  ctx.fillRect(x, y, w, w);
}

function draw() {
  if (y >= canvas.height) {
    return;
  }

  for (let i = 0; i < cells.length; i++) {
    let x = i * w;
    ctx.fillStyle = cells[i] === 1 ? cellColor : "#fff";
    drawPixel(x, y, w);
  }

  y += w;

  let nextCells = [];

  let len = cells.length;
  for (let i = 0; i < cells.length; i++) {
    let left = cells[(i - 1 + len) % len];
    let right = cells[(i + 1 + len) % len];
    let state = cells[i];
    let newState = calculateState(left, state, right);
    nextCells[i] = newState;
  }
  cells = nextCells;

  setTimeout(() => {
    draw();
  }, 4);
}

function calculateState(a, b, c) {
  let neighborHood = "" + a + b + c;
  let value = 7 - parseInt(neighborHood, 2);

  return parseInt(ruleSet[value]);
}

setup();
draw();