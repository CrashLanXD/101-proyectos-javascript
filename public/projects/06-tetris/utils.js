const $canvas = document.querySelector("canvas");
const ctx = $canvas.getContext("2d");

let width = innerWidth;
let height = innerHeight;

let f = undefined;

function size(w, h) {
  if (w && h) {
    $canvas.width = w;
    $canvas.height = h;
    width = w;
    height = h;
    return;
  }

  $canvas.width = width;
  $canvas.height = height;
}

function fill(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

function clear() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function frameRate(frameRate) {
  f = frameRate;
}

function repeat(fn, frames = 1) {
  let frameCount = 0;
  function loop() {
    frameCount++;
    if (frameCount > frames) {
      frameCount = 0;
      fn();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function ellipse(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath;
}

function line(x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function collision(o1, o2) {
  return getDistance(o1.x, o1.y, o2.x, o2.y) <= o1.radius + o2.radius;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}
