/* MINE SWEEPER */
const $ = (s) => document.querySelector(s);
const $grid = $(".grid");
const $seconds = $("#seconds");
const $happyFace = $("#happyFace");
const $minesLeft = $("#minesLeft");
const $faceContainer = $("#faceContainer");
let lockGame = false;
let firstClick = true;
let seconds = 0;
let intervalId = null;

const MineState = {
  HAS_MINE: "A",
  NO_MINE: "А",
  NAME: "state",
};
const mineColors = [
  "",
  "#00f", "#008000", "#f00", "#000080",
  "#800000", "#008080", "#ff4500", "#696969",
];
const dev = false; // !only for dev // start with false
const modes = {
  beginner: [8, 8],
  intermediate: [16, 16],
  expert: [16, 30],
};
const maxMines = {
  beginner: 10,
  intermediate: 30,
  expert: 75,
};
const FACE_STATES = {
  happy: "happy", // ☺
  sad: "sad", // ☹
  pacman: "pacman", // ⍩
  meh: "meh", // ⍨
  shruggie: "shruggie", // ツ
};
const faceState = (state) => {
  $happyFace.className = state;
};

let currentMode = "beginner";
let [rows, cols] = modes[[currentMode]];
let mineCount = maxMines[[currentMode]];

generateGrid(rows, cols);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasMine(cell) {
  return cell?.getAttribute(MineState.NAME) === MineState.HAS_MINE;
}

function updateTime() {
  intervalId = setInterval(() => {
    $seconds.textContent = `${seconds++}`.padStart(3, "00");
    if (seconds === 70) {
      faceState(FACE_STATES.shruggie);
    }
    if (lockGame) {
      clearInterval(intervalId);
    }
  }, 1000);
}

function updateMineCount() {
  const flaggedCells = Array.from($grid.querySelectorAll(".flagged")).length;
  let count = mineCount - flaggedCells;
  if (count < 0) count = 0;
  $minesLeft.textContent = `${count}`.padStart(3, "0");
}

function restartValues() {
  clearInterval(intervalId);
  lockGame = false;
  firstClick = true;
  seconds = 0;
  faceState(FACE_STATES.happy);
  $seconds.textContent = `${seconds++}`.padStart(3, "00");
  $grid.innerHTML = "";
  updateMineCount();
}

function generateGrid(rows, cols) {
  restartValues();
  for (let i = 0; i < rows; i++) {
    const row = $grid.insertRow(i);
    for (let j = 0; j < cols; j++) {
      const cell = row.insertCell(j);
      cell.onclick = function () {
        checkMine(this);
      };
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (lockGame) return;
        faceState(FACE_STATES.happy);
        if (!cell.classList.contains("active")) {
          cell.classList.toggle("flagged");
          updateMineCount();
        }
      });
      cell.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (e.button !== 1 || lockGame || cell.classList.contains("hide"))
          return;
        tryRemoveNeighbors(cell);
      });
      cell.classList.add("hide");
      const state = document.createAttribute(MineState.NAME);
      state.value = MineState.NO_MINE;
      cell.setAttributeNode(state);
    }
  }

  generateMines(mineCount);
  precalculateNeighbors();
}

function tryRemoveNeighbors(cell) {
  if (!cell || lockGame || cell.classList.contains("flagged")) return;

  const row = cell.parentNode.rowIndex;
  const col = cell.cellIndex;
  const minesAround = cell._minesAround || 0;

  let flaggedCount = 0;
  const neighbors = [];

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i === row && j === col) continue;
      const neighbor = $grid.rows[i]?.cells[j];
      if (!neighbor) continue;
      neighbors.push(neighbor);
      if (neighbor.classList.contains("flagged")) {
        flaggedCount++;
      }
    }
  }

  if (flaggedCount === minesAround) {
    neighbors.forEach((neighbor) => {
      if (!neighbor.classList.contains("flagged") && !neighbor._active) {
        checkMine(neighbor);
      }
    });
  } else {
    faceState(FACE_STATES.meh);
  }
}

function generateMines(count) {
  const placedMines = new Set();

  while (placedMines.size < count) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const position = row * cols + col;

    if (!placedMines.has(position)) {
      placedMines.add(position);
      const cell = $grid.rows[row]?.cells[col];
      if (!cell) continue;
      cell.setAttribute(MineState.NAME, MineState.HAS_MINE);

      if (dev) {
        cell.classList.add("devReveal");
      }
    }
  }
}

function checkMine(cell) {
  if (lockGame) return;

  if (firstClick) {
    firstClick = false;
    updateTime();
    if (hasMine(cell)) {
      moveMine(cell);
      precalculateNeighbors();
    }
  }

  if (cell.classList.contains("flagged")) {
    faceState(FACE_STATES.pacman);
    return;
  } else {
    faceState(FACE_STATES.happy);
  }

  if (cell.getAttribute(MineState.NAME) === MineState.HAS_MINE) {
    revealMines();
    lockGame = true;
    clearInterval(intervalId);
    console.log("you lose 😹😹😹");
    faceState(FACE_STATES.sad);
  } else {
    // display number of mines around cell
    cell.className = "active";
    const row = cell.parentNode.rowIndex;
    const col = cell.cellIndex;
    const minesAround = cell._minesAround || 0;
    cell.innerHTML = minesAround > 0 ? minesAround : "";
    cell.style.setProperty("--color", mineColors[minesAround]);
    faceState(FACE_STATES.happy);

    if (minesAround === 0) {
      revealAdjacentCells(row, col);
    }
  }
}

