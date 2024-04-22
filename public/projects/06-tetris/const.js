// GAME
const BOARD_COLS = 10;
const BOARD_ROWS = 18;
const CELL_SIZE = 30;
const BOARD_WIDTH = BOARD_COLS * CELL_SIZE;
const BOARD_HEIGHT = BOARD_ROWS * CELL_SIZE;

// COLORS
const COLORS = {
  darkGreen: "#254834",
  lightGreen: "#92be33",
  green: "#46792f",
  green1: "#6c9c37",
  green2: "#70962a",
  green3: "#4a6d1b",
  green4: "#244331",
  green5: "#6f9526",
};

const PIECES = [
  [
    [1, 1],
    [1, 1],
  ],
  [[2], [2], [2], [2]],
  [
    [0, 3],
    [3, 3],
    [3, 0],
  ],
  [
    [4, 0],
    [4, 4],
    [0, 4],
  ],
  [
    [5, 0],
    [5, 0],
    [5, 5],
  ],
  [
    [6, 6],
    [6, 0],
    [6, 0],
  ],
  [
    [7, 0],
    [7, 7],
    [7, 0],
  ],
];

//#region DRAW METHODS

function drawBlock(x, y, type) {
  switch (type) {
    case 1:
      drawBlockType1(x, y);
      break;
    case 2:
      drawBlockType2(x, y);
      break;
    case 3:
      drawBlockType3(x, y);
      break;
    case 4:
      drawBlockType4(x, y);
      break;
    case 5:
      drawBlockType5(x, y);
      break;
    case 6:
      drawBlockType6(x, y);
      break;
    case 7:
      drawBlockType7(x, y);
      break;

    default:
      drawBlockTypeDeath(x, y);
      break;
  }
}

// Draw the block with a pretty design? :D
// border:
let b = 3.5;
function drawBlockType1(x, y) {
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + b, y + b, CELL_SIZE - b * 2, CELL_SIZE - b * 2);
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(offset + x + 7.5, y + 7.5, CELL_SIZE - 15, CELL_SIZE - 15);
}
function drawBlockType2(x, y) {
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green2;
  ctx.fillRect(offset + x + b, y + b, CELL_SIZE - b * 2, CELL_SIZE - b * 2);
  ctx.fillStyle = COLORS.green3;
  ctx.fillRect(offset + x + 14, y + 3, CELL_SIZE - 26, CELL_SIZE - 26); // 1
  ctx.fillRect(offset + x + 7, y + 6, CELL_SIZE - 26, CELL_SIZE - 26); // 2
  ctx.fillRect(offset + x + 23, y + 6, CELL_SIZE - 26, CELL_SIZE - 26);
  ctx.fillRect(offset + x + 3, y + 14, CELL_SIZE - 26, CELL_SIZE - 26); // 3
  ctx.fillRect(offset + x + 14, y + 14, CELL_SIZE - 26, CELL_SIZE - 26);
  ctx.fillRect(offset + x + 23, y + 17, CELL_SIZE - 26, CELL_SIZE - 26); // 4
  ctx.fillRect(offset + x + 7, y + 23, CELL_SIZE - 26, CELL_SIZE - 26); // 5
  ctx.fillRect(offset + x + 14, y + 23, CELL_SIZE - 26, CELL_SIZE - 26);
}
function drawBlockType3(x, y) {
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(offset + x + b, y + b, CELL_SIZE - b * 2, CELL_SIZE - b * 2);
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x + 7.5, y + 7.5, CELL_SIZE - 15, CELL_SIZE - 15);
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + 11.3, y + 11.3, CELL_SIZE - 22.6, CELL_SIZE - 22.6);
}
function drawBlockType4(x, y) {
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(offset + x + b, y + b, CELL_SIZE - b * 2, CELL_SIZE - b * 2);
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x + 11, y + 11, CELL_SIZE - 22, CELL_SIZE - 22);
}
function drawBlockType5(x, y) {
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(offset + x + b, y + b, CELL_SIZE - b * 2, CELL_SIZE - b * 2);

  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x + 7.5, y + 7.5, CELL_SIZE - 15, CELL_SIZE - 15);
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + 11.3, y + 11.3, CELL_SIZE - 22.6, CELL_SIZE - 22.6);
}
function drawBlockType6(x, y) {
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(offset + x + b, y + b, CELL_SIZE - (b * 2), CELL_SIZE - (b * 2));
}
function drawBlockType7(x, y) {
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(offset + x + b, y + b, CELL_SIZE - (b * 2), CELL_SIZE - (b * 2));

  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + 7.4, y + 7.4, CELL_SIZE - 15, 4);
  ctx.fillRect(offset + x + 7.4, y + 7.4, 4, 11);
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x + 7.4, y + 18.6, CELL_SIZE - 15, 4);
  ctx.fillRect(offset + x + 18.6, y + 11.4, 4, 11);
}
function drawBlockTypeDeath(x, y) {
  ctx.fillStyle = COLORS.green4;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green5;
  ctx.fillRect(offset + x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6);
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + 3, y + 3, CELL_SIZE - 6, 4);
  ctx.fillRect(offset + x + 3, y + 3, 4, CELL_SIZE - 6);
  ctx.fillStyle = COLORS.green3;
  ctx.fillRect(offset + x + 3, y + CELL_SIZE - 6, CELL_SIZE - 6, 4);
  ctx.fillRect(offset + x + CELL_SIZE - 7, y + 8, 4, CELL_SIZE - 12);
}
function drawWalls(x, y) {
  // Draw wall on the sides of the board with a pretty design? :D
  ctx.fillStyle = COLORS.green2;
  ctx.fillRect(x, y, CELL_SIZE, 24);
  ctx.fillStyle = COLORS.green4;

  ctx.fillRect(x, y + 9, CELL_SIZE, 4);
  ctx.fillRect(x, y + 22, CELL_SIZE, 4.1);

  ctx.fillRect(x + 5, y - 1, 3, 10);
  ctx.fillRect(x + 20, y - 1, 3, 10);

  ctx.fillRect(x + 11, y + 12, 3, 10);
  ctx.fillRect(x + 27, y + 12, 3, 10);

  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(x + 9, y, 4, 4);
  ctx.fillRect(x + 24, y, 4, 4);

  ctx.fillRect(x, y + 13, 4, 4);
  ctx.fillRect(x + 15, y + 13, 4, 4);
}

//#endregion
