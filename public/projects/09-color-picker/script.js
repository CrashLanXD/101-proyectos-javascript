/**
 * You could go with the EyeDropper API for a more modern touch...
 * but keep in mind it's not supported in all browsers. Check it out here: `https://developer.mozilla.org/docs/Web/API/EyeDropper_API`
 * As a fallback, we'll use the trusty Magnifier class.
 * The EyeDropper API lets users pick a color from anywhere on the screen—pretty neat!
 * lol.
 */

class Magnifier {
  constructor(id) {
    this.id = id;
    this.canvas;
    this.ctx;
    this.gridSize = 9;
    this.pixelSize = 10;
    this.width = this.gridSize * this.pixelSize;
    this.height = this.gridSize * this.pixelSize;
    this._init();
  }

  _init() {
    this.canvas = $(`#${this.id}`);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style["imageRendering"] = "pixelated";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  draw(realX, realY, ctx, canvas) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    const px = this.pixelSize;
    const px2 = px + 6;
    const size = this.gridSize;
    const size2 = ~~(size * 0.5);
    const size3 = size2 * px - 3;

    this.ctx.strokeStyle = "#888888";
    this.ctx.lineWidth = 0.3;

    // oX = offsetX
    // aX = actualX
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const oX = realX - size2;
        const oY = realY - size2;
        const aX = x + oX;
        const aY = y + oY;

        const [r, g, b] = ctx.getImageData(aX, aY, 1, 1).data;

        const x2 = x * px;
        const y2 = y * px;

        if (aX >= 0 && aX < canvas.width && aY >= 0 && aY < canvas.height) {
          this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          this.ctx.fillRect(x2, y2, px, px);
        }

        this.ctx.strokeRect(x2, y2, px, px);
      }
    }

    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(size3, size3, px2, px2);
  }
}

const $ = (selector) => {
  return document.querySelector(selector);
};

const $$ = (selector) => {
  return document.querySelectorAll(selector);
};

const cssVar = (varName, value) => {
  document.documentElement.style.setProperty(varName, value);
}

//------------- VARS
const $message = $("#message");
const canvas = $("#mainCanvas");
const eyeDropperContainer = $("#magnifierContainer");
const fileLoader = $("#fileLoader");

const $allColors = {
  valueRgb: $("#valueRgb"),
  valueHex: $("#valueHex"),
  valueHsl: $("#valueHsl"),
  valueCmyk: $("#valueCmyk"),
};

const $copyButtons = $$("button[data-copy-target]")

const ctx = canvas.getContext("2d");

let magnifier;
let mouseX = 0;
let mouseY = 0;
let realX = 0;
let realY = 0;

canvas.style["imageRendering"] = "pixelated";
//------------- VARS

const createEyeDropper = () => {
  if (window.EyeDropper) {
    $message.textContent = "¡La API de Google está disponible! Haz clic derecho para usarla 😎";
    return new EyeDropper();
  } else {
    return new Magnifier("magnifier");
  }
};

const rgbToHex = ([r, g, b]) => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)}`;
};

const rgbToHsl = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;

    s = l > 0.5
    ? d / (2 - max - min)
    : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0);  break;
      case g: h = (b - r) / d + 2;                break;
      case b: h = (r - g) / d + 4;                break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const rgbToCmyk = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return [
    (c * 100).toFixed(2),
    (m * 100).toFixed(2),
    (y * 100).toFixed(2),
    (k * 100).toFixed(2)
  ];
}

function hexToRgb(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return [r, g, b];
}

const getColor = (ctx, realX, realY) => {
  const px = ctx.getImageData(realX, realY, 1, 1).data;
  const r = px[0];
  const g = px[1];
  const b = px[2];
  return [r, g, b];
}

const resizeCanvas = (canvas, w, h) => {
  canvas.width = w;
  canvas.height = h;
}

const drawImage = (ctx, image) => {
  ctx.drawImage(image, 0, 0);
}

const handleImage = (e) => {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = (event) => {
    const image = new Image();
    image.src = event.target.result;
    image.onload = () => {
      resizeCanvas(canvas, image.width, image.height);
      drawImage(ctx, image);
    }
  }
}

const handlePaste = (e) => {
  const items = e.clipboardData.items;
  for (const item of items) {
    if (item.type.indexOf("image") !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;
        image.onload = () => {
          resizeCanvas(canvas, image.width, image.height);
          drawImage(ctx, image);
        }
      }
    }
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
}

const updateRealVars = (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  realX = x * scaleX;
  realY = y * scaleY;
}

const followMouse = (e, $el, offsetX, offsetY) => {
  const { offsetWidth, offsetHeight } = $el;
  const { pageX, pageY } = e;
  $el.style.left = `${pageX - offsetWidth / 2 + offsetX}px`;
  $el.style.top = `${pageY - offsetHeight / 2 + offsetY}px`;
}

const addCanvasListeners = () => {
  if (!(magnifier instanceof Magnifier)) return;

  canvas.addEventListener("click", () => {
    updateColors(true, getColor(ctx, realX, realY), $allColors);
  });

  canvas.addEventListener("mouseenter", () => {
    cssVar("--magnifier-opacity", "1");
  })

  canvas.addEventListener("mouseleave", () => {
    cssVar("--magnifier-opacity", "0");
  })

  canvas.addEventListener("mousemove", (e) => {
    updateRealVars(e);    
    followMouse(
      e,
      eyeDropperContainer,
      eyeDropperContainer.clientWidth / 1.5,
      eyeDropperContainer.clientHeight / 1.5
    );
    magnifier.draw(realX, realY, ctx, canvas);
  });
}

const updateColors = (isMagnifier, color, $colors) => {
  let rgb, hex, hsl, cmyk;

  if (!isMagnifier) {
    hex = color;
    rgb = hexToRgb(color);
  } else {
    rgb = color;
    hex = rgbToHex([...rgb]);
  }
  hsl = rgbToHsl([...rgb]);
  cmyk = rgbToCmyk([...rgb]);

  $colors.valueHex.textContent = hex.toUpperCase();
  $colors.valueRgb.textContent = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
  $colors.valueHsl.textContent = `${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%`;
  $colors.valueCmyk.textContent = `${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%`;

  cssVar('--selection', hex);
  cssVar('--selection-rgb', `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / 0.1)`);
}

const main = () => {
  magnifier = createEyeDropper();

  if (!(magnifier instanceof Magnifier)) {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      magnifier.open().then((res) => {
        updateColors(false, res.sRGBHex, $allColors);
      });
    });
  } else {
    addCanvasListeners();
  }

  $copyButtons.forEach(b => {
    b.addEventListener("click", () => {
      const targetId = b.getAttribute("data-copy-target");
      const target = $allColors[targetId];
      copyToClipboard(target.textContent);
    })
  })

  fileLoader.addEventListener("change", handleImage)
  document.addEventListener("paste", handlePaste);
};

main();
