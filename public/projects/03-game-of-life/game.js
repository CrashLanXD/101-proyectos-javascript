class GameOfLife {
  constructor(cols, rows, cellSize, ctx) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.grid = [];
    this.ctx = ctx;
    this.rule = { rulestring: "", probability: 0, name: "The Game Of Life" };
    this.B = new Array(9).fill(false); // Born
    this.S = new Array(9).fill(false); // Survive
  }

  init(rule) {
    this.grid = make2DArray(this.cols, this.rows);
    this.rule = rule;
    this.parseRule(rule.rulestring);
  }

  parseRule(rulestring) {
    if (!RULESTRING_REGEX.test(rulestring)) throw new Error("Invalid rulestring :D");
    this.B.fill(false);
    this.S.fill(false);

    const [first, second] = rulestring.split("/")
    const bRule = first.startsWith("B") ? first : second;
    const sRule = first.startsWith("S") ? first : second;

    for (const char of bRule.slice(1)) this.B[+char] = true;
    for (const char of sRule.slice(1)) this.S[+char] = true;
  }

  nextGeneration() {
    const newCells = make2DArray(this.cols, this.rows);

    for (let i = 0; i < this.cols; i++)
    for (let j = 0; j < this.rows; j++) {
      const neighbors = this.countNeighbors(i, j);
      const isAlive = this.grid[i][j] > 0.00;

      if (isAlive) {
        if(this.S[neighbors]) newCells[i][j] = Math.max(0.05, this.grid[i][j] * 0.95);
      } else if(this.B[neighbors]) newCells[i][j] = BORN;
    }

    this.grid = newCells;
    generations++;
  }

  countNeighbors(x, y) {
    let count = 0;
    const startX = x > 0 ? x - 1 : 0;
    const startY = y > 0 ? y - 1 : 0;
    const endX = x < this.cols - 1 ? x + 1 : this.cols - 1;
    const endY = y < this.rows - 1 ? y + 1 : this.rows - 1;

    for (let i = startX; i <= endX; i++)
    for (let j = startY; j <= endY; j++)
      if (i !== x || j !== y) count += this.grid[i][j] > 0 ? 1 : 0;
    
    return count;
  }

  draw() {
    this.ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    this.ctx.fillStyle = color;
    for (let i = 0; i < this.cols; i++)
    for (let j = 0; j < this.rows; j++) {
      if (this.grid[i][j] > 0) {
        this.ctx.globalAlpha = this.grid[i][j];
        this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }

  update() {
    this.draw();
    this.nextGeneration();
  }

  soup(probability) {
    const prob = probability ?? this.rule.probability;
    for(let i = 0; i < this.cols; i++)
    for(let j = 0; j < this.rows; j++)
      this.grid[i][j] = Math.random() > prob ? 0 : BORN;
  }

  updateGridDimensions(w, h) {
    const newCols = ~~w;
    const newRows = ~~h;
    
    const newGrid = make2DArray(newCols, newRows);
    for (let i = 0; i < Math.min(this.cols, newCols); i++)
    for (let j = 0; j < Math.min(this.rows, newRows); j++)
      newGrid[i][j] = this.grid[i][j];

    this.cols = newCols;
    this.rows = newRows;
    this.grid = newGrid;
  }
}
