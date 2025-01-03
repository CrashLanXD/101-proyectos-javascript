const $$ = (id) => document.getElementById(id);

addEventListener("DOMContentLoaded", () => {
  const $ = {
    gridWidth: $$("gridWidth"),
    gridHeight: $$("gridHeight"),
    cellSize: $$("cellSize"),
    applyGridChanges: $$("applyGridChanges"),
    gameRules: $$("gameRules"),
    customRulestring: $$("customRulestring"),
    applyRules: $$("applyRules"),
    probability: $$("probability"),
    probabilityValue: $$("probabilityValue"),
    updateSpeed: $$("updateSpeed"),
    speedValue: $$("speedValue"),
    generateSoup: $$("generateSoup"),
    colorPicker: $$("colorPicker"),
    bgPicker: $$("bgPicker"),
    currentRulestring: $$("currentRulestring"),
    currentSpeedValue: $$("currentSpeedValue"),
    currentProbabilityValue: $$("currentProbabilityValue"),
  }
  if (Object.values($$).some((el) => !el)) return;

  applyDefaultValues();

  $.applyGridChanges.addEventListener("click", () => {
    const gridWidth = Math.abs(~~parseInt($.gridWidth.value, 10) || 0);
    const gridHeight = Math.abs(~~parseInt($.gridHeight.value, 10) || 0);
    const cellSize = Math.abs(~~parseInt($.cellSize.value, 10) || 1);
    game.cellSize = cellSize;
    resize(gridWidth, gridHeight);
  });

  $.applyRules.addEventListener("click", () => {
    const rulestring = $.customRulestring.value;
    if (rulestring.length > 0) game.parseRule(rulestring);
    else {
      game.rule = RULES[$.gameRules.value];
      game.parseRule(game.rule.rulestring);
    }
    $.currentRulestring.textContent = game.rule.rulestring;
  });

  $.probability.addEventListener("input", () => {
    const prob = (parseFloat($.probability.value) / 100);
    $.probabilityValue.textContent = `${prob * 100}%`;
  });

  $.updateSpeed.addEventListener("input", () => {
    const speed = parseInt($.updateSpeed.value);
    $.speedValue.textContent = `${speed}ms`;
  });

  $.generateSoup.addEventListener("click", () => {
    const prob = parseFloat($.probability.value) / 100 || 0.0;
    updateSpeed = parseInt($.updateSpeed.value);
    game.soup(prob);
    $.currentProbabilityValue.textContent = `${prob * 100}%`;
    $.currentSpeedValue.textContent = `${updateSpeed}ms`;
  });

  $.colorPicker.addEventListener("input", () => {
    const rgb = hexToRgb($.colorPicker.value);
    if (rgb) {
      color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.fillStyle = color;
    }
  });

  $.bgPicker.addEventListener("input", () => document.body.style.backgroundColor = $.bgPicker.value);

  function applyDefaultValues() {
    $.gridWidth.value = $canvas.width;
    $.gridHeight.value = $canvas.height;
    $.cellSize.value = game.cellSize;

    $.probability.value = `${game.rule.probability * 100}%`;
    $.updateSpeed.value = updateSpeed;
    $.colorPicker.value = rgbToHex(...rgbStringToValue(color));

    $.currentRulestring.textContent = game.rule.rulestring;
    $.currentSpeedValue.textContent = `${updateSpeed}ms`;
    $.currentProbabilityValue.textContent = `${game.rule.probability * 100}%`;

    generations = 0;
  }

  function rgbStringToValue(rgb) {
    const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
    return match ? match.slice(1, 4).map((v) => parseInt(v)) : null;
  }

  function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  }
});