function moveMine(cell) {
  cell.setAttribute(MineState.NAME, MineState.NO_MINE);
  cell.classList.remove("devReveal");

  let newRow, newCol, newPosition;
  do {
    newRow = Math.floor(Math.random() * rows);
    newCol = Math.floor(Math.random() * cols);
    newPosition = $grid.rows[newRow]?.cells[newCol];
  } while (hasMine(newPosition) || newPosition === cell);

  newPosition.setAttribute(MineState.NAME, MineState.HAS_MINE);
  if (dev) {
    newPosition.classList.add("devReveal");
  }
}

function precalculateNeighbors() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = $grid?.rows[i]?.cells[j];
      if (!cell) continue;
      if (!hasMine(cell)) {
        cell._minesAround = countNeighbors(i, j);
      }
    }
  }
}

function countNeighbors(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i === row && j === col) continue;
      if (hasMine($grid.rows[i]?.cells[j])) {
        count++;
      }
    }
  }
  return count;
}

async function revealAdjacentCells(row, col) {
  const cellsToReveal = [[row, col]];
  const revealedCells = new Set();

  // let iterations = 0; // not needed // 😐
  while (cellsToReveal.length > 0) {
    // if (++iterations > 99999) break; // not needed // 😐
    const [currentRow, currentCol] = cellsToReveal.shift();
    const cell = $grid.rows[currentRow]?.cells[currentCol];

    if (!cell || cell._active || hasMine(cell) || revealedCells.has(cell)) {
      continue;
    }

    revealedCells.add(cell);
    cell._active = true;
    cell.className = "active";

    await sleep(0); // 🛌💤

    const minesAround = cell._minesAround || 0;
    cell.innerHTML = minesAround > 0 ? minesAround : "";
    cell.style.setProperty("--color", mineColors[minesAround]);

    if (minesAround === 0) {
      for (let i = currentRow - 1; i <= currentRow + 1; i++) {
        for (let j = currentCol - 1; j <= currentCol + 1; j++) {
          if (i === currentRow && j === currentCol) continue;
          const adjacentCell = $grid.rows[i]?.cells[j];
          if (
            adjacentCell &&
            !revealedCells.has(adjacentCell) &&
            !adjacentCell?._active &&
            !cellsToReveal.some(([r, c]) => r === i && c === j)
          ) {
            cellsToReveal.push([i, j]);
          }
        }
      }
    }
  }
  checkGameCompleted();
}

function revealMines() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = $grid.rows[i].cells[j];
      if (hasMine(cell)) {
        cell.classList.add("revealed");
      }
    }
  }
}

function checkGameCompleted() {
  let win = true;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = $grid.rows[i]?.cells[j];
      if (
        cell &&
        !hasMine(cell) &&
        (cell.getAttribute("class") === "hide" ||
          cell.classList.contains("flagged"))
      ) {
        win = false;
      }
    }
  }
  if (win) {
    console.log("you win 🥳🥳🥳");
    lockGame = true;
    faceState(`${FACE_STATES.happy} rainbow`);
    revealMines();
    clearInterval(intervalId);
  }
}

function changeMode(mode) {
  currentMode = mode;
  [rows, cols] = modes[[currentMode]];
  mineCount = maxMines[[currentMode]];
  generateGrid(rows, cols);
}

$faceContainer.addEventListener("click", () => {
  generateGrid(rows, cols);
});

console.log(
  "%c\n\n %c😡 WHAT ARE YOU DOING HERE?! %c\n\n\n %c🚫 GET OUT OF THE CONSOLE! %c\n\n\n",
  "",
  "color: #fff; background: #ff0000; font-size: 2.5rem; font-weight: bold; padding: 10px; border: 3px solid #000; border-radius: 10px; text-shadow: 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000;",
  "",
  "color: #fff; background: #000; font-size: 2rem; font-weight: bold; padding: 8px; border: 3px solid #ff0000; border-radius: 10px; text-shadow: 2px 2px 0 #ff0000, -2px 2px 0 #ff0000, 2px -2px 0 #ff0000, -2px -2px 0 #ff0000;",
  ""
);
console.log(
  `%c\n %c"${MineState.HAS_MINE}" === "${MineState.NO_MINE}" = ${
    MineState.HAS_MINE === MineState.NO_MINE
  }?! %c\n\n`,
  "",
  "color: #000; background: #ff0; font-size: 1.7rem; font-weight: bold; padding: 4px; border-radius: 5px;",
  ""
);
