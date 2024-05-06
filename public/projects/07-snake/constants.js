const $canvas = document.querySelector("canvas");
const ctx = $canvas.getContext("2d");

function size(w, h) {
  $canvas.width = w;
  $canvas.height = h;
}

function fill(
  color = "#000",
  x = 0,
  y = 0,
  w = $canvas.width,
  h = $canvas.height
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function clear() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

const CELL_SIZE = 55;
const COLUMNS = 17;
const ROWS = 15;

// DOM elements
const $scoreSpan = document.querySelector("span");
const $maxScoreSpan = document.querySelector(".trophy");
const $menuScoreSpan = document.querySelector(".span-score");
const $menuMaxScoreSpan = document.querySelector(".span-max-score");
const $menu = document.querySelector(".start-menu");

const GAME = {
  width: COLUMNS * CELL_SIZE,
  height: ROWS * CELL_SIZE,
  gameOver: false,
};

function resetGame() {
  GAME.gameOver = false;
  Snake.reset();
  Food.reset();
  setup();
}

const COLOR_BACKGROUND = [
  ["#b5af42", "#919b3a"],
  // ["#494351", "443e4c"],
  // ["#432a6f", "#3d285d"],
];

const COLOR_TYPES = [
  [
    [58, 81, 34],
    [93, 120, 46],
  ],
  // [[107, 107, 107],[137, 137, 137],],
  // [[183, 73, 236],[232, 128, 64],],
];

const BG_IDX = 0;
const SNAKE_IDX = 0;
