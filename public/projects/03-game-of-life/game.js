class GameOfLife {
  constructor(cols, rows, cellSize, ctx) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.grid = []; // Initialize grid to hold cell states
    this.ctx = ctx; // Canvas rendering context
    this.rule; // Rule function to determine cell state transition

    // Create an offscreen canvas for drawing
    this.offscreenCanvas = document.createElement("canvas");
    this.initOffScreenCanvas();
  }

  // Initialize offscreen canvas
  initOffScreenCanvas() {
    this.offscreenCanvas.width = $canvas.width;
    this.offscreenCanvas.height = $canvas.height;
    this.offscreenCtx = this.offscreenCanvas.getContext("2d");
  }

  //Initialize the game with a specific rule
  init(rule) {
    this.grid = make2DArray(this.cols, this.rows); // Create a 2D array to represent the grid
    this.rule = rule; // Set the rule function
  }

  // Calculate the next generation of cell states
  nextGeneration(rule) {
    const newCells = make2DArray(this.cols, this.rows); // Create a new grid for the next generation
    const neighborCounts = make2DArray(this.cols, this.rows); // Create a grid to store neighbors count

    // Count neighbors for each cell
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        neighborCounts[i][j] = this.countNeighbors(i, j);
      }
    }

    // Apply the rule to each cell to determine its next state
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const isAlive = this.grid[i][j] > 0;
        const neighbors = neighborCounts[i][j];

        if (isAlive) this.grid[i][j] = Math.max(1, this.grid[i][j] - 1); // Decrease age of living cells

        rule(newCells, i, j, isAlive, neighbors); // Apply the rule
      }
    }

    // Update the grid with the new cell states
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = newCells[i][j];
      }
    }

    generations++; // Increment generation count
  }

  // HighLife rule: A variant of Conway's Game of Life
  highLifeRule(newCells, i, j, isAlive, neighbors) {
    if (!isAlive && (neighbors === 3 || neighbors === 6 || neighbors === 8))
      newCells[i][j] = COLORS.length - 1; // Revive cell
    else if (isAlive && (neighbors === 2 || neighbors === 3))
      newCells[i][j] = this.grid[i][j]; // Cell stay alive
  }

  // Life 34 rule: Another variant of Conway's Game of Life
  life34Rule(newCells, i, j, isAlive, neighbors) {
    if (!isAlive && (neighbors === 3 || neighbors === 4))
      newCells[i][j] = COLORS.length - 1; // Revive cell
    else if (isAlive && (neighbors === 2 || neighbors === 3))
      newCells[i][j] = this.grid[i][j]; // Cell stay alive
  }

  // Normal rule: Classics Conway's Game of Life
  normalRule(newCells, i, j, isAlive, neighbors) {
    if (!isAlive && neighbors === 3)
      newCells[i][j] = COLORS.length - 1; // Revive cell
    else if (isAlive && (neighbors === 2 || neighbors === 3))
      newCells[i][j] = this.grid[i][j]; // Cell stay alive
  }

  // Count the number of living neighbors for a given cell
  countNeighbors(x, y) {
    let count = 0;
    const startX = Math.max(0, x - 1);
    const startY = Math.max(0, y - 1);
    const endX = Math.min(this.cols - 1, x + 1);
    const endY = Math.min(this.rows - 1, y + 1);

    // Iterate over neighboring cells
    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        if (i === x && j === y) continue; // Skip the current cell
        if (this.grid[i][j] > 0) count++; // Increment count if neighbor is alive
      }
    }
    return count; // Return the total count of living neighbors
  }

  // Draw the grid on the canvas
  draw() {
    // Crear the offscreen canvas
    this.offscreenCtx.clearRect(
      0,
      0,
      this.offscreenCanvas.width,
      this.offscreenCanvas.height
    );

    // Draw living cells on the offscreen canvas
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.grid[i][j] > 0) {
          const color = COLORS[this.grid[i][j] - 1];
          this.offscreenCtx.fillStyle = color;
          this.offscreenCtx.fillRect(
            i * this.cellSize,
            j * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
      }
    }

    // Draw the offscreen canvas on the main canvas
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
  }

  // Update the mage state and draw the grid
  update() {
    this.draw(); // Draw the grid
    this.nextGeneration(this.rule.bind(this)); // Calculate and apply the next generation of cell state
  }

  // Initializes the board with random cells states based on given probability
  randomStart(probability) {
    // Loop through each cell in the grid
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        // Set the cell state randomly based on the probability
        this.grid[i][j] = Math.random() > probability ? COLORS.length - 1 : 0;
      }
    }
  }
}
