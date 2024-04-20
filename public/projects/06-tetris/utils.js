// Select the canvas element from the DOM
const $canvas = document.querySelector("canvas");
// Get the 2D rendering context of the canvas
const ctx = $canvas.getContext("2d");

// Initialize variables for canvas width and height
let width = innerWidth;
let height = innerHeight;

// Function to set the size of the canvas
function size(w, h) {
  // If both argument are provided, set the canvas size accordingly
  if (w && h) {
    $canvas.width = w;
    $canvas.height = h;
    width = w;
    height = h;
    return;
  }

  // Otherwise, set the canvas size to default width and height
  $canvas.width = width;
  $canvas.height = height;
}

// Function to fill a rectangle on the canvas
function fill(
  x = 0,
  y = 0,
  w = $canvas.width,
  h = $canvas.height,
  color = "#000"
) {
  // Set the fill style to the provided color
  ctx.fillStyle = color;
  // Fill a rectangle with the provided dimensions and position
  ctx.fillRect(x, y, w, h);
}

// Function to draw text on the canvas
function text(text, x, y, color = "white", fontSize = 30) {
  // Set the font style for the canvas
  // Monocraft is a special font, it probably doesn't work
  ctx.font = `${fontSize}px Monocraft Nerd Font`;
  // Set the fill style for the text
  ctx.fillStyle = color;

  // Draw the text at the specified position
  ctx.fillText(text, x, y);
}

// Function to generate a random integer within a given range
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to create a 2D array with given number of columns and rows
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  // Loop trough each column
  for (let i = 0; i < cols; i++) {
    // Create a new array for each column and fill it with zeros
    arr[i] = new Array(rows).fill(0);
  }

  // Return the 2D array
  return arr;
}
// :D