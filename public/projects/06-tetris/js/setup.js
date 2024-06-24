//;;;;;;;;;;;;;;;;;;//
//      CONST       //
//;;;;;;;;;;;;;;;;;;//
const W = 160;
const H = 144;
const COLS = 10;
const ROWS = 18;
const BLOCK_SIZE = 8;
const OFFSET_X = BLOCK_SIZE * 2;
const FPS = 59.7275;
const FRAME_DURATION = 1000 / FPS;
const MAX_LEVEL = 9;
const MAX_LINES = 999;
const MAX_SCORE = 999999;
const TASK_INTERVALS = [800, 717, 633, 550, 467, 383, 300, 217, 133, 100];
const ui = { w: 55, x: 105 };

const textTypes = {
  score: { x: 4 , y: 26, x1:ui.x    , y1: 24, w: ui.w },
  level: { x: 15, y: 57, x1:ui.x + 6, y1: 55, w: 43   },
  lines: { x: 15, y: 81, x1:ui.x + 6, y1: 79, w: 43   },
}
//;;;;;;;;;;;;;;;;;;;;;;//

//;;;;;;;;;;;;;;;;;;;;;;//
const $canvas = document.getElementById("canvas");
const ctx = $canvas.getContext("2d");

$canvas.style.imageRendering = "pixelated";
$canvas.width = W;
$canvas.height = H;
//;;;;;;;;;;;;;;;;;;;;;;//

//;;;;;;;;;;;;;;;;;;;;;;//
//      GAME VARS       //
//;;;;;;;;;;;;;;;;;;;;;;//
let activeColorPalette;
let colorMap = {};
let board;
let piece;
let TASK_INTERVAL;

let score = 0;
let level = 0;
let lines = 0;
let isGamePaused = false;
let lastFrameTime = 0;
let lastTaskTime = 0;
//;;;;;;;;;;;;;;;;;;;;;;//
