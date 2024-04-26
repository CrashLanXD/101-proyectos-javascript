// Define the colors used for cell representation
const COLORS = [
  "#373737",
  "#555555",
  "#737373",
  "#919191",
  "#afafaf",
  "#cfcfcf",
  "#efefef",
  "#ffffff",
];

// Create a new instance of the GameOfLife class
let game = new GameOfLife(0, 0, 0, 0);
let generations = 0;

// Initialize the game with given parameters
function init(cellSize, rule, probability) {
  // Create a new GameOfLife instance with calculated dimension
  game = new GameOfLife(
    parseInt($canvas.width / cellSize),
    parseInt($canvas.height / cellSize),
    cellSize,
    ctx
  );

  // Initialize the game with the specified rule and set random initial cell states
  game.init(rule);
  game.randomStart(probability);
  draw(); // Start the draw loop
}

// Variables for controlling the draw loop
let counter = 0;
let lastTime = 0;
let updateInterval = 100;

// The draw function, responsible for updating and rendering the game
function draw(time = 0) {
  requestAnimationFrame(draw);

  let deltaTime = time - lastTime;
  lastTime = time;

  counter += deltaTime;
  if (counter > updateInterval) {
    counter = 0;
    fill(0, 0, $canvas.width, $canvas.height, "#000"); // Clear the canvas

    game.update(); // Update game state
    changeText(); // Update the generation counter
  }
}

// Function to update the generation counter text
const $span = document.querySelector("span");
function changeText() {
  $span.textContent = generations;
}

// Array containing different game rules
const GAME_TYPES = [game.normalRule, game.highLifeRule, game.life34Rule];

// Set canvas size and initialize the game with default parameters
size(400, 280);
init(3, GAME_TYPES[0], 0.7); // Cell size: 3, Rule: Normal, Probability: 0.7
