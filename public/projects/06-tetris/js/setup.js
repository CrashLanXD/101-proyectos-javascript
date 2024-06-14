//;;;;;;;;;;;;;;;;;;//
//      CONST       //
//;;;;;;;;;;;;;;;;;;//
const W = 160;
const H = 144;
const COLS = 10;
const ROWS = 18;
const BLOCK_SIZE = 8;
const OFFSET_X = BLOCK_SIZE * 2;
const FPS = 30;
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

/*
The bugs started to appear -_-

TODO: 1. **Redesign Controls:**
  - Make the controls more comfortable and reminiscent of the original Game Boy.
  - **Explanation:** Enhance the control layout to mimic the Game Boy's design, improving user comfort.

TODO: 2. **Improve Responsiveness:**
  - Ensure the game fits correctly on mobile devices in both vertical and horizontal orientations.
  - **Explanation:** Adjust the layout for optimal display on mobile devices, ensuring it looks and functions well in both portrait and landscape modes.

TODO: 3. **Fix "I" Tetromino Rotation:**
  - When rotating the "I" tetromino upwards (clockwise: false), it currently stays in the same position as when rotated downwards.
  - **Solution:** Modify the `rotate()` function to include a condition: if the piece is "I" and `clockwise` is false, use `move(0, 3)` to elevate it by 3 positions. This will ensure it rotates correctly.

TODO: 4. **Remove Pause on Row Clear:**
  - Temporarily remove the pause that occurs when rows are cleared.
  - **Explanation:** Since a destruction animation is planned (but not yet implemented), the current pause makes the game appear frozen. Removing the pause will maintain game flow until the animation is added.

TODO: 5. **Enhance Smoothness on Mobile:**
  - Improve the fluidity of piece dropping on mobile devices.
  - **Explanation:** The current issue is that when holding the down button, the automatic fall interval overlaps with the manual drop, causing inconsistent movement. A possible solution is to disable the automatic fall while the down button is pressed and re-enable it upon release.

  **Current Drop Behavior:**
  Normal fall (one step at a time): |  Issue with overlapping moves:
  [-] = 1                           |  [--] = 2!
  [-] = 1                           |  [-]  = 1
  [-] = 1                           |  [-]  = 1
  [-] = 1                           |  [--] = 2!
  [-] = 1                           |  [-]  = 1
  [-] = 1                           |  [--] = 2!
  [-] = 1                           |  [--] = 2!

  **Proposed Solution:**
  By disabling the automatic fall during manual drops, the piece will fall consistently one step at a time, preventing the "laggy" effect and ensuring smooth gameplay.

('-')
*/
