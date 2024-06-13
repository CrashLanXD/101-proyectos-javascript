function drawStaticUI() {
  // main background
  color(activeColorPalette.text);
  rect(0, 0, W);
  color(activeColorPalette.background);
  rect(7, 0, 98, H);

  // walls on both sides
  drawWalls();

  // score area background
  drawScoreArea();

  // text area SCORE, LEVEL & LINES
  textArea(5, 14); // SCORE
  textArea(45, 22); // LEVEL
  textArea(69, 22); // LINES

  drawText(TEXT["score"], ui.x + 8, 9);
  drawText(TEXT["level"], ui.x + 8, 49);
  drawText(TEXT["lines"], ui.x + 8, 73);

  // next piece area
  drawNextPieceArea(10, 99, 42);
}

function drawWalls() {
  for (
    let i = 0;
    i <= 24;
    i++ // left
  )
    drawBlock(BLOCK_SIZE, i * BLOCK_TYPES.wall.length, BLOCK_TYPES.wall);
  for (
    let i = 0;
    i <= 24;
    i++ // right
  )
    drawBlock(96, i * BLOCK_TYPES.wall.length, BLOCK_TYPES.wall);
}

function textArea(y, h) {
  color(activeColorPalette.background);
  rect(ui.x + 4, y + 1, ui.w - 8, h - 2);
  rect(ui.x + 5, y, ui.w - 10, h);

  color(activeColorPalette.secondary);
  rect(ui.x + 5, y + 2, ui.w - 10, h - 4);
  rect(ui.x + 6, y + 1, ui.w - 12, h - 2);

  color(activeColorPalette.background);
  rect(ui.x + 6, y + 3, ui.w - 12, h - 6);
  rect(ui.x + 7, y + 2, ui.w - 14, h - 4);
}

function drawScoreArea() {
  color(activeColorPalette.background);
  rect(ui.x, 14, ui.w, 22);

  color(activeColorPalette.secondary);
  rect(ui.x, 15, ui.w, 20);

  color(activeColorPalette.background);
  rect(ui.x, 22, ui.w, 1);
  rect(ui.x, 24, ui.w, 10);
}

function drawNextPieceArea(x, y, s) {
  color(activeColorPalette.primary);
  rect(ui.x + x, y + 2, s, s - 4);
  rect(ui.x + x + 1, y + 1, s - 2, s - 2);
  rect(ui.x + x + 2, y, s - 4, s);

  color(activeColorPalette.background);
  rect(ui.x + x + 1, y + 2, s - 2, s - 4);
  rect(ui.x + x + 2, y + 1, s - 4, s - 2);

  color(activeColorPalette.primary);
  rect(ui.x + x + 2, y + 3, s - 4, s - 6);
  rect(ui.x + x + 3, y + 2, s - 6, s - 4);

  color(activeColorPalette.secondary);
  rect(ui.x + x + 2, y + 4, s - 4, s - 8);
  rect(ui.x + x + 3, y + 3, s - 6, s - 6);
  rect(ui.x + x + 4, y + 2, s - 8, s - 4);

  color(activeColorPalette.text);
  rect(ui.x + x + 3, y + 4, s - 6, s - 8);
  rect(ui.x + x + 4, y + 3, s - 8, s - 6);

  color(activeColorPalette.background);
  rect(ui.x + x + 4, y + 4, s - 8, s - 8);
}

function drawText(text, x, y) {
  color(activeColorPalette.text);
  for (let row = 0; row < text.length; row++) {
    for (let col = 0; col < text[row].length; col++) {
      if (text[row][col] === 1) rect(x + col, y + row, 1);
    }
  }
}

function drawNumber(number, x, y) {
  const digits = number.toString().split("");
  const digitWidth = 6;

  digits.forEach((digit, idx) => {
    const digitPattern = TEXT[digit];
    if (digitPattern) {
      const digitX = x + idx * (digitWidth + 2);
      drawText(digitPattern, digitX, y);
    }
  });
}

function drawBlock(x, y, block) {
  for (let row = 0; row < block.length; row++) {
    for (let col = 0; col < block[row].length; col++) {
      const colorIndex = block[row][col];
      if (colorIndex in colorMap) {
        color(colorMap[colorIndex]);
        rect(x + col, y + row, 1);
      }
    }
  }
}

function color(c) {
  ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function rect(x, y, w, h = w) {
  ctx.fillRect(x, y, w, h);
}

function clear(x = 0, y = 0, w = W, h = H) {
  color(activeColorPalette.background);
  rect(x, y, w, h);
}

function setPallete(pallete) {
  activeColorPalette = pallete;
  colorMap = {
    0: activeColorPalette.text,
    1: activeColorPalette.background,
    2: activeColorPalette.primary,
    3: activeColorPalette.secondary,
  };
  drawStaticUI();
}

function setNumber(number, type) {
  const t = textTypes[type];
  clear(t.x1, t.y1, t.w, 9);
  drawNumber(number, ui.x + t.x, t.y);
}
