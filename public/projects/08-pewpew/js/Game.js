class Game {
  constructor() {
    this.canvas;
    this.ctx;
    this.player;
    this.quickPause;
    this.level;
    this.menu;
    this.isPaused;
    this.isPlayerBeaten;
    this.keys = {};
    this.items = [];
    this.enemies = [];
    this.bullets = [];
  }

  init() {
    this.canvas = document.getElementById("canvas");
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothEnabled = false;

    this.menu = new Menu(this.ctx);

    this.menu.addButton(
      "PlayAgain();",
      this.canvas.width / 2 - 175,
      250,
      350,
      70,
      () => {
        this.restartGame();
      }
    );

    this.canvas.addEventListener("click", (e) => {
      if (this.isPlayerBeaten) {
        this.menu.handleMouseClick(e);
      }
    });
  }

  initializeGame() {
    this.level = new Level(1600, 900, [0, 240, 0]);
    const mapWidth = this.level.mapWidth;
    const mapHeight = this.level.mapHeight;

    this.player = new Player(mapWidth / 2, mapHeight / 2);

    this.quickPause = new QuickPause(this.ctx);

    this.items.push(new ScoreArea(mapWidth / 2, mapHeight / 2 + 200));
    this.items.push(new ShieldItem(mapWidth / 2, mapHeight / 2 - 200));
    this.items.push(new WeaponItem(mapWidth / 2 - 200, mapHeight / 2));

    this.isPaused = false;
    this.isPlayerBeaten = false;
  }

  render() {
    const offsetX = this.canvas.width / 2 - this.player.x;
    const offsetY = this.canvas.height / 2 - this.player.y;

    this.drawMap(this.ctx, offsetX, offsetY);

    this.drawItems(this.ctx, offsetX, offsetY);

    this.drawBullets(this.ctx, offsetX, offsetY);

    this.drawPlayer(this.ctx, offsetX, offsetY);

    this.drawEnemies(this.ctx, offsetX, offsetY);

    this.player.drawUi(this.ctx);
    if (this.isPlayerBeaten) {
      this.menu.draw();
    }
  }

  update() {
    this.clear();
    this.render();

    if (!this.isPlayerBeaten) {
      this.player.move();
      this.player.update();
    }

    this.updateBullets();

    this.updateEnemies();
    this.updateItems();
  }

  updateEnemies() {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.update(this.player);
      if (enemy.hp <= 0) {
        this.enemies.splice(i, 1);
        if (!this.isPlayerBeaten) {
          this.player.score += 100;
        }
      }
    }
  }

  updateItems() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.update(this.player);
      if (item.collected) {
        this.items.splice(i, 1);
        if (item instanceof ScoreArea) {
          this.spawnNewItem(ScoreArea);
          if (Math.random() > 0.75) this.spawnNewItem(WeaponItem);

          // spawn 3 enemies
          this.enemies = this.enemies.concat(
            spawnEnemies(
              3,
              this.player,
              150,
              this.level.mapWidth,
              this.level.mapHeight
            )
          );
        }
      }
    }
  }

  spawnNewItem(NewItem) {
    this.items.push(
      spawnItem(
        this.player,
        NewItem,
        200,
        this.level.mapWidth,
        this.level.mapHeight
      )
    );
  }

  clear() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      let bullet = this.bullets[i];
      if (!bullet) continue;
      bullet.update();

      if (bullet.lifetime <= 0 || bullet.isOutOfBounds()) {
        this.bullets.splice(i, 1);
        continue;
      }

      if (bullet.hasCollidedWith(this.player)) {
        this.bullets.splice(i, 1);
        this.player.damage();
        break;
      }
    }
  }

  drawMap(ctx, offsetX, offsetY) {
    this.level.drawBackground(ctx, this.player, offsetX, offsetY);
    this.level.drawMapBorders(ctx, this.player, offsetX, offsetY);
    this.level.drawOtherMaps(ctx, offsetX, offsetY);
  }

  drawPlayer(ctx, offsetX, offsetY) {
    this.player.draw(ctx, offsetX, offsetY);
    this.player.drawBullets(ctx, offsetX, offsetY);
    // this.player.hitbox(ctx, offsetX, offsetY);
  }

  drawBullets(ctx, offsetX, offsetY) {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(ctx, offsetX, offsetY);
    }
  }

  drawItems(ctx, offsetX, offsetY) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.draw(ctx, offsetX, offsetY);
      // item.hitbox(this.ctx, offsetX, offsetY);
    }
  }

  drawEnemies(ctx, offsetX, offsetY) {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.draw(ctx, offsetX, offsetY);
      // enemy.hitbox(this.ctx, offsetX, offsetY);
    }
  }

  restartGame() {
    this.isPaused = false;
    this.isPlayerBeaten = false;
    this.keys = {};
    this.items = [];
    this.enemies = [];
    this.bullets = [];
    this.initializeGame();
  }
}
