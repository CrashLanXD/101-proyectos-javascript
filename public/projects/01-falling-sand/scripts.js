const $canvas = document.getElementById("canvas");
const ctx = $canvas.getContext("2d");

$canvas.style["image-rendering"] = "pixelated";

//#region world vars

//#region some colors
const sandColors = [
  [209, 163, 71, 255],
  [226, 191, 121, 255],
  [209, 155, 45, 255],
  [207, 171, 99, 255],
];
const waterColors = [
  [80, 129, 201, 255],
  [92, 147, 229, 255],
  [84, 132, 212, 255],
  [88, 140, 220, 255],
];
const smokeColors = [
  [126, 126, 126, 255],
  [71, 71, 71, 255],
];
const fireColors = [
  [255, 0, 0, 255],
  [255, 90, 0, 255],
  [255, 154, 0, 255],
];
const iceColors = [
  [160, 233, 253, 255],
  [134, 214, 216, 255],
];
const wallColors = [
  [142, 148, 148, 255],
  [140, 141, 141, 255],
  [152, 160, 167, 255],
];
const woodColors = [
  [85, 51, 17, 255],
  [84, 52, 20, 255],
];

function randCol(arr) {
  const ranIdx = ~~(Math.random() * arr.length);
  return arr[ranIdx];
}
//#endregion some colors

let WORLD_WIDTH;
let WORLD_HEIGHT;
let WORLD_WIDTH_4;
let imageData;

let world;
let worldReversed;
let grid;

let lines;
let lineHeight;
let text;

let tickTock = true; // por ahora no se usara por algunos bugs! 🐛
let dropperSize = 10;
let dropperElement = ELEMENT_SAND;
let probability = 0.3;
let dropperSizeSquared = dropperSize * dropperSize;

let debug = true;
let lastFrameTime = performance.now();
let fps = 0;

let mouseX, mouseY;
let isMousePressed = false;
let rect = $canvas.getBoundingClientRect();

if (innerHeight > innerWidth) {
  debug = false;
  setup(innerWidth - 30, 700, 1);
} else setup(700, 400, 1);

//#endregion world vars

function drawWorld() {
  ctx.putImageData(imageData, 0, 0);
}

function setPixel(x, y, r, g, b, a) {
  const offset = y * WORLD_WIDTH_4 + x * 4;
  const data = imageData.data;
  data[offset] = r;
  data[offset + 1] = g;
  data[offset + 2] = b;
  data[offset + 3] = a;
}

function setPixelTransparency(x, y, a) {
  const offset = y * WORLD_WIDTH_4 + x * 4;
  imageData.data[offset + 3] = a;
}

function setPixelIdTransparency(id, a) {
  imageData.data[id] = a;
}

function isElementAtPosition(slide, element) {
  return slide?.element === element;
}

function setSpace(space, element, velocity = 1) {
  space.element = element;
  space.velocity = velocity;
  switch (element) {
    case ELEMENT_SAND:
      setPixel(space.x, space.y, ...randCol(sandColors));
      break;
    case ELEMENT_WATER:
      setPixel(space.x, space.y, ...randCol(waterColors));
      break;
    case ELEMENT_ICE:
      setPixel(space.x, space.y, ...randCol(iceColors));
      break;
    case ELEMENT_WALL:
      setPixel(space.x, space.y, ...randCol(wallColors));
      break;
    case ELEMENT_SMOKE:
      setPixel(space.x, space.y, ...randCol(smokeColors));
      break;
    case ELEMENT_FIRE:
      setPixel(space.x, space.y, ...randCol(fireColors));
      break;
    case ELEMENT_WOOD:
      setPixel(space.x, space.y, ...randCol(woodColors));
      break;
    default:
      setPixel(space.x, space.y, ...ELEMENT_EMPTY.color);
  }
}

function makeSpace(x, y) {
  return {
    x: x,
    y: y,
    id: y * WORLD_WIDTH * 4 + x * 4 + 3,
    element: ELEMENT_EMPTY,
    velocity: 1,
    below: undefined,
    above: undefined,
    slideBLeft: undefined,
    slideBRight: undefined,
    slideTLeft: undefined,
    slideTRight: undefined,
    slideLeft: undefined,
    slideRight: undefined,
  };
}

function init() {
  world = [];
  worldReversed = [];
  grid = [];
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const space = makeSpace(x, y);
      row.push(space);
      setPixel(space.x, space.y, ...ELEMENT_EMPTY.color);
    }
    grid.push(row);
  }

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const space = grid[y][x];
      world.push(space);
      worldReversed.push(space);
    }
  }
  worldReversed.reverse();

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const space = grid[y][x];
      space.below = grid[y + 1]?.[x];
      space.above = grid[y - 1]?.[x];
      space.slideRight = grid[y]?.[x + 1];
      space.slideLeft = grid[y]?.[x - 1];
      space.slideBRight = grid[y + 1]?.[x + 1];
      space.slideTRight = grid[y - 1]?.[x + 1];
      space.slideBLeft = grid[y + 1]?.[x - 1];
      space.slideTLeft = grid[y - 1]?.[x - 1];
    }
  }
}

