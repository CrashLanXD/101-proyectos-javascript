const game = new Game();
game.init();

let taskInterval = 20000;
let lastFrameTime = 0;
let lastTaskTime = 0;

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function spawnItem(player, Item, margin, mapWidth, mapHeight) {
  let newX, newY, distance;

  do {
    newX = Math.random() * (mapWidth - 2 * margin) + margin;
    newY = Math.random() * (mapHeight - 2 * margin) + margin;
    distance = Math.sqrt(
      Math.pow(newX - player.x, 2) + Math.pow(newY - player.y, 2)
    );
  } while (distance < margin);

  return new Item(newX, newY);
}

function spawnEnemies(count, player, margin, mapWidth, mapHeight) {
  const enemies = [];

  for (let i = 0; i < count; i++) {
    let newX, newY, distance;

    do {
      newX = Math.random() * (mapWidth - 2 * margin) + margin;
      newY = Math.random() * (mapHeight - 2 * margin) + margin;
      distance = Math.sqrt(
        Math.pow(newX - player.x, 2) + Math.pow(newY - player.y, 2)
      );
    } while (distance < margin);

    const randomType = Math.random();

    let newEnemy;

    if (randomType < 0.5) {
      // 50%
      if (Math.random() < 0.5) {
        newEnemy = new Shooter(newX, newY);
      } else {
        newEnemy = new WaveShooter(newX, newY);
      }
    } else if (randomType < 0.75) {
      // 25%
      newEnemy = new GuidedSquare(newX, newY);
    } else {
      // 25%
      if (Math.random() < 0.75) {
        const followerCount = Math.min(
          count - enemies.length,
          Math.ceil(Math.random() * 3)
        );
        for (let j = 0; j < followerCount; j++) {
          enemies.push(new Follower(newX, newY));
        }
      } else {
        newEnemy = new Follower(newX, newY);
      }
    }

    if (newEnemy) {
      enemies.push(newEnemy);
    }

    if (enemies.length >= count) {
      break;
    }
  }

  return enemies;
}

function main() {
  game.restartGame();

  addEventListener("keydown", (e) => {
    const { key } = e;
    game.keys[key] = true;
    if (e.repeat) return;
    game.quickPause.start();
  });
  addEventListener("keyup", (e) => {
    const { key } = e;
    game.keys[key] = false;
    if (e.repeat) return;
    game.quickPause.start();
  });
  addEventListener("resize", () => {
    game.canvas.width = innerWidth;
    game.canvas.height = innerHeight;
  });

  requestAnimationFrame(tick);
}

function tick(timeStamp) {
  if (timeStamp - lastFrameTime >= FRAME_DURATION) {
    lastFrameTime = timeStamp;
    if (!game.isPaused) {
      game.render();
      game.update();

      if (timeStamp - lastTaskTime >= taskInterval) {
        lastTaskTime = timeStamp;
        if (Math.random() > 0.7) {
          game.spawnNewItem(ShieldItem);
        }
        if (Math.random() > 0.2) {
          game.spawnNewItem(WeaponItem);
        }
      }
    }
  }
  requestAnimationFrame(tick);
}

main();
