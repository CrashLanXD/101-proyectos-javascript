// Its hard to explain...
class Level {
  constructor(w, h, c) {
    this.mapWidth = w;
    this.mapHeight = h;
    this.color = c;
    this.bgDynamicCanvas;
    this.bgStaticCanvas;
    this.init();
  }

  init() {
    this.bgStaticCanvas = document.createElement("canvas");
    this.bgDynamicCanvas = document.createElement("canvas");
    const dynamicCtx = this.bgDynamicCanvas.getContext("2d");
    const staticCtx = this.bgStaticCanvas.getContext("2d");

    this.bgDynamicCanvas.width = this.mapWidth - 80;
    this.bgDynamicCanvas.height = this.mapHeight - 40;
    this.bgStaticCanvas.width = this.mapWidth - 40;
    this.bgStaticCanvas.height = this.mapHeight - 40;

    this.initializeBackground(
      this.bgDynamicCanvas,
      dynamicCtx,
      this.color,
      250
    );
    this.initializeBackground(this.bgStaticCanvas, staticCtx, this.color, 250);
  }

  initializeBackground(canvas, ctx, bg, starCount) {
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2;
      const alpha = Math.random();

      ctx.fillStyle = `rgba(${bg[0]}, ${bg[1]}, ${bg[2]}, ${alpha})`;
      ctx.beginPath();
      ctx.rect(x, y, radius * 2, radius * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawBackground(ctx, player, offsetX, offsetY) {
    ctx.drawImage(this.bgStaticCanvas, offsetX + 20, offsetY + 20);
    // ONLY IF THE MAP SIZE IS SMALL
    ctx.drawImage(this.bgDynamicCanvas, offsetX + player.x * 0.05, offsetY + player.y * 0.05);
  }

  drawMapBorders(ctx, player, offsetX, offsetY) {
    const maxOffset = 15;
    const layers = 13;
    const initialLineWidth = 5;
    const borderDistance = 100;
    const bg = this.color;

    let alpha = 0.9;

    for (let i = 0; i < layers; i++) {
      ctx.strokeStyle = `rgba(${bg[0]}, ${bg[1]}, ${bg[2]}, ${alpha})`;
      alpha -= 0.05;
      const layerOffset = i / layers;
      ctx.lineWidth = initialLineWidth - i * 0.4;

      const offset = maxOffset * layerOffset;

      let xOffset = offset;
      let yOffset = offset;
      let widthOffset = 2 * offset;
      let heightOffset = 2 * offset;

      if (player.x - offsetX < borderDistance) {
        xOffset =
          ((maxOffset * (player.x - offsetX)) / borderDistance) *
          layerOffset *
          0.7;
      }
      // top
      if (player.y - offsetY < borderDistance) {
        yOffset =
          ((maxOffset * (player.y - offsetY)) / borderDistance) *
          layerOffset *
          2;
      }
      // right
      if (this.mapWidth - (player.x - offsetX) < borderDistance) {
        widthOffset =
          ((maxOffset * (this.mapWidth - (player.x - offsetX))) /
            borderDistance) *
          layerOffset *
          0.7;
      }
      // bottom
      if (this.mapHeight - (player.y - offsetY) < borderDistance) {
        heightOffset =
          ((maxOffset * (this.mapHeight - (player.y - offsetY))) /
            borderDistance) *
          layerOffset *
          2;
      }

      ctx.strokeRect(
        offsetX + xOffset,
        offsetY + yOffset,
        this.mapWidth - widthOffset,
        this.mapHeight - heightOffset
      );
    }
  }

  drawOtherMaps(ctx, offsetX, offsetY) {
    const bg = this.color;
    const offset = 300;
    const halfOffset = 300;
    const ax = offsetX + this.mapWidth + offset;
    const bx = offsetX - this.mapWidth - offset;
    const by = offsetY - this.mapHeight - halfOffset;
    const ay = offsetY + this.mapHeight + halfOffset;
    let lineWidth = 5;
    ctx.lineWidth = lineWidth;
    lineWidth = 5;
    let alpha = 0.8;
    for (let i = 0; i < 12; i++) {
      ctx.strokeStyle = `rgba(${bg[0]}, ${bg[1]}, ${bg[2]}, ${alpha})`;
      alpha -= 0.05;
      lineWidth -= 0.25;
      ctx.lineWidth = lineWidth;
      const off = 9 * (i * 0.9);
      const twoOff = off * 1.7;

      ctx.strokeRect(
        offsetX - off,
        ay - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // top
      ctx.strokeRect(
        offsetX - off,
        by - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // bottom

      ctx.strokeRect(
        bx - off,
        ay - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // bottom-left
      ctx.strokeRect(
        bx - off,
        offsetY - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // left
      ctx.strokeRect(
        bx - off,
        by - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // top-left

      ctx.strokeRect(
        ax - off,
        offsetY - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // right
      ctx.strokeRect(
        ax - off,
        by - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // top-left
      ctx.strokeRect(
        ax - off,
        ay - off,
        this.mapWidth + twoOff,
        this.mapHeight + twoOff
      ); // bottom-left
    }
  }
}