function updateWorld() {
  const spaces = worldReversed;
  for (const space of spaces) {
    space.element.behave?.(space);
  }
}

function spawn() {
  const mouseCol = ~~mouseX;
  const mouseRow = ~~mouseY;
  for (let i = -dropperSize; i <= dropperSize; i++) {
    for (let j = -dropperSize; j <= dropperSize; j++) {
      const x = mouseCol + i;
      const y = mouseRow + j;
      if (x >= 0 && x < WORLD_WIDTH && y >= 0 && y < WORLD_HEIGHT) {
        const distanceSquared = i * i + j * j;
        if (
          distanceSquared <= dropperSizeSquared &&
          Math.random() < probability
        ) {
          const space = grid[y][x];
          setSpace(space, dropperElement);
        }
      }
    }
  }
}

//#region pointer
const handlePointerEvent = (event) => {
  rect = $canvas.getBoundingClientRect();
  const clientX = event.clientX ?? event.touches[0].clientX;
  const clientY = event.clientY ?? event.touches[0].clientY;
  mouseX = clientX - rect.left;
  mouseY = clientY - rect.top;
  if (event.type === "mousedown" || event.type === "touchstart") {
    isMousePressed = true;
    $canvas.style.cursor = "grab";
    spawn();
  } else if (event.type === "mouseup" || event.type === "touchend") {
    isMousePressed = false;
    $canvas.style.cursor = "pointer";
  } else if (event.type === "mousemove" || event.type === "touchmove") {
    if (isMousePressed) spawn();
  }
};

$canvas.addEventListener("mousedown", handlePointerEvent);
$canvas.addEventListener("mouseup", handlePointerEvent);
$canvas.addEventListener("mousemove", (e) => {
  handlePointerEvent(e);
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});
$canvas.addEventListener("touchstart", handlePointerEvent);
$canvas.addEventListener("touchend", handlePointerEvent);
$canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  handlePointerEvent(event);
});

ctx.lineWidth = 1;
function drawCircle(x, y, radius) {
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}
//#endregion

//#region debug info
function calculateFPS() {
  const currentFrameTime = performance.now();
  const deltaTime = currentFrameTime - lastFrameTime;
  fps = Math.round(1000 / deltaTime); // 1000 ms / deltaTime = FPS
  lastFrameTime = currentFrameTime;
}

function setText() {
  ctx.font = "14px monospace";
  text = `
a: fill current
e: empty
s: sand 
w: water
i: ice  
r: stone
k: smoke
f: fire
o: wood
[: dropper --
]: dropper ++
d: hide

${WORLD_WIDTH}x${WORLD_HEIGHT}
cells = [${WORLD_WIDTH * WORLD_HEIGHT}]

`;
  lines = text.split("\n");
  lineHeight = 14;
  ctx.fillStyle = "#fff";
}
function showText() {
  if (debug) {
    calculateFPS();
    lines.forEach((line, idx) => {
      const y = idx * lineHeight;
      ctx.fillText(line, 0, y);
    });
    ctx.fillText(
      `dropper size: ${dropperSize}`,
      0,
      lineHeight * (lines.length - 1)
    );
    ctx.fillText(`FPS: ${fps}`, 0, lineHeight * lines.length);
  }
}
//#endregion

function tick() {
  updateWorld();
  drawWorld();
  showText();
  drawCircle(mouseX, mouseY, Math.abs(dropperSize));
  requestAnimationFrame(tick);
}

//#region keyboard
function fillAll(e) {
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const space = grid[y][x];
      setSpace(space, e);
    }
  }
}
const setElement = (e, p) => {
  dropperElement = e;
  probability = p;
};
addEventListener("keydown", (e) => {
  switch (e.key) {
    case "c":
      fillAll(ELEMENT_EMPTY);
      break;
    case "a":
      fillAll(dropperElement);
      break;
    case "e":
      setElement(ELEMENT_EMPTY, 1);
      break;
    case "s":
      setElement(ELEMENT_SAND, 0.3);
      break;
    case "w":
      setElement(ELEMENT_WATER, 0.6);
      break;
    case "r":
      setElement(ELEMENT_WALL, 1);
      break;
    case "o":
      setElement(ELEMENT_WOOD, 1);
      break;
    case "i":
      setElement(ELEMENT_ICE, 1);
      break;
    case "k":
      setElement(ELEMENT_SMOKE, 0.8);
      break;
    case "f":
      setElement(ELEMENT_FIRE, 0.8);
      break;
    case "[":
      dropperSize--;
      dropperSizeSquared = dropperSize * dropperSize;
      break;
    case "]":
      dropperSize++;
      dropperSizeSquared = dropperSize * dropperSize;
      break;
    case "d":
      debug = !debug;
      break;
  }
});
//#endregion

function setup(w, h) {
  WORLD_WIDTH = w;
  WORLD_HEIGHT = h;
  WORLD_WIDTH_4 = WORLD_WIDTH * 4;
  $canvas.width = WORLD_WIDTH;
  $canvas.height = WORLD_HEIGHT;
  imageData = ctx.createImageData(WORLD_WIDTH, WORLD_HEIGHT);
  setText();
  init();
  tick();
}
