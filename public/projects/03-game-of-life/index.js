const $canvas = document.querySelector("canvas");
const ctx = $canvas.getContext("2d");

const $span = document.querySelector("#generation-count");

const RULESTRING_REGEX = /^(B[0-8]*\/S[0-8]*|S[0-8]*\/B[0-8]*)$/;
const MAX_ALPHA_VALUE = 1;
const BORN = MAX_ALPHA_VALUE;

let game; // game: GameOfLife
let generations = 0;
let color = "rgb(150, 150, 150)"; // #fbfbfb
let updateSpeed = 100; // 100ms
let lastFrameTime = 0;
let ruleSelected;

function init(cellSize, rule, probability) {
  game = new GameOfLife(Math.floor($canvas.width / cellSize), Math.floor($canvas.height / cellSize), cellSize, ctx);
  game.init(rule);
  game.soup(probability);
  tick(); // Start the draw loop
}

function resize(w, h) {
  $canvas.width = w ?? window.innerWidth;
  $canvas.height = h ?? window.innerHeight;
  if (game) game.updateGridDimensions($canvas.width, $canvas.height);
}

function make2DArray(cols, rows) {
  return Array.from({ length: cols }, () => Array(rows).fill(0))
}

function tick(timeStamp) {
  if (timeStamp - lastFrameTime >= updateSpeed) {
    lastFrameTime = timeStamp;
    game.update();
    changeText(); // Update the generation counter
  }
  requestAnimationFrame(tick)
}

function changeText() {
  $span.textContent = generations;
}

const RULES = { // examples
  coral: { rulestring: "B3/S45678", name: "Coral", probability: 0.5, },
  fredkin: { rulestring: "B1357/S02468", name: "Fredkin", probability: 0.004, },
  highLife: { rulestring: "B36/S23", name: "High Life", probability: 0.4, },
  life: { rulestring: "B3/S23", name: "Life", probability: 0.7, },
  life34: { rulestring: "B34/S34", name: "34 Life", probability: 0.15, },
  lifeWithoutDeath: { rulestring: "B3/S012345678", name: "Life Without Death", probability: 0.03, },
  liveFreeOrDie: { rulestring: "B2/S0", name: "Live Free or Die", probability: 0.03, },
  maze: { rulestring: "B3/S12345", name: "Maze", probability: 0.05, },
  neonBlobs: { rulestring: "B08/S4", name: "Neon Blobs", probability: 0.5, },
  replicator: { rulestring: "B1357/S1357", name: "Replicator", probability: 0.01, },
  seeds: { rulestring: "B2/S", name: "Seeds", probability: 0.025, },
  vote: { rulestring: "B5678/S45678", name: "Vote", probability: 0.5, },
  cheerios: { rulestring: "B35678/S34567", name: "Cheerios", probability: 0.5, },
};

resize();
init(7, ruleSelected = RULES.life, 0.7);
