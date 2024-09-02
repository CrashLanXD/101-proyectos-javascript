const $menu = $("#menu");
const $help = $("#help");
const $helpDialog = $("#helpDialog");

$menu.value = "";
$help.value = "";

$helpDialog.addEventListener("click", (e) => {
  const { target } = e;
  if (target.id === "closeHelp" || target.id === "minimizeHelp") {
    $helpDialog.close();
  }
});

$menu.addEventListener("change", (e) => {
  const { value } = e.target;
  if (value === "new") {
    generateGrid(rows, cols);
  } else if (value === "beginner") {
    changeMode("beginner");
  } else if (value === "intermediate") {
    changeMode("intermediate");
  } else if (value === "expert") {
    changeMode("expert");
  } else if (value === "bestTimes") {
    console.log("bestTimes");
  } else if (value === "exit") {
    console.log("exit");
  }
  e.target.value = "";
});

$help.addEventListener("change", (e) => {
  const { value } = e.target;
  if (value === "help") {
    $helpDialog.showModal();
  }
  e.target.value = "";
});

document.addEventListener("keydown", (e) => {
  const { key } = e;
  if (e.repeat) return;

  switch (key) {
    case "n":
    case "N":
    case "F2":
      generateGrid(rows, cols);
      break;
    case "b":
    case "B":
      changeMode("beginner");
      break;
    case "i":
    case "I":
      changeMode("intermediate");
      break;
    case "e":
    case "E":
      changeMode("expert");
      break;
    case "m":
    case "M":
      console.log("marks");
      break;
    case "c":
    case "C":
      console.log("color");
      break;
    case "t":
    case "T":
      console.log("bestTimes");
      break;
    case "x":
    case "X":
      console.log("exit");
      break;
  }
});
