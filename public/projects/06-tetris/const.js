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
function drawBlockType1(x, y) {
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(offset + x + 7.3, y + 7.3, CELL_SIZE - 12.5, CELL_SIZE - 12.5);
  ctx.strokeStyle = COLORS.darkGreen;
  ctx.lineWidth = 3.9;
  ctx.strokeRect(offset + x + 2, y + 2, CELL_SIZE - 2, CELL_SIZE - 2);
}
function drawBlockType2(x, y) {
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green2;
  ctx.fillRect(offset + x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6);
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
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = COLORS.darkGreen;
  ctx.lineWidth = 3;
  ctx.strokeRect(offset + x + 2, y + 2, CELL_SIZE - 3, CELL_SIZE - 3);

  ctx.lineWidth = 4;
  ctx.strokeRect(offset + x + 9.4, y + 9.4, CELL_SIZE - 18, CELL_SIZE - 18);
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + 11, y + 11, CELL_SIZE - 22, CELL_SIZE - 22);
}
function drawBlockType4(x, y) {
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(offset + x + 11, y + 11, CELL_SIZE - 21, CELL_SIZE - 21);
  ctx.strokeStyle = COLORS.darkGreen;
  ctx.lineWidth = 3.2;
  ctx.strokeRect(offset + x + 1, y + 1, CELL_SIZE - 1, CELL_SIZE - 1);
}
function drawBlockType5(x, y) {
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = COLORS.darkGreen;
  ctx.lineWidth = 3;
  ctx.strokeRect(offset + x + 2, y + 2, CELL_SIZE - 3, CELL_SIZE - 3);

  ctx.lineWidth = 4;
  ctx.strokeRect(offset + x + 9.4, y + 9.4, CELL_SIZE - 18, CELL_SIZE - 18);
  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + 11, y + 11, CELL_SIZE - 22, CELL_SIZE - 22);
}
function drawBlockType6(x, y) {
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(offset + x + 4, y + 4, CELL_SIZE - 8, CELL_SIZE - 8);
}
function drawBlockType7(x, y) {
  ctx.fillStyle = COLORS.green1;
  ctx.fillRect(offset + x, y, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = COLORS.darkGreen;
  ctx.lineWidth = 3;
  ctx.strokeRect(offset + x + 2, y + 2, CELL_SIZE - 3, CELL_SIZE - 3);

  ctx.fillStyle = COLORS.lightGreen;
  ctx.fillRect(offset + x + 7.4, y + 7.4, CELL_SIZE - 14, 4);
  ctx.fillRect(offset + x + 7.4, y + 7.8, 4, 12);
  ctx.fillStyle = COLORS.darkGreen;
  ctx.fillRect(offset + x + 7.4, y + 19.4, CELL_SIZE - 14, 4);
  ctx.fillRect(offset + x + 19.4, y + 10.8, 4, 12);
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

//#endregion
