const $CANVAS = document.querySelector("canvas");
const CTX = $CANVAS.getContext("2d");

$CANVAS.width = 760;
$CANVAS.height = 515;

const WIDTH = $CANVAS.width;
const HEIGHT = $CANVAS.height;

const COLORS = {
  player: "#2a7829",
  aliens: "#787b2c",
  floor: "#474d10",
  bullet: "#979797",
  defense: "#ad481e",
  bg: "#000",
};

const OFFSET = 170;

let leftPressed = false;
let rightPressed = false;
let upPressed = false;

function initializeEvents() {
  addEventListener("keydown", keyDownHandler);
  addEventListener("keyup", keyUpHandler);

  function keyDownHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d")
      {rightPressed = true;}
    else if (key === "Left" || key === "ArrowLeft" || key.toLowerCase() === "a")
      {leftPressed = true;}
    else if (key === "Up" || key === "ArrowUp" || key.toLowerCase() === "w" || ' ')
      {upPressed = true;}
  }

  function keyUpHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight" || key.toLowerCase() === "d")
      rightPressed = false;
    else if (key === "Left" || key === "ArrowLeft" || key.toLowerCase() === "a")
      leftPressed = false;
    else if (key === "Up" || key === "ArrowUp" || key.toLowerCase() === "w" || ' ')
      upPressed = false;
  }
}