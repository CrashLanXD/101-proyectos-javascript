document
  .getElementById("sand")
  .addEventListener("click", () => setElement(ELEMENT_SAND, 0.3));
document
  .getElementById("water")
  .addEventListener("click", () => setElement(ELEMENT_WATER, 0.6));
document
  .getElementById("ice")
  .addEventListener("click", () => setElement(ELEMENT_ICE, 1));
document
  .getElementById("stone")
  .addEventListener("click", () => setElement(ELEMENT_WALL, 1));
document
  .getElementById("wood")
  .addEventListener("click", () => setElement(ELEMENT_WOOD, 1));
document
  .getElementById("smoke")
  .addEventListener("click", () => setElement(ELEMENT_SMOKE, 0.8));
document
  .getElementById("fire")
  .addEventListener("click", () => setElement(ELEMENT_FIRE, 0.8));
document
  .getElementById("eraser")
  .addEventListener("click", () => setElement(ELEMENT_EMPTY, 1));
document
  .getElementById("fill")
  .addEventListener("click", () => fillAll(dropperElement));
document
  .getElementById("clear")
  .addEventListener("click", () => fillAll(ELEMENT_EMPTY));
document.getElementById("dropperPlus").addEventListener("click", () => {
  dropperSize++;
  dropperSizeSquared = dropperSize * dropperSize;
});
document.getElementById("dropperMinus").addEventListener("click", () => {
  dropperSize--;
  dropperSizeSquared = dropperSize * dropperSize;
});

document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  const inputText = document.getElementById("size").value;
  const [widthStr, heightStr] = inputText.split("x");
  const width = parseInt(widthStr);
  const height = parseInt(heightStr);

  if (!isNaN(width) && !isNaN(height)) {
    setup(width, height);
  } else console.error("Error al analizar los valores!");
});
