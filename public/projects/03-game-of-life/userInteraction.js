// This part handles user interaction
addEventListener("DOMContentLoaded", () => {
  const $cellSize = document.getElementById("cellSize");
  const $boardSize = document.getElementById("boardSize");
  const $updateSpeedInput = document.getElementById("updateSpeed");
  const $probability = document.getElementById("probability");
  const $gameRules = document.getElementById("gameRules");
  const $applyChangesButton = document.getElementById("applyChanges");

  // Add event listener to apply changes button
  $applyChangesButton.addEventListener("click", () => {
    // Extract width and height from board size input
    const board = $boardSize.value.split("x");
    const width = parseInt(board[0]);
    const height = parseInt(board[1]);

    // Extract cell size from input
    const cellSize = parseInt($cellSize.value);

    // Extract update speed from input
    const updateSpeed = parseInt($updateSpeedInput.value);

    // Extract probability of cells generation from input
    const probability = parseFloat($probability.value) / 100;

    // Extract update speed from input
    const selectedRule = $gameRules.value;

    // Set canvas size, initialize game, and update settings
    size(Math.floor(width), Math.floor(height));
    init(cellSize, GAME_TYPES[parseInt(selectedRule)], probability);
    updateInterval = updateSpeed;
    generations = 0;
    changeText();
  });
});
